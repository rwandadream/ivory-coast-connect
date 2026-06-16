import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  LogOut,
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  User,
  Mail,
  Camera,
} from "lucide-react";
import { formatXOF, formatTel } from "@/lib/store";
import { clearSession, getSessionId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { useStudent, useStudentPlanning, useStudentFactures, useUpdateEleve, usePaiements, useFormations, useInscriptions } from "@/lib/api/database.hooks";
import { compressImage } from "@/lib/utils";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "Mon Espace — SARAH AUTO" }] }),
  component: StudentPortal,
});

function StudentPortal() {
  const navigate = useNavigate();
  const studentId = getSessionId();

  const { data: student, isLoading: isLoadingStudent } = useStudent(studentId);
  const { data: studentPlanning = [] } = useStudentPlanning(studentId);
  const { data: studentFactures = [] } = useStudentFactures(studentId);
  const { data: allPaiements = [] } = usePaiements();
  const { data: formations = [] } = useFormations();
  const { data: inscriptions = [] } = useInscriptions();
  const { mutateAsync: updateEleve } = useUpdateEleve();

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && student) {
      try {
        const compressed = await compressImage(file, 400, 0.8);
        await updateEleve({ id: student.id, data: { photo_profil: compressed } });
        toast.success("Photo de profil mise à jour !");
      } catch (err) {
        toast.error("Erreur lors de la mise à jour de la photo");
      }
    }
  };

  const totalMontant = useMemo(
    () => studentFactures.reduce((sum, f) => sum + f.montant, 0),
    [studentFactures],
  );
  const totalPaye = useMemo(
    () => allPaiements.filter((p) => p.eleve_id === studentId).reduce((sum, p) => sum + p.montant, 0),
    [allPaiements, studentId],
  );
  const resteAPayer = Math.max(0, totalMontant - totalPaye);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const handleLogout = () => {
    clearSession();
    toast.success("Déconnexion réussie");
    navigate({ to: "/login" });
  };

  const handleDownloadInvoice = async (factureId: string) => {
    const f = studentFactures.find((x) => x.id === factureId);
    if (!f || !student) return;
    const inscription = inscriptions.find((i) => i.id === f.inscription_id);
    const formationData = formations.find((fr) => fr.id === inscription?.formation_id);

    try {
      await generateInvoicePDF({
        numero: f.numero,
        date: f.date_emission || f.created_at || "",
        eleve: {
          nom: student.nom,
          prenom: student.prenom,
          telephone: student.telephone,
          adresse: student.adresse ?? undefined,
        },
        formation: formationData?.nom || "Formation Permis",
        montant: f.montant,
        paiements: allPaiements
          .filter((p) => p.facture_id === f.id)
          .map((p) => ({
            date: p.date_paiement || p.created_at || "",
            montant: p.montant,
            mode: p.mode_paiement || "especes",
          })),
      });
      toast.success("Facture téléchargée");
    } catch (e) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  if (!isClient || isLoadingStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <h1 className="text-xl font-bold text-white mb-4">Session expirée ou dossier introuvable</h1>
        <Button onClick={() => navigate({ to: "/login" })}>Retour à la connexion</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Area */}
      <header className="relative z-10 px-6 pt-12 pb-8">
        <div className="mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {student.photo_profil ? (
                  <img
                    src={student.photo_profil}
                    className="h-16 w-16 rounded-3xl object-cover ring-2 ring-primary/30 shadow-glow transition-all group-hover:ring-primary group-hover:brightness-75"
                    alt="Profile"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-primary text-2xl font-black text-white shadow-glow transition-all group-hover:brightness-90">
                    {student.prenom[0]}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                />
              </label>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-slate-950 shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Candidat Sarah Auto
              </p>
              <h1 className="text-xl font-black text-white">
                {student.prenom} {student.nom}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="border-white/10 text-white/50 text-[10px]">
                  {student.dossier_code}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="rounded-2xl border-white/5 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-[2rem] p-5 border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Formation
            </p>
            <p className="text-xl font-black text-white mt-1">Permis {student.type_permis}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%]" />
              </div>
              <span className="text-[10px] font-bold text-white/40">65%</span>
            </div>
          </div>
          <div className="glass rounded-[2rem] p-5 border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Compte</p>
            <p className="text-xl font-black text-primary mt-1">{formatXOF(resteAPayer)}</p>
            <p className="text-[10px] font-bold text-white/40 mt-1 uppercase">Reste à solder</p>
          </div>
        </div>

        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-[2rem] p-1.5 h-14 border border-white/5 backdrop-blur-md">
            <TabsTrigger
              value="planning"
              className="rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Planning
            </TabsTrigger>
            <TabsTrigger
              value="infos"
              className="rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold"
            >
              <User className="h-4 w-4 mr-2" />
              Mes Infos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                Mes Cours & Séances
              </h2>
              <Badge className="bg-white/5 text-white/40 border-none">
                {studentPlanning.length} Séances
              </Badge>
            </div>

            {studentPlanning.length === 0 ? (
              <div className="text-center py-16 glass rounded-[2.5rem] border-dashed border-white/10">
                <Clock className="h-10 w-10 text-white/10 mx-auto mb-4" />
                <p className="text-sm text-white/30 font-bold uppercase tracking-widest">
                  Aucune séance prévue
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentPlanning.map((session) => (
                  <div
                    key={session.id}
                    className="group glass p-5 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all duration-500 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                          <Car className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-white text-lg">{session.titre || "Séance de conduite"}</p>
                          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-0.5">
                            {new Date(session.date_heure).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">
                          {new Date(session.date_heure).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                          {session.duree_minutes || 60} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${(session.moniteurs as any)?.nom || "User"}`}
                            alt="Moniteur"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter text-white/30">
                            Moniteur
                          </p>
                          <p className="text-xs font-bold text-white">
                            {(session.moniteurs as any)?.prenom || "À affecter"} {(session.moniteurs as any)?.nom || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.lieu && (
                          <Badge
                            variant="outline"
                            className="border-white/5 text-[10px] text-white/40"
                          >
                            <MapPin className="h-3 w-3 mr-1" /> {session.lieu}
                          </Badge>
                        )}
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-3">
                          {session.type || "Formation"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="infos" className="mt-8 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 px-2">
              Détails de mon profil
            </h2>

            <div className="grid gap-4">
              <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                      Nom complet
                    </p>
                    <p className="font-bold text-white">
                      {student.prenom} {student.nom}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                      Téléphone
                    </p>
                    <p className="font-bold text-white">{formatTel(student.telephone)}</p>
                  </div>
                </div>

                {student.email && (
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                        Email
                      </p>
                      <p className="font-bold text-white">{student.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                      Adresse
                    </p>
                    <p className="font-bold text-white">{student.adresse || "Non renseignée"}</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Identification
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-tighter">
                      Né(e) le
                    </p>
                    <p className="text-sm font-bold text-white">
                      {student.date_naissance
                        ? new Date(student.date_naissance).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-tighter">
                      Sexe
                    </p>
                    <p className="text-sm font-bold text-white">
                      {student.sexe === "M" ? "Masculin" : "Féminin"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-tighter">
                      Type de pièce
                    </p>
                    <p className="text-sm font-bold text-white">{student.type_piece || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-tighter">
                      N° de pièce
                    </p>
                    <p className="text-sm font-bold text-white">{student.num_piece || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <a
          href={`https://wa.me/2250707070707?text=Bonjour,%20je%20suis%20l'élève%20${student.prenom}%20${student.nom}%20(Code:%20${student.dossier_code}).%20J'ai%20une%20question.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-glow text-white transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-4 border-slate-950 flex items-center justify-center text-[8px] font-black">
            1
          </div>
        </a>
      </div>
    </div>
  );
}
