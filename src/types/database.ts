export type Database = {
  public: {
    Tables: {
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
          status: "open" | "completed";
          price_mode: "customer" | "business";
          user_id: string | null;
          total: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          status?: "open" | "completed";
          price_mode?: "customer" | "business";
        };
        Update: {
          customer_name?: string | null;
          status?: "open" | "completed";
          price_mode?: "customer" | "business";
          total?: number | null;
          completed_at?: string | null;
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
      close_order: {
        Args: { p_order_id: string };
        Returns: {
          id: string;
          customer_name: string | null;
          status: "open" | "completed";
          price_mode: "customer" | "business";
          user_id: string | null;
          total: number | null;
          created_at: string;
          completed_at: string | null;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};