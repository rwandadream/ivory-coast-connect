import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { createWorker } from "tesseract.js";
import { Camera, RefreshCw, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CniScannerProps {
  onScanComplete: (data: { nom: string; prenom: string; date_naissance: string }) => void;
  onClose: () => void;
}

export function CniScanner({ onScanComplete, onClose }: CniScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const processImage = async () => {
    if (!imgSrc) return;
    setIsProcessing(true);
    toast.info("Analyse de la CNI en cours...");

    try {
      const worker = await createWorker("fra");
      const {
        data: { text },
      } = await worker.recognize(imgSrc);
      await worker.terminate();

      console.log("OCR Result:", text);

      // Simple parsing logic for CNI (needs to be adapted based on actual CNI format)
      // This is a basic example extracting words that look like names
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 2);

      let nom = "";
      let prenom = "";
      let dob = "";

      // Heuristic: Look for keywords or patterns
      lines.forEach((line) => {
        const l = line.toUpperCase();
        if (l.includes("NOM") || l.includes("SURNAME")) {
          nom = line.split(":").pop()?.trim() || line.split(" ").slice(1).join(" ");
        } else if (l.includes("PRENOM") || l.includes("GIVEN NAMES")) {
          prenom = line.split(":").pop()?.trim() || line.split(" ").slice(1).join(" ");
        } else if (/\d{2}[/.]\d{2}[/.]\d{4}/.test(line)) {
          const match = line.match(/\d{2}[/.]\d{2}[/.]\d{4}/);
          if (match) dob = match[0].replace(/\./g, "-").split("-").reverse().join("-");
        }
      });

      // Fallback if patterns not found: take first few lines
      if (!nom && lines.length > 0) nom = lines[0];
      if (!prenom && lines.length > 1) prenom = lines[1];

      onScanComplete({
        nom: nom.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim(),
        prenom: prenom.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim(),
        date_naissance: dob || "",
      });

      toast.success("Analyse terminée !");
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Échec de l'analyse. Essayez de taper manuellement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-3xl border border-slate-800">
      <div className="relative w-full aspect-[1.6/1] overflow-hidden rounded-2xl bg-black ring-2 ring-primary/20">
        {!imgSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={imgSrc} alt="Capture" className="h-full w-full object-cover" />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-sm font-bold uppercase tracking-widest">IA en cours...</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full">
        {!imgSrc ? (
          <>
            <Button onClick={onClose} variant="ghost" className="flex-1 rounded-xl text-slate-400">
              Annuler
            </Button>
            <Button onClick={capture} className="flex-2 gap-2 bg-primary rounded-xl px-8">
              <Camera className="h-5 w-5" /> Capturer
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setImgSrc(null)}
              variant="outline"
              className="flex-1 gap-2 rounded-xl border-slate-700"
              disabled={isProcessing}
            >
              <RefreshCw className="h-4 w-4" /> Refaire
            </Button>
            <Button
              onClick={processImage}
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700 rounded-xl"
              disabled={isProcessing}
            >
              <Check className="h-4 w-4" /> Valider & Analyser
            </Button>
          </>
        )}
      </div>

      <p className="text-[10px] text-slate-500 text-center px-4">
        Placez la CNI bien à plat dans le cadre et assurez-vous d'avoir un bon éclairage.
      </p>
    </div>
  );
}
