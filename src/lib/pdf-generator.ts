import { formatXOF } from "./store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = async (data: {
  numero: string;
  date: string;
  eleve: { nom: string; prenom: string; telephone: string; adresse?: string };
  formation: string;
  montant: number;
  paiements: Array<{ date: string; montant: number; mode: string }>;
}) => {
  try {
    const doc = new jsPDF();
    const margin = 20;

    // Header - Company Info
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Primary Blue
    doc.text("SARAH AUTO", margin, 30);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Auto-école & Centre de Formation", margin, 37);
    doc.text("Abidjan, Côte d'Ivoire", margin, 42);
    doc.text("Contact: +225 07 07 07 07 07", margin, 47);

    // Invoice Title & Info
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("FACTURE", 140, 30);

    doc.setFontSize(10);
    doc.text(`N°: ${data.numero}`, 140, 40);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString("fr-FR")}`, 140, 45);

    // Divider
    doc.setDrawColor(230);
    doc.line(margin, 55, 190, 55);

    // Client Info
    doc.setFontSize(12);
    doc.text("DESTINATAIRE :", margin, 65);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${data.eleve.prenom} ${data.eleve.nom}`, margin, 72);
    doc.setFont("helvetica", "normal");
    doc.text(`Tel: ${data.eleve.telephone}`, margin, 77);
    if (data.eleve.adresse) doc.text(data.eleve.adresse, margin, 82);

    // Table of Services
    autoTable(doc, {
      startY: 95,
      head: [["Désignation", "Montant (FCFA)"]],
      body: [[`Formation : ${data.formation}`, formatXOF(data.montant)]],
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 1: { halign: "right" } },
    });

    // Payments Table
    const lastY = (doc as any).lastAutoTable?.finalY || 110;
    doc.setFontSize(12);
    doc.text("HISTORIQUE DES PAIEMENTS :", margin, lastY + 15);

    const paymentsBody = data.paiements.map((p) => [
      new Date(p.date).toLocaleDateString("fr-FR"),
      p.mode,
      formatXOF(p.montant),
    ]);

    autoTable(doc, {
      startY: lastY + 20,
      head: [["Date", "Mode", "Montant"]],
      body: paymentsBody.length > 0 ? paymentsBody : [["-", "-", "Aucun paiement"]],
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 2: { halign: "right" } },
    });

    // Summary
    const totalPaid = data.paiements.reduce((sum, p) => sum + p.montant, 0);
    const remaining = Math.max(0, data.montant - totalPaid);
    const summaryY = (doc as any).lastAutoTable?.finalY + 15;

    doc.setFontSize(10);
    doc.text(`Total déjà payé :`, 130, summaryY);
    doc.text(formatXOF(totalPaid), 190, summaryY, { align: "right" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(remaining > 0 ? 245 : 34, remaining > 0 ? 158 : 197, remaining > 0 ? 11 : 94);
    doc.text(`RESTE À PAYER :`, 130, summaryY + 10);
    doc.text(formatXOF(remaining), 190, summaryY + 10, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Merci pour votre confiance.", 105, 280, { align: "center" });
    doc.text("SARAH AUTO - Logiciel de gestion v2.0", 105, 285, { align: "center" });

    // Save/Download
    doc.save(`Facture_${data.numero}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Generation error:", error);
    throw error;
  }
};
