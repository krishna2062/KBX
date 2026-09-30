-- ========================================================
-- KBX — KRISHNA BHANDARI PRODUCTION SUPABASE DATABASE SCHEMA
-- Normalized PostgreSQL Schema with RLS, Triggers, and Indexes
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically set updated_at on modify
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles & Roles (Links with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    title TEXT DEFAULT 'Software Developer & Founder',
    role TEXT CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for profiles
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Website Settings
CREATE TABLE IF NOT EXISTS website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL DEFAULT 'KBX',
    owner_name TEXT NOT NULL DEFAULT 'Krishna Bhandari',
    owner_title TEXT DEFAULT 'Independent Software Developer & Digital Product Builder',
    logo TEXT,
    favicon TEXT,
    owner_image TEXT,
    email TEXT DEFAULT 'contact@kbx.dev',
    phone TEXT,
    location TEXT DEFAULT 'Sydney / Remote',
    github_url TEXT DEFAULT 'https://github.com',
    linkedin_url TEXT DEFAULT 'https://linkedin.com',
    other_social_links JSONB DEFAULT '{}'::jsonb,
    copyright_text TEXT DEFAULT '© 2026 Krishna Bhandari. All rights reserved.',
    availability_status TEXT DEFAULT 'Available for Q2/Q3 Projects',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_website_settings_updated_at
BEFORE UPDATE ON website_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Home Content
CREATE TABLE IF NOT EXISTS home_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_eyebrow TEXT DEFAULT 'INDEPENDENT SOFTWARE DEVELOPER',
    hero_title TEXT DEFAULT 'Designing & Building',
    hero_title_highlight TEXT DEFAULT 'Modern Digital Products',
    hero_description TEXT DEFAULT 'Specialized in high-performance web applications, SaaS platforms, mobile apps, and robust custom software engineered for ambitious brands and fast-moving teams.',
    primary_cta_text TEXT DEFAULT 'Start a Project',
    primary_cta_url TEXT DEFAULT '/start-project',
    secondary_cta_text TEXT DEFAULT 'Explore Selected Work',
    secondary_cta_url TEXT DEFAULT '/projects',
    hero_visual_type TEXT CHECK (hero_visual_type IN ('3d', 'image', 'video')) DEFAULT '3d',
    hero_image TEXT,
    hero_video TEXT,
    hero_3d_config JSONB DEFAULT '{"model": "network_sphere", "density": 80, "interactive": true}'::jsonb,
    about_section_title TEXT DEFAULT 'Engineering Philosophy',
    about_section_description TEXT DEFAULT 'Direct collaboration without agency overhead or unnecessary meetings.',
    services_section_title TEXT DEFAULT 'Capabilities & Solutions',
    projects_section_title TEXT DEFAULT 'Selected Architecture & Builds',
    process_section_title TEXT DEFAULT 'Disciplined Delivery Framework',
    final_cta_title TEXT DEFAULT 'Have a project in mind?',
    final_cta_description TEXT DEFAULT 'Let us engineer your vision into a high-performance digital product.',
    section_toggles JSONB DEFAULT '{"services": true, "projects": true, "technologies": true, "process": true, "testimonials": true, "cta": true}'::jsonb,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_home_content_updated_at
BEFORE UPDATE ON home_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. About Content
CREATE TABLE IF NOT EXISTS about_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT DEFAULT 'Software Developer & Digital Product Builder',
    subtitle TEXT DEFAULT 'Building high-performance applications with precision and modern architecture.',
    biography TEXT DEFAULT 'Over 7+ years of engineering robust software, distributed cloud systems, and delightful digital experiences.',
    short_bio TEXT DEFAULT 'Krishna Bhandari is an independent software developer delivering scalable web applications, mobile software, and custom business platforms.',
    philosophy TEXT DEFAULT 'I believe great software is born at the intersection of rigorous architecture, performance discipline, and refined visual craft.',
    profile_image TEXT,
    location TEXT DEFAULT 'Sydney, Australia / Available Worldwide',
    availability TEXT DEFAULT 'Booking Q2 / Q3 Client Engagements',
    experience_summary TEXT DEFAULT '7+ Years Production Experience · 40+ Shipped Products',
    skills_summary TEXT DEFAULT 'Full-Stack Architecture, Distributed Systems, Cloud Native Apps',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_about_content_updated_at
BEFORE UPDATE ON about_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. About Experiences
CREATE TABLE IF NOT EXISTS about_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    period TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_about_experiences_updated_at
BEFORE UPDATE ON about_experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    short_description TEXT,
    full_description TEXT,
    icon TEXT DEFAULT 'Code',
    cover_image TEXT,
    highlight TEXT DEFAULT 'Production Grade',
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT true,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Service Features
CREATE TABLE IF NOT EXISTS service_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 8. Technologies
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Mobile', 'Database', 'Cloud', 'DevOps', 'Tools', 'Other')),
    description TEXT,
    website_url TEXT,
    proficiency TEXT DEFAULT 'Production Expert',
    display_order INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_technologies_updated_at
BEFORE UPDATE ON technologies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Service Technologies (Many-to-Many)
CREATE TABLE IF NOT EXISTS service_technologies (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, technology_id)
);

-- 10. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    short_description TEXT,
    full_description TEXT,
    category TEXT DEFAULT 'Web Application',
    client_type TEXT DEFAULT 'Confidential Enterprise',
    year TEXT DEFAULT '2026',
    scope TEXT DEFAULT 'Architecture, Frontend, Backend & Cloud Infrastructure',
    cover_image TEXT,
    project_url TEXT,
    github_url TEXT,
    challenge TEXT,
    solution TEXT,
    architecture TEXT,
    outcome TEXT,
    metrics JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT true,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Project Images
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0
);

-- 12. Project Technologies (Many-to-Many)
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

-- 13. Process Steps
CREATE TABLE IF NOT EXISTS process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb,
    icon TEXT DEFAULT 'CheckCircle',
    display_order INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_process_steps_updated_at
BEFORE UPDATE ON process_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    company TEXT,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar TEXT,
    project_relationship TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT DEFAULT 'Engineering',
    tags JSONB DEFAULT '[]'::jsonb,
    author TEXT DEFAULT 'Krishna Bhandari',
    published_date TIMESTAMPTZ DEFAULT NOW(),
    reading_time TEXT DEFAULT '5 min read',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 16. Media Assets Metadata
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT,
    file_type TEXT CHECK (file_type IN ('image', 'video', 'doc')) DEFAULT 'image',
    mime_type TEXT,
    size_bytes BIGINT DEFAULT 0,
    dimensions TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('unread', 'read', 'replied', 'archived')) DEFAULT 'unread',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_contact_messages_updated_at
BEFORE UPDATE ON contact_messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 18. Message Replies
CREATE TABLE IF NOT EXISTS message_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    admin_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    reply_text TEXT NOT NULL,
    delivery_status TEXT CHECK (delivery_status IN ('sent', 'failed', 'pending')) DEFAULT 'pending',
    delivery_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Start Project Requests
CREATE TABLE IF NOT EXISTS project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT NOT NULL,
    description TEXT NOT NULL,
    required_features TEXT,
    target_users TEXT,
    preferred_technology TEXT,
    budget TEXT,
    timeline TEXT,
    reference_url TEXT,
    additional_message TEXT,
    internal_notes TEXT DEFAULT '',
    status TEXT CHECK (status IN ('new', 'reviewing', 'contacted', 'in_progress', 'completed', 'rejected', 'archived')) DEFAULT 'new',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_project_requests_updated_at
BEFORE UPDATE ON project_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 20. Project Request Attachments
CREATE TABLE IF NOT EXISTS project_request_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Realtime Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('new_project_request', 'new_contact_message', 'content_update', 'system')) DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_entity_type TEXT,
    related_entity_id TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT UNIQUE NOT NULL,
    seo_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    canonical_url TEXT,
    robots_index BOOLEAN DEFAULT true,
    robots_follow BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_seo_settings_updated_at
BEFORE UPDATE ON seo_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 23. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR PERFORMANCE & RELATIONAL LOOKUPS
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_technologies_slug ON technologies(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created_at ON project_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, read_at);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin/editor
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Website Settings
CREATE POLICY "Public can read website settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage website settings" ON website_settings FOR ALL USING (is_admin());

-- 3. Home Content
CREATE POLICY "Public can read published home content" ON home_content FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Admins can manage home content" ON home_content FOR ALL USING (is_admin());

-- 4. About Content
CREATE POLICY "Public can read published about content" ON about_content FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Admins can manage about content" ON about_content FOR ALL USING (is_admin());

-- 5. About Experiences
CREATE POLICY "Public can read published experiences" ON about_experiences FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage experiences" ON about_experiences FOR ALL USING (is_admin());

-- 6. Services & Features
CREATE POLICY "Public can read published services" ON services FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (is_admin());
CREATE POLICY "Public can read service features" ON service_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage service features" ON service_features FOR ALL USING (is_admin());

-- 7. Technologies & Service Technologies
CREATE POLICY "Public can read published technologies" ON technologies FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage technologies" ON technologies FOR ALL USING (is_admin());
CREATE POLICY "Public can read service technologies" ON service_technologies FOR SELECT USING (true);
CREATE POLICY "Admins can manage service technologies" ON service_technologies FOR ALL USING (is_admin());

-- 8. Projects & Images & Project Technologies
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (is_admin());
CREATE POLICY "Public can read project images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images" ON project_images FOR ALL USING (is_admin());
CREATE POLICY "Public can read project technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Admins can manage project technologies" ON project_technologies FOR ALL USING (is_admin());

-- 9. Process Steps
CREATE POLICY "Public can read published process steps" ON process_steps FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage process steps" ON process_steps FOR ALL USING (is_admin());

-- 10. Testimonials
CREATE POLICY "Public can read published testimonials" ON testimonials FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_admin());

-- 11. Blog Posts
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (is_admin());

-- 12. Media Library
CREATE POLICY "Public can read media metadata" ON media FOR SELECT USING (true);
CREATE POLICY "Admins can insert/update/delete media" ON media FOR ALL USING (is_admin());

-- 13. Contact Messages
CREATE POLICY "Public can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read contact messages" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Only admins can update/delete contact messages" ON contact_messages FOR ALL USING (is_admin());

-- 14. Message Replies
CREATE POLICY "Only admins can read and write message replies" ON message_replies FOR ALL USING (is_admin());

-- 15. Project Requests
CREATE POLICY "Public can submit project requests" ON project_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read project requests" ON project_requests FOR SELECT USING (is_admin());
CREATE POLICY "Only admins can update/delete project requests" ON project_requests FOR ALL USING (is_admin());

-- 16. Project Request Attachments
CREATE POLICY "Public can attach files to their request" ON project_request_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read and manage attachments" ON project_request_attachments FOR ALL USING (is_admin());

-- 17. Notifications
CREATE POLICY "Admins can read and update their notifications" ON notifications FOR ALL USING (is_admin());

-- 18. SEO Settings
CREATE POLICY "Public can read SEO settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage SEO settings" ON seo_settings FOR ALL USING (is_admin());

-- 19. Audit Logs
CREATE POLICY "Only admins can read audit logs" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System and admins can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (is_admin() OR auth.uid() IS NULL);

-- ========================================================
-- REALTIME PUBLICATION
-- ========================================================
-- Enable Supabase Realtime for instant synchronization
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE project_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER TABLE contact_messages REPLICA IDENTITY FULL;
ALTER TABLE project_requests REPLICA IDENTITY FULL;
