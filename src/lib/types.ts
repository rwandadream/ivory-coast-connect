export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      eleves: {
        Row: {
          id: string;
          nom: string;
          prenom: string;
          telephone: string;
          email: string | null;
          adresse: string | null;
          date_naissance: string | null;
          type_permis: string;
          date_inscription: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          prenom: string;
          telephone: string;
          email?: string | null;
          adresse?: string | null;
          date_naissance?: string | null;
          type_permis: string;
          date_inscription?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          prenom?: string;
          telephone?: string;
          email?: string | null;
          adresse?: string | null;
          date_naissance?: string | null;
          type_permis?: string;
          date_inscription?: string | null;
          created_at?: string;
        };
      };
      formations: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          prix: number;
          actif: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          description?: string | null;
          prix?: number;
          actif?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          description?: string | null;
          prix?: number;
          actif?: boolean;
          created_at?: string;
        };
      };
      inscriptions: {
        Row: {
          id: string;
          eleve_id: string | null;
          formation_id: string | null;
          tarif: number;
          date_inscription: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          eleve_id?: string | null;
          formation_id?: string | null;
          tarif: number;
          date_inscription?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          eleve_id?: string | null;
          formation_id?: string | null;
          tarif?: number;
          date_inscription?: string | null;
          created_at?: string;
        };
      };
      factures: {
        Row: {
          id: string;
          numero: string;
          eleve_id: string | null;
          inscription_id: string | null;
          montant: number;
          date_emission: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero: string;
          eleve_id?: string | null;
          inscription_id?: string | null;
          montant: number;
          date_emission?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero?: string;
          eleve_id?: string | null;
          inscription_id?: string | null;
          montant?: number;
          date_emission?: string | null;
          created_at?: string;
        };
      };
      paiements: {
        Row: {
          id: string;
          facture_id: string | null;
          eleve_id: string | null;
          montant: number;
          mode_paiement: string;
          date_paiement: string | null;
          reference: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          facture_id?: string | null;
          eleve_id?: string | null;
          montant: number;
          mode_paiement: string;
          date_paiement?: string | null;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          facture_id?: string | null;
          eleve_id?: string | null;
          montant?: number;
          mode_paiement?: string;
          date_paiement?: string | null;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      examens: {
        Row: {
          id: string;
          eleve_id: string | null;
          formation_id: string | null;
          type_permis: string;
          type_examen: string;
          date_examen: string;
          resultat: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          eleve_id?: string | null;
          formation_id?: string | null;
          type_permis: string;
          type_examen: string;
          date_examen: string;
          resultat?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          eleve_id?: string | null;
          formation_id?: string | null;
          type_permis?: string;
          type_examen?: string;
          date_examen?: string;
          resultat?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      moniteurs: {
        Row: {
          id: string;
          nom: string;
          prenom: string;
          telephone: string;
          email: string | null;
          specialite: string | null;
          statut: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          prenom: string;
          telephone: string;
          email?: string | null;
          specialite?: string | null;
          statut?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          prenom?: string;
          telephone?: string;
          email?: string | null;
          specialite?: string | null;
          statut?: string;
          created_at?: string;
        };
      };
      planning_sessions: {
        Row: {
          id: string;
          titre: string;
          eleve_id: string | null;
          moniteur_id: string | null;
          date_heure: string;
          duree_minutes: number;
          lieu: string | null;
          type: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          eleve_id?: string | null;
          moniteur_id?: string | null;
          date_heure: string;
          duree_minutes?: number;
          lieu?: string | null;
          type?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          titre?: string;
          eleve_id?: string | null;
          moniteur_id?: string | null;
          date_heure?: string;
          duree_minutes?: number;
          lieu?: string | null;
          type?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema[PublicEnumNameOrOptions]
    : never;
