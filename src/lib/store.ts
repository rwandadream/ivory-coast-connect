import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];

export type Eleve = Tables["eleves"]["Row"] & {
  dossier_code: string;
  statut: string;
  type_permis: string;
  code: string | null;
  inspecteur: string | null;
};

export type EleveInsert = Tables["eleves"]["Insert"] & {
  photo_cni?: string | null;
  photo_profil?: string | null;
};

export type EleveUpdate = Tables["eleves"]["Update"] & {
  photo_cni?: string | null;
  photo_profil?: string | null;
};

export type Formation = Tables["formations"]["Row"];
export type Inscription = Tables["inscriptions"]["Row"] & {
  dossier_code: string;
};
export type Facture = Omit<Tables["factures"]["Row"], "statut"> & {
  montant_paye: number;
  statut: "non_payee" | "partielle" | "payee";
};
export type Paiement = Tables["paiements"]["Row"];
export type Examen = Tables["examens"]["Row"] & {
  type_permis: string;
  inspecteur: string | null;
};
export type Moniteur = Tables["moniteurs"]["Row"];
export type Seance = Tables["seances"]["Row"];
export type PlanningSession = Seance & {
  titre: string;
  date_heure: string;
  duree_minutes: number;
  lieu: string | null;
  type: string;
};
export type Depense = Tables["depenses"]["Row"] & {
  date: string;
};
export type Vehicule = Tables["vehicules"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type AuditLog = Tables["audit_log"]["Row"];

export type User = {
  id: string;
  email: string;
  name: string;
  role:
    | "administrateur_principal"
    | "administrateur_secondaire"
    | "comptable"
    | "moniteur"
    | "conseiller";
  created_at: string;
};

export type ModePaiement = "especes" | "orange_money" | "wave" | "virement";
export type ResultatExamen = "en_attente" | "admis" | "echec";

type State = {
  eleves: Eleve[];
  formations: Formation[];
  inscriptions: Inscription[];
  factures: Facture[];
  paiements: Paiement[];
  examens: Examen[];
  moniteurs: Moniteur[];
  seances: Seance[];
  planning_sessions: PlanningSession[];
  vehicules: Vehicule[];
  depenses: Depense[];
  profiles: Profile[];
  users: User[];
  audit: AuditLog[];
  isLoading: boolean;

  // Actions
  fetchData: () => Promise<void>;

  // Eleves
  addEleve: (e: EleveInsert) => Promise<void>;
  updateEleve: (id: string, e: EleveUpdate) => Promise<void>;
  deleteEleve: (id: string) => Promise<void>;

  // Formations
  addFormation: (f: Tables["formations"]["Insert"]) => Promise<void>;
  updateFormation: (id: string, f: Tables["formations"]["Update"]) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;

  // Inscriptions
  addInscription: (i: Tables["inscriptions"]["Insert"]) => Promise<void>;
  deleteInscription: (id: string) => Promise<void>;

  // Paiements
  addPaiement: (p: Tables["paiements"]["Insert"]) => Promise<void>;
  deletePaiement: (id: string) => Promise<void>;

  // Examens
  addExamen: (e: Tables["examens"]["Insert"]) => Promise<void>;
  updateExamen: (id: string, e: Tables["examens"]["Update"]) => Promise<void>;
  deleteExamen: (id: string) => Promise<void>;

  // Moniteurs
  addMoniteur: (m: Tables["moniteurs"]["Insert"]) => Promise<void>;
  updateMoniteur: (id: string, m: Tables["moniteurs"]["Update"]) => Promise<void>;
  deleteMoniteur: (id: string) => Promise<void>;

  // Seances / Planning
  addPlanningSession: (s: Tables["seances"]["Insert"]) => Promise<void>;
  updatePlanningSession: (id: string, s: Tables["seances"]["Update"]) => Promise<void>;
  deletePlanningSession: (id: string) => Promise<void>;

  // Vehicules
  addVehicule: (v: Tables["vehicules"]["Insert"]) => Promise<void>;
  updateVehicule: (id: string, v: Tables["vehicules"]["Update"]) => Promise<void>;
  deleteVehicule: (id: string) => Promise<void>;

  // Depenses
  addDepense: (d: Tables["depenses"]["Insert"]) => Promise<void>;
  updateDepense: (id: string, d: Tables["depenses"]["Update"]) => Promise<void>;
  deleteDepense: (id: string) => Promise<void>;

  // Users
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Audit
  addAuditEntry: (
    action: string,
    entity: string,
    entity_id?: string,
    old_data?: unknown,
    new_data?: unknown,
  ) => Promise<void>;

  // Helpers
  getMontantPaye: (factureId: string) => number;
  getStatutFacture: (factureId: string) => "non_payee" | "partielle" | "payee";
  getFactureReste: (factureId: string) => number;
};

export const useStore = create<State>((set, get) => ({
  eleves: [],
  formations: [],
  inscriptions: [],
  factures: [],
  paiements: [],
  examens: [],
  moniteurs: [],
  seances: [],
  planning_sessions: [],
  vehicules: [],
  depenses: [],
  profiles: [],
  users: [],
  audit: [],
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [
        { data: eleves },
        { data: formations },
        { data: inscriptions },
        { data: factures },
        { data: paiements },
        { data: examens },
        { data: moniteurs },
        { data: seances },
        { data: vehicules },
        { data: depenses },
        { data: profiles },
        { data: audit },
        { data: permis },
        { data: inspecteurs },
      ] = await Promise.all([
        supabase.from("eleves").select("*").order("created_at", { ascending: false }),
        supabase.from("formations").select("*").order("nom"),
        supabase.from("inscriptions").select("*"),
        supabase.from("factures").select("*"),
        supabase.from("paiements").select("*"),
        supabase.from("examens").select("*").order("date_examen", { ascending: false }),
        supabase.from("moniteurs").select("*").order("nom"),
        supabase.from("seances").select("*").order("date_seance", { ascending: false }),
        supabase.from("vehicules").select("*").order("immatriculation"),
        supabase.from("depenses").select("*").order("date_depense", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("permis").select("*"),
        supabase.from("inspecteurs").select("*"),
      ]);

      const mappedEleves = (eleves || []).map((e) => {
        const p = (permis || []).find((x) => x.id === e.permis_id);
        const insp = (inspecteurs || []).find((x) => x.id === e.inspecteur_id);
        return {
          ...e,
          dossier_code: e.id.slice(0, 8).toUpperCase(),
          type_permis: p?.code || "B",
          code: e.id.slice(-4).toUpperCase(),
          inspecteur: insp ? `${insp.prenom} ${insp.nom}` : null,
          statut: e.statut || "prospect",
        } as Eleve;
      });

      const mappedFactures = (factures || []).map((f) => {
        const montant_paye = (paiements || [])
          .filter((p) => p.facture_id === f.id)
          .reduce((sum, p) => sum + p.montant, 0);

        let statut: "non_payee" | "partielle" | "payee" = "non_payee";
        if (montant_paye >= f.montant) statut = "payee";
        else if (montant_paye > 0) statut = "partielle";

        return {
          ...f,
          montant_paye,
          statut,
        } as Facture;
      });

      const mappedDepenses = (depenses || []).map(
        (d) =>
          ({
            ...d,
            date: d.date_depense || d.created_at || "",
          }) as Depense,
      );

      const mappedExamens = (examens || []).map((ex) => {
        const insp = (inspecteurs || []).find((x) => x.id === ex.inspecteur_id);
        const eleve = mappedEleves.find((e) => e.id === ex.eleve_id);
        return {
          ...ex,
          type_permis: eleve?.type_permis || "B",
          inspecteur: insp ? `${insp.prenom} ${insp.nom}` : null,
        } as Examen;
      });

      const mappedPlanning = (seances || []).map((s) => {
        const eleve = mappedEleves.find((e) => e.id === s.eleve_id);
        return {
          ...s,
          titre:
            s.titre || (eleve ? `Conduite: ${eleve.prenom} ${eleve.nom}` : "Séance de conduite"),
          date_heure: s.date_seance ? `${s.date_seance}T${s.heure_debut || "08:00:00"}` : "",
          duree_minutes: s.duree_minutes || 60,
          type: s.type || "Formation",
          lieu: s.lieu || null,
        } as PlanningSession;
      });

      const users = (profiles || []).map((p) => ({
        id: p.id,
        email: p.email,
        name: p.name || "",
        role: p.role as User["role"],
        created_at: p.created_at || "",
      }));

      set({
        eleves: mappedEleves,
        formations: formations || [],
        inscriptions: (inscriptions || []).map((ins) => ({
          ...ins,
          dossier_code: ins.id.slice(0, 8).toUpperCase(),
        })),
        factures: mappedFactures,
        paiements: paiements || [],
        examens: mappedExamens,
        moniteurs: moniteurs || [],
        seances: seances || [],
        planning_sessions: mappedPlanning,
        vehicules: vehicules || [],
        depenses: mappedDepenses,
        profiles: profiles || [],
        users,
        audit: audit || [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addEleve: async (e) => {
    const { data, error } = await supabase.from("eleves").insert(e).select().single();
    if (error) throw error;
    await get().fetchData();
    get().addAuditEntry("CREATION", "ELEVE", data.id, null, data);
  },
  updateEleve: async (id, e) => {
    const old = get().eleves.find((x) => x.id === id);
    const { data, error } = await supabase.from("eleves").update(e).eq("id", id).select().single();
    if (error) throw error;
    await get().fetchData();
    get().addAuditEntry("MODIFICATION", "ELEVE", id, old, data);
  },
  deleteEleve: async (id) => {
    const old = get().eleves.find((x) => x.id === id);
    const { error } = await supabase.from("eleves").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
    get().addAuditEntry("SUPPRESSION", "ELEVE", id, old, null);
  },

  addFormation: async (f) => {
    const { error } = await supabase.from("formations").insert(f);
    if (error) throw error;
    await get().fetchData();
  },
  updateFormation: async (id, f) => {
    const { error } = await supabase.from("formations").update(f).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteFormation: async (id) => {
    const { error } = await supabase.from("formations").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addInscription: async (i) => {
    const { data: inscription, error: insError } = await supabase
      .from("inscriptions")
      .insert(i)
      .select()
      .single();
    if (insError) throw insError;

    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const { error: facError } = await supabase.from("factures").insert({
      eleve_id: i.eleve_id,
      inscription_id: inscription.id,
      montant: i.tarif,
      numero: invoiceNumber,
      statut: "impayee",
    });

    if (facError) throw facError;
    await get().fetchData();
  },
  deleteInscription: async (id) => {
    const { error } = await supabase.from("inscriptions").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addPaiement: async (p) => {
    const { error } = await supabase.from("paiements").insert(p);
    if (error) throw error;
    await get().fetchData();
  },
  deletePaiement: async (id) => {
    const { error } = await supabase.from("paiements").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addExamen: async (e) => {
    const { error } = await supabase.from("examens").insert(e);
    if (error) throw error;
    await get().fetchData();
  },
  updateExamen: async (id, e) => {
    const { error } = await supabase.from("examens").update(e).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteExamen: async (id) => {
    const { error } = await supabase.from("examens").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addMoniteur: async (m) => {
    const { error } = await supabase.from("moniteurs").insert(m);
    if (error) throw error;
    await get().fetchData();
  },
  updateMoniteur: async (id, m) => {
    const { error } = await supabase.from("moniteurs").update(m).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteMoniteur: async (id) => {
    const { error } = await supabase.from("moniteurs").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addPlanningSession: async (s) => {
    const { error } = await supabase.from("seances").insert(s);
    if (error) throw error;
    await get().fetchData();
  },
  updatePlanningSession: async (id, s) => {
    const { error } = await supabase.from("seances").update(s).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deletePlanningSession: async (id) => {
    const { error } = await supabase.from("seances").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addVehicule: async (v) => {
    const { error } = await supabase.from("vehicules").insert(v);
    if (error) throw error;
    await get().fetchData();
  },
  updateVehicule: async (id, v) => {
    const { error } = await supabase.from("vehicules").update(v).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteVehicule: async (id) => {
    const { error } = await supabase.from("vehicules").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addDepense: async (d) => {
    const user = await getCurrentUser();
    const { error } = await supabase.from("depenses").insert({ ...d, utilisateur_id: user?.id });
    if (error) throw error;
    await get().fetchData();
  },
  updateDepense: async (id, d) => {
    const { error } = await supabase.from("depenses").update(d).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteDepense: async (id) => {
    const { error } = await supabase.from("depenses").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addUser: async (user) => {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: { data: { name: user.name, role: user.role } },
    });
    if (error) throw error;
    await get().fetchData();
  },
  updateUser: async (id, data) => {
    const { error } = await supabase.from("profiles").update(data).eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },
  deleteUser: async (id) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
    await get().fetchData();
  },

  addAuditEntry: async (action, entity, entity_id, old_data, new_data) => {
    const user = await getCurrentUser();
    await supabase.from("audit_log").insert({
      action,
      entity,
      entity_id,
      old_data: old_data ? JSON.parse(JSON.stringify(old_data)) : null,
      new_data: new_data ? JSON.parse(JSON.stringify(new_data)) : null,
      user_id: user?.id,
    });
  },

  getMontantPaye: (factureId) => {
    const f = get().factures.find((x) => x.id === factureId);
    return f ? f.montant_paye : 0;
  },
  getStatutFacture: (factureId) => {
    const f = get().factures.find((x) => x.id === factureId);
    return f ? f.statut : "non_payee";
  },
  getFactureReste: (factureId) => {
    const f = get().factures.find((x) => x.id === factureId);
    if (!f) return 0;
    return Math.max(0, f.montant - f.montant_paye);
  },
}));

export const formatXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "decimal", maximumFractionDigits: 0 }).format(n) +
  " FCFA";

export const formatTel = (tel: string) => {
  const clean = tel.replace(/\D/g, "");
  if (!clean) return "";
  const parts = clean.match(/.{1,2}/g) ?? [];
  return "+225 " + parts.join(" ");
};

export const labelModePaiement = (m: string) =>
  ({
    especes: "Espèces",
    orange_money: "Orange Money",
    wave: "Wave",
    virement: "Virement bancaire",
  })[m as ModePaiement] || m;

export const labelResultat = (r: string) =>
  ({ en_attente: "En attente", admis: "Admis", echec: "Échec" })[r as ResultatExamen] || r;
