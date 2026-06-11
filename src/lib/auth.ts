import type { Eleve } from "@/lib/store";

export type AuthUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "administrateur" | "comptable" | "moniteur" | "conseiller";
  created_at: string;
};

const USERS_STORAGE_KEY = "sarah_auto_users";
const SESSION_ID_KEY = "sarah_auto_session_id";
const SESSION_TYPE_KEY = "sarah_auto_session_type";

export function getStoredUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) ?? "[]") as AuthUser[];
    if (users.length === 0) {
      // Create default admin if empty
      const admin: AuthUser = {
        id: "admin-default",
        email: "admin@sarahauto.ci",
        password: "admin",
        name: "Admin Sarah",
        role: "administrateur",
        created_at: new Date().toISOString(),
      };
      return [admin];
    }
    return users;
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: AuthUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

export function getSessionType(): "admin" | "eleve" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_TYPE_KEY) as "admin" | "eleve" | null;
}

export function setSession(id: string, type: "admin" | "eleve") {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_ID_KEY, id);
  localStorage.setItem(SESSION_TYPE_KEY, type);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_TYPE_KEY);
}

export function createUser(
  email: string,
  password: string,
  name?: string,
  role: AuthUser["role"] = "administrateur",
) {
  const users = getStoredUsers();
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { error: "Un compte existe déjà pour cet email." };
  }

  const newUser: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email,
    password,
    name: name ?? email.split("@")[0] ?? email,
    role,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);
  return { user: newUser };
}

export function validateUserCredentials(email: string, password: string) {
  const users = getStoredUsers();
  const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { error: "Aucun compte trouvé pour cet email." };
  }

  if (user.password !== password) {
    return { error: "Mot de passe incorrect." };
  }

  return { user };
}

export function validateStudentCredentials(
  dossierCode: string,
  telephone: string,
  eleves: Eleve[],
) {
  const cleanInputTel = telephone.replace(/\D/g, "");
  const eleve = eleves.find(
    (e) =>
      e.dossier_code.toLowerCase() === dossierCode.toLowerCase().trim() &&
      e.telephone.replace(/\D/g, "").includes(cleanInputTel),
  );

  if (!eleve) {
    return { error: "Identifiants invalides (Vérifiez le code dossier et le téléphone)." };
  }

  return { eleve };
}
