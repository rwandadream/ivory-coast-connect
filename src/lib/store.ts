import { create } from "zustand";
import { getStoredUsers, saveStoredUsers, type AuthUser } from "@/lib/auth";
import type { Database } from "@/lib/types";

type Tables = Database["public"]["Tables"];
export type Eleve = Tables["eleves"]["Row"] & {
  dossier_code: string;
  statut: "prospect" | "inscrit" | "en_formation" | "certifie" | "abandon";
  notes?: string | null;
};
export type Formation = Tables["formations"]["Row"];
export type Inscription = Tables["inscriptions"]["Row"] & {
  dossier_code: string;
};
export type Facture = Tables["factures"]["Row"] & {
  due_date?: string | null;
  montant_paye: number;
  statut: "non_payee" | "partielle" | "payee";
};
export type Paiement = Tables["paiements"]["Row"];
export type Examen = Tables["examens"]["Row"] & {
  session_code?: string;
};
export type Moniteur = Tables["moniteurs"]["Row"];
export type PlanningSession = Tables["planning_sessions"]["Row"];
export type User = {
  id: string;
  email: string;
  name: string;
  role: "administrateur" | "comptable" | "moniteur" | "conseiller";
  created_at: string;
};
export type AuditEntry = {
  id: string;
  action: string;
  entity: string;
  entity_id?: string;
  user_email?: string;
  timestamp: string;
  details?: string;
};

export type ModePaiement = "especes" | "orange_money" | "wave" | "virement";
export type ResultatExamen = "en_attente" | "admis" | "echec";

type LocalData = {
  eleves: Eleve[];
  formations: Formation[];
  inscriptions: Inscription[];
  factures: Facture[];
  paiements: Paiement[];
  examens: Examen[];
  moniteurs: Moniteur[];
  planning_sessions: PlanningSession[];
  users: User[];
  audit: AuditEntry[];
};

const STORAGE_KEY = "sarah_auto_data";

function getLocalData(): LocalData {
  if (typeof window === "undefined") {
    return {
      eleves: [],
      formations: [],
      inscriptions: [],
      factures: [],
      paiements: [],
      examens: [],
      moniteurs: [],
      planning_sessions: [],
      users: [],
      audit: [],
    };
  }

  try {
    return (
      (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as LocalData | null) ?? {
        eleves: [],
        formations: [],
        inscriptions: [],
        factures: [],
        paiements: [],
        examens: [],
        moniteurs: [],
        planning_sessions: [],
        users: [],
        audit: [],
      }
    );
  } catch {
    return {
      eleves: [],
      formations: [],
      inscriptions: [],
      factures: [],
      paiements: [],
      examens: [],
      moniteurs: [],
      planning_sessions: [],
      users: [],
      audit: [],
    };
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function saveLocalData(data: LocalData) {
  if (typeof window === "undefined") return;

  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    const optimizedData = {
      ...data,
      audit: data.audit.slice(0, 100),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(optimizedData));
    } catch (e) {
      console.error("Failed to save data to localStorage:", e);
    }
  }, 500);
}

function generateId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function padNumber(value: number, length: number) {
  return String(value).padStart(length, "0");
}

function generateDossierCode() {
  const year = new Date().getFullYear();
  return `DOS-${year}-${padNumber(Math.floor(Math.random() * 9999) + 1, 4)}`;
}

function generateFactureNumero(count: number) {
  const year = new Date().getFullYear();
  return `SAR-${year}-${padNumber(count, 4)}`;
}

type State = {
  eleves: Eleve[];
  formations: Formation[];
  inscriptions: Inscription[];
  factures: Facture[];
  paiements: Paiement[];
  examens: Examen[];
  moniteurs: Moniteur[];
  planning_sessions: PlanningSession[];
  users: User[];
  audit: AuditEntry[];
  isLoading: boolean;

  // Actions
  fetchData: () => Promise<void>;

  // Eleves
  addEleve: (e: Tables["eleves"]["Insert"]) => Promise<void>;
  updateEleve: (id: string, e: Tables["eleves"]["Update"]) => Promise<void>;
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

  // Planning
  addPlanningSession: (session: Tables["planning_sessions"]["Insert"]) => Promise<void>;
  updatePlanningSession: (
    id: string,
    session: Tables["planning_sessions"]["Update"],
  ) => Promise<void>;
  deletePlanningSession: (id: string) => Promise<void>;

  // Users
  addUser: (user: Omit<AuthUser, "id" | "created_at">) => Promise<void>;
  updateUser: (id: string, data: Partial<Omit<AuthUser, "id" | "created_at">>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Audit
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp">) => Promise<void>;

  // Helpers
  getMontantPaye: (factureId: string) => number;
  getStatutFacture: (factureId: string) => "non_payee" | "partielle" | "payee";
  getFactureReste: (factureId: string) => number;
  getEleveStatut: (eleveId: string) => Eleve["statut"];
  getEleveDossier: (eleveId: string) => string;
};

export const useStore = create<State>((set, get) => ({
  eleves: [],
  formations: [],
  inscriptions: [],
  factures: [],
  paiements: [],
  examens: [],
  moniteurs: [],
  planning_sessions: [],
  users: [],
  audit: [],
  isLoading: false,

  fetchData: async () => {
    if (typeof window === "undefined") return;
    set({ isLoading: true });
    try {
      const data = getLocalData();

      // Migration and setup of factures with real-time tracking
      const factures = data.factures.map((f) => {
        const montant_paye = data.paiements
          .filter((p) => p.facture_id === f.id)
          .reduce((sum, p) => sum + p.montant, 0);
        return {
          ...f,
          montant_paye: f.montant_paye ?? montant_paye,
          statut:
            f.statut ??
            (montant_paye >= f.montant ? "payee" : montant_paye > 0 ? "partielle" : "non_payee"),
        } as Facture;
      });

      const eleves = [...data.eleves].sort(
        (a, b) =>
          new Date(b.created_at ?? "1970-01-01").getTime() -
          new Date(a.created_at ?? "1970-01-01").getTime(),
      );
      const formations = [...data.formations];
      if (formations.length === 0) {
        const defaultPermis = ["A", "B", "AB", "BCDE", "ABCD"];
        const defaultFormations: Formation[] = defaultPermis.map((p) => ({
          id: `permis-${p.toLowerCase()}`,
          nom: `Permis ${p}`,
          prix: p === "A" ? 80000 : 150000,
          actif: true,
          created_at: new Date().toISOString(),
          description: `Formation complète (Code + Conduite) pour le permis ${p}.`,
        }));
        formations.push(...defaultFormations);
      }
      formations.sort((a, b) => (a.nom ?? "").localeCompare(b.nom ?? ""));
      const inscriptions = [...data.inscriptions];
      const paiements = [...data.paiements];
      const examens = [...data.examens].sort(
        (a, b) =>
          new Date(b.date_examen ?? "1970-01-01").getTime() -
          new Date(a.date_examen ?? "1970-01-01").getTime(),
      );
      const moniteurs = [...data.moniteurs].sort((a, b) => a.nom.localeCompare(b.nom));
      const planning_sessions = [...data.planning_sessions].sort(
        (a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime(),
      );
      const authUsers = getStoredUsers();
      const users = authUsers.map(({ id, email, name, role, created_at }) => ({
        id,
        email,
        name,
        role,
        created_at,
      }));
      const audit = [...data.audit].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      set({
        eleves,
        formations,
        inscriptions,
        factures,
        paiements,
        examens,
        moniteurs,
        planning_sessions,
        users,
        audit,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addEleve: async (e) => {
    const newEleve: Eleve = {
      id: e.id ?? generateId(),
      nom: e.nom,
      prenom: e.prenom,
      telephone: e.telephone,
      email: e.email ?? null,
      adresse: e.adresse ?? null,
      date_naissance: e.date_naissance ?? null,
      lieu_naissance: e.lieu_naissance ?? null,
      sexe: e.sexe ?? null,
      nationalite: e.nationalite ?? null,
      type_piece: e.type_piece ?? null,
      num_piece: e.num_piece ?? null,
      code: e.code ?? null,
      type_permis: e.type_permis,
      date_inscription: e.date_inscription ?? new Date().toISOString().slice(0, 10),
      created_at: e.created_at ?? new Date().toISOString(),
      dossier_code: generateDossierCode(),
      statut: "prospect",
      notes: null,
    };

    set((s) => {
      const updatedEleves = [newEleve, ...s.eleves];
      saveLocalData({
        eleves: updatedEleves,
        formations: s.formations,
        inscriptions: s.inscriptions,
        factures: s.factures,
        paiements: s.paiements,
        examens: s.examens,
        moniteurs: s.moniteurs,
        planning_sessions: s.planning_sessions,
        users: s.users,
        audit: s.audit,
      });
      return { eleves: updatedEleves };
    });
  },
  updateEleve: async (id, e) => {
    set((s) => {
      const updatedEleves = s.eleves.map((x) => (x.id === id ? ({ ...x, ...e } as Eleve) : x));
      saveLocalData({
        ...s,
        eleves: updatedEleves,
      });
      return { eleves: updatedEleves };
    });
  },
  deleteEleve: async (id) => {
    set((s) => {
      const updatedEleves = s.eleves.filter((x) => x.id !== id);
      const updatedInscriptions = s.inscriptions.filter((i) => i.eleve_id !== id);
      const removedFactureIds = s.factures.filter((f) => f.eleve_id === id).map((f) => f.id);
      const updatedFactures = s.factures.filter((f) => f.eleve_id !== id);
      const updatedPaiements = s.paiements.filter(
        (p) => !removedFactureIds.includes(p.facture_id || ""),
      );
      const updatedExamens = s.examens.filter((x) => x.eleve_id !== id);

      saveLocalData({
        ...s,
        eleves: updatedEleves,
        inscriptions: updatedInscriptions,
        factures: updatedFactures,
        paiements: updatedPaiements,
        examens: updatedExamens,
      });

      return {
        eleves: updatedEleves,
        inscriptions: updatedInscriptions,
        factures: updatedFactures,
        paiements: updatedPaiements,
        examens: updatedExamens,
      };
    });
  },

  addFormation: async (f) => {
    const newFormation: Formation = {
      id: f.id ?? generateId(),
      nom: f.nom,
      description: f.description ?? null,
      prix: f.prix ?? 0,
      actif: f.actif ?? true,
      created_at: f.created_at ?? new Date().toISOString(),
    };
    set((s) => {
      const updated = [newFormation, ...s.formations];
      saveLocalData({ ...s, formations: updated });
      return { formations: updated };
    });
  },
  updateFormation: async (id, f) => {
    set((s) => {
      const updated = s.formations.map((x) => (x.id === id ? ({ ...x, ...f } as Formation) : x));
      saveLocalData({ ...s, formations: updated });
      return { formations: updated };
    });
  },
  deleteFormation: async (id) => {
    set((s) => {
      const updated = s.formations.filter((x) => x.id !== id);
      saveLocalData({ ...s, formations: updated });
      return { formations: updated };
    });
  },

  addInscription: async (i) => {
    set((s) => {
      const newInscription: Inscription = {
        id: i.id ?? generateId(),
        eleve_id: i.eleve_id ?? null,
        formation_id: i.formation_id ?? null,
        tarif: i.tarif,
        date_inscription: i.date_inscription ?? new Date().toISOString().slice(0, 10),
        created_at: i.created_at ?? new Date().toISOString(),
        dossier_code: generateDossierCode(),
      };

      const factureNumero = generateFactureNumero(s.factures.length + 1);
      const emissionDate = newInscription.date_inscription || new Date().toISOString().slice(0, 10);
      const dueDate = new Date(new Date(emissionDate).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      const newFacture: Facture = {
        id: generateId(),
        numero: factureNumero,
        eleve_id: newInscription.eleve_id,
        inscription_id: newInscription.id,
        montant: newInscription.tarif,
        montant_paye: 0,
        statut: "non_payee" as const,
        date_emission: emissionDate,
        due_date: dueDate,
        created_at: new Date().toISOString(),
      };

      const updatedInscriptions = [newInscription, ...s.inscriptions];
      const updatedFactures = [newFacture, ...s.factures];

      saveLocalData({ ...s, inscriptions: updatedInscriptions, factures: updatedFactures });
      return { inscriptions: updatedInscriptions, factures: updatedFactures };
    });
  },
  deleteInscription: async (id) => {
    set((s) => {
      const updatedInscriptions = s.inscriptions.filter((x) => x.id !== id);
      const factureIds = s.factures.filter((f) => f.inscription_id === id).map((f) => f.id);
      const updatedFactures = s.factures.filter((f) => f.inscription_id !== id);
      const updatedPaiements = s.paiements.filter((p) => !factureIds.includes(p.facture_id || ""));

      saveLocalData({
        ...s,
        inscriptions: updatedInscriptions,
        factures: updatedFactures,
        paiements: updatedPaiements,
      });
      return {
        inscriptions: updatedInscriptions,
        factures: updatedFactures,
        paiements: updatedPaiements,
      };
    });
  },

  addPaiement: async (p) => {
    const newPaiement: Paiement = {
      id: p.id ?? generateId(),
      facture_id: p.facture_id ?? null,
      eleve_id: p.eleve_id ?? null,
      montant: p.montant,
      mode_paiement: p.mode_paiement,
      date_paiement: p.date_paiement ?? new Date().toISOString().slice(0, 10),
      reference: p.reference ?? null,
      notes: p.notes ?? null,
      created_at: p.created_at ?? new Date().toISOString(),
    };
    set((s) => {
      const updatedPaiements = [newPaiement, ...s.paiements];
      const updatedFactures = s.factures.map((f) => {
        if (f.id === p.facture_id) {
          const newTotal = f.montant_paye + p.montant;
          return {
            ...f,
            montant_paye: newTotal,
            statut: (newTotal >= f.montant
              ? "payee"
              : newTotal > 0
                ? "partielle"
                : "non_payee") as Facture["statut"],
          };
        }
        return f;
      });
      saveLocalData({ ...s, paiements: updatedPaiements, factures: updatedFactures });
      return { paiements: updatedPaiements, factures: updatedFactures };
    });
  },
  deletePaiement: async (id) => {
    set((s) => {
      const p = s.paiements.find((x) => x.id === id);
      const updatedPaiements = s.paiements.filter((x) => x.id !== id);
      const updatedFactures = s.factures.map((f) => {
        if (p && f.id === p.facture_id) {
          const newTotal = Math.max(0, f.montant_paye - p.montant);
          return {
            ...f,
            montant_paye: newTotal,
            statut: (newTotal >= f.montant
              ? "payee"
              : newTotal > 0
                ? "partielle"
                : "non_payee") as Facture["statut"],
          };
        }
        return f;
      });
      saveLocalData({ ...s, paiements: updatedPaiements, factures: updatedFactures });
      return { paiements: updatedPaiements, factures: updatedFactures };
    });
  },

  addExamen: async (e) => {
    const newExamen: Examen = {
      id: e.id ?? generateId(),
      eleve_id: e.eleve_id ?? null,
      formation_id: e.formation_id ?? null,
      type_permis: e.type_permis,
      type_examen: e.type_examen,
      date_examen: e.date_examen,
      resultat: e.resultat ?? null,
      notes: e.notes ?? null,
      session_code: `SES-${new Date(e.date_examen).toISOString().slice(0, 10)}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
      created_at: e.created_at ?? new Date().toISOString(),
    };
    set((s) => {
      const updated = [newExamen, ...s.examens];
      saveLocalData({ ...s, examens: updated });
      return { examens: updated };
    });
  },
  updateExamen: async (id, e) => {
    set((s) => {
      const updated = s.examens.map((x) => (x.id === id ? ({ ...x, ...e } as Examen) : x));
      saveLocalData({ ...s, examens: updated });
      return { examens: updated };
    });
  },
  deleteExamen: async (id) => {
    set((s) => {
      const updated = s.examens.filter((x) => x.id !== id);
      saveLocalData({ ...s, examens: updated });
      return { examens: updated };
    });
  },

  addMoniteur: async (m) => {
    const newMoniteur: Moniteur = {
      id: m.id ?? generateId(),
      nom: m.nom,
      prenom: m.prenom,
      telephone: m.telephone,
      email: m.email ?? null,
      specialite: m.specialite ?? null,
      statut: m.statut ?? "Disponible",
      created_at: m.created_at ?? new Date().toISOString(),
    };
    set((s) => {
      const updated = [newMoniteur, ...s.moniteurs];
      saveLocalData({ ...s, moniteurs: updated });
      return { moniteurs: updated };
    });
  },
  updateMoniteur: async (id, m) => {
    set((s) => {
      const updated = s.moniteurs.map((x) => (x.id === id ? ({ ...x, ...m } as Moniteur) : x));
      saveLocalData({ ...s, moniteurs: updated });
      return { moniteurs: updated };
    });
  },
  deleteMoniteur: async (id) => {
    set((s) => {
      const updatedMoniteurs = s.moniteurs.filter((x) => x.id !== id);
      const updatedPlanning = s.planning_sessions.filter((session) => session.moniteur_id !== id);
      saveLocalData({ ...s, moniteurs: updatedMoniteurs, planning_sessions: updatedPlanning });
      return { moniteurs: updatedMoniteurs, planning_sessions: updatedPlanning };
    });
  },
  addPlanningSession: async (session) => {
    const newSession: PlanningSession = {
      id: session.id ?? generateId(),
      titre: session.titre,
      eleve_id: session.eleve_id ?? null,
      moniteur_id: session.moniteur_id ?? null,
      date_heure: session.date_heure,
      duree_minutes: session.duree_minutes ?? 60,
      lieu: session.lieu ?? null,
      type: session.type ?? "Formation",
      notes: session.notes ?? null,
      created_at: session.created_at ?? new Date().toISOString(),
    };
    set((s) => {
      const updated = [newSession, ...s.planning_sessions];
      saveLocalData({ ...s, planning_sessions: updated });
      return { planning_sessions: updated };
    });
  },
  updatePlanningSession: async (id, session) => {
    set((s) => {
      const updated = s.planning_sessions.map((x) =>
        x.id === id ? ({ ...x, ...session } as PlanningSession) : x,
      );
      saveLocalData({ ...s, planning_sessions: updated });
      return { planning_sessions: updated };
    });
  },
  deletePlanningSession: async (id) => {
    set((s) => {
      const updated = s.planning_sessions.filter((x) => x.id !== id);
      saveLocalData({ ...s, planning_sessions: updated });
      return { planning_sessions: updated };
    });
  },

  addUser: async (user) => {
    const authUsers = getStoredUsers();
    const newAuthUser: AuthUser = {
      id: generateId(),
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      created_at: new Date().toISOString(),
    };
    authUsers.unshift(newAuthUser);
    saveStoredUsers(authUsers);

    const newStoreUser: User = {
      id: newAuthUser.id,
      email: newAuthUser.email,
      name: newAuthUser.name,
      role: newAuthUser.role,
      created_at: newAuthUser.created_at,
    };
    const data = getLocalData();
    data.users.unshift(newStoreUser);
    saveLocalData(data);
    set((s) => ({ users: [newStoreUser, ...s.users] }));
  },
  updateUser: async (id, userData) => {
    const authUsers = getStoredUsers();
    const authIndex = authUsers.findIndex((u) => u.id === id);
    if (authIndex === -1) return;
    const updatedAuthUser = { ...authUsers[authIndex], ...userData } as AuthUser;
    authUsers[authIndex] = updatedAuthUser;
    saveStoredUsers(authUsers);

    const updatedStoreUser: User = {
      id: updatedAuthUser.id,
      email: updatedAuthUser.email,
      name: updatedAuthUser.name,
      role: updatedAuthUser.role,
      created_at: updatedAuthUser.created_at,
    };

    const data = getLocalData();
    const storeIndex = data.users.findIndex((u) => u.id === id);
    if (storeIndex !== -1) {
      data.users[storeIndex] = updatedStoreUser;
      saveLocalData(data);
    }
    set((s) => ({ users: s.users.map((u) => (u.id === id ? updatedStoreUser : u)) }));
  },
  deleteUser: async (id) => {
    const authUsers = getStoredUsers();
    saveStoredUsers(authUsers.filter((u) => u.id !== id));

    const data = getLocalData();
    data.users = data.users.filter((u) => u.id !== id);
    saveLocalData(data);
    set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
  },

  addAuditEntry: async (entry) => {
    const data = getLocalData();
    const newEntry: AuditEntry = {
      id: generateId(),
      ...entry,
      timestamp: new Date().toISOString(),
    };
    data.audit.unshift(newEntry);
    saveLocalData(data);
    set((s) => ({ audit: [newEntry, ...s.audit] }));
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
    const facture = get().factures.find((f) => f.id === factureId);
    if (!facture) return 0;
    return Math.max(0, facture.montant - facture.montant_paye);
  },
  getEleveStatut: (eleveId) => {
    const eleves = get().eleves;
    const eleve = eleves.find((e) => e.id === eleveId);
    if (!eleve) return "prospect";
    const inscriptions = get().inscriptions.filter((i) => i.eleve_id === eleveId);
    const examens = get().examens.filter((x) => x.eleve_id === eleveId);
    if (examens.some((x) => x.resultat === "admis")) return "certifie";
    if (examens.some((x) => x.resultat === "echec")) return "en_formation";
    if (inscriptions.length > 0) return "inscrit";
    return "prospect";
  },
  getEleveDossier: (eleveId) => {
    const eleve = get().eleves.find((e) => e.id === eleveId);
    return eleve?.dossier_code ?? "—";
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
