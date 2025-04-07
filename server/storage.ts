import { users, surveys, surveyResponses, type User, type InsertUser, type Survey, type InsertSurvey, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getUsers(role?: string, flag?: string): Promise<User[]>;
  
  // Survey operations
  getSurvey(id: string): Promise<Survey | undefined>;
  getSurveys(category?: string, createdBy?: string): Promise<Survey[]>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  updateSurvey(id: string, data: Partial<Survey>): Promise<Survey | undefined>;
  deleteSurvey(id: string): Promise<boolean>;
  
  // Survey response operations
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponsesByVendor(vendorId: string): Promise<SurveyResponse[]>;
  getSurveyResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]>;
}

export class MemStorage implements IStorage {
  private userStore: Map<string, User>;
  private surveyStore: Map<string, Survey>;
  private responseStore: Map<string, SurveyResponse>;
  private userIdCounter: number;
  private surveyIdCounter: number;
  private responseIdCounter: number;

  constructor() {
    this.userStore = new Map();
    this.surveyStore = new Map();
    this.responseStore = new Map();
    this.userIdCounter = 1;
    this.surveyIdCounter = 1;
    this.responseIdCounter = 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const created_at = new Date();
    const newUser: User = { ...user, id, created_at, flag: 'no' };
    this.userStore.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.userStore.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }

  async getUsers(role?: string, flag?: string): Promise<User[]> {
    let users = Array.from(this.userStore.values());
    
    if (role) {
      users = users.filter(user => user.role === role);
    }
    
    if (flag) {
      users = users.filter(user => user.flag === flag);
    }
    
    return users;
  }

  // Survey operations
  async getSurvey(id: string): Promise<Survey | undefined> {
    return this.surveyStore.get(id);
  }

  async getSurveys(category?: string, createdBy?: string): Promise<Survey[]> {
    let surveys = Array.from(this.surveyStore.values());
    
    if (category) {
      surveys = surveys.filter(survey => survey.category === category);
    }
    
    if (createdBy) {
      surveys = surveys.filter(survey => survey.created_by === createdBy);
    }
    
    return surveys;
  }

  async createSurvey(survey: InsertSurvey): Promise<Survey> {
    const id = crypto.randomUUID();
    const created_at = new Date();
    const newSurvey: Survey = { ...survey, id, created_at, is_active: true };
    this.surveyStore.set(id, newSurvey);
    return newSurvey;
  }

  async updateSurvey(id: string, data: Partial<Survey>): Promise<Survey | undefined> {
    const survey = this.surveyStore.get(id);
    if (!survey) return undefined;
    
    const updatedSurvey = { ...survey, ...data };
    this.surveyStore.set(id, updatedSurvey);
    return updatedSurvey;
  }

  async deleteSurvey(id: string): Promise<boolean> {
    return this.surveyStore.delete(id);
  }

  // Survey response operations
  async createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = crypto.randomUUID();
    const completed_at = new Date();
    const newResponse: SurveyResponse = { ...response, id, completed_at };
    this.responseStore.set(id, newResponse);
    return newResponse;
  }

  async getSurveyResponsesByVendor(vendorId: string): Promise<SurveyResponse[]> {
    return Array.from(this.responseStore.values()).filter(
      response => response.vendor_id === vendorId
    );
  }

  async getSurveyResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    return Array.from(this.responseStore.values()).filter(
      response => response.survey_id === surveyId
    );
  }
}

export const storage = new MemStorage();
