/**
 * Typed Database Interfaces for Supabase PostgreSQL Schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          title: string | null;
          role: 'super_admin' | 'admin' | 'editor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          title?: string | null;
          role?: 'super_admin' | 'admin' | 'editor';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      website_settings: {
        Row: {
          id: string;
          brand_name: string;
          owner_name: string;
          owner_title: string;
          logo: string | null;
          favicon: string | null;
          owner_image: string | null;
          email: string;
          phone: string | null;
          location: string;
          github_url: string | null;
          linkedin_url: string | null;
          other_social_links: Json;
          copyright_text: string;
          availability_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_name?: string;
          owner_name?: string;
          owner_title?: string;
          logo?: string | null;
          favicon?: string | null;
          owner_image?: string | null;
          email?: string;
          phone?: string | null;
          location?: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          other_social_links?: Json;
          copyright_text?: string;
          availability_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['website_settings']['Insert']>;
      };
      home_content: {
        Row: {
          id: string;
          hero_eyebrow: string | null;
          hero_title: string | null;
          hero_title_highlight: string | null;
          hero_description: string | null;
          primary_cta_text: string | null;
          primary_cta_url: string | null;
          secondary_cta_text: string | null;
          secondary_cta_url: string | null;
          hero_visual_type: '3d' | 'image' | 'video';
          hero_image: string | null;
          hero_video: string | null;
          hero_3d_config: Json;
          about_section_title: string | null;
          about_section_description: string | null;
          services_section_title: string | null;
          projects_section_title: string | null;
          process_section_title: string | null;
          final_cta_title: string | null;
          final_cta_description: string | null;
          section_toggles: Json;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['home_content']['Row']>;
        Update: Partial<Database['public']['Tables']['home_content']['Row']>;
      };
      about_content: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          biography: string | null;
          short_bio: string | null;
          philosophy: string | null;
          profile_image: string | null;
          location: string | null;
          availability: string | null;
          experience_summary: string | null;
          skills_summary: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['about_content']['Row']>;
        Update: Partial<Database['public']['Tables']['about_content']['Row']>;
      };
      about_experiences: {
        Row: {
          id: string;
          title: string;
          organization: string;
          period: string | null;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          display_order: number;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['about_experiences']['Row']>;
        Update: Partial<Database['public']['Tables']['about_experiences']['Row']>;
      };
      services: {
        Row: {
          id: string;
          number: string | null;
          name: string;
          slug: string;
          tagline: string | null;
          short_description: string | null;
          full_description: string | null;
          icon: string | null;
          cover_image: string | null;
          highlight: string | null;
          display_order: number;
          featured: boolean;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['services']['Row']>;
        Update: Partial<Database['public']['Tables']['services']['Row']>;
      };
      service_features: {
        Row: {
          id: string;
          service_id: string;
          feature: string;
          display_order: number;
        };
        Insert: Partial<Database['public']['Tables']['service_features']['Row']>;
        Update: Partial<Database['public']['Tables']['service_features']['Row']>;
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo: string | null;
          category: string;
          description: string | null;
          website_url: string | null;
          proficiency: string | null;
          display_order: number;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['technologies']['Row']>;
        Update: Partial<Database['public']['Tables']['technologies']['Row']>;
      };
      projects: {
        Row: {
          id: string;
          number: string | null;
          title: string;
          slug: string;
          tagline: string | null;
          short_description: string | null;
          full_description: string | null;
          category: string | null;
          client_type: string | null;
          year: string | null;
          scope: string | null;
          cover_image: string | null;
          project_url: string | null;
          github_url: string | null;
          challenge: string | null;
          solution: string | null;
          architecture: string | null;
          outcome: string | null;
          metrics: Json;
          featured: boolean;
          status: 'draft' | 'published' | 'archived';
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['projects']['Row']>;
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
      };
      process_steps: {
        Row: {
          id: string;
          number: string;
          title: string;
          description: string | null;
          deliverables: Json;
          icon: string | null;
          display_order: number;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['process_steps']['Row']>;
        Update: Partial<Database['public']['Tables']['process_steps']['Row']>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          company: string | null;
          role: string | null;
          content: string;
          rating: number;
          avatar: string | null;
          project_relationship: string | null;
          display_order: number;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['testimonials']['Row']>;
        Update: Partial<Database['public']['Tables']['testimonials']['Row']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          category: string;
          tags: Json;
          author: string;
          published_date: string;
          reading_time: string;
          status: 'draft' | 'published' | 'archived';
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      media: {
        Row: {
          id: string;
          filename: string;
          url: string;
          storage_path: string | null;
          file_type: 'image' | 'video' | 'doc';
          mime_type: string | null;
          size_bytes: number;
          dimensions: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['media']['Row']>;
        Update: Partial<Database['public']['Tables']['media']['Row']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          status: 'unread' | 'read' | 'replied' | 'archived';
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          status?: 'unread' | 'read' | 'replied' | 'archived';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
      message_replies: {
        Row: {
          id: string;
          message_id: string;
          admin_id: string | null;
          admin_name: string;
          subject: string;
          reply_text: string;
          delivery_status: 'sent' | 'failed' | 'pending';
          delivery_error: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['message_replies']['Row']>;
        Update: Partial<Database['public']['Tables']['message_replies']['Row']>;
      };
      project_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          company: string | null;
          project_type: string;
          description: string;
          required_features: string | null;
          target_users: string | null;
          preferred_technology: string | null;
          budget: string | null;
          timeline: string | null;
          reference_url: string | null;
          additional_message: string | null;
          internal_notes: string | null;
          status: 'new' | 'reviewing' | 'contacted' | 'in_progress' | 'completed' | 'rejected' | 'archived';
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          project_type: string;
          description: string;
          required_features?: string | null;
          target_users?: string | null;
          preferred_technology?: string | null;
          budget?: string | null;
          timeline?: string | null;
          reference_url?: string | null;
          additional_message?: string | null;
          internal_notes?: string | null;
          status?: 'new' | 'reviewing' | 'contacted' | 'in_progress' | 'completed' | 'rejected' | 'archived';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['project_requests']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string | null;
          type: 'new_project_request' | 'new_contact_message' | 'content_update' | 'system';
          title: string;
          message: string;
          related_entity_type: string | null;
          related_entity_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      seo_settings: {
        Row: {
          id: string;
          page: string;
          seo_title: string | null;
          meta_description: string | null;
          keywords: string | null;
          og_title: string | null;
          og_description: string | null;
          og_image: string | null;
          canonical_url: string | null;
          robots_index: boolean;
          robots_follow: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['seo_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['seo_settings']['Row']>;
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          actor_name: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          description: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_logs']['Row']>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>;
      };
    };
  };
}
