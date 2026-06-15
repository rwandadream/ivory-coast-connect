import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight, Car, User, Hash, Phone } from "lucide-react";
import { signIn, validateStudentCredentials } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";

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
    } catch (error) {
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
        // We'll need a new way to handle student session in Supabase later
        // For now, we might still need localStorage for student portal if they are not auth users
        localStorage.setItem("sarah_auto_session_id", result.eleve.id);
        localStorage.setItem("sarah_auto_session_type", "eleve");
        toast.success("Bienvenue dans votre espace, " + result.eleve.prenom);
        navigate({ to: "/portal" });
      }
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] overflow-hidden selection:bg-primary/30">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Architecture"
          className="h-full w-full object-cover opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-primary/20" />
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-6 py-12 animate-fade-in-up">
        <div className="glass glass-hover rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.7)] border-white/5 p-8 sm:p-12 backdrop-blur-3xl transition-all duration-700">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="group mb-6 relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow ring-1 ring-white/20">
                <Car className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
              SARAH <span className="text-primary-glow">AUTO</span>
            </h1>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 mb-8 border border-white/5">
              <TabsTrigger
                value="student"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest"
              >
                Espace Élève
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest"
              >
                Administration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Email Pro
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="email"
                        placeholder="admin@sarahauto.ci"
                        className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Code Secret
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Accéder à l'Admin"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Code Dossier
                    </Label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="DOS-2026-XXXX"
                        className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        value={dossierCode}
                        onChange={(e) => setDossierCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      N° Téléphone
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="tel"
                        placeholder="07 00 00 00 00"
                        className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-14 w-full rounded-2xl bg-gradient-primary font-black text-primary-foreground shadow-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Consulter mon dossier"
                  )}
                </Button>
                <p className="text-center text-[10px] text-white/30 px-4">
                  Vos identifiants se trouvent sur votre contrat d'inscription.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-semibold">
              <span className="text-white/30">Nouveau collaborateur ?</span>
              <Link to="/signup" className="ml-3 font-black text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
