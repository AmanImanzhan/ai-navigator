export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string | null
          created_at: string
          details: Json
          entity_id: string
          id: number
          locale: Database["public"]["Enums"]["app_locale"] | null
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json
          entity_id: string
          id?: never
          locale?: Database["public"]["Enums"]["app_locale"] | null
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string
          id?: never
          locale?: Database["public"]["Enums"]["app_locale"] | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage: {
        Row: {
          count: number
          day: string
          user_id: string
        }
        Insert: {
          count?: number
          day?: string
          user_id: string
        }
        Update: {
          count?: number
          day?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_reservations: {
        Row: {
          created_at: string
          day: string
          id: string
          refunded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          refunded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          refunded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lesson_notes: {
        Row: {
          lesson_id: string
          locale: Database["public"]["Enums"]["app_locale"]
          text: string
        }
        Insert: {
          lesson_id: string
          locale: Database["public"]["Enums"]["app_locale"]
          text: string
        }
        Update: {
          lesson_id?: string
          locale?: Database["public"]["Enums"]["app_locale"]
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_translations: {
        Row: {
          content: Json | null
          lesson_id: string
          locale: Database["public"]["Enums"]["app_locale"]
          title: string
        }
        Insert: {
          content?: Json | null
          lesson_id: string
          locale: Database["public"]["Enums"]["app_locale"]
          title: string
        }
        Update: {
          content?: Json | null
          lesson_id?: string
          locale?: Database["public"]["Enums"]["app_locale"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          id: string
          level: number
          minutes: number
          published: boolean
          sort: number
          track_id: string
        }
        Insert: {
          id: string
          level: number
          minutes: number
          published?: boolean
          sort: number
          track_id: string
        }
        Update: {
          id?: string
          level?: number
          minutes?: number
          published?: boolean
          sort?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          language: Database["public"]["Enums"]["app_locale"]
          minutes_per_day: number
          occupation: string | null
          onboarding_completed_at: string | null
          reminder_enabled: boolean
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          language?: Database["public"]["Enums"]["app_locale"]
          minutes_per_day?: number
          occupation?: string | null
          onboarding_completed_at?: string | null
          reminder_enabled?: boolean
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          language?: Database["public"]["Enums"]["app_locale"]
          minutes_per_day?: number
          occupation?: string | null
          onboarding_completed_at?: string | null
          reminder_enabled?: boolean
        }
        Relationships: []
      }
      revenuecat_events: {
        Row: {
          id: string
          processed_at: string
          type: string
        }
        Insert: {
          id: string
          processed_at?: string
          type: string
        }
        Update: {
          id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
      saved_prompts: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          template_id: string | null
          text: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          template_id?: string | null
          text: string
          title?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          template_id?: string | null
          text?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_prompts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          environment: string | null
          expires_at: string | null
          last_event_at: string | null
          product_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          environment?: string | null
          expires_at?: string | null
          last_event_at?: string | null
          product_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          environment?: string | null
          expires_at?: string | null
          last_event_at?: string | null
          product_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_translations: {
        Row: {
          example: string
          locale: Database["public"]["Enums"]["app_locale"]
          prompt: string
          purpose: string
          template_id: string
          title: string
          tools: Json
        }
        Insert: {
          example: string
          locale: Database["public"]["Enums"]["app_locale"]
          prompt: string
          purpose: string
          template_id: string
          title: string
          tools?: Json
        }
        Update: {
          example?: string
          locale?: Database["public"]["Enums"]["app_locale"]
          prompt?: string
          purpose?: string
          template_id?: string
          title?: string
          tools?: Json
        }
        Relationships: [
          {
            foreignKeyName: "template_translations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          id: string
          lesson_id: string
          published: boolean
          sort: number
        }
        Insert: {
          id: string
          lesson_id: string
          published?: boolean
          sort: number
        }
        Update: {
          id?: string
          lesson_id?: string
          published?: boolean
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "templates_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      track_translations: {
        Row: {
          locale: Database["public"]["Enums"]["app_locale"]
          title: string
          track_id: string
        }
        Insert: {
          locale: Database["public"]["Enums"]["app_locale"]
          title: string
          track_id: string
        }
        Update: {
          locale?: Database["public"]["Enums"]["app_locale"]
          title?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_translations_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          id: string
          premium: boolean
          sort: number
        }
        Insert: {
          id: string
          premium?: boolean
          sort: number
        }
        Update: {
          id?: string
          premium?: boolean
          sort?: number
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          lesson_id: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_stats: {
        Args: never
        Returns: {
          ai_requests_7d: number
          ai_requests_today: number
          ai_users_today: number
          users: number
        }[]
      }
      ai_usage_status: {
        Args: { p_free_limit: number; p_premium_limit: number }
        Returns: {
          daily_limit: number
          premium: boolean
          remaining: number
          reset_at: string
          used: number
        }[]
      }
      apply_subscription_event: {
        Args: {
          p_environment: string
          p_event_at: string
          p_event_id: string
          p_event_type: string
          p_expires_at: string
          p_product_id: string
          p_status: Database["public"]["Enums"]["subscription_status"]
          p_user: string
        }
        Returns: string
      }
      apply_subscription_transfer: {
        Args: {
          p_event_at: string
          p_event_id: string
          p_from: string[]
          p_to?: string
        }
        Returns: string
      }
      consume_ai_request: {
        Args: { p_free_limit: number; p_premium_limit: number }
        Returns: {
          allowed: boolean
          daily_limit: number
          premium: boolean
          remaining: number
          reservation_id: string
          reset_at: string
          used: number
        }[]
      }
      has_premium: { Args: { p_user: string }; Returns: boolean }
      refund_ai_request: { Args: { p_reservation: string }; Returns: boolean }
      reset_my_data: { Args: never; Returns: undefined }
    }
    Enums: {
      app_locale: "en" | "ru" | "es"
      org_role: "owner" | "admin" | "member"
      subscription_status:
        | "active"
        | "trialing"
        | "grace_period"
        | "expired"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_locale: ["en", "ru", "es"],
      org_role: ["owner", "admin", "member"],
      subscription_status: [
        "active",
        "trialing",
        "grace_period",
        "expired",
        "cancelled",
      ],
    },
  },
} as const
