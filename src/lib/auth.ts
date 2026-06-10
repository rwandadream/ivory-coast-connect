export type AuthUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "administrateur" | "comptable" | "moniteur" | "conseiller";
  created_at: string;
};

const USERS_STORAGE_KEY = "sarah_auto_users";
const SESSION_STORAGE_KEY = "sarah_auto_session";

export function getStoredUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) ?? "[]") as AuthUser[];
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: AuthUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function setSessionEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, email);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
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
