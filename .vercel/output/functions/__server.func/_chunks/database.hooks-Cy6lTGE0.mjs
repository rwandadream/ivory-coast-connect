import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { m as supabase } from "./router-CQ4OfHlr.mjs";
//#region dist/server/assets/database.hooks-Cy6lTGE0.js
function useEleves() {
	return useQuery({
		queryKey: ["eleves"],
		queryFn: async () => {
			const { data, error } = await supabase.from("eleves").select("*, permis(code), inspecteurs(nom, prenom)").order("created_at", { ascending: false });
			if (error) throw error;
			return data.map((e) => ({
				...e,
				dossier_code: e.id.slice(0, 8).toUpperCase(),
				type_permis: e.permis?.code || "B",
				inspecteur: e.inspecteurs ? `${e.inspecteurs.prenom} ${e.inspecteurs.nom}` : null,
				statut: e.statut || "prospect"
			}));
		}
	});
}
function useFormations() {
	return useQuery({
		queryKey: ["formations"],
		queryFn: async () => {
			const { data, error } = await supabase.from("formations").select("*").order("nom");
			if (error) throw error;
			return data;
		}
	});
}
function useFactures() {
	return useQuery({
		queryKey: ["factures"],
		queryFn: async () => {
			const { data: factures, error: fError } = await supabase.from("factures").select("*");
			if (fError) throw fError;
			const { data: paiements, error: pError } = await supabase.from("paiements").select("facture_id, montant");
			if (pError) throw pError;
			return factures.map((f) => {
				const montant_paye = paiements.filter((p) => p.facture_id === f.id).reduce((sum, p) => sum + p.montant, 0);
				let statut = "non_payee";
				if (montant_paye >= f.montant) statut = "payee";
				else if (montant_paye > 0) statut = "partielle";
				return {
					...f,
					montant_paye,
					statut
				};
			});
		}
	});
}
function usePaiements() {
	return useQuery({
		queryKey: ["paiements"],
		queryFn: async () => {
			const { data, error } = await supabase.from("paiements").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useInscriptions() {
	return useQuery({
		queryKey: ["inscriptions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("inscriptions").select("*");
			if (error) throw error;
			return data;
		}
	});
}
function useExamens() {
	return useQuery({
		queryKey: ["examens"],
		queryFn: async () => {
			const { data, error } = await supabase.from("examens").select("*").order("date_examen", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useDepenses() {
	return useQuery({
		queryKey: ["depenses"],
		queryFn: async () => {
			const { data, error } = await supabase.from("depenses").select("*").order("date_depense", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useStudent(id) {
	return useQuery({
		queryKey: ["eleve", id],
		queryFn: async () => {
			if (!id) return null;
			const { data, error } = await supabase.from("eleves").select("*, permis(code)").eq("id", id).single();
			if (error) throw error;
			return {
				...data,
				dossier_code: data.id.slice(0, 8).toUpperCase(),
				type_permis: data.permis?.code || "B",
				statut: data.statut || "prospect"
			};
		},
		enabled: !!id
	});
}
function useStudentPlanning(id) {
	return useQuery({
		queryKey: ["planning", id],
		queryFn: async () => {
			if (!id) return [];
			const { data, error } = await supabase.from("seances").select("*, moniteurs(*)").eq("eleve_id", id).order("date_seance", { ascending: true });
			if (error) throw error;
			return data.map((s) => ({
				...s,
				date_heure: s.date_seance ? `${s.date_seance}T${s.heure_debut || "08:00:00"}` : ""
			}));
		},
		enabled: !!id
	});
}
function useStudentFactures(id) {
	return useQuery({
		queryKey: ["factures", id],
		queryFn: async () => {
			if (!id) return [];
			const { data, error } = await supabase.from("factures").select("*").eq("eleve_id", id);
			if (error) throw error;
			return data;
		},
		enabled: !!id
	});
}
function useUpdateEleve() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }) => {
			const { error } = await supabase.from("eleves").update(data).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["eleves"] });
		}
	});
}
//#endregion
export { useFormations as a, useStudent as c, useUpdateEleve as d, useFactures as i, useStudentFactures as l, useEleves as n, useInscriptions as o, useExamens as r, usePaiements as s, useDepenses as t, useStudentPlanning as u };
