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

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dossierCode, setDossierCode] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
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
    <div className="flex min-h-screen bg-black overflow-hidden">
      {/* ══ LEFT — Panneau 3D (desktop uniquement) ══ */}
      <div className="relative hidden lg:flex flex-col flex-shrink-0 w-[58%] xl:w-[62%] overflow-hidden">
        {/* Skeleton de chargement */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#080604] transition-opacity duration-700"
          style={{ opacity: sceneReady ? 0 : 1, pointerEvents: sceneReady ? "none" : "auto" }}
          aria-hidden={sceneReady}
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-[color:var(--primary)] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[color:var(--primary)] opacity-60" />
            </div>
          </div>
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-medium">
            Chargement scène 3D…
          </p>
        </div>

        {/* Iframe Sketchfab */}
        <iframe
          title="Bugatti - La Voiture Noire"
          src="https://sketchfab.com/models/b713f2e7c48842c194084cf42b0b7a5f/embed?autostart=1&autospin=0.18&ui_controls=0&ui_infos=0&ui_stop=0&ui_theme=dark&camera=0&preload=1&ui_annotations=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_inspector=0"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setSceneReady(true)}
          className="absolute inset-0 h-full w-full transition-opacity duration-1000"
          style={{ opacity: sceneReady ? 1 : 0 }}
        />

        {/* Gradient haut */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-20" />

        {/* Gradient droite — fondu vers le panel form */}
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-r from-transparent to-black pointer-events-none z-20" />

        {/* Badge SARAH AUTO en haut à gauche */}
        <div className="absolute top-8 left-8 z-30 flex items-center gap-2.5">
          <Logo size={32} />
          <div className="flex flex-col">
            <span className="text-white text-[11px] font-black tracking-widest uppercase leading-none">
              SARAH AUTO
            </span>
            <span className="text-white/35 text-[9px] tracking-[0.2em] uppercase leading-none mt-0.5">
              ERP Auto-École
            </span>
          </div>
        </div>

        {/* Branding bas */}
        <div className="absolute bottom-0 inset-x-0 z-30 px-10 pb-10 bg-gradient-to-t from-black via-black/65 to-transparent pointer-events-none">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-px w-6 bg-[color:var(--primary)] opacity-70 flex-shrink-0" />
              <span className="text-[color:var(--primary)] text-[9px] font-bold uppercase tracking-[0.3em] opacity-80">
                Côte d'Ivoire · Gestion Auto-École
              </span>
            </div>
            <h1
              className="text-white text-[2rem] font-black leading-[1.1] tracking-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              La route vers<br />l'excellence
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Gérez vos élèves, plannings, factures et examens depuis une seule interface.
            </p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — Panneau Formulaire ══ */}
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen overflow-y-auto bg-black py-12 px-6 selection:bg-[color:var(--primary)]/30">
        {/* Lueur ambiante */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "oklch(0.65 0.18 45 / 0.07)" }}
        />
        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Contenu du formulaire */}
        <div className="relative z-10 w-full max-w-[400px] animate-fade-in-up">
          {/* Logo centré */}
          <div className="flex flex-col items-center mb-10">
            <div className="group relative flex flex-col items-center">
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "oklch(0.65 0.18 45 / 0.12)" }}
              />
              <div className="relative z-10 transition-transform duration-500 hover:scale-105">
                <Logo size={96} />
              </div>
            </div>
            {/* Visible uniquement sur mobile */}
            <div className="lg:hidden mt-4 flex flex-col items-center gap-0.5">
              <span className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">
                SARAH AUTO
              </span>
              <span className="text-white/25 text-[9px] tracking-widest">ERP Auto-École</span>
            </div>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 mb-8 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}>
              <TabsTrigger
                value="student"
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200 data-[state=active]:bg-[color:var(--primary)] data-[state=active]:text-[color:var(--primary-foreground)] data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/70"
              >
                Espace Élève
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200 data-[state=active]:bg-[color:var(--primary)] data-[state=active]:text-[color:var(--primary-foreground)] data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/70"
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
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="email"
                      placeholder="admin@sarahauto.ci"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/40 focus:ring-4 focus:ring-[color:var(--primary)]/8 transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Code Secret</FieldLabel>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/40 focus:ring-4 focus:ring-[color:var(--primary)]/8 transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
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
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Accéder à l'Admin"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ─── ÉLÈVE ─── */}
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-5">
                <FieldGroup>
                  <FieldLabel>Code Dossier</FieldLabel>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      placeholder="DOS-2026-XXXX"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/40 focus:ring-4 focus:ring-[color:var(--primary)]/8 transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                      value={dossierCode}
                      onChange={(e) => setDossierCode(e.target.value)}
                      required
                    />
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>N° Téléphone</FieldLabel>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[color:var(--primary)] transition-colors duration-200" />
                    <Input
                      type="tel"
                      placeholder="07 00 00 00 00"
                      className="h-14 pl-11 rounded-2xl text-white placeholder:text-white/20 focus:border-[color:var(--primary)]/40 focus:ring-4 focus:ring-[color:var(--primary)]/8 transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
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
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Consulter mon dossier"
                  )}
                </Button>

                <p className="text-center text-[10px] text-white/25 px-6 leading-relaxed">
                  Vos identifiants se trouvent sur votre contrat d'inscription.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Lien inscription */}
          <div
            className="mt-8 pt-6 text-center border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-sm">
              <span className="text-white/25">Nouveau collaborateur ?</span>
              <Link
                to="/signup"
                className="ml-2 font-black text-[color:var(--primary)] hover:text-[color:var(--primary-glow)] transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright bas de page */}
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/10 text-[9px] tracking-[0.25em] uppercase whitespace-nowrap">
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
