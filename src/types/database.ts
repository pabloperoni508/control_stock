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
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          abbreviation: string;
          type: "weight" | "count" | "volume";
          created_at?: string;
        };
        Update: {
          name?: string;
          abbreviation?: string;
          type?: "weight" | "count" | "volume";
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
          price: number;
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
          price?: number;
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
          price?: number;
          min_stock?: number;
          active?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};