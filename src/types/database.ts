export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string; tenant_id: string; description: string; amount: number;
          payment_method: string; expense_date: string;
          created_by: string | null; created_at: string;
        };
        Insert: {
          id?: string; description: string; amount: number;
          payment_method: string; expense_date: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      cash_registers: {
        Row: { id: string; tenant_id: string; created_by: string | null; created_at: string };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      cash_register_periods: {
        Row: {
          id: string; tenant_id: string; cash_register_id: string;
          opened_at: string; opened_by: string;
          closed_at: string | null; closed_by: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          enabled_modules: string[];
          theme: Record<string, unknown> | null;
          payment_method: string | null;
          cash_register_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          enabled_modules?: string[];
          theme?: Record<string, unknown> | null;
        };
        Update: {
          name?: string;
          enabled_modules?: string[];
          theme?: Record<string, unknown> | null;
        };
        Relationships: [];
      };
      organization_memberships: {
        Row: {
          organization_id: string;
          user_id: string;
          role: "admin" | "member";
          created_at: string;
        };
        Insert: {
          organization_id: string;
          user_id: string;
          role?: "admin" | "member";
          created_at?: string;
        };
        Update: {
          role?: "admin" | "member";
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string | null;
        };
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          type: "weight" | "count" | "volume";
          conversion_factor: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          abbreviation: string;
          type: "weight" | "count" | "volume";
          conversion_factor?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          abbreviation?: string;
          type?: "weight" | "count" | "volume";
          conversion_factor?: number;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          category_id: string | null;
          stock_unit_id: string | null;
          sale_unit_id: string | null;
          customer_price: number;
          business_price: number | null;
          current_stock: number;
          min_stock: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          category_id?: string | null;
          stock_unit_id?: string | null;
          sale_unit_id?: string | null;
          customer_price?: number;
          business_price?: number | null;
          current_stock?: number;
          min_stock?: number;
          active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          image_url?: string | null;
          category_id?: string | null;
          stock_unit_id?: string | null;
          sale_unit_id?: string | null;
          customer_price?: number;
          business_price?: number | null;
          min_stock?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          type: "ingreso" | "venta" | "merma" | "ajuste" | "devolucion";
          quantity: number;
          previous_stock: number;
          new_stock: number;
          user_id: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          type: "ingreso" | "venta" | "merma" | "ajuste" | "devolucion";
          quantity: number;
          reason?: string | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string | null;
          status: "open" | "completed" | "cancelled";
          price_mode: "customer" | "business";
          owes: boolean;
          user_id: string | null;
          total: number | null;
          created_at: string;
          completed_at: string | null;
          payment_method: string | null;
          cash_register_id: string | null;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          status?: "open" | "completed" | "cancelled";
          price_mode?: "customer" | "business";
          owes?: boolean;
          payment_method?: string | null;
          cash_register_id?: string | null;
        };
        Update: {
          customer_name?: string | null;
          status?: "open" | "completed" | "cancelled";
          price_mode?: "customer" | "business";
          owes?: boolean;
          total?: number | null;
          completed_at?: string | null;
          payment_method?: string | null;
          cash_register_id?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_id: string;
          prepared: boolean;
          movement_id: string | null;
          discount_percent: number;
          round_total: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_id: string;
          prepared?: boolean;
          discount_percent?: number;
          round_total?: boolean;
        };
        Update: {
          quantity?: number;
          unit_id?: string;
          prepared?: boolean;
          movement_id?: string | null;
          discount_percent?: number;
          round_total?: boolean;
        };
        Relationships: [];
      };
      business_settings: {
        Row: {
          id: string;
          global_min_stock_alert: boolean;
          low_rotation_days: number;
          default_sale_unit_id: string | null;
          allow_negative_stock: boolean;
          rounding_rule: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          global_min_stock_alert?: boolean;
          low_rotation_days?: number;
          default_sale_unit_id?: string | null;
          allow_negative_stock?: boolean;
          rounding_rule?: string | null;
        };
        Update: {
          global_min_stock_alert?: boolean;
          low_rotation_days?: number;
          default_sale_unit_id?: string | null;
          allow_negative_stock?: boolean;
          rounding_rule?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      bakery_period_totals: {
        Args: { p_from: string; p_to: string; p_timezone: string };
        Returns: { day: string; income: number; expenses: number }[];
      };
      update_sale: {
        Args: { p_order_id: string; p_description: string; p_amount: number; p_payment_method: string };
        Returns: Record<string, unknown>;
      };
      close_order: {
        Args: { p_order_id: string };
        Returns: {
          id: string;
          customer_name: string | null;
          status: "open" | "completed" | "cancelled";
          price_mode: "customer" | "business";
          owes: boolean;
          user_id: string | null;
          total: number | null;
          created_at: string;
          completed_at: string | null;
          payment_method: string | null;
          cash_register_id: string | null;
        };
      };
            open_cash_register: { Args: Record<PropertyKey, never>; Returns: string };
      close_cash_register: { Args: Record<PropertyKey, never>; Returns: string };
      reopen_cash_register: { Args: { p_register_id: string }; Returns: string };
      register_sale: {
        Args: { p_description: string; p_amount: number; p_payment_method: string };
        Returns: Record<string, unknown>;
      };
      cancel_order: {
        Args: { p_order_id: string };
        Returns: {
          id: string;
          customer_name: string | null;
          status: "open" | "completed" | "cancelled";
          price_mode: "customer" | "business";
          owes: boolean;
          user_id: string | null;
          total: number | null;
          created_at: string;
          completed_at: string | null;
          payment_method: string | null;
          cash_register_id: string | null;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

