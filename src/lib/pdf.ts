import { jsPDF } from "jspdf";
import { momentLabel } from "@/lib/moments";
import type { Entry, Patient, WeekCompliance } from "@/lib/data";

const MARGIN = 14;
const PAGE_WIDTH = 210; // A4 portrait, mm
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export function exportPatientSummaryPDF(
  patient: Patient,
  entries: Entry[],
  weeks: WeekCompliance[],
  cumulative: number
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(60, 42, 114);
  doc.text("Reporte de cumplimiento", MARGIN, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Ejercicio de masticación y deglución · Dra. Sandra Ardila", MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text(patient.name, MARGIN, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  const contact = [patient.phone, patient.email].filter(Boolean).join(" · ");
  if (contact) {
    doc.text(contact, MARGIN, y);
    y += 6;
  }

  const moments = patient.requiredMoments.map(momentLabel).join(", ") || "Ninguno";
  doc.text(`Momentos prescritos: ${moments}`, MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(60, 42, 114);
  doc.text(`Cumplimiento acumulado: ${cumulative}%`, MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Cumplimiento semanal", MARGIN, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(90, 90, 90);
  doc.text("Semana", MARGIN, y);
  doc.text("Rango", MARGIN + 35, y);
  doc.text("Cumplimiento", MARGIN + 100, y);
  y += 1.5;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  for (const week of weeks) {
    ensureSpace(6);
    doc.text(week.label, MARGIN, y);
    doc.text(`${week.startDate} a ${week.endDate}`, MARGIN + 35, y);
    doc.text(`${week.compliance}%`, MARGIN + 100, y);
    y += 6;
  }

  y += 6;
  ensureSpace(10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Registro detallado", MARGIN, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(90, 90, 90);
  doc.text("Fecha", MARGIN, y);
  doc.text("Momento", MARGIN + 30, y);
  doc.text("Alimento", MARGIN + 70, y);
  y += 1.5;
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  if (entries.length === 0) {
    doc.text("Este paciente aún no tiene registros.", MARGIN, y);
    y += 6;
  } else {
    for (const entry of entries) {
      ensureSpace(6);
      doc.text(entry.date, MARGIN, y);
      doc.text(momentLabel(entry.moment), MARGIN + 30, y);
      const food = entry.food.length > 45 ? entry.food.slice(0, 42) + "..." : entry.food;
      doc.text(food, MARGIN + 70, y);
      y += 6;
    }
  }

  doc.save(`${patient.name.replace(/\s+/g, "_")}_reporte.pdf`);
}
