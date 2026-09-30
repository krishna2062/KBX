# KBX — Krishna Bhandari · Production Website & CMS

Production-grade, personal brand web application and Content Management System engineered for **Krishna Bhandari — Independent Software Developer & Digital Product Builder**.

Targeted for deployment across **GitHub + Vercel + Supabase + Resend**.

---

## 1. Project Overview

- **Public Customer-Facing Site**:
  - Home, About, Services, Projects, Case Studies (`/projects/:slug`), Process, Contact, and Start a Project Brief (`/start-project`).
  - Zero visible admin links, badges, or dashboard triggers on public routes.
  - Interactive 3D network geometry, fluid typography, dark green-black aesthetic with emerald accents.
  - Dynamic content powered directly by Supabase PostgreSQL.

- **Admin Control Center** (`/admin`):
  - Strictly protected by Supabase Auth and cryptographic session tokens.
  - Real-time updates for incoming contact messages and project request briefs.
  - In-app email response system that dispatches transactional emails to clients.
  - Full CRUD control over website settings, hero typography, about biography, services, technologies, project case studies, process steps, testimonials, and media library.
  - Role-Based Access Control (RBAC): `super_admin`, `admin`, `editor`.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Lucide React, Framer Motion
- **Backend / Database Platform**: Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage, Supabase Realtime)
- **Deployment Platform**: Vercel (Edge Network + Serverless Functions)
- **Email Service**: Resend (Serverless transactional email API)
- **Local Dev Full-Stack Runtime**: Express 4 with Vite dev middlewares

---

## 3. Local Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/kbx-portfolio.git
cd kbx-portfolio

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` to view the public site.  
Visit `http://localhost:3000/admin` to access the Admin Control Center.

---

## 4. Environment Variables

Create `.env` using `.env.example` as a reference:

```env
# ==========================================
# PUBLIC FRONTEND CONFIGURATION (Vite)
# ==========================================
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
VITE_APP_URL="https://your-production-domain.com"

# ==========================================
# SERVER-SIDE ONLY CONFIGURATION (Vercel Functions)
# NEVER PREFIX WITH VITE_ · NEVER EXPOSE TO CLIENT
# ==========================================
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
RESEND_API_KEY="re_123456789"
EMAIL_FROM="Krishna Bhandari — KBX <contact@kbx.dev>"
ADMIN_EMAIL="krishnabhandari2062@gmail.com"
```

---

## 5. Supabase Setup

### Step 1: Create Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New Project** and configure your organization and database password.
3. Note your **Project URL** and **anon public API key** from **Project Settings > API**.

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Copy the entire contents of `supabase/migrations/20260930000000_kbx_schema.sql`.
3. Click **Run**. This provisions all 23 tables, foreign keys, triggers for `updated_at`, and Row Level Security (RLS) policies.
4. (Optional) Run `supabase/seed.sql` to populate initial baseline profile and settings records.

---

## 6. Authentication Setup

1. In Supabase Dashboard, navigate to **Authentication > Providers > Email**.
2. Ensure **Email provider** is **Enabled**.
3. Under **Authentication > Users**, click **Add user** -> **Create user**:
   - Email: `krishna@kbx.dev` (or your preferred admin email)
   - Password: Choose a strong password.
   - Auto-confirm User: **Checked**.
4. In the SQL Editor, assign the `super_admin` role to this user in `profiles`:
   ```sql
   INSERT INTO profiles (id, email, name, role, title)
   SELECT id, email, 'Krishna Bhandari', 'super_admin', 'Founder & Software Developer'
   FROM auth.users
   WHERE email = 'krishna@kbx.dev'
   ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
   ```

---

## 7. Storage Setup

1. In Supabase Dashboard, go to **Storage > New Bucket**:
   - Create bucket: `public-media` (Public: **Yes**) for logos, project covers, and gallery photos.
   - Create bucket: `attachments` (Public: **No**) for client project brief attachments.
2. In the SQL Editor, execute storage policies:
   ```sql
   -- Allow public read of public-media
   CREATE POLICY "Public media access" ON storage.objects
   FOR SELECT USING (bucket_id = 'public-media');

   -- Allow admin upload/delete
   CREATE POLICY "Admin storage upload" ON storage.objects
   FOR ALL USING (auth.role() = 'authenticated');
   ```

---

## 8. Realtime Setup

The migration script automatically creates the `supabase_realtime` publication for:
- `contact_messages`
- `project_requests`
- `notifications`

To verify:
1. Go to **Database > Publications > supabase_realtime**.
2. Confirm `contact_messages` and `project_requests` are enabled for replication.

---

## 9. Transactional Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com).
2. Generate an API Key in **API Keys**.
3. Add your verified domain (or use `onboarding@resend.dev` for testing).
4. Set `RESEND_API_KEY` and `EMAIL_FROM` in your Vercel Environment Variables.
5. In-app replies sent from `/admin/messages` will dispatch via Resend and log delivery status (*Sent*, *Pending*, *Failed*).

---

## 10. Vercel Deployment

1. Push your repository to **GitHub**.
2. Log in to [vercel.com](https://vercel.com) and click **Add New > Project**.
3. Select your GitHub repository.
4. Under **Build & Development Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `ADMIN_EMAIL`
6. Click **Deploy**.

Vercel will build the frontend into `dist/` and mount `/api/send-reply` as a serverless function. SPA rewrites and security headers are handled automatically via `vercel.json`.

---

## 11. Custom Domain Setup

1. In Vercel Project Settings, navigate to **Domains**.
2. Enter your custom domain (e.g. `kbx.dev` or `krishnabhandari.com`).
3. Add the provided DNS CNAME / A records at your domain registrar.
4. Once verified, update `VITE_APP_URL` in Vercel to your custom domain.

---

## 12. Production Verification Checklist

- [x] **SPA Routing**: Directly opening `/about`, `/projects/:slug`, `/start-project`, or `/admin/dashboard` never produces 404.
- [x] **Zero Admin Exposure**: No admin links, badges, or buttons exist on the public website.
- [x] **Auth Gate**: `/admin` without credentials renders the Admin Login. `/admin/dashboard` redirects to `/admin` when unauthenticated.
- [x] **Database Isolation**: Row Level Security (RLS) protects private messages, project briefs, audit logs, and internal notes.
- [x] **Real-Time Updates**: Visitor submissions on `/contact` or `/start-project` increment the admin counters in real-time.
- [x] **In-App Email Reply**: Admin can reply directly to contact messages with delivery tracking (*Sent*, *Pending*, *Failed*).
- [x] **Dynamic CMS**: Editing home hero typography, adding a project, or changing owner title reflects on the public site immediately without recompiling.
- [x] **Clean Builds**: `npm run build` and `npm run lint` compile with 0 errors.

---

## 13. Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the full-stack development server with Vite middleware on port 3000 |
| `npm run build` | Compiles production assets into `dist/` using Vite |
| `npm run preview` | Localy previews the production build in `dist/` |
| `npm run lint` | Runs TypeScript compilation verification (`tsc --noEmit`) |
