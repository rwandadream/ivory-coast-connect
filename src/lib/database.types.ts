export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity: string
          entity_id: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      depenses: {
        Row: {
          categorie: string
          created_at: string | null
          date_depense: string | null
          description: string | null
          id: string
          justificatif_url: string | null
          mode_paiement: string | null
          montant: number
          utilisateur_id: string | null
          vehicule_id: string | null
        }
        Insert: {
          categorie: string
          created_at?: string | null
          date_depense?: string | null
          description?: string | null
          id?: string
          justificatif_url?: string | null
          mode_paiement?: string | null
          montant: number
          utilisateur_id?: string | null
          vehicule_id?: string | null
        }
        Update: {
          categorie?: string
          created_at?: string | null
          date_depense?: string | null
          description?: string | null
          id?: string
          justificatif_url?: string | null
          mode_paiement?: string | null
          montant?: number
          utilisateur_id?: string | null
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "depenses_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depenses_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          }
        ]
      }
      eleves: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_inscription: string | null
          date_naissance: string | null
          email: string | null
          est_parraine: boolean | null
          id: string
          inspecteur_id: string | null
          lieu_naissance: string | null
          nationalite: string | null
          nom: string
          notes: string | null
          num_piece: string | null
          parrain_nom: string | null
          permis_id: string | null
          photo_cni: string | null
          photo_profil: string | null
          prenom: string
          sexe: string | null
          statut: string | null
          telephone: string
          type_piece: string | null
          dossier_code: string | null
          type_permis: string | null
          code: string | null
          inspecteur: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          email?: string | null
          est_parraine?: boolean | null
          id?: string
          inspecteur_id?: string | null
          lieu_naissance?: string | null
          nationalite?: string | null
          nom: string
          notes?: string | null
          num_piece?: string | null
          parrain_nom?: string | null
          permis_id?: string | null
          photo_cni?: string | null
          photo_profil?: string | null
          prenom: string
          sexe?: string | null
          statut?: string | null
          telephone: string
          type_piece?: string | null
          dossier_code?: string | null
          type_permis?: string | null
          code?: string | null
          inspecteur?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          email?: string | null
          est_parraine?: boolean | null
          id?: string
          inspecteur_id?: string | null
          lieu_naissance?: string | null
          nationalite?: string | null
          nom?: string
          notes?: string | null
          num_piece?: string | null
          parrain_nom?: string | null
          permis_id?: string | null
          photo_cni?: string | null
          photo_profil?: string | null
          prenom?: string
          sexe?: string | null
          statut?: string | null
          telephone?: string
          type_piece?: string | null
          dossier_code?: string | null
          type_permis?: string | null
          code?: string | null
          inspecteur?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eleves_inspecteur_id_fkey"
            columns: ["inspecteur_id"]
            isOneToOne: false
            referencedRelation: "inspecteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eleves_permis_id_fkey"
            columns: ["permis_id"]
            isOneToOne: false
            referencedRelation: "permis"
            referencedColumns: ["id"]
          }
        ]
      }
      examens: {
        Row: {
          created_at: string | null
          date_examen: string
          eleve_id: string | null
          id: string
          inspecteur_id: string | null
          notes: string | null
          resultat: string | null
          type_examen: string
          formation_id: string | null
          type_permis: string | null
        }
        Insert: {
          created_at?: string | null
          date_examen: string
          eleve_id?: string | null
          id?: string
          inspecteur_id?: string | null
          notes?: string | null
          resultat?: string | null
          type_examen: string
          formation_id?: string | null
          type_permis?: string | null
        }
        Update: {
          created_at?: string | null
          date_examen?: string
          eleve_id?: string | null
          id?: string
          inspecteur_id?: string | null
          notes?: string | null
          resultat?: string | null
          type_examen?: string
          formation_id?: string | null
          type_permis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "examens_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "eleves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "examens_inspecteur_id_fkey"
            columns: ["inspecteur_id"]
            isOneToOne: false
            referencedRelation: "inspecteurs"
            referencedColumns: ["id"]
          }
        ]
      }
      factures: {
        Row: {
          created_at: string | null
          date_emission: string | null
          eleve_id: string | null
          id: string
          inscription_id: string | null
          montant: number
          numero: string
          statut: string | null
        }
        Insert: {
          created_at?: string | null
          date_emission?: string | null
          eleve_id?: string | null
          id?: string
          inscription_id?: string | null
          montant: number
          numero: string
          statut?: string | null
        }
        Update: {
          created_at?: string | null
          date_emission?: string | null
          eleve_id?: string | null
          id?: string
          inscription_id?: string | null
          montant?: number
          numero?: string
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factures_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "eleves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_inscription_id_fkey"
            columns: ["inscription_id"]
            isOneToOne: false
            referencedRelation: "inscriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      formations: {
        Row: {
          actif: boolean | null
          created_at: string | null
          description: string | null
          id: string
          nom: string
          prix: number | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
          prix?: number | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
          prix?: number | null
        }
        Relationships: []
      }
      inscriptions: {
        Row: {
          created_at: string | null
          date_inscription: string | null
          eleve_id: string | null
          formation_id: string | null
          id: string
          tarif: number
        }
        Insert: {
          created_at?: string | null
          date_inscription?: string | null
          eleve_id?: string | null
          formation_id?: string | null
          id?: string
          tarif: number
        }
        Update: {
          created_at?: string | null
          date_inscription?: string | null
          eleve_id?: string | null
          formation_id?: string | null
          id?: string
          tarif?: number
        }
        Relationships: [
          {
            foreignKeyName: "inscriptions_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "eleves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscriptions_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          }
        ]
      }
      inspecteurs: {
        Row: {
          actif: boolean | null
          created_at: string | null
          email: string | null
          id: string
          nom: string
          prenom: string
          telephone: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nom: string
          prenom: string
          telephone?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nom?: string
          prenom?: string
          telephone?: string | null
        }
        Relationships: []
      }
      moniteurs: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nom: string
          prenom: string
          specialite: string | null
          statut: string | null
          telephone: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nom: string
          prenom: string
          specialite?: string | null
          statut?: string | null
          telephone: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nom?: string
          prenom?: string
          specialite?: string | null
          statut?: string | null
          telephone?: string
        }
        Relationships: []
      }
      paiements: {
        Row: {
          created_at: string | null
          date_paiement: string | null
          facture_id: string | null
          id: string
          mode_paiement: string | null
          montant: number
          notes: string | null
          reference: string | null
          eleve_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_paiement?: string | null
          facture_id?: string | null
          id?: string
          mode_paiement?: string | null
          montant: number
          notes?: string | null
          reference?: string | null
          eleve_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_paiement?: string | null
          facture_id?: string | null
          id?: string
          mode_paiement?: string | null
          montant?: number
          notes?: string | null
          reference?: string | null
          eleve_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paiements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          }
        ]
      }
      permis: {
        Row: {
          code: string
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      seances: {
        Row: {
          created_at: string | null
          date_seance: string | null
          eleve_id: string | null
          heure_debut: string | null
          heure_fin: string | null
          id: string
          moniteur_id: string | null
          notes: string | null
          statut: string | null
          vehicule_id: string | null
          duree_minutes: number | null
          lieu: string | null
          type: string | null
          titre: string | null
        }
        Insert: {
          created_at?: string | null
          date_seance?: string | null
          eleve_id?: string | null
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          moniteur_id?: string | null
          notes?: string | null
          statut?: string | null
          vehicule_id?: string | null
          duree_minutes?: number | null
          lieu?: string | null
          type?: string | null
          titre?: string | null
        }
        Update: {
          created_at?: string | null
          date_seance?: string | null
          eleve_id?: string | null
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          moniteur_id?: string | null
          notes?: string | null
          statut?: string | null
          vehicule_id?: string | null
          duree_minutes?: number | null
          lieu?: string | null
          type?: string | null
          titre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seances_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "eleves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seances_moniteur_id_fkey"
            columns: ["moniteur_id"]
            isOneToOne: false
            referencedRelation: "moniteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seances_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicules: {
        Row: {
          created_at: string | null
          etat: string | null
          id: string
          immatriculation: string
          marque: string | null
          modele: string | null
        }
        Insert: {
          created_at?: string | null
          etat?: string | null
          id?: string
          immatriculation: string
          marque?: string | null
          modele?: string | null
        }
        Update: {
          created_at?: string | null
          etat?: string | null
          id?: string
          immatriculation?: string
          marque?: string | null
          modele?: string | null
        }
        Relationships: []
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
