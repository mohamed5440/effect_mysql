import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import pool, { dbStatus, missingEnvVars, dbInitialized } from './src/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { User } from './src/types';
import { contactSchema, applicationSchema, loginSchema } from './src/lib/security';
import { sendSuccess, sendError, sendDbUnavailable, sendValidationError, sendUnauthorized } from './src/lib/api-utils';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust first proxy for rate limiting (needed in environments like Cloud Run / AI Studio)
  app.set('trust proxy', 1);

  // Security and performance middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://i.postimg.cc", "https://*.google.com", "https://images.unsplash.com", "*"],
        connectSrc: ["'self'", "https://*.run.app", "wss://*.run.app", "https://*.effect.online"],
        frameAncestors: ["'self'", "https://*.google.com", "https://ai.studio", "https://*.effect.online"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));

  // Gzip compression for all responses
  app.use(compression({
    level: 6, // Balance between compression ratio and CPU usage
    threshold: 100, // Only compress responses larger than 100 bytes
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    }
  }));

  // Static files with aggressive caching for production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    const oneYear = 31536000000;
    
    // Serve static assets with long-term cache
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: oneYear,
      immutable: true,
      etag: true
    }));

    // Serve other static files
    app.use(express.static(distPath, {
      maxAge: '1h', // 1 hour for index.html and other root files
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache'); // Don't cache HTML to ensure quick updates
        }
      }
    }));
  }

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://effect.online',
    'https://www.effect.online',
    'https://ai.studio'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.run.app') || 
        origin.endsWith('.google.com')
      ) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
  }));

  app.use(express.json({ limit: '10kb' })); // Limit JSON payload size to prevent DOS
  app.use(cookieParser());

  // Block malicious patterns in URL and Query
  app.use((req, res, next) => {
    const maliciousPatterns = [/<script/i, /eval\(/i, /union\s+select/i, /base64/i];
    const url = decodeURIComponent(req.originalUrl);
    
    if (maliciousPatterns.some(pattern => pattern.test(url))) {
      console.warn(`[SECURITY] Blocked malicious request pattern from IP: ${req.ip} - ${req.method} ${req.url}`);
      return res.status(403).json({ error: 'Request blocked for security reasons.' });
    }
    next();
  });

  const JWT_SECRET = process.env.JWT_SECRET;
  const IS_PROD = process.env.NODE_ENV === 'production';
  
  if (!JWT_SECRET && IS_PROD) {
    console.error('FATAL ERROR: JWT_SECRET environment variable is REQUIRED in production.');
    process.exit(1);
  }

  const defaultSecret = JWT_SECRET || 'dev_secret_only';

  // Seed default admin helper
  const seedAdmin = async () => {
    try {
      await dbInitialized;
      if (!dbStatus.initialized) {
        console.warn('[SEED] Database not initialized successfully, skipping admin seeding.');
        return;
      }

      const targetEmail = (process.env.ADMIN_EMAIL || 'sohaib200596@gmail.com').toLowerCase().trim();
      const targetPassword = process.env.ADMIN_PASSWORD;
      const fallbackPassword = IS_PROD ? null : 'sohaib200596';
      const adminPassword = targetPassword || fallbackPassword;
      
      const [adminRows]: any = await pool.query('SELECT * FROM admins WHERE email = ?', [targetEmail]);
      
      if (adminRows.length === 0) {
        if (!adminPassword) {
          console.error('!!! FATAL: No ADMIN_PASSWORD set for initial admin creation. Production requires this environment variable. !!!');
          if (IS_PROD) process.exit(1);
          return;
        }
        console.log(`[SEED] Creating initial admin: ${targetEmail}`);
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await pool.query('INSERT INTO admins (email, password) VALUES (?, ?)', [targetEmail, hashedPassword]);
        console.log('[SEED] Admin created successfully.');
      } else if (targetPassword) {
        // Only update if environment variable is explicitly provided
        console.log(`[SEED] Environment password provided, updating admin: ${targetEmail}`);
        const hashedPassword = await bcrypt.hash(targetPassword, 12);
        const updateSql = dbStatus.type === 'sqlite' 
          ? 'UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
          : 'UPDATE admins SET password = ? WHERE email = ?';
        await pool.query(updateSql, [hashedPassword, targetEmail]);
        console.log('[SEED] Admin password updated.');
      } else {
        console.log(`[SEED] Admin already exists: ${targetEmail}`);
      }
    } catch (err) {
      console.error('[SEED] Critical error during admin seeding:', err);
    }
  };

  // Run seeding
  await seedAdmin();

  // Rate Limiters
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: { error: 'Too many requests, please try again later.' }
  });

  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: { error: 'Too many login attempts, please try again in an hour.' }
  });

  const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 submissions per hour
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: { error: 'Too many submissions, please try again later.' }
  });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    // Check cookie first, then Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return sendUnauthorized(res, 'Unauthorized: Session expired or missings');
    }
 
    try {
      const decoded = jwt.verify(token, defaultSecret);
      req.user = decoded;
      next();
    } catch (err) {
      console.warn(`[AUTH] Invalid token for ${req.path}`);
      return sendUnauthorized(res, 'Invalid or expired token');
    }
  };

  // --- API Routes ---
  app.use('/api/', apiLimiter);

  // Health Check
  app.get('/api/health', async (req, res) => {
    try {
      if (!dbStatus.initialized) {
        return sendDbUnavailable(res);
      }

      await pool.query('SELECT 1');
      
      res.set('Cache-Control', 'no-store');
      res.json({ 
        status: 'ok',
        uptime: process.uptime()
      });
    } catch (err: any) {
      return sendDbUnavailable(res);
    }
  });

  // Auth
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      console.warn(`[SECURITY] Invalid login payload from IP: ${req.ip}`);
      return sendValidationError(res);
    }

    const { email, password } = validation.data;
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const [rows]: any = await pool.query('SELECT * FROM admins WHERE email = ?', [normalizedEmail]);
      const user = rows[0] as User & { password: string };

      if (!user) {
        console.warn(`[SECURITY] Failed login attempt: User not found (${normalizedEmail}) from IP: ${req.ip}`);
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Anti timing-attack delay
        return sendError(res, 401, 'بيانات غير صحيحة');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        console.warn(`[SECURITY] Failed login attempt: Incorrect password for ${normalizedEmail} from IP: ${req.ip}`);
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Anti timing-attack delay
        return sendError(res, 401, 'بيانات غير صحيحة');
      }

      const token = jwt.sign({ id: user.id, email: user.email }, defaultSecret, { expiresIn: '1d' });
      
      console.log(`[AUTH] User logged in: ${normalizedEmail}`);

      res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none', // Needed for AI Studio iframe
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      
      res.json({ 
        user: { id: user.id, email: user.email },
        token: token 
      });
    } catch (err) {
      console.error('Login Error:', err);
      return sendError(res, 500, 'حدث خطأ أثناء تسجيل الدخول.');
    }
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    res.json({ message: 'Logged out successfully' });
  });

  // Contacts
  app.post('/api/contacts', submissionLimiter, async (req, res) => {
    console.log(`[SUBMISSION] Received contact request from IP: ${req.ip}`);
    const validation = contactSchema.safeParse(req.body);
    if (!validation.success) {
      console.warn(`[SUBMISSION] Contact validation failed:`, validation.error.format());
      return sendValidationError(res);
    }
    
    const { full_name, email, phone, subject, message } = validation.data;
    console.log(`[SUBMISSION] Saving contact from: ${full_name} (${email})`);
    
    if (!dbStatus.initialized) {
      console.error('[SUBMISSION] Database not available for contact saving');
      return sendDbUnavailable(res);
    }

    try {
      const [result]: any = await pool.query(
        'INSERT INTO contacts (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, phone, subject, message]
      );
      console.log(`[SUBMISSION] Contact saved successfully. ID: ${result.insertId || result.lastID}`);
      return sendSuccess(res);
    } catch (err: any) {
      console.error('Error saving contact:', err);
      return sendDbUnavailable(res);
    }
  });

  // Applications
  app.post('/api/applications', submissionLimiter, async (req, res) => {
    console.log(`[SUBMISSION] Received application request from IP: ${req.ip}`);
    const validation = applicationSchema.safeParse(req.body);
    if (!validation.success) {
      console.warn(`[SUBMISSION] Application validation failed:`, validation.error.format());
      return sendValidationError(res);
    }

    const { 
      full_name, email, phone, location, expertise, 
      experience, portfolio, skills, min_rate, max_rate, bio 
    } = validation.data;
    console.log(`[SUBMISSION] Saving application from: ${full_name} (${email})`);

    if (!dbStatus.initialized) {
      console.error('[SUBMISSION] Database not available for application saving');
      return sendDbUnavailable(res);
    }

    try {
      const [result]: any = await pool.query(
        'INSERT INTO applications (full_name, email, phone, location, expertise, experience, portfolio, skills, min_rate, max_rate, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [full_name, email, phone, location, expertise, experience, portfolio, skills, min_rate, max_rate, bio]
      );
      
      const insertId = result.insertId || result.lastInsertRowid || result.lastID;
      console.log(`[SUBMISSION] Application saved successfully. ID: ${insertId}`);
      return sendSuccess(res, { success: true, id: insertId });
    } catch (err: any) {
      console.error('Error saving application:', err);
      return sendDbUnavailable(res);
    }
  });

  // Admin Data
  app.get('/api/admin/applications', authenticate, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
      res.set('Cache-Control', 'no-store');
      res.json(rows);
    } catch (err) {
      console.error('[ADMIN] Error fetching applications:', err);
      res.status(500).json({ error: 'Error fetching applications' });
    }
  });

  app.get('/api/admin/contacts', authenticate, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
      res.set('Cache-Control', 'no-store');
      res.json(rows);
    } catch (err) {
      console.error('[ADMIN] Error fetching contacts:', err);
      res.status(500).json({ error: 'Error fetching contacts' });
    }
  });

  app.delete('/api/admin/contacts/:id', authenticate, async (req, res) => {
    try {
      await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
      return sendSuccess(res);
    } catch (err) {
      return sendError(res, 500, 'Error deleting contact');
    }
  });

  app.delete('/api/admin/applications/:id', authenticate, async (req, res) => {
    try {
      await pool.query('DELETE FROM applications WHERE id = ?', [req.params.id]);
      return sendSuccess(res);
    } catch (err) {
      return sendError(res, 500, 'Error deleting application');
    }
  });

  app.patch('/api/admin/applications/:id/status', authenticate, async (req, res) => {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' });
    }

    try {
      const updateSql = dbStatus.type === 'sqlite'
        ? 'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        : 'UPDATE applications SET status = ? WHERE id = ?';
        
      const [result]: any = await pool.query(updateSql, [status, req.params.id]);
      if (result.affectedRows === 0 && result.changes === 0) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Update status error:', err);
      res.status(500).json({ error: 'Error updating status' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
