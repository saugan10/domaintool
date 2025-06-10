import { 
  users, domains, payments, notifications,
  type User, type InsertUser, type Domain, type InsertDomain,
  type Payment, type InsertPayment, type Notification, type InsertNotification,
  type DomainWithStats, type DashboardStats
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Domain methods
  getDomainsByUserId(userId: number): Promise<Domain[]>;
  getDomainById(id: number): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: number, updates: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: number): Promise<boolean>;
  getDashboardStats(userId: number): Promise<DashboardStats>;
  getDomainsWithStats(userId: number): Promise<DomainWithStats[]>;
  
  // Payment methods
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  // Notification methods
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  updateNotificationEmailSent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private domains: Map<number, Domain>;
  private payments: Map<number, Payment>;
  private notifications: Map<number, Notification>;
  private currentUserId: number;
  private currentDomainId: number;
  private currentPaymentId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.domains = new Map();
    this.payments = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentDomainId = 1;
    this.currentPaymentId = 1;
    this.currentNotificationId = 1;
    
    // Add sample data for testing
    this.initializeSampleData().catch(console.error);
  }

  private async initializeSampleData() {
    // Create a test user for easy login testing
    // Password: "password123" hashed with bcrypt
    const testUser: User = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
      createdAt: new Date(),
    };
    this.users.set(1, testUser);
    this.currentUserId = 2; // Start from 2 for new registrations
    
    // Sample domains
    const now = new Date();
    const domains = [
      {
        id: this.currentDomainId++,
        userId: 1,
        name: "example.com",
        registrar: "GoDaddy",
        expiryDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        status: "active" as const,
        tags: ["business", "main"],
        autoRenew: true,
        createdAt: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000), // 300 days ago
        updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: this.currentDomainId++,
        userId: 1,
        name: "mystore.com",
        registrar: "Namecheap",
        expiryDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now (expiring soon)
        status: "expiring" as const,
        tags: ["ecommerce", "store"],
        autoRenew: false,
        createdAt: new Date(now.getTime() - 350 * 24 * 60 * 60 * 1000), // 350 days ago
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: this.currentDomainId++,
        userId: 1,
        name: "testsite.org",
        registrar: "Domain.com",
        expiryDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
        status: "expired" as const,
        tags: ["test", "development"],
        autoRenew: false,
        createdAt: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000), // 400 days ago
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: this.currentDomainId++,
        userId: 1,
        name: "portfolio.dev",
        registrar: "Cloudflare",
        expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
        status: "active" as const,
        tags: ["personal", "portfolio"],
        autoRenew: true,
        createdAt: new Date(now.getTime() - 185 * 24 * 60 * 60 * 1000), // 185 days ago
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: this.currentDomainId++,
        userId: 1,
        name: "blog.net",
        registrar: "Google Domains",
        expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        status: "active" as const,
        tags: ["blog", "content"],
        autoRenew: false,
        createdAt: new Date(now.getTime() - 275 * 24 * 60 * 60 * 1000), // 275 days ago
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      }
    ];

    domains.forEach(domain => {
      this.domains.set(domain.id, domain);
    });

    // Sample payments
    const payments = [
      {
        id: this.currentPaymentId++,
        userId: 1,
        domainId: 1,
        amount: 1299, // $12.99 in cents
        currency: "USD",
        razorpayPaymentId: "pay_sample123",
        razorpayOrderId: "order_sample123",
        status: "completed" as const,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        id: this.currentPaymentId++,
        userId: 1,
        domainId: 4,
        amount: 899, // $8.99 in cents
        currency: "USD",
        razorpayPaymentId: "pay_sample456",
        razorpayOrderId: "order_sample456",
        status: "completed" as const,
        createdAt: new Date(now.getTime() - 185 * 24 * 60 * 60 * 1000), // 185 days ago
      },
      {
        id: this.currentPaymentId++,
        userId: 1,
        domainId: 2,
        amount: 1499, // $14.99 in cents
        currency: "USD",
        razorpayPaymentId: null,
        razorpayOrderId: "order_sample789",
        status: "pending" as const,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      }
    ];

    payments.forEach(payment => {
      this.payments.set(payment.id, payment);
    });

    // Sample notifications
    const notifications = [
      {
        id: this.currentNotificationId++,
        userId: 1,
        domainId: 2,
        type: "expiry_reminder" as const,
        message: "Domain mystore.com expires in 15 days",
        emailSent: true,
        read: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        domainId: 3,
        type: "domain_expired" as const,
        message: "Domain testsite.org has expired",
        emailSent: true,
        read: false,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        domainId: 1,
        type: "payment_success" as const,
        message: "Payment successful for domain example.com renewal",
        emailSent: false,
        read: true,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        domainId: 4,
        type: "payment_success" as const,
        message: "Payment successful for domain portfolio.dev renewal",
        emailSent: false,
        read: true,
        createdAt: new Date(now.getTime() - 185 * 24 * 60 * 60 * 1000), // 185 days ago
      }
    ];

    notifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    // Associate sample data with the first user created
    if (this.users.size === 1) {
      this.associateSampleDataWithUser(id);
    }
    
    return user;
  }

  private associateSampleDataWithUser(userId: number) {
    // Update all sample domains to belong to this user
    this.domains.forEach((domain, domainId) => {
      if (domain.userId === 1) {
        this.domains.set(domainId, { ...domain, userId });
      }
    });

    // Update all sample payments to belong to this user
    this.payments.forEach((payment, paymentId) => {
      if (payment.userId === 1) {
        this.payments.set(paymentId, { ...payment, userId });
      }
    });

    // Update all sample notifications to belong to this user
    this.notifications.forEach((notification, notificationId) => {
      if (notification.userId === 1) {
        this.notifications.set(notificationId, { ...notification, userId });
      }
    });
  }

  async getDomainsByUserId(userId: number): Promise<Domain[]> {
    return Array.from(this.domains.values()).filter(domain => domain.userId === userId);
  }

  async getDomainById(id: number): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const id = this.currentDomainId++;
    const now = new Date();
    const domain: Domain = {
      userId: insertDomain.userId,
      name: insertDomain.name,
      registrar: insertDomain.registrar || null,
      expiryDate: insertDomain.expiryDate || null,
      status: "active",
      tags: Array.isArray(insertDomain.tags) ? insertDomain.tags : [],
      autoRenew: insertDomain.autoRenew || false,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.domains.set(id, domain);
    return domain;
  }

  async updateDomain(id: number, updates: Partial<InsertDomain>): Promise<Domain | undefined> {
    const domain = this.domains.get(id);
    if (!domain) return undefined;

    const updatedDomain: Domain = {
      ...domain,
      ...updates,
      updatedAt: new Date(),
    };
    this.domains.set(id, updatedDomain);
    return updatedDomain;
  }

  async deleteDomain(id: number): Promise<boolean> {
    return this.domains.delete(id);
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const userDomains = await this.getDomainsByUserId(userId);
    const now = new Date();
    
    let activeDomains = 0;
    let expiringSoon = 0;
    let expiredDomains = 0;

    userDomains.forEach(domain => {
      if (!domain.expiryDate) {
        activeDomains++;
        return;
      }

      const daysUntilExpiry = Math.ceil((domain.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        expiredDomains++;
      } else if (daysUntilExpiry <= 30) {
        expiringSoon++;
      } else {
        activeDomains++;
      }
    });

    return {
      totalDomains: userDomains.length,
      activeDomains,
      expiringSoon,
      expiredDomains,
    };
  }

  async getDomainsWithStats(userId: number): Promise<DomainWithStats[]> {
    const userDomains = await this.getDomainsByUserId(userId);
    const now = new Date();

    return userDomains.map(domain => {
      if (!domain.expiryDate) {
        return {
          ...domain,
          daysUntilExpiry: 365,
          progressPercentage: 100,
        };
      }

      const daysUntilExpiry = Math.ceil((domain.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const totalDays = 365; // Assuming 1 year registration
      const progressPercentage = Math.max(0, Math.min(100, (daysUntilExpiry / totalDays) * 100));

      return {
        ...domain,
        daysUntilExpiry,
        progressPercentage,
      };
    });
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      status: insertPayment.status || "pending",
      currency: insertPayment.currency || "USD",
      razorpayPaymentId: insertPayment.razorpayPaymentId || null,
      razorpayOrderId: insertPayment.razorpayOrderId || null,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment: Payment = {
      ...payment,
      ...updates,
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(notification => notification.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      userId: insertNotification.userId,
      domainId: insertNotification.domainId || null,
      type: insertNotification.type,
      message: insertNotification.message,
      id,
      emailSent: false,
      read: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }

  async updateNotificationEmailSent(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.emailSent = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
