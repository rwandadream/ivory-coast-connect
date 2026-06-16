import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];

// --- QUERIES ---

export function useEleves() {
  return useQuery({
    queryKey: ["eleves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eleves")
        .select("*, permis(code), inspecteurs(nom, prenom)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((e) => ({
        ...e,
        dossier_code: e.id.slice(0, 8).toUpperCase(),
        type_permis: (e.permis as any)?.code || "B",
        inspecteur: e.inspecteurs
          ? `${(e.inspecteurs as any).prenom} ${(e.inspecteurs as any).nom}`
          : null,
        statut: e.statut || "prospect",
      }));
    },
  });
}

export function useFormations() {
  return useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("formations").select("*").order("nom");
      if (error) throw error;
      return data;
    },
  });
}

export function useFactures() {
  return useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data: factures, error: fError } = await supabase.from("factures").select("*");
      if (fError) throw fError;

      const { data: paiements, error: pError } = await supabase.from("paiements").select("facture_id, montant");
      if (pError) throw pError;

      return factures.map((f) => {
        const montant_paye = paiements
          .filter((p) => p.facture_id === f.id)
          .reduce((sum, p) => sum + p.montant, 0);

        let statut: "non_payee" | "partielle" | "payee" = "non_payee";
        if (montant_paye >= f.montant) statut = "payee";
        else if (montant_paye > 0) statut = "partielle";

        return { ...f, montant_paye, statut };
      });
    },
  });
}

export function usePaiements() {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("paiements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useExamenSessions() {
  return useQuery({
    queryKey: ["examen_sessions"],
    queryFn: async () => {
      const { data: sessions, error: sError } = await supabase
        .from("examen_sessions")
        .select("*")
        .order("date_examen", { ascending: false });
      if (sError) throw sError;

      const { data: sessionEleves, error: seError } = await supabase.from("examen_session_eleves").select("session_id, resultat");
      if (seError) throw seError;

      return sessions.map((s) => {
        const related = sessionEleves.filter((e) => e.session_id === s.id);
        const total = related.length;
        const admis = related.filter((e) => e.resultat === "admis").length;
        return {
          ...s,
          eleves_count: total,
          admis_count: admis,
          taux_reussite: total > 0 ? (admis / total) * 100 : 0,
        };
      });
    },
  });
}

export function useInscriptions() {
  return useQuery({
    queryKey: ["inscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inscriptions").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useExamens() {
  return useQuery({
    queryKey: ["examens"],
    queryFn: async () => {
      const { data, error } = await supabase.from("examens").select("*").order("date_examen", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDepenses() {
  return useQuery({
    queryKey: ["depenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("depenses").select("*").order("date_depense", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useStudent(id: string | null) {
  return useQuery({
    queryKey: ["eleve", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("eleves")
        .select("*, permis(code)")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        dossier_code: data.id.slice(0, 8).toUpperCase(),
        type_permis: (data.permis as any)?.code || "B",
        statut: data.statut || "prospect",
      };
    },
    enabled: !!id,
  });
}

export function useStudentPlanning(id: string | null) {
  return useQuery({
    queryKey: ["planning", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("seances")
        .select("*, moniteurs(*)")
        .eq("eleve_id", id)
        .order("date_seance", { ascending: true });

      if (error) throw error;
      return data.map(s => ({
        ...s,
        date_heure: s.date_seance ? `${s.date_seance}T${s.heure_debut || "08:00:00"}` : "",
      }));
    },
    enabled: !!id,
  });
}

export function useStudentFactures(id: string | null) {
  return useQuery({
    queryKey: ["factures", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase.from("factures").select("*").eq("eleve_id", id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// --- MUTATIONS ---

export function useAddEleve() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eleve: Tables["eleves"]["Insert"]) => {
      const { data, error } = await supabase.from("eleves").insert(eleve).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eleves"] });
    },
  });
}

export function useUpdateEleve() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Tables["eleves"]["Update"] }) => {
      const { error } = await supabase.from("eleves").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eleves"] });
    },
  });
}
