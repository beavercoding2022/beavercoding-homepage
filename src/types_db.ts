export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          slug: string;
          thumbnail_url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: never;
          name: string;
          slug: string;
          thumbnail_url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: never;
          name?: string;
          slug?: string;
          thumbnail_url?: string | null;
        };
        Relationships: [];
      };
      category_relations: {
        Row: {
          child_category_id: number;
          parent_category_id: number;
        };
        Insert: {
          child_category_id: number;
          parent_category_id: number;
        };
        Update: {
          child_category_id?: number;
          parent_category_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'category_relations_child_category_id_fkey';
            columns: ['child_category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'category_relations_parent_category_id_fkey';
            columns: ['parent_category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          payment_service_customer_id: string | null;
        };
        Insert: {
          id: string;
          payment_service_customer_id?: string | null;
        };
        Update: {
          id?: string;
          payment_service_customer_id?: string | null;
        };
        Relationships: [];
      };
      post_categories: {
        Row: {
          category_id: number;
          post_id: number;
        };
        Insert: {
          category_id: number;
          post_id: number;
        };
        Update: {
          category_id?: number;
          post_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_categories_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_comments: {
        Row: {
          content: string;
          external_reference_url: string | null;
          id: number;
          is_deleted: boolean | null;
          parent_comment_id: number | null;
          post_id: number | null;
          user_id: string;
        };
        Insert: {
          content: string;
          external_reference_url?: string | null;
          id?: never;
          is_deleted?: boolean | null;
          parent_comment_id?: number | null;
          post_id?: number | null;
          user_id: string;
        };
        Update: {
          content?: string;
          external_reference_url?: string | null;
          id?: never;
          is_deleted?: boolean | null;
          parent_comment_id?: number | null;
          post_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_comments_parent_comment_id_fkey';
            columns: ['parent_comment_id'];
            isOneToOne: false;
            referencedRelation: 'post_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      post_linked_list: {
        Row: {
          next_post_id: number;
          prev_post_id: number;
        };
        Insert: {
          next_post_id: number;
          prev_post_id: number;
        };
        Update: {
          next_post_id?: number;
          prev_post_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_linked_list_next_post_id_fkey';
            columns: ['next_post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_linked_list_prev_post_id_fkey';
            columns: ['prev_post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_section_categories: {
        Row: {
          category_id: number;
          post_section_id: number;
        };
        Insert: {
          category_id: number;
          post_section_id: number;
        };
        Update: {
          category_id?: number;
          post_section_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_section_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_section_categories_post_section_id_fkey';
            columns: ['post_section_id'];
            isOneToOne: false;
            referencedRelation: 'post_sections';
            referencedColumns: ['id'];
          },
        ];
      };
      post_section_references: {
        Row: {
          destination_post_section_id: number;
          source_post_section_id: number;
        };
        Insert: {
          destination_post_section_id: number;
          source_post_section_id: number;
        };
        Update: {
          destination_post_section_id?: number;
          source_post_section_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_section_references_destination_post_section_id_fkey';
            columns: ['destination_post_section_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_section_references_source_post_section_id_fkey';
            columns: ['source_post_section_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_section_tags: {
        Row: {
          post_section_id: number;
          tag_id: number;
        };
        Insert: {
          post_section_id: number;
          tag_id: number;
        };
        Update: {
          post_section_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_section_tags_post_section_id_fkey';
            columns: ['post_section_id'];
            isOneToOne: false;
            referencedRelation: 'post_sections';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_section_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      post_sections: {
        Row: {
          content: string;
          external_reference_url: string | null;
          id: number;
          image_paths: string[];
          post_id: number;
          section_order: number;
          user_id: string;
        };
        Insert: {
          content: string;
          external_reference_url?: string | null;
          id?: never;
          image_paths?: string[];
          post_id: number;
          section_order?: number;
          user_id?: string;
        };
        Update: {
          content?: string;
          external_reference_url?: string | null;
          id?: never;
          image_paths?: string[];
          post_id?: number;
          section_order?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_sections_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_sections_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      post_series: {
        Row: {
          created_at: string;
          id: number;
          slug: string;
          thumbnail_url: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          slug: string;
          thumbnail_url?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          slug?: string;
          thumbnail_url?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      post_tags: {
        Row: {
          id: number;
          post_id: number;
          tag_id: number;
        };
        Insert: {
          id?: never;
          post_id: number;
          tag_id: number;
        };
        Update: {
          id?: never;
          post_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_tags_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          category_id: number | null;
          created_at: string;
          id: number;
          image_paths: string[];
          lang: string;
          posting_type: Database['public']['Enums']['posting_type'] | null;
          public: boolean;
          series_id: number | null;
          slug: string;
          team_id: number | null;
          thumbnail_url: string | null;
          title: string;
          user_id: string;
          viewcount: number;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string;
          id?: never;
          image_paths?: string[];
          lang?: string;
          posting_type?: Database['public']['Enums']['posting_type'] | null;
          public: boolean;
          series_id?: number | null;
          slug: string;
          team_id?: number | null;
          thumbnail_url?: string | null;
          title: string;
          user_id?: string;
          viewcount?: number;
        };
        Update: {
          category_id?: number | null;
          created_at?: string;
          id?: never;
          image_paths?: string[];
          lang?: string;
          posting_type?: Database['public']['Enums']['posting_type'] | null;
          public?: boolean;
          series_id?: number | null;
          slug?: string;
          team_id?: number | null;
          thumbnail_url?: string | null;
          title?: string;
          user_id?: string;
          viewcount?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'posts_series_id_fkey';
            columns: ['series_id'];
            isOneToOne: false;
            referencedRelation: 'post_series';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'posts_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'posts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id: string;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_price_id_fkey';
            columns: ['price_id'];
            isOneToOne: false;
            referencedRelation: 'prices';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          id?: never;
          name: string;
          slug: string;
        };
        Update: {
          id?: never;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      user_teams: {
        Row: {
          team_id: number;
          user_id: string;
        };
        Insert: {
          team_id: number;
          user_id: string;
        };
        Update: {
          team_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_teams_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_teams_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          connection_status: Database['public']['Enums']['user_connection_status'];
          full_name: string | null;
          id: string;
          payment_method: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          connection_status?: Database['public']['Enums']['user_connection_status'];
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          connection_status?: Database['public']['Enums']['user_connection_status'];
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      posting_type: 'blog' | 'docs' | 'portfolio';
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
        | 'paused';
      user_connection_status: 'online' | 'offline';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
