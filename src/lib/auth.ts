import { supabase } from "@/lib/supabase";

export type AuthUser = {
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

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email!,
    name: profile.name || user.email?.split("@")[0] || "",
    role: profile.role,
    created_at: profile.created_at,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('student-session-id');
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('student-session-id');
  }
}

export function getSessionId() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('student-session-id');
  }
  return null;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
}

// Keep this for the student portal, but it will need to be adapted to Supabase later
export function validateStudentCredentials(
  dossierCode: string,
  telephone: string,
  eleves: any[],
) {
  const cleanInputTel = telephone.replace(/\D/g, "");
  const eleve = eleves.find(
    (e) =>
      e.dossier_code?.toLowerCase() === dossierCode.toLowerCase().trim() &&
      e.telephone.replace(/\D/g, "").includes(cleanInputTel),
  );

  if (!eleve) {
    return { error: "Identifiants invalides (Vérifiez le code dossier et le téléphone)." };
  }

  return { eleve };
}
