import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import "../_libs/sonner.mjs";
import { f as formatXOF } from "./router-CQ4OfHlr.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region dist/server/assets/pdf-generator-BcRW9Xdi.js
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min(), 1);
require_jsx_runtime();
require_react();
const generateInvoicePDF = async (data) => {
	try {
		const doc = new import_jspdf_node_min.default();
		const margin = 20;
		doc.setFontSize(22);
		doc.setTextColor(59, 130, 246);
		doc.text("SARAH AUTO", margin, 30);
		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text("Auto-école & Centre de Formation", margin, 37);
		doc.text("Abidjan, Côte d'Ivoire", margin, 42);
		doc.text("Contact: +225 07 07 07 07 07", margin, 47);
		doc.setFontSize(18);
		doc.setTextColor(0);
		doc.text("FACTURE", 140, 30);
		doc.setFontSize(10);
		doc.text(`N°: ${data.numero}`, 140, 40);
		doc.text(`Date: ${new Date(data.date).toLocaleDateString("fr-FR")}`, 140, 45);
		doc.setDrawColor(230);
		doc.line(margin, 55, 190, 55);
		doc.setFontSize(12);
		doc.text("DESTINATAIRE :", margin, 65);
		doc.setFontSize(10);
		doc.setFont("helvetica", "bold");
		doc.text(`${data.eleve.prenom} ${data.eleve.nom}`, margin, 72);
		doc.setFont("helvetica", "normal");
		doc.text(`Tel: ${data.eleve.telephone}`, margin, 77);
		if (data.eleve.adresse) doc.text(data.eleve.adresse, margin, 82);
		autoTable(doc, {
			startY: 95,
			head: [["Désignation", "Montant (FCFA)"]],
			body: [[`Formation : ${data.formation}`, formatXOF(data.montant)]],
			headStyles: {
				fillColor: [
					59,
					130,
					246
				],
				textColor: [
					255,
					255,
					255
				]
			},
			bodyStyles: { fontSize: 10 },
			columnStyles: { 1: { halign: "right" } }
		});
		const lastY = doc.lastAutoTable?.finalY || 110;
		doc.setFontSize(12);
		doc.text("HISTORIQUE DES PAIEMENTS :", margin, lastY + 15);
		const paymentsBody = data.paiements.map((p) => [
			new Date(p.date).toLocaleDateString("fr-FR"),
			p.mode,
			formatXOF(p.montant)
		]);
		autoTable(doc, {
			startY: lastY + 20,
			head: [[
				"Date",
				"Mode",
				"Montant"
			]],
			body: paymentsBody.length > 0 ? paymentsBody : [[
				"-",
				"-",
				"Aucun paiement"
			]],
			headStyles: {
				fillColor: [
					240,
					240,
					240
				],
				textColor: [
					0,
					0,
					0
				]
			},
			bodyStyles: { fontSize: 9 },
			columnStyles: { 2: { halign: "right" } }
		});
		const totalPaid = data.paiements.reduce((sum, p) => sum + p.montant, 0);
		const remaining = Math.max(0, data.montant - totalPaid);
		const summaryY = doc.lastAutoTable?.finalY + 15;
		doc.setFontSize(10);
		doc.text(`Total déjà payé :`, 130, summaryY);
		doc.text(formatXOF(totalPaid), 190, summaryY, { align: "right" });
		doc.setFontSize(12);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(remaining > 0 ? 245 : 34, remaining > 0 ? 158 : 197, remaining > 0 ? 11 : 94);
		doc.text(`RESTE À PAYER :`, 130, summaryY + 10);
		doc.text(formatXOF(remaining), 190, summaryY + 10, { align: "right" });
		doc.setFontSize(8);
		doc.setFont("helvetica", "italic");
		doc.setTextColor(150);
		doc.text("Merci pour votre confiance.", 105, 280, { align: "center" });
		doc.text("SARAH AUTO - Logiciel de gestion v2.0", 105, 285, { align: "center" });
		doc.save(`Facture_${data.numero}.pdf`);
		return true;
	} catch (error) {
		console.error("PDF Generation error:", error);
		throw error;
	}
};
//#endregion
export { generateInvoicePDF };
