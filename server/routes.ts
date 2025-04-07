import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSurveySchema, insertSurveyResponseSchema, type Survey } from "@shared/schema";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "survey-marketplace-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }

          // Compare the hashed password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
          }

          // Check if user is approved
          if (user.flag !== "yes") {
            return done(null, false, { message: "Account pending approval" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Password is already hashed in the storage layer's createUser method
      const user = await storage.createUser(userData);
      
      res.status(201).json({
        message: "User created successfully. Awaiting admin approval.",
        userId: user.id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/signin", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          category: user.category,
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/signout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      category: user.category,
      flag: user.flag,
    });
  });

  // User routes
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const { role, flag } = req.query;
      const users = await storage.getUsers(
        role as string | undefined,
        flag as string | undefined
      );
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Survey routes
  app.post("/api/surveys", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Only admins and clients can create surveys
      if (user.role !== "admin" && user.role !== "client") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const surveyData = insertSurveySchema.parse({
        ...req.body,
        created_by: user.id,
      });
      
      const survey = await storage.createSurvey(surveyData);
      res.status(201).json(survey);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/surveys", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { category } = req.query;
      
      let surveys: Survey[] = [];
      
      if (user.role === "admin") {
        // Admins can see all surveys
        surveys = await storage.getSurveys(category as string | undefined);
      } else if (user.role === "client") {
        // Clients can only see their own surveys
        surveys = await storage.getSurveys(
          category as string | undefined,
          user.id
        );
      } else if (user.role === "vendor") {
        // Vendors can only see surveys matching their category
        surveys = await storage.getSurveys(user.category || undefined);
      }
      
      res.json(surveys);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/surveys/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const survey = await storage.getSurvey(id);
      
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      res.json(survey);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/surveys/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      const survey = await storage.getSurvey(id);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      // Only admins or the creator can update a survey
      if (user.role !== "admin" && survey.created_by !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedSurvey = await storage.updateSurvey(id, req.body);
      res.json(updatedSurvey);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/surveys/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      const survey = await storage.getSurvey(id);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      // Only admins or the creator can delete a survey
      if (user.role !== "admin" && survey.created_by !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteSurvey(id);
      res.json({ message: "Survey deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Survey response routes
  app.post("/api/survey-responses", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Only vendors can create survey responses
      if (user.role !== "vendor") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const responseData = insertSurveyResponseSchema.parse({
        ...req.body,
        vendor_id: user.id,
      });
      
      // Check if survey exists and matches vendor's category
      const surveyId = responseData.survey_id as string;
      const survey = await storage.getSurvey(surveyId);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      if (survey.category !== user.category) {
        return res.status(403).json({ message: "You are not eligible for this survey" });
      }
      
      const response = await storage.createSurveyResponse(responseData);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/survey-responses/vendor", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      if (user.role !== "vendor") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const responses = await storage.getSurveyResponsesByVendor(user.id);
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/survey-responses/survey/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      const survey = await storage.getSurvey(id);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      // Only admins or the survey creator can see responses
      if (user.role !== "admin" && survey.created_by !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const responses = await storage.getSurveyResponsesBySurvey(id);
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
