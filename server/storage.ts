import { 
  users, domains, payments, notifications,
  type User, type InsertUser, type Domain, type InsertDomain,
  type Payment, type InsertPayment, type Notification, type InsertNotification,
  type DomainWithStats, type DashboardStats
} from "@shared/schema";

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
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
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
      ...insertDomain,
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
      ...insertNotification,
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
