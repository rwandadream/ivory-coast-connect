import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type ExamenSession, type ExamenSessionEleve } from "@/lib/store";

export const generateBordereauPDF = async (
  session: ExamenSession,
  eleves: ExamenSessionEleve[],
) => {
  try {
    const doc = new jsPDF();
    const margin = 20;

    // Header - SARAH AUTO
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Primary Blue
    doc.setFont("helvetica", "bold");
    doc.text("SARAH AUTO-ÉCOLE", margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Formation et recyclage des conducteurs professionnels", margin, 32);
    doc.text("Permis de conduire toutes catégories", margin, 37);

    // Document Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    const title = `BORDEREAU D'EXAMEN DE ${session.type_examen.toUpperCase()}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (210 - titleWidth) / 2, 55);

    // Session Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Left Column
    doc.text(`N° BORDEREAU : ${session.numero_bordereau}`, margin, 70);
    doc.text(
      `DATE : ${format(new Date(session.date_examen), "dd MMMM yyyy", { locale: fr })}`,
      margin,
      77,
    );
    doc.text(`HEURE : ${session.heure_examen.slice(0, 5)}`, margin, 84);

    // Right Column
    doc.text(`CENTRE : ${session.centre}`, 120, 70);
    doc.text(`LIEU : ${session.lieu}`, 120, 77);
    doc.text(`CATÉGORIE : ${session.categorie}`, 120, 84);

    // Table
    const tableBody = eleves.map((e, index) => [
      index + 1,
      e.nom_complet,
      e.identifiant,
      e.categorie_permis,
      "", // Signature/Note space
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["N°", "NOM ET PRÉNOMS", "IDENTIFIANT (CNI/DOSSIER)", "CAT.", "OBSERVATIONS"]],
      body: tableBody,
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        minCellHeight: 10,
        valign: "middle",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { halign: "center", cellWidth: 50 },
        3: { halign: "center", cellWidth: 15 },
        4: { cellWidth: 35 },
      },
      theme: "grid",
    });

    // Footer - Signatures
    const finalY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("L'Auto-école", margin + 10, finalY);
    doc.text("L'Inspecteur", 140, finalY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    const footerText = `Généré le ${format(new Date(), "dd/MM/yyyy HH:mm")} - Logiciel SARAH AUTO v2.0`;
    doc.text(footerText, 105, 285, { align: "center" });

    // Download
    doc.save(`Bordereau_${session.numero_bordereau}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Generation error:", error);
    throw error;
  }
};
