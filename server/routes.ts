import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import cron from "node-cron";
import Razorpay from "razorpay";
import {
  loginSchema,
  registerSchema,
  insertDomainSchema,
  insertPaymentSchema,
  type User,
  type Domain,
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_key";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret";
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || "your-api-key";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
});

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// WHOIS lookup function
async function lookupDomain(domainName: string) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${domainName}`, {
      headers: {
        'X-Api-Key': API_NINJAS_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error('WHOIS lookup failed');
    }
    
    const data = await response.json();
    return {
      registrar: data.registrar || null,
      expiryDate: data.expiration_date ? new Date(data.expiration_date) : null,
    };
  } catch (error) {
    console.error('WHOIS lookup error:', error);
    return { registrar: null, expiryDate: null };
  }
}

// Update domain statuses
async function updateDomainStatuses() {
  const allUsers = Array.from((storage as any).users.values());
  
  for (const user of allUsers) {
    const domains = await storage.getDomainsByUserId(user.id);
    const now = new Date();
    
    for (const domain of domains) {
      if (!domain.expiryDate) continue;
      
      const daysUntilExpiry = Math.ceil((domain.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let newStatus = domain.status;
      
      if (daysUntilExpiry < 0) {
        newStatus = "expired";
      } else if (daysUntilExpiry <= 30) {
        newStatus = "expiring";
      } else {
        newStatus = "active";
      }
      
      if (newStatus !== domain.status) {
        await storage.updateDomain(domain.id, { status: newStatus });
        
        // Create notification
        await storage.createNotification({
          userId: user.id,
          domainId: domain.id,
          type: newStatus === "expired" ? "domain_expired" : "expiry_reminder",
          message: `Domain ${domain.name} is ${newStatus}`,
        });
      }
    }
  }
}

// Send email notifications
async function sendExpiryNotifications() {
  const allUsers = Array.from((storage as any).users.values());
  
  for (const user of allUsers) {
    const domains = await storage.getDomainsByUserId(user.id);
    const now = new Date();
    
    for (const domain of domains) {
      if (!domain.expiryDate) continue;
      
      const daysUntilExpiry = Math.ceil((domain.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry === 7) {
        // Send 7-day reminder
        const notification = await storage.createNotification({
          userId: user.id,
          domainId: domain.id,
          type: "expiry_reminder",
          message: `Domain ${domain.name} expires in 7 days`,
        });
        
        try {
          await transporter.sendMail({
            from: process.env.FROM_EMAIL || "noreply@domainpro.com",
            to: user.email,
            subject: `Domain Expiry Reminder: ${domain.name}`,
            html: `
              <h2>Domain Expiry Reminder</h2>
              <p>Your domain <strong>${domain.name}</strong> will expire in 7 days.</p>
              <p>Expiry Date: ${domain.expiryDate.toLocaleDateString()}</p>
              <p>Please renew your domain to avoid any service interruption.</p>
            `,
          });
          
          await storage.updateNotificationEmailSent(notification.id);
        } catch (error) {
          console.error("Email sending failed:", error);
        }
      }
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });
      
      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  // Domain routes
  app.get("/api/domains", authenticateToken, async (req: any, res) => {
    try {
      const domains = await storage.getDomainsWithStats(req.user.id);
      res.json(domains);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch domains" });
    }
  });

  app.post("/api/domains", authenticateToken, async (req: any, res) => {
    try {
      const { name, tags, autoRenew } = req.body;
      
      // WHOIS lookup
      const whoisData = await lookupDomain(name);
      
      const domain = await storage.createDomain({
        userId: req.user.id,
        name,
        registrar: whoisData.registrar,
        expiryDate: whoisData.expiryDate,
        tags: tags || [],
        autoRenew: autoRenew || false,
      });
      
      res.json(domain);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to add domain" });
    }
  });

  app.put("/api/domains/:id", authenticateToken, async (req: any, res) => {
    try {
      const domainId = parseInt(req.params.id);
      const domain = await storage.getDomainById(domainId);
      
      if (!domain || domain.userId !== req.user.id) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      const updatedDomain = await storage.updateDomain(domainId, req.body);
      res.json(updatedDomain);
    } catch (error) {
      res.status(400).json({ message: "Failed to update domain" });
    }
  });

  app.delete("/api/domains/:id", authenticateToken, async (req: any, res) => {
    try {
      const domainId = parseInt(req.params.id);
      const domain = await storage.getDomainById(domainId);
      
      if (!domain || domain.userId !== req.user.id) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      await storage.deleteDomain(domainId);
      res.json({ message: "Domain deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete domain" });
    }
  });

  // Dashboard route
  app.get("/api/dashboard/stats", authenticateToken, async (req: any, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Payment routes
  app.post("/api/payments/create-order", authenticateToken, async (req: any, res) => {
    try {
      const { domainId, amount } = req.body;
      
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `domain_${domainId}_${Date.now()}`,
      });
      
      res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", authenticateToken, async (req: any, res) => {
    try {
      const { paymentId, orderId, signature, domainId, amount } = req.body;
      
      // Verify payment signature (simplified)
      // In production, use Razorpay's signature verification
      
      // Create payment record
      const payment = await storage.createPayment({
        userId: req.user.id,
        domainId,
        amount,
        currency: "INR",
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        status: "completed",
      });
      
      // Extend domain expiry by 1 year
      const domain = await storage.getDomainById(domainId);
      if (domain) {
        const currentExpiry = domain.expiryDate || new Date();
        const newExpiry = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000);
        await storage.updateDomain(domainId, { expiryDate: newExpiry, status: "active" });
      }
      
      // Create notification
      await storage.createNotification({
        userId: req.user.id,
        domainId,
        type: "payment_success",
        message: `Payment successful for domain renewal`,
      });
      
      res.json({ payment, message: "Payment verified and domain renewed" });
    } catch (error) {
      res.status(400).json({ message: "Payment verification failed" });
    }
  });

  app.get("/api/payments", authenticateToken, async (req: any, res) => {
    try {
      const payments = await storage.getPaymentsByUserId(req.user.id);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Notification routes
  app.get("/api/notifications", authenticateToken, async (req: any, res) => {
    try {
      const notifications = await storage.getNotificationsByUserId(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", authenticateToken, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(400).json({ message: "Failed to update notification" });
    }
  });

  // WHOIS lookup route
  app.get("/api/whois/:domain", authenticateToken, async (req: any, res) => {
    try {
      const domainName = req.params.domain;
      const whoisData = await lookupDomain(domainName);
      res.json(whoisData);
    } catch (error) {
      res.status(500).json({ message: "WHOIS lookup failed" });
    }
  });

  // Schedule cron jobs
  // Update domain statuses every hour
  cron.schedule("0 * * * *", updateDomainStatuses);
  
  // Send email notifications daily at 9 AM
  cron.schedule("0 9 * * *", sendExpiryNotifications);

  const httpServer = createServer(app);
  return httpServer;
}
