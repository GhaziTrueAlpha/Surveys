import { users, surveys, surveyResponses, type User, type InsertUser, type Survey, type InsertSurvey, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUniqueId(uniqueId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getUsers(role?: string, flag?: string): Promise<User[]>;
  
  // Survey operations
  getSurvey(id: string): Promise<Survey | undefined>;
  getSurveyByUniqueId(uniqueId: string): Promise<Survey | undefined>;
  getSurveys(category?: string, createdBy?: string): Promise<Survey[]>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  updateSurvey(id: string, data: Partial<Survey>): Promise<Survey | undefined>;
  deleteSurvey(id: string): Promise<boolean>;
  
  // Survey response operations
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponsesByVendor(vendorId: string): Promise<SurveyResponse[]>;
  getSurveyResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]>;

  // Initialize default admin
  initializeAdmin(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  
  async getUserByUniqueId(uniqueId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.unique_id, uniqueId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const newUser = { ...user, password: hashedPassword };
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
      
    return result[0];
  }

  async getUsers(role?: string, flag?: string): Promise<User[]> {
    if (role && flag) {
      return await db.select().from(users)
        .where(and(eq(users.role, role), eq(users.flag, flag)));
    } else if (role) {
      return await db.select().from(users)
        .where(eq(users.role, role));
    } else if (flag) {
      return await db.select().from(users)
        .where(eq(users.flag, flag));
    } else {
      return await db.select().from(users);
    }
  }

  // Survey operations
  async getSurvey(id: string): Promise<Survey | undefined> {
    const result = await db.select().from(surveys).where(eq(surveys.id, id)).limit(1);
    return result[0];
  }
  
  async getSurveyByUniqueId(uniqueId: string): Promise<Survey | undefined> {
    const result = await db.select().from(surveys).where(eq(surveys.unique_id, uniqueId)).limit(1);
    return result[0];
  }

  async getSurveys(category?: string, createdBy?: string): Promise<Survey[]> {
    if (category && createdBy) {
      return await db.select().from(surveys)
        .where(and(eq(surveys.category, category), eq(surveys.created_by, createdBy)));
    } else if (category) {
      return await db.select().from(surveys)
        .where(eq(surveys.category, category));
    } else if (createdBy) {
      return await db.select().from(surveys)
        .where(eq(surveys.created_by, createdBy));
    } else {
      return await db.select().from(surveys);
    }
  }

  async createSurvey(survey: InsertSurvey): Promise<Survey> {
    const result = await db.insert(surveys).values(survey).returning();
    return result[0];
  }

  async updateSurvey(id: string, data: Partial<Survey>): Promise<Survey | undefined> {
    const result = await db.update(surveys)
      .set(data)
      .where(eq(surveys.id, id))
      .returning();
      
    return result[0];
  }

  async deleteSurvey(id: string): Promise<boolean> {
    const result = await db.delete(surveys).where(eq(surveys.id, id)).returning();
    return result.length > 0;
  }

  // Survey response operations
  async createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const result = await db.insert(surveyResponses).values(response).returning();
    return result[0];
  }

  async getSurveyResponsesByVendor(vendorId: string): Promise<SurveyResponse[]> {
    return await db.select()
      .from(surveyResponses)
      .where(eq(surveyResponses.vendor_id, vendorId));
  }

  async getSurveyResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    return await db.select()
      .from(surveyResponses)
      .where(eq(surveyResponses.survey_id, surveyId));
  }

  // Initialize admin user
  async initializeAdmin(): Promise<void> {
    // Check if admin exists
    const adminExists = await db.select().from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);
    
    if (adminExists.length === 0) {
      // Create default admin
      const adminUser: InsertUser = {
        email: 'admin@example.com',
        password: 'admin123', // In production, use a strong password
        role: 'admin',
        name: 'Admin User',
        company_name: 'Survey Marketplace',
        account_email: 'admin@example.com',
        gst: 'ADMIN-GST',
        city: 'Admin City',
        flag: 'yes' // Admin is pre-approved
      };
      
      await this.createUser(adminUser);
      console.log('Default admin user created');
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize admin user on startup
storage.initializeAdmin().catch(console.error);
