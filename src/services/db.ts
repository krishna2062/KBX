/**
 * Production Database Service Layer
 * Supports direct Supabase Client queries in production & API proxy in server runtime.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PublicInquiryPayload, PublicMessagePayload } from './api';

export async function fetchLiveContentFromDatabase() {
  if (isSupabaseConfigured && supabase) {
    try {
      // Query published content concurrently from Supabase
      const [
        settingsRes,
        homeRes,
        aboutRes,
        servicesRes,
        projectsRes,
        techRes,
        processRes,
        testimonialsRes,
        blogRes,
        seoRes
      ] = await Promise.all([
        supabase.from('website_settings').select('*').limit(1).maybeSingle(),
        supabase.from('home_content').select('*').limit(1).maybeSingle(),
        supabase.from('about_content').select('*').limit(1).maybeSingle(),
        supabase.from('services').select('*').eq('status', 'published').order('display_order', { ascending: true }),
        supabase.from('projects').select('*').eq('status', 'published').order('display_order', { ascending: true }),
        supabase.from('technologies').select('*').eq('status', 'published').order('display_order', { ascending: true }),
        supabase.from('process_steps').select('*').eq('status', 'published').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').eq('status', 'published').order('display_order', { ascending: true }),
        supabase.from('blog_posts').select('*').eq('status', 'published').order('published_date', { ascending: false }),
        supabase.from('seo_settings').select('*')
      ]);

      const brand = settingsRes.data ? {
        brandName: settingsRes.data.brand_name,
        ownerName: settingsRes.data.owner_name,
        ownerTitle: settingsRes.data.owner_title,
        logoText: settingsRes.data.brand_name,
        logoBadgeLetter: settingsRes.data.brand_name?.charAt(0) || 'K',
        ownerImage: settingsRes.data.owner_image || '/src/assets/images/krishna_studio_portrait_1790694647980.jpg',
        email: settingsRes.data.email,
        phone: settingsRes.data.phone || '',
        location: settingsRes.data.location || 'Sydney / Remote',
        timezone: 'UTC+10:00',
        github: settingsRes.data.github_url || 'https://github.com',
        linkedin: settingsRes.data.linkedin_url || 'https://linkedin.com',
        twitter: (settingsRes.data.other_social_links as any)?.x || 'https://x.com',
        availabilityStatus: settingsRes.data.availability_status
      } : null;

      const hero = homeRes.data ? {
        eyebrow: homeRes.data.hero_eyebrow || 'Independent Software Development',
        titlePrefix: homeRes.data.hero_title || 'Designing & Building',
        titleHighlight1: homeRes.data.hero_title_highlight || 'Modern Digital Products',
        titleMiddle: '',
        titleHighlight2: '',
        description: homeRes.data.hero_description || '',
        primaryCtaText: homeRes.data.primary_cta_text || 'Start a Project',
        primaryCtaLink: homeRes.data.primary_cta_url || 'start',
        secondaryCtaText: homeRes.data.secondary_cta_text || 'Explore Work',
        secondaryCtaLink: homeRes.data.secondary_cta_url || 'projects',
        statusBadgeText: 'Available for Q2/Q3 Projects',
        statusBadgeActive: true
      } : null;

      const mappedServices = (servicesRes.data || []).map((s: any) => ({
        id: s.id,
        number: s.number || '01',
        title: s.name,
        slug: s.slug,
        tagline: s.tagline || '',
        description: s.short_description || s.full_description || '',
        deliverables: [],
        technologies: [],
        highlight: s.highlight || 'Featured',
        status: s.status,
        featured: s.featured,
        order: s.display_order
      }));

      const mappedProjects = (projectsRes.data || []).map((p: any) => ({
        id: p.id,
        number: p.number || '01',
        name: p.title,
        slug: p.slug,
        tagline: p.tagline || '',
        category: p.category || 'Web Application',
        client: p.client_type || 'Confidential Client',
        year: p.year || '2026',
        scope: p.scope || 'Full-Stack Architecture & Build',
        description: p.short_description || p.full_description || '',
        coverImage: p.cover_image || '/src/assets/images/project_nexatalk_1790694609831.png',
        galleryImages: [p.cover_image || '/src/assets/images/project_nexatalk_1790694609831.png'],
        projectUrl: p.project_url || '',
        githubUrl: p.github_url || '',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        metrics: p.metrics || [],
        caseStudy: {
          challenge: p.challenge || '',
          architecture: p.architecture || p.solution || '',
          result: p.outcome || ''
        },
        featured: p.featured,
        status: p.status,
        order: p.display_order
      }));

      const mappedTech = (techRes.data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description || '',
        active: t.status === 'published',
        order: t.display_order
      }));

      const mappedProcess = (processRes.data || []).map((step: any) => ({
        id: step.id,
        number: step.number,
        title: step.title,
        description: step.description,
        deliverables: step.deliverables || [],
        active: step.status === 'published',
        order: step.display_order
      }));

      const mappedTestimonials = (testimonialsRes.data || []).map((t: any) => ({
        id: t.id,
        clientName: t.client_name,
        company: t.company || '',
        role: t.role || '',
        content: t.content,
        rating: t.rating || 5,
        avatar: t.avatar || '',
        projectRelation: t.project_relationship || '',
        status: t.status,
        order: t.display_order
      }));

      return {
        success: true,
        brand,
        hero,
        services: mappedServices,
        projects: mappedProjects,
        technologies: mappedTech,
        process: mappedProcess,
        testimonials: mappedTestimonials,
        blog: blogRes.data || []
      };
    } catch (err) {
      console.warn('Direct Supabase fetch encountered error, fallback to API:', err);
    }
  }

  // Fallback to Express backend or local endpoint
  try {
    const res = await fetch('/api/public-content');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetch failed, falling back to bundled defaults:', err);
    return null;
  }
}

/**
 * Submit Contact Message
 */
export async function submitContactMessageToDb(payload: PublicMessagePayload) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contact_messages').insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      subject: payload.subject || 'General Inquiry',
      message: payload.message,
      status: 'unread'
    }).select().single();

    if (error) {
      throw new Error(error.message || 'Failed to submit contact message to Supabase');
    }
    return { success: true, message: data };
  }

  // Fallback to /api/messages
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || errorJson.message || 'Failed to submit message');
  }
  return res.json();
}

/**
 * Submit Project Inquiry Brief
 */
export async function submitProjectInquiryToDb(payload: PublicInquiryPayload) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('project_requests').insert({
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone || null,
      company: payload.company || null,
      project_type: payload.projectType,
      description: payload.description,
      target_users: payload.targetUsers || null,
      preferred_technology: payload.preferredTech || null,
      budget: payload.budgetRange,
      timeline: payload.timeline,
      reference_url: payload.referenceUrl || null,
      additional_message: payload.additionalMessage || null,
      status: 'new'
    }).select().single();

    if (error) {
      throw new Error(error.message || 'Failed to submit project inquiry to Supabase');
    }
    return { success: true, inquiry: data };
  }

  // Fallback to /api/inquiries
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || errorJson.message || 'Failed to submit inquiry');
  }
  return res.json();
}
