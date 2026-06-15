import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight, Car } from "lucide-react";
import { signUp } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, email.split("@")[0]);
      if (error) {
        toast.error("Erreur d'inscription : " + error.message);
      } else {
        toast.success("Compte créé ! Vous pouvez désormais vous connecter.");
        navigate({ to: "/login" });
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] overflow-hidden selection:bg-primary/30">
      {/* Cinematic Automotive Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Car"
          className="h-full w-full object-cover opacity-40 animate-pulse-subtle scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-primary/20" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[460px] px-6 py-12 animate-fade-in-up">
        {/* Glassmorphic Card */}
        <div className="glass glass-hover rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.7)] border-white/5 p-10 sm:p-14 backdrop-blur-3xl transition-all duration-700">
          {/* Brand Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="group mb-8 relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Car className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
              SARAH <span className="text-primary-glow">AUTO</span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-4 opacity-50" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
              Créer votre compte
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-7">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1"
                >
                  Email Professionnel
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className="h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="directeur@sarahauto.ci"
                    className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white placeholder:text-white/10 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1"
                >
                  Mot de passe
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white placeholder:text-white/10 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-primary text-base font-black text-primary-foreground shadow-glow transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Créer le compte
                    <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </>
                )}
              </div>
            </Button>
          </form>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-col items-center gap-8 border-t border-white/5 pt-10">
            <p className="flex items-center text-sm font-semibold">
              <span className="text-white/30">Déjà inscrit ?</span>
              <Link
                to="/login"
                className="ml-3 font-black text-primary hover:text-primary-glow transition-all duration-300 relative group"
              >
                Se connecter
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </p>

            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] text-center">
              SARAH AUTO © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
