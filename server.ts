import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { store, verifyPassword, AppStoreData } from './server/store';
import {
  CmsService,
  CmsProject,
  CmsTechnology,
  CmsProcessStep,
  CmsTestimonial,
  CmsBlogPost,
  CmsMediaItem,
  ProjectInquirySubmission,
  ContactMessageSubmission,
  MessageReply
} from './server/types';
import { emailService } from './server/emailService';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION MIDDLEWARE
  // ==========================================
  const requireAuth = (allowedRoles: ('super_admin' | 'admin' | 'editor')[] = ['super_admin', 'admin', 'editor']) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
      }

      const token = authHeader.substring(7);
      const session = store.getSession(token);
      if (!session) {
        return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
      }

      const user = store.getUserById(session.userId);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account not found.' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: `Access denied: insufficient permissions for role "${user.role}"` });
      }

      (req as any).user = user;
      (req as any).session = session;
      next();
    };
  };

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // Admin Login
  app.post('/api/auth/login', (req, res) => {
    const { login, password, rememberMe } = req.body;
    if (!login || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
    }

    const user = store.getUserByLogin(login);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/username and password.' });
    }

    const valid = verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/username and password.' });
    }

    user.lastLogin = new Date().toISOString();
    store.updateData('users', store.getData().users);

    const session = store.createSession(user.id, !!rememberMe);
    store.addAuditLog(user.name, 'LOGIN', 'Auth', user.id, `User signed in successfully (role: ${user.role})`);

    res.json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        lastLogin: user.lastLogin
      }
    });
  });

  // Verify Active Session / Get Current User
  app.get('/api/auth/me', requireAuth(), (req, res) => {
    const user = (req as any).user;
    const session = (req as any).session;
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        lastLogin: user.lastLogin
      },
      expiresAt: session.expiresAt
    });
  });

  // Logout (Invalidate current session)
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      store.deleteSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Logout All Sessions
  app.post('/api/auth/logout-all', requireAuth(), (req, res) => {
    const user = (req as any).user;
    store.deleteAllSessionsForUser(user.id);
    res.json({ success: true, message: 'All active sessions invalidated.' });
  });

  // Change Password
  app.post('/api/auth/change-password', requireAuth(), (req, res) => {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const valid = verifyPassword(currentPassword, user.salt, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Current password does not match.' });
    }

    store.updateUserPassword(user.id, newPassword);
    const newSession = store.createSession(user.id, false);
    store.addAuditLog(user.name, 'PASSWORD_CHANGE', 'Auth', user.id, 'User changed account password');

    res.json({
      success: true,
      token: newSession.token,
      expiresAt: newSession.expiresAt,
      message: 'Password changed successfully.'
    });
  });

  // ==========================================
  // PUBLIC API ENDPOINTS
  // ==========================================

  // Get full published website content
  app.get('/api/public-content', (req, res) => {
    const data = store.getData();
    const publishedServices = data.services
      .filter((s) => s.status === 'published')
      .sort((a, b) => a.order - b.order);

    const publishedProjects = data.projects
      .filter((p) => p.status === 'published')
      .sort((a, b) => a.order - b.order);

    const activeTech = data.technologies
      .filter((t) => t.active)
      .sort((a, b) => a.order - b.order);

    const activeProcess = data.process
      .filter((p) => p.active)
      .sort((a, b) => a.order - b.order);

    const publishedTestimonials = data.testimonials
      .filter((t) => t.status === 'published')
      .sort((a, b) => a.order - b.order);

    const publishedBlog = data.blog
      .filter((b) => b.status === 'published');

    res.json({
      success: true,
      brand: data.brand,
      hero: data.hero,
      sectionToggles: data.sectionToggles,
      about: data.about,
      services: publishedServices,
      projects: publishedProjects,
      technologies: activeTech,
      process: activeProcess,
      testimonials: publishedTestimonials,
      blog: publishedBlog,
      seo: data.seo,
      appearance: data.appearance
    });
  });

  // Track visitor
  app.post('/api/track-visit', (req, res) => {
    store.incrementVisitor();
    res.json({ success: true, count: store.getData().visitorCount });
  });

  // Submit Start a Project Inquiry (Public customer endpoint)
  app.post('/api/inquiries', (req, res) => {
    const body = req.body;
    if (!body.fullName || !body.email || !body.description) {
      return res.status(400).json({ success: false, error: 'Full name, email, and description are required.' });
    }

    const newInquiry: ProjectInquirySubmission = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      projectType: body.projectType || 'Web Application',
      budgetRange: body.budgetRange || '$10,000 – $25,000',
      timeline: body.timeline || 'Standard (1–2 months)',
      description: body.description,
      targetUsers: body.targetUsers || '',
      preferredTech: body.preferredTech || '',
      referenceUrl: body.referenceUrl || '',
      additionalMessage: body.additionalMessage || '',
      attachmentName: body.attachmentName || undefined,
      status: 'new',
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentInquiries = store.getData().inquiries;
    store.updateData('inquiries', [newInquiry, ...currentInquiries]);

    store.addAuditLog(
      body.fullName,
      'SUBMIT_INQUIRY',
      'Inquiry',
      newInquiry.id,
      `New project request for ${newInquiry.projectType} (${newInquiry.budgetRange})`
    );

    store.addNotification(
      'New Project Request',
      `Incoming brief from ${newInquiry.fullName} (${newInquiry.company || 'Individual'}) for ${newInquiry.projectType}`,
      'inquiry',
      'inquiries'
    );

    store.broadcastEvent({
      type: 'NEW_INQUIRY',
      inquiry: newInquiry
    });

    res.status(201).json({ success: true, inquiry: newInquiry });
  });

  // Submit Contact Form Message (Public customer endpoint)
  app.post('/api/messages', (req, res) => {
    const body = req.body;
    if (!body.name || !body.email || !body.message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const newMessage: ContactMessageSubmission = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject || 'General Consultation Inquiry',
      message: body.message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    const currentMessages = store.getData().messages;
    store.updateData('messages', [newMessage, ...currentMessages]);

    store.addAuditLog(
      body.name,
      'SUBMIT_MESSAGE',
      'ContactMessage',
      newMessage.id,
      `Message: "${newMessage.subject}" from ${newMessage.email}`
    );

    store.addNotification(
      'New Contact Message',
      `Direct message from ${newMessage.name} (${newMessage.email}): "${newMessage.subject}"`,
      'message',
      'messages'
    );

    store.broadcastEvent({
      type: 'NEW_MESSAGE',
      message: newMessage
    });

    res.status(201).json({ success: true, message: newMessage });
  });

  // ==========================================
  // REAL-TIME SERVER-SENT EVENTS (SSE)
  // ==========================================
  app.get('/api/admin/events', (req, res) => {
    // Check auth via token query param or authorization header
    const token = (req.query.token as string) || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : null);
    if (!token || !store.getSession(token)) {
      return res.status(401).json({ success: false, message: 'Authentication required for SSE stream.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    const unregister = store.registerSseClient((data) => {
      res.write(data);
    });

    const interval = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 25000);

    req.on('close', () => {
      clearInterval(interval);
      unregister();
    });
  });

  // ==========================================
  // PROTECTED ADMIN API ENDPOINTS
  // ==========================================

  // Dashboard Overview Stats
  app.get('/api/admin/stats', requireAuth(), (req, res) => {
    const data = store.getData();
    const newInquiries = data.inquiries.filter((i) => i.status === 'new').length;
    const inProgressInquiries = data.inquiries.filter((i) => i.status === 'in_progress').length;
    const unreadMessages = data.messages.filter((m) => m.status === 'unread').length;

    const publishedProjects = data.projects.filter((p) => p.status === 'published').length;
    const publishedServices = data.services.filter((s) => s.status === 'published').length;

    res.json({
      success: true,
      stats: {
        projectRequestsTotal: data.inquiries.length,
        projectRequestsNew: newInquiries,
        projectRequestsInProgress: inProgressInquiries,
        contactMessagesTotal: data.messages.length,
        contactMessagesUnread: unreadMessages,
        totalProjects: data.projects.length,
        publishedProjects,
        totalServices: data.services.length,
        publishedServices,
        totalTechnologies: data.technologies.length,
        websiteVisitors: data.visitorCount
      },
      recentInquiries: data.inquiries.slice(0, 5),
      recentMessages: data.messages.slice(0, 5),
      recentAuditLogs: data.auditLogs.slice(0, 10),
      unreadNotificationsCount: data.notifications.filter((n) => !n.read).length
    });
  });

  // Full Admin Store Data
  app.get('/api/admin/data', requireAuth(), (req, res) => {
    res.json({ success: true, data: store.getData() });
  });

  // Brand Update
  app.put('/api/admin/brand', requireAuth(['super_admin', 'admin']), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('brand', req.body, actor, 'Updated brand profile & social settings');
    res.json({ success: true, brand: store.getData().brand });
  });

  // Hero Update
  app.put('/api/admin/hero', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('hero', req.body, actor, 'Updated Home Hero typography & CTA buttons');
    res.json({ success: true, hero: store.getData().hero });
  });

  // Section Toggles Update
  app.put('/api/admin/section-toggles', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('sectionToggles', req.body, actor, 'Updated homepage section toggles & order');
    res.json({ success: true, sectionToggles: store.getData().sectionToggles });
  });

  // About Content Update
  app.put('/api/admin/about', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('about', req.body, actor, 'Updated biography, philosophy & career experiences');
    res.json({ success: true, about: store.getData().about });
  });

  // SEO Settings Update
  app.put('/api/admin/seo', requireAuth(['super_admin', 'admin']), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('seo', req.body, actor, 'Updated SEO titles, OpenGraph & meta description');
    res.json({ success: true, seo: store.getData().seo });
  });

  // Appearance Settings Update
  app.put('/api/admin/appearance', requireAuth(['super_admin', 'admin']), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('appearance', req.body, actor, 'Updated appearance styling & visual controls');
    res.json({ success: true, appearance: store.getData().appearance });
  });

  // Services CRUD
  app.get('/api/admin/services', requireAuth(), (req, res) => {
    res.json({ success: true, services: store.getData().services });
  });

  app.post('/api/admin/services', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const services = [...store.getData().services];
    const newService: CmsService = {
      id: req.body.id || `srv_${Date.now()}`,
      number: String(services.length + 1).padStart(2, '0'),
      title: req.body.title || 'NEW SERVICE',
      slug: req.body.slug || `service-${Date.now()}`,
      tagline: req.body.tagline || '',
      description: req.body.description || '',
      deliverables: req.body.deliverables || [],
      technologies: req.body.technologies || [],
      highlight: req.body.highlight || 'Featured',
      status: req.body.status || 'published',
      featured: req.body.featured ?? true,
      order: services.length + 1
    };
    services.push(newService);
    store.updateData('services', services, actor, `Created service: ${newService.title}`);
    res.status(201).json({ success: true, service: newService });
  });

  app.put('/api/admin/services/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const services = store.getData().services.map((s) => {
      if (s.id === req.params.id) {
        return { ...s, ...req.body };
      }
      return s;
    });
    store.updateData('services', services, actor, `Updated service: ${req.body.title || req.params.id}`);
    res.json({ success: true, services });
  });

  app.delete('/api/admin/services/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const services = store.getData().services.filter((s) => s.id !== req.params.id);
    store.updateData('services', services, actor, `Deleted service ID: ${req.params.id}`);
    res.json({ success: true, services });
  });

  // Projects CRUD
  app.get('/api/admin/projects', requireAuth(), (req, res) => {
    res.json({ success: true, projects: store.getData().projects });
  });

  app.post('/api/admin/projects', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const projects = [...store.getData().projects];
    const newProject: CmsProject = {
      id: req.body.id || `proj_${Date.now()}`,
      number: String(projects.length + 1).padStart(2, '0'),
      name: req.body.name || 'NEW PROJECT',
      slug: req.body.slug || `project-${Date.now()}`,
      tagline: req.body.tagline || '',
      category: req.body.category || 'Web Application',
      client: req.body.client || 'Confidential Client',
      year: req.body.year || new Date().getFullYear().toString(),
      scope: req.body.scope || 'Architecture, Design, Full-Stack Build',
      description: req.body.description || '',
      coverImage: req.body.coverImage || '/src/assets/images/project_nexatalk_1790694609831.png',
      galleryImages: req.body.galleryImages || [req.body.coverImage || '/src/assets/images/project_nexatalk_1790694609831.png'],
      projectUrl: req.body.projectUrl || '',
      githubUrl: req.body.githubUrl || '',
      technologies: req.body.technologies || ['React', 'TypeScript', 'Node.js'],
      metrics: req.body.metrics || [
        { label: 'Latency budget', value: '< 50ms' },
        { label: 'Uptime verification', value: '99.9%' }
      ],
      caseStudy: req.body.caseStudy || {
        challenge: 'Provide scalable architecture for low-latency digital experiences.',
        architecture: 'Engineered with clean separation of client interfaces and backend microservices.',
        result: 'Achieved production reliability and exceptional performance benchmarks.'
      },
      featured: req.body.featured ?? true,
      status: req.body.status || 'published',
      order: projects.length + 1
    };
    projects.push(newProject);
    store.updateData('projects', projects, actor, `Created project: ${newProject.name}`);
    res.status(201).json({ success: true, project: newProject });
  });

  app.put('/api/admin/projects/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const projects = store.getData().projects.map((p) => {
      if (p.id === req.params.id) {
        return { ...p, ...req.body };
      }
      return p;
    });
    store.updateData('projects', projects, actor, `Updated project: ${req.body.name || req.params.id}`);
    res.json({ success: true, projects });
  });

  app.delete('/api/admin/projects/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const projects = store.getData().projects.filter((p) => p.id !== req.params.id);
    store.updateData('projects', projects, actor, `Deleted project ID: ${req.params.id}`);
    res.json({ success: true, projects });
  });

  // Technologies CRUD
  app.get('/api/admin/technologies', requireAuth(), (req, res) => {
    res.json({ success: true, technologies: store.getData().technologies });
  });

  app.post('/api/admin/technologies', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const technologies = [...store.getData().technologies];
    const newTech: CmsTechnology = {
      id: req.body.id || `tech_${Date.now()}`,
      name: req.body.name || 'New Technology',
      category: req.body.category || 'Frontend',
      description: req.body.description || '',
      active: req.body.active ?? true,
      order: technologies.length + 1
    };
    technologies.push(newTech);
    store.updateData('technologies', technologies, actor, `Added technology: ${newTech.name}`);
    res.status(201).json({ success: true, technology: newTech });
  });

  app.put('/api/admin/technologies/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const technologies = store.getData().technologies.map((t) => {
      if (t.id === req.params.id) {
        return { ...t, ...req.body };
      }
      return t;
    });
    store.updateData('technologies', technologies, actor, `Updated technology: ${req.body.name || req.params.id}`);
    res.json({ success: true, technologies });
  });

  app.delete('/api/admin/technologies/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const technologies = store.getData().technologies.filter((t) => t.id !== req.params.id);
    store.updateData('technologies', technologies, actor, `Deleted technology ID: ${req.params.id}`);
    res.json({ success: true, technologies });
  });

  // Process Pipeline Update
  app.get('/api/admin/process', requireAuth(), (req, res) => {
    res.json({ success: true, process: store.getData().process });
  });

  app.put('/api/admin/process', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    store.updateData('process', req.body, actor, 'Updated engineering delivery process stages');
    res.json({ success: true, process: store.getData().process });
  });

  // Testimonials CRUD
  app.get('/api/admin/testimonials', requireAuth(), (req, res) => {
    res.json({ success: true, testimonials: store.getData().testimonials });
  });

  app.post('/api/admin/testimonials', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const testimonials = [...store.getData().testimonials];
    const newTestimonial: CmsTestimonial = {
      id: req.body.id || `test_${Date.now()}`,
      clientName: req.body.clientName || 'Client Name',
      company: req.body.company || 'Company Inc',
      role: req.body.role || 'Founder / CTO',
      content: req.body.content || '',
      rating: req.body.rating || 5,
      avatar: req.body.avatar || '',
      projectRelationship: req.body.projectRelationship || req.body.projectRelation || '',
      status: req.body.status || 'published',
      order: testimonials.length + 1
    };
    testimonials.push(newTestimonial);
    store.updateData('testimonials', testimonials, actor, `Added testimonial from ${newTestimonial.clientName}`);
    res.status(201).json({ success: true, testimonial: newTestimonial });
  });

  app.put('/api/admin/testimonials/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const testimonials = store.getData().testimonials.map((t) => {
      if (t.id === req.params.id) {
        return { ...t, ...req.body };
      }
      return t;
    });
    store.updateData('testimonials', testimonials, actor, `Updated testimonial: ${req.params.id}`);
    res.json({ success: true, testimonials });
  });

  app.delete('/api/admin/testimonials/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const testimonials = store.getData().testimonials.filter((t) => t.id !== req.params.id);
    store.updateData('testimonials', testimonials, actor, `Deleted testimonial ID: ${req.params.id}`);
    res.json({ success: true, testimonials });
  });

  // Blog / News CRUD
  app.get('/api/admin/blog', requireAuth(), (req, res) => {
    res.json({ success: true, blog: store.getData().blog });
  });

  app.post('/api/admin/blog', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const posts = [...store.getData().blog];
    const newPost: CmsBlogPost = {
      id: req.body.id || `post_${Date.now()}`,
      title: req.body.title || 'New Technical Article',
      slug: req.body.slug || `post-${Date.now()}`,
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      coverImage: req.body.coverImage || '',
      category: req.body.category || 'Engineering',
      tags: req.body.tags || ['Architecture', 'Engineering'],
      author: req.body.author || 'Krishna Bhandari',
      publishedDate: req.body.publishedDate || req.body.publishedAt || new Date().toISOString(),
      readingTime: req.body.readingTime || req.body.readTime || '5 min read',
      status: req.body.status || 'draft'
    };
    posts.unshift(newPost);
    store.updateData('blog', posts, actor, `Authored post: ${newPost.title}`);
    res.status(201).json({ success: true, post: newPost });
  });

  app.put('/api/admin/blog/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const posts = store.getData().blog.map((p) => {
      if (p.id === req.params.id) {
        return { ...p, ...req.body };
      }
      return p;
    });
    store.updateData('blog', posts, actor, `Updated post: ${req.body.title || req.params.id}`);
    res.json({ success: true, blog: posts });
  });

  app.delete('/api/admin/blog/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const posts = store.getData().blog.filter((p) => p.id !== req.params.id);
    store.updateData('blog', posts, actor, `Deleted post ID: ${req.params.id}`);
    res.json({ success: true, blog: posts });
  });

  // Media Library
  app.get('/api/admin/media', requireAuth(), (req, res) => {
    res.json({ success: true, media: store.getData().media });
  });

  app.post('/api/admin/media', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const mediaList = [...store.getData().media];
    const newMedia: CmsMediaItem = {
      id: req.body.id || `med_${Date.now()}`,
      filename: req.body.filename || req.body.name || 'Uploaded Asset',
      url: req.body.url,
      fileType: req.body.fileType || req.body.type || 'image',
      sizeBytes: req.body.sizeBytes || 320000,
      dimensions: req.body.dimensions || '1920x1080',
      uploadedAt: new Date().toISOString()
    };
    mediaList.unshift(newMedia);
    store.updateData('media', mediaList, actor, `Uploaded asset: ${newMedia.filename}`);
    res.status(201).json({ success: true, media: newMedia });
  });

  app.delete('/api/admin/media/:id', requireAuth(), (req, res) => {
    const actor = (req as any).user.name;
    const mediaList = store.getData().media.filter((m) => m.id !== req.params.id);
    store.updateData('media', mediaList, actor, `Deleted asset ID: ${req.params.id}`);
    res.json({ success: true, media: mediaList });
  });

  // Project Requests (Inquiries)
  app.get('/api/admin/inquiries', requireAuth(['super_admin', 'admin']), (req, res) => {
    res.json({ success: true, inquiries: store.getData().inquiries });
  });

  app.patch('/api/admin/inquiries/:id', requireAuth(['super_admin', 'admin']), (req, res) => {
    const actor = (req as any).user.name;
    const inquiries = store.getData().inquiries.map((inq) => {
      if (inq.id === req.params.id) {
        return { ...inq, ...req.body, updatedAt: new Date().toISOString() };
      }
      return inq;
    });
    store.updateData('inquiries', inquiries, actor, `Updated status/notes for project inquiry: ${req.params.id}`);
    res.json({ success: true, inquiries });
  });

  app.delete('/api/admin/inquiries/:id', requireAuth(['super_admin']), (req, res) => {
    const actor = (req as any).user.name;
    const inquiries = store.getData().inquiries.filter((inq) => inq.id !== req.params.id);
    store.updateData('inquiries', inquiries, actor, `Deleted inquiry ID: ${req.params.id}`);
    res.json({ success: true, inquiries });
  });

  // Contact Messages
  app.get('/api/admin/messages', requireAuth(['super_admin', 'admin']), (req, res) => {
    res.json({ success: true, messages: store.getData().messages });
  });

  app.patch('/api/admin/messages/:id', requireAuth(['super_admin', 'admin']), (req, res) => {
    const actor = (req as any).user.name;
    const messages = store.getData().messages.map((m) => {
      if (m.id === req.params.id) {
        return { ...m, ...req.body };
      }
      return m;
    });
    store.updateData('messages', messages, actor, `Updated contact message status: ${req.params.id}`);
    res.json({ success: true, messages });
  });

  app.delete('/api/admin/messages/:id', requireAuth(['super_admin']), (req, res) => {
    const actor = (req as any).user.name;
    const messages = store.getData().messages.filter((m) => m.id !== req.params.id);
    store.updateData('messages', messages, actor, `Deleted contact message: ${req.params.id}`);
    res.json({ success: true, messages });
  });

  // Contact Message Replies
  app.get('/api/admin/messages/:id/replies', requireAuth(['super_admin', 'admin']), (req, res) => {
    const replies = (store.getData().replies || []).filter((r) => r.messageId === req.params.id);
    res.json({ success: true, replies });
  });

  app.post('/api/admin/messages/:id/reply', requireAuth(['super_admin', 'admin']), async (req, res) => {
    const actor = (req as any).user.name;
    const actorId = (req as any).user.id;
    const { subject, replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ success: false, message: 'Reply message text is required.' });
    }

    const message = store.getData().messages.find((m) => m.id === req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const emailSubject = subject || `Re: ${message.subject}`;
    const result = await emailService.sendContactReply(
      message.email,
      message.name,
      emailSubject,
      replyText,
      actor
    );

    const newReply: MessageReply = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      messageId: message.id,
      adminId: actorId,
      adminName: actor,
      subject: emailSubject,
      replyText,
      deliveryStatus: result.status,
      deliveryError: result.error,
      createdAt: new Date().toISOString()
    };

    const currentReplies = store.getData().replies || [];
    store.updateData('replies', [newReply, ...currentReplies], actor, `Sent reply to ${message.email}`);

    // Update message status to replied
    const messages = store.getData().messages.map((m) => (m.id === message.id ? { ...m, status: 'replied' as const } : m));
    store.updateData('messages', messages);

    store.addAuditLog(actor, 'REPLY_MESSAGE', 'ContactMessage', message.id, `Replied to "${message.subject}" (${result.status} via ${result.provider})`);

    res.json({
      success: true,
      reply: newReply,
      deliveryStatus: result.status,
      provider: result.provider,
      message: result.status === 'sent' ? 'Reply delivered successfully.' : 'Reply recorded in database.'
    });
  });

  // Database Export & Import
  app.post('/api/admin/export', requireAuth(['super_admin']), (req, res) => {
    const data = store.getData();
    // Exclude password hashes and sessions from export
    const safeData = {
      ...data,
      sessions: [],
      users: data.users.map(({ passwordHash, salt, ...rest }) => rest)
    };
    res.json({ success: true, export: safeData, exportedAt: new Date().toISOString() });
  });

  app.post('/api/admin/import', requireAuth(['super_admin']), (req, res) => {
    const actor = (req as any).user.name;
    const imported = req.body;
    if (!imported || !imported.brand) {
      return res.status(400).json({ success: false, message: 'Invalid database backup JSON.' });
    }
    const current = store.getData();
    // Preserve current users and sessions to avoid lock-out
    imported.users = current.users;
    imported.sessions = current.sessions;
    for (const key of Object.keys(imported) as (keyof AppStoreData)[]) {
      if (key !== 'users' && key !== 'sessions') {
        store.updateData(key, imported[key] as any);
      }
    }
    store.addAuditLog(actor, 'IMPORT', 'System', 'store', 'Restored database from imported backup');
    res.json({ success: true, message: 'Database backup successfully imported.' });
  });

  // Notifications
  app.get('/api/admin/notifications', requireAuth(), (req, res) => {
    res.json({ success: true, notifications: store.getData().notifications });
  });

  app.put('/api/admin/notifications/:id/read', requireAuth(), (req, res) => {
    const notifications = store.getData().notifications.map((n) => (n.id === req.params.id ? { ...n, read: true } : n));
    store.updateData('notifications', notifications);
    res.json({ success: true, notifications });
  });

  // Admin User Profiles
  app.get('/api/admin/users', requireAuth(['super_admin']), (req, res) => {
    const safeUsers = store.getData().users.map(({ passwordHash, salt, ...rest }) => rest);
    res.json({ success: true, users: safeUsers });
  });

  app.put('/api/admin/users/:id', requireAuth(['super_admin']), (req, res) => {
    const actor = (req as any).user.name;
    const users = store.getData().users.map((u) => {
      if (u.id === req.params.id) {
        const { passwordHash, salt, ...safeBody } = req.body;
        return { ...u, ...safeBody };
      }
      return u;
    });
    store.updateData('users', users, actor, `Updated user credentials/profile: ${req.params.id}`);
    const safeUsers = users.map(({ passwordHash, salt, ...rest }) => rest);
    res.json({ success: true, users: safeUsers });
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', requireAuth(['super_admin', 'admin']), (req, res) => {
    res.json({ success: true, auditLogs: store.getData().auditLogs });
  });

  // ==========================================
  // VITE DEV MIDDLEWARE / STATIC PROD SERVING
  // ==========================================
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KBX Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[KBX Server] Startup failed:', err);
  process.exit(1);
});
