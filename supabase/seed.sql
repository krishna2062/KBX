-- ========================================================
-- KBX — KRISHNA BHANDARI SEED DATA
-- Production-Ready Initial Configuration and Data
-- ========================================================

-- Insert Website Settings
INSERT INTO website_settings (
    brand_name,
    owner_name,
    owner_title,
    logo,
    favicon,
    owner_image,
    email,
    phone,
    location,
    github_url,
    linkedin_url,
    other_social_links,
    copyright_text,
    availability_status
) VALUES (
    'KBX',
    'Krishna Bhandari',
    'Independent Software Developer & Digital Product Builder',
    '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
    '/favicon.ico',
    '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
    'contact@kbx.dev',
    '+61 (0) 400 000 000',
    'Sydney, Australia / Available Worldwide',
    'https://github.com/krishnabhandari',
    'https://linkedin.com/in/krishnabhandari',
    '{"x": "https://x.com/kbxdev"}'::jsonb,
    '© 2026 Krishna Bhandari · KBX Studio. Engineered with performance discipline.',
    'Accepting Selected Q2/Q3 2026 Engagements'
) ON CONFLICT DO NOTHING;

-- Insert Home Content
INSERT INTO home_content (
    hero_eyebrow,
    hero_title,
    hero_title_highlight,
    hero_description,
    primary_cta_text,
    primary_cta_url,
    secondary_cta_text,
    secondary_cta_url,
    hero_visual_type,
    about_section_title,
    about_section_description,
    services_section_title,
    projects_section_title,
    process_section_title,
    final_cta_title,
    final_cta_description,
    published
) VALUES (
    'INDEPENDENT SOFTWARE DEVELOPER',
    'Designing & Building',
    'Modern Digital Products',
    'Specialized in high-performance web applications, SaaS platforms, mobile apps, and robust custom software engineered for ambitious brands and fast-moving teams.',
    'Start a Project',
    '/start-project',
    'Explore Selected Work',
    '/projects',
    '3d',
    'Engineering Philosophy',
    'Direct collaboration without agency overhead or unnecessary meetings.',
    'Capabilities & Solutions',
    'Selected Architecture & Builds',
    'Disciplined Delivery Framework',
    'Have a project in mind?',
    'Let us engineer your vision into a high-performance digital product.',
    true
) ON CONFLICT DO NOTHING;

-- Insert About Content
INSERT INTO about_content (
    title,
    subtitle,
    biography,
    short_bio,
    philosophy,
    profile_image,
    location,
    availability,
    experience_summary,
    skills_summary,
    published
) VALUES (
    'Krishna Bhandari — Software Developer & Digital Product Builder',
    'Crafting high-scale web platforms, responsive mobile apps, and resilient backend systems.',
    'With more than seven years of dedicated full-stack engineering experience, I partner directly with founders, enterprise product leaders, and innovators to architect, build, and deploy production software. No middlemen, no bloated agency retainers—just senior technical execution and disciplined craftsmanship.',
    'Krishna Bhandari is an independent software developer delivering scalable web applications, mobile software, and custom business platforms.',
    'I believe that software longevity depends on architectural clarity, zero superfluous abstractions, and relentless attention to real-world performance metrics.',
    '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
    'Sydney, Australia / Available Worldwide',
    'Available for Q2 / Q3 Client Engagements',
    '7+ Years Engineering · 40+ Delivered Solutions',
    'React, TypeScript, Node.js, PostgreSQL, Cloud Infrastructure',
    true
) ON CONFLICT DO NOTHING;

-- Insert Process Steps
INSERT INTO process_steps (number, title, description, deliverables, display_order, status) VALUES
('01', 'Discover', 'Deep-dive technical workshop to define system requirements, constraints, and business goals.', '["Architecture Blueprint", "Technical Feasibility Matrix", "Scope & Milestone Schedule"]'::jsonb, 1, 'published'),
('02', 'Plan', 'Data modeling, schema design, API contract specifications, and risk mitigation strategies.', '["Database Entity Schemas", "System Flow Diagram", "Sprint Roadmap"]'::jsonb, 2, 'published'),
('03', 'Design', 'Interactive user experience prototypes, typographic hierarchy, and precision design systems.', '["High-Fidelity Mockups", "Component Design Tokens", "Interactive Prototypes"]'::jsonb, 3, 'published'),
('04', 'Build', 'Clean, typed, testable code engineered using modern stacks and scalable patterns.', '["Full-Stack Implementation", "Unit & Integration Tests", "Continuous Deployment Pipeline"]'::jsonb, 4, 'published'),
('05', 'Test', 'Automated regression verification, load benchmarks, security audits, and cross-device testing.', '["Performance Audit (>95 Lighthouse)", "Security Vulnerability Scan", "Cross-Platform QA Report"]'::jsonb, 5, 'published'),
('06', 'Deploy', 'Zero-downtime automated release to production cloud infrastructure with health monitoring.', '["Cloud Infrastructure Provisioning", "Domain & SSL Setup", "Production Launch Checklist"]'::jsonb, 6, 'published'),
('07', 'Support', 'Ongoing performance tuning, telemetry observability, and feature enhancements.', '["System Observability Dashboard", "SLA Incident Response", "Iterative Feature Updates"]'::jsonb, 7, 'published')
ON CONFLICT DO NOTHING;
