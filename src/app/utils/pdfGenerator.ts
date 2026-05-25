import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFHeaderOptions {
  title: string;
  subtitle?: string;
  reportType: string;
  generatedBy: string;
  period?: string;
}

export interface PDFKPICard {
  label: string;
  value: string | number;
  color?: string;
}

export interface PDFTableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PDFChartData {
  type: 'bar' | 'pie';
  title: string;
  data: any[];
  labels?: string[];
}

export class InstitutionalPDFGenerator {
  private doc: jsPDF;
  private currentY: number = 0;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 14;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  addInstitutionalHeader(options: PDFHeaderOptions): void {
    this.doc.setFillColor(17, 24, 39);
    this.doc.rect(0, 0, this.pageWidth, 50, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.text('Sistema Académico Institucional', this.pageWidth / 2, 18, { align: 'center' });

    this.doc.setFontSize(16);
    this.doc.text(options.title, this.pageWidth / 2, 30, { align: 'center' });

    if (options.subtitle) {
      this.doc.setFontSize(12);
      this.doc.text(options.subtitle, this.pageWidth / 2, 42, { align: 'center' });
    }

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);

    this.currentY = 60;

    this.doc.text(`Tipo de Reporte: ${options.reportType}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, this.margin, this.currentY);
    this.currentY += 6;

    if (options.period) {
      this.doc.text(`Período: ${options.period}`, this.margin, this.currentY);
      this.currentY += 6;
    }

    this.doc.text(`Generado por: ${options.generatedBy}`, this.margin, this.currentY);
    this.currentY += 12;

    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  addKPICards(kpis: PDFKPICard[]): void {
    const cardsPerRow = 3;
    const cardWidth = (this.pageWidth - (this.margin * 2) - ((cardsPerRow - 1) * 8)) / cardsPerRow;
    const cardHeight = 28;

    this.doc.setFontSize(12);
    this.doc.setTextColor(59, 130, 246);
    this.doc.text('Indicadores Clave', this.margin, this.currentY);
    this.currentY += 8;

    kpis.forEach((kpi, index) => {
      const col = index % cardsPerRow;
      const row = Math.floor(index / cardsPerRow);
      const x = this.margin + (col * (cardWidth + 8));
      const y = this.currentY + (row * (cardHeight + 6));

      this.doc.setFillColor(249, 250, 251);
      this.doc.setDrawColor(229, 231, 235);
      this.doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');

      this.doc.setFontSize(10);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(kpi.label, x + 4, y + 8);

      this.doc.setFontSize(18);
      const color = kpi.color || '59,130,246';
      const [r, g, b] = color.split(',').map(Number);
      this.doc.setTextColor(r, g, b);
      this.doc.text(String(kpi.value), x + 4, y + 22);
    });

    const totalRows = Math.ceil(kpis.length / cardsPerRow);
    this.currentY += (totalRows * (cardHeight + 6)) + 8;
  }

  addSectionTitle(title: string): void {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;
  }

  addProfessionalTable(columns: PDFTableColumn[], data: any[], options?: {
    headerColor?: [number, number, number];
    alternateRows?: boolean;
  }): void {
    this.checkPageBreak(40);

    const headerColor = options?.headerColor || [59, 130, 246];

    autoTable(this.doc, {
      startY: this.currentY,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey])),
      theme: 'grid',
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [31, 41, 55],
      },
      alternateRowStyles: options?.alternateRows !== false ? {
        fillColor: [249, 250, 251],
      } : undefined,
      columnStyles: columns.reduce((acc, col, idx) => {
        if (col.width) {
          acc[idx] = { cellWidth: col.width };
        }
        return acc;
      }, {} as any),
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  addStatisticsBox(stats: Array<{ label: string; value: string | number }>): void {
    this.checkPageBreak(40);

    this.doc.setFillColor(240, 253, 244);
    this.doc.setDrawColor(134, 239, 172);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 10 + (stats.length * 8), 3, 3, 'FD');

    this.doc.setFontSize(12);
    this.doc.setTextColor(22, 101, 52);
    this.doc.text('Estadísticas', this.margin + 4, this.currentY + 6);

    this.currentY += 12;

    stats.forEach((stat, index) => {
      this.doc.setFontSize(10);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text(`${stat.label}:`, this.margin + 4, this.currentY);

      this.doc.setTextColor(22, 101, 52);
      this.doc.text(String(stat.value), this.margin + 70, this.currentY);

      this.currentY += 6;
    });

    this.currentY += 8;
  }

  addTextBlock(text: string, options?: { fontSize?: number; color?: [number, number, number] }): void {
    this.checkPageBreak(20);

    this.doc.setFontSize(options?.fontSize || 10);
    const color = options?.color || [31, 41, 55];
    this.doc.setTextColor(color[0], color[1], color[2]);

    const lines = this.doc.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    this.doc.text(lines, this.margin, this.currentY);

    this.currentY += (lines.length * 6) + 4;
  }

  addPageBreak(): void {
    this.doc.addPage();
    this.currentY = 20;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.addPageBreak();
    }
  }

  addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      this.doc.setDrawColor(229, 231, 235);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.pageHeight - 20, this.pageWidth - this.margin, this.pageHeight - 20);

      this.doc.setFontSize(8);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 12,
        { align: 'center' }
      );

      this.doc.text(
        'Sistema Académico Institucional - Documento Oficial',
        this.pageWidth / 2,
        this.pageHeight - 6,
        { align: 'center' }
      );
    }
  }

  save(filename: string): void {
    this.addFooter();
    this.doc.save(filename);
  }

  getDocument(): jsPDF {
    this.addFooter();
    return this.doc;
  }
}

export function generatePDF(config: {
  header: PDFHeaderOptions;
  kpis?: PDFKPICard[];
  sections: Array<{
    title?: string;
    type: 'table' | 'statistics' | 'text';
    data: any;
    columns?: PDFTableColumn[];
  }>;
  filename: string;
}): void {
  const pdf = new InstitutionalPDFGenerator();

  pdf.addInstitutionalHeader(config.header);

  if (config.kpis && config.kpis.length > 0) {
    pdf.addKPICards(config.kpis);
  }

  config.sections.forEach(section => {
    if (section.title) {
      pdf.addSectionTitle(section.title);
    }

    switch (section.type) {
      case 'table':
        if (section.columns) {
          pdf.addProfessionalTable(section.columns, section.data);
        }
        break;
      case 'statistics':
        pdf.addStatisticsBox(section.data);
        break;
      case 'text':
        pdf.addTextBlock(section.data);
        break;
    }
  });

  pdf.save(config.filename);
}
