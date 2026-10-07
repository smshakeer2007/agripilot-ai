import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { config } from '../config/index.js';
import { registerSchema, loginSchema, updateUserSchema } from '../validators/auth.validator.js';
import { seedDemoDataForUser } from '../db/seed.js';

export const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const existingUser = await db.findUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validatedData.password, salt);

      const user = await db.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password_hash: passwordHash,
        farm_name: validatedData.farm_name,
        farming_sector: validatedData.farming_sector,
        farming_approach: validatedData.farming_approach,
        primary_goal: validatedData.primary_goal,
        risk_alert_threshold: validatedData.risk_alert_threshold
      });

      // Auto-seed initial realistic demo data so the dashboard is immediately active and impressive!
      try {
        await seedDemoDataForUser(user.id);
      } catch (seedErr) {
        console.warn('Auto-seed note:', seedErr.message);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      const { password_hash, ...safeUser } = user;

      return res.status(201).json({
        success: true,
        message: 'Farm user registered successfully.',
        token,
        user: safeUser
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await db.findUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const isMatch = await bcrypt.compare(validatedData.password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      const { password_hash, ...safeUser } = user;

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: safeUser
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      return res.json({
        success: true,
        user: req.user
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/settings
  async updateSettings(req, res, next) {
    try {
      const updates = updateUserSchema.parse(req.body);
      const updatedUser = await db.updateUser(req.user.id, updates);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const { password_hash, ...safeUser } = updatedUser;

      return res.json({
        success: true,
        message: 'Farm profile & settings updated.',
        user: safeUser
      });
    } catch (err) {
      next(err);
    }
  }
};
