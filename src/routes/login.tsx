import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Loader2, Hash, Phone } from "lucide-react";
import { signIn, validateStudentCredentials } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import bgImage from "@/assets/images/african-american-man-woman-couple-driving-car-street.jpg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dossierCode, setDossierCode] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const eleves = useStore((s) => s.eleves);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        toast.success("Bienvenue");
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = validateStudentCredentials(dossierCode, telephone, eleves);
      if (result.error || !result.eleve) {
        toast.error(result.error || "Identifiants invalides.");
      } else {
        localStorage.setItem("sarah_auto_session_id", result.eleve.id);
        localStorage.setItem("sarah_auto_session_type", "eleve");
        toast.success("Bienvenue dans votre espace, " + result.eleve.prenom);
        navigate({ to: "/portal" });
      }
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080604] selection:bg-primary/30">

      {/* ── Image de fond ── */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* ── Calques de superposition ── */}
      {/* Couche principale sombre */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Dégradé directionnel pour lisibilité de la carte */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-[color:var(--primary)]/15" />
      {/* Vignette bords */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.55)_100%)]" />

      {/* ── Carte formulaire centrée ── */}
      <div className="relative z-10 w-full max-w-[480px] px-4 py-10 sm:px-6 animate-fade-in-up">
        <div
          className="rounded-[2.5rem] border border-white/[0.08] p-8 sm:p-10 backdrop-blur-2xl shadow-[0_32px_96px_-12px_rgba(0,0,0,0.8)]"
          style={{ background: "rgba(8, 6, 4, 0.72)" }}
        >

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="group relative flex flex-col items-center">
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "oklch(0.65 0.18 45 / 0.15)" }}
              />
              <div className="relative z-10 transition-transform duration-500 hover:scale-105">
                <Logo size={120} />
              </div>
            </div>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="student" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2 rounded-2xl p-1 mb-8 border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <TabsTrigger
                value="student"
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200 data-[state=active]:bg-[color:var(--primary)] data-[state=active]:text-[color:var(--primary-foreground)] data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/65"
              >
                Espace Élève
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200 data-[state=active]:bg-[color:var(--primary)] data-[state=active]:text-[color:var(--primary-foreground)] data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/65"
              >
                Administration
              </TabsTrigger>
            </TabsList>

            {/* ─── ADMIN ─── */}
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <FieldGroup>
                  <FieldLabel>Email Pro</FieldLabel>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="email"
                      placeholder="admin@sarahauto.ci"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/50 focus:ring-4 focus:ring-[color:var(--primary)]/10 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Code Secret</FieldLabel>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/50 focus:ring-4 focus:ring-[color:var(--primary)]/10 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <Button
                  type="submit"
                  className="h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Accéder à l'Admin"}
                </Button>
              </form>
            </TabsContent>

            {/* ─── ÉLÈVE ─── */}
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-5">
                <FieldGroup>
                  <FieldLabel>Code Dossier</FieldLabel>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      placeholder="DOS-2026-XXXX"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/50 focus:ring-4 focus:ring-[color:var(--primary)]/10 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                      value={dossierCode}
                      onChange={(e) => setDossierCode(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>N° Téléphone</FieldLabel>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="tel"
                      placeholder="07 00 00 00 00"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/50 focus:ring-4 focus:ring-[color:var(--primary)]/10 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <Button
                  type="submit"
                  className="h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Consulter mon dossier"}
                </Button>

                <p className="text-center text-[10px] text-white/25 px-4 leading-relaxed">
                  Vos identifiants se trouvent sur votre contrat d'inscription.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Lien inscription */}
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-sm">
              <span className="text-white/30">Nouveau collaborateur ?</span>
              <Link
                to="/signup"
                className="ml-2 font-black text-[color:var(--primary)] hover:text-[color:var(--primary-glow)] transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-white/20 text-[9px] tracking-[0.25em] uppercase">
          © 2026 SARAH AUTO · Tous droits réservés
        </p>
      </div>
    </div>
  );
}

/* ── Micro-composants locaux ── */
function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30 ml-0.5">
      {children}
    </Label>
  );
}
