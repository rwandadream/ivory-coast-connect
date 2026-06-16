import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

export const loginStudent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      dossierCode: z.string().min(1),
      telephone: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { dossierCode, telephone } = data;
    const cleanInputTel = telephone.replace(/\D/g, "");

    // Query only for the matching student
    const { data: eleves, error } = await supabase
      .from("eleves")
      .select("id, telephone")
      .ilike("id", `${dossierCode}%`); // dossierCode is prefix of ID

    if (error || !eleves) {
      throw new Error("Erreur lors de la recherche du dossier");
    }

    const eleve = eleves.find((e) => e.telephone.replace(/\D/g, "").includes(cleanInputTel));

    if (!eleve) {
      throw new Error("Identifiants invalides");
    }

    return { studentId: eleve.id };
  });
