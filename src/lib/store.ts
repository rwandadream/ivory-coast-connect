import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Eleve = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string; // stored without prefix, displayed with +225
  email?: string;
  adresse?: string;
  dateNaissance?: string;
  typePermis: string;
  dateInscription: string;
  createdAt: string;
};

export type Formation = {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  actif: boolean;
  createdAt: string;
};

export type Inscription = {
  id: string;
  eleveId: string;
  formationId: string;
  tarif: number;
  date: string;
  factureId?: string;
  createdAt: string;
};

export type Facture = {
  id: string;
  numero: string; // SAR-YYYY-NNNN
  eleveId: string;
  inscriptionId: string;
  montant: number;
  dateEmission: string;
  createdAt: string;
};

export type ModePaiement = "especes" | "orange_money" | "wave" | "virement";
export type Paiement = {
  id: string;
  factureId: string;
  eleveId: string;
  montant: number;
  mode: ModePaiement;
  date: string;
  reference?: string;
  notes?: string;
  createdAt: string;
};

export type ResultatExamen = "en_attente" | "admis" | "echec";
export type Examen = {
  id: string;
  eleveId: string;
  formationId?: string;
  typePermis: string;
  dateExamen: string;
  resultat: ResultatExamen;
  notes?: string;
  createdAt: string;
};

type State = {
  eleves: Eleve[];
  formations: Formation[];
  inscriptions: Inscription[];
  factures: Facture[];
  paiements: Paiement[];
  examens: Examen[];

  // Eleves
  addEleve: (e: Omit<Eleve, "id" | "createdAt">) => Eleve;
  updateEleve: (id: string, e: Partial<Eleve>) => void;
  deleteEleve: (id: string) => void;

  // Formations
  addFormation: (f: Omit<Formation, "id" | "createdAt">) => Formation;
  updateFormation: (id: string, f: Partial<Formation>) => void;
  deleteFormation: (id: string) => void;

  // Inscriptions (creates facture automatically)
  addInscription: (i: Omit<Inscription, "id" | "createdAt" | "factureId">) => Inscription;
  deleteInscription: (id: string) => void;

  // Paiements
  addPaiement: (p: Omit<Paiement, "id" | "createdAt">) => Paiement;
  deletePaiement: (id: string) => void;

  // Examens
  addExamen: (e: Omit<Examen, "id" | "createdAt">) => Examen;
  updateExamen: (id: string, e: Partial<Examen>) => void;
  deleteExamen: (id: string) => void;

  // Helpers
  getMontantPaye: (factureId: string) => number;
  getStatutFacture: (factureId: string) => "non_payee" | "partielle" | "payee";
  resetDemoData: () => void;
};

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const genNumeroFacture = (factures: Facture[]) => {
  const year = new Date().getFullYear();
  const yearFactures = factures.filter((f) => f.numero.startsWith(`SAR-${year}-`));
  const next = yearFactures.length + 1;
  return `SAR-${year}-${String(next).padStart(4, "0")}`;
};

const seedFormations: Formation[] = [
  { id: uid(), nom: "Permis B complet", description: "Code + conduite", prix: 250000, actif: true, createdAt: now() },
  { id: uid(), nom: "Code de la route", description: "Préparation au code", prix: 50000, actif: true, createdAt: now() },
  { id: uid(), nom: "Formation accélérée", description: "Permis B en 4 semaines", prix: 350000, actif: true, createdAt: now() },
  { id: uid(), nom: "Heure supplémentaire", description: "Heure de conduite", prix: 8000, actif: true, createdAt: now() },
];

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      eleves: [],
      formations: seedFormations,
      inscriptions: [],
      factures: [],
      paiements: [],
      examens: [],

      addEleve: (e) => {
        const item: Eleve = { ...e, id: uid(), createdAt: now() };
        set((s) => ({ eleves: [item, ...s.eleves] }));
        return item;
      },
      updateEleve: (id, e) =>
        set((s) => ({ eleves: s.eleves.map((x) => (x.id === id ? { ...x, ...e } : x)) })),
      deleteEleve: (id) =>
        set((s) => ({
          eleves: s.eleves.filter((x) => x.id !== id),
          inscriptions: s.inscriptions.filter((x) => x.eleveId !== id),
          factures: s.factures.filter((x) => x.eleveId !== id),
          paiements: s.paiements.filter((x) => x.eleveId !== id),
          examens: s.examens.filter((x) => x.eleveId !== id),
        })),

      addFormation: (f) => {
        const item: Formation = { ...f, id: uid(), createdAt: now() };
        set((s) => ({ formations: [item, ...s.formations] }));
        return item;
      },
      updateFormation: (id, f) =>
        set((s) => ({ formations: s.formations.map((x) => (x.id === id ? { ...x, ...f } : x)) })),
      deleteFormation: (id) => set((s) => ({ formations: s.formations.filter((x) => x.id !== id) })),

      addInscription: (i) => {
        const factureId = uid();
        const inscriptionId = uid();
        const date = now();
        const numero = genNumeroFacture(get().factures);
        const inscription: Inscription = { ...i, id: inscriptionId, factureId, createdAt: date };
        const facture: Facture = {
          id: factureId,
          numero,
          eleveId: i.eleveId,
          inscriptionId,
          montant: i.tarif,
          dateEmission: date,
          createdAt: date,
        };
        set((s) => ({
          inscriptions: [inscription, ...s.inscriptions],
          factures: [facture, ...s.factures],
        }));
        return inscription;
      },
      deleteInscription: (id) =>
        set((s) => {
          const ins = s.inscriptions.find((x) => x.id === id);
          return {
            inscriptions: s.inscriptions.filter((x) => x.id !== id),
            factures: ins?.factureId ? s.factures.filter((f) => f.id !== ins.factureId) : s.factures,
            paiements: ins?.factureId ? s.paiements.filter((p) => p.factureId !== ins.factureId) : s.paiements,
          };
        }),

      addPaiement: (p) => {
        const item: Paiement = { ...p, id: uid(), createdAt: now() };
        set((s) => ({ paiements: [item, ...s.paiements] }));
        return item;
      },
      deletePaiement: (id) => set((s) => ({ paiements: s.paiements.filter((x) => x.id !== id) })),

      addExamen: (e) => {
        const item: Examen = { ...e, id: uid(), createdAt: now() };
        set((s) => ({ examens: [item, ...s.examens] }));
        return item;
      },
      updateExamen: (id, e) =>
        set((s) => ({ examens: s.examens.map((x) => (x.id === id ? { ...x, ...e } : x)) })),
      deleteExamen: (id) => set((s) => ({ examens: s.examens.filter((x) => x.id !== id) })),

      getMontantPaye: (factureId) =>
        get().paiements.filter((p) => p.factureId === factureId).reduce((sum, p) => sum + p.montant, 0),

      getStatutFacture: (factureId) => {
        const facture = get().factures.find((f) => f.id === factureId);
        if (!facture) return "non_payee";
        const paye = get().getMontantPaye(factureId);
        if (paye <= 0) return "non_payee";
        if (paye >= facture.montant) return "payee";
        return "partielle";
      },

      resetDemoData: () =>
        set({
          eleves: [],
          formations: seedFormations,
          inscriptions: [],
          factures: [],
          paiements: [],
          examens: [],
        }),
    }),
    { name: "sarrah-auto-v1" },
  ),
);

export const formatXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "decimal", maximumFractionDigits: 0 }).format(n) + " FCFA";

export const formatTel = (tel: string) => {
  const clean = tel.replace(/\D/g, "");
  if (!clean) return "";
  // group as +225 XX XX XX XX XX
  const parts = clean.match(/.{1,2}/g) ?? [];
  return "+225 " + parts.join(" ");
};

export const labelModePaiement = (m: ModePaiement) =>
  ({ especes: "Espèces", orange_money: "Orange Money", wave: "Wave", virement: "Virement bancaire" })[m];

export const labelResultat = (r: ResultatExamen) =>
  ({ en_attente: "En attente", admis: "Admis", echec: "Échec" })[r];
