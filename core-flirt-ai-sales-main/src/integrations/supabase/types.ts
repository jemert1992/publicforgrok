export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          content_type: string
          content_url: string
          created_at: string
          description: string | null
          id: string
          keywords: string[] | null
          model_id: string
          price: number | null
          title: string
        }
        Insert: {
          content_type: string
          content_url: string
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          model_id: string
          price?: number | null
          title: string
        }
        Update: {
          content_type?: string
          content_url?: string
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          model_id?: string
          price?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_interaction: string | null
          messages: Json[]
          model_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_interaction?: string | null
          messages?: Json[]
          model_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_interaction?: string | null
          messages?: Json[]
          model_id?: string
          subscriber_id?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          bio: Json
          created_at: string
          id: string
          name: string
          no_go_topics: string[] | null
          preferences: Json
          services: Json
          updated_at: string
        }
        Insert: {
          bio?: Json
          created_at?: string
          id?: string
          name: string
          no_go_topics?: string[] | null
          preferences?: Json
          services?: Json
          updated_at?: string
        }
        Update: {
          bio?: Json
          created_at?: string
          id?: string
          name?: string
          no_go_topics?: string[] | null
          preferences?: Json
          services?: Json
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          do_not_message: boolean | null
          external_id: string
          id: string
          last_purchase: string | null
          name: string | null
          tier: string | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          do_not_message?: boolean | null
          external_id: string
          id?: string
          last_purchase?: string | null
          name?: string | null
          tier?: string | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          do_not_message?: boolean | null
          external_id?: string
          id?: string
          last_purchase?: string | null
          name?: string | null
          tier?: string | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          content_id: string | null
          created_at: string
          external_transaction_id: string | null
          id: string
          model_id: string
          subscriber_id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          content_id?: string | null
          created_at?: string
          external_transaction_id?: string | null
          id?: string
          model_id: string
          subscriber_id: string
          transaction_type: string
        }
        Update: {
          amount?: number
          content_id?: string | null
          created_at?: string
          external_transaction_id?: string | null
          id?: string
          model_id?: string
          subscriber_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
