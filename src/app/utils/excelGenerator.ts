import * as XLSX from 'xlsx';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  type?: 'text' | 'number' | 'date' | 'percentage';
  align?: 'left' | 'center' | 'right';
}

export interface ExcelSheet {
  name: string;
  data: any[];
  columns: ExcelColumn[];
  includeStatistics?: boolean;
  conditionalFormatting?: ConditionalFormat[];
}

export interface ConditionalFormat {
  column: string;
  rules: Array<{
    condition: (value: any) => boolean;
    style: {
      bgColor?: string;
      textColor?: string;
      bold?: boolean;
    };
  }>;
}

export interface ExcelMetadata {
  title: string;
  subtitle?: string;
  generatedBy: string;
  date?: string;
}

export class ProfessionalExcelGenerator {
  private workbook: XLSX.WorkBook;
  private currentSheet: XLSX.WorkSheet | null = null;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  addSheet(config: ExcelSheet & { metadata?: ExcelMetadata }): void {
    const wsData: any[][] = [];

    if (config.metadata) {
      wsData.push([config.metadata.title]);
      if (config.metadata.subtitle) {
        wsData.push([config.metadata.subtitle]);
      }
      wsData.push([`Generado por: ${config.metadata.generatedBy}`]);
      wsData.push([`Fecha: ${config.metadata.date || new Date().toLocaleDateString('es-ES')}`]);
      wsData.push([]);
    }

    const headerRow = config.columns.map(col => col.header);
    wsData.push(headerRow);

    config.data.forEach(row => {
      const rowData = config.columns.map(col => {
        const value = row[col.key];

        if (col.type === 'number' && typeof value === 'number') {
          return parseFloat(value.toFixed(2));
        }

        if (col.type === 'percentage' && typeof value === 'number') {
          return value / 100;
        }

        if (col.type === 'date' && value) {
          return new Date(value);
        }

        return value;
      });
      wsData.push(rowData);
    });

    if (config.includeStatistics && config.data.length > 0) {
      wsData.push([]);
      wsData.push(['ESTADÍSTICAS']);

      config.columns.forEach((col, colIndex) => {
        if (col.type === 'number' || col.type === 'percentage') {
          const values = config.data.map(row => row[col.key]).filter(v => typeof v === 'number');

          if (values.length > 0) {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);

            wsData.push([
              `${col.header} - Promedio`,
              colIndex === 0 ? '' : '',
              ...Array(colIndex).fill(''),
              parseFloat(avg.toFixed(2))
            ]);
            wsData.push([
              `${col.header} - Máximo`,
              colIndex === 0 ? '' : '',
              ...Array(colIndex).fill(''),
              parseFloat(max.toFixed(2))
            ]);
            wsData.push([
              `${col.header} - Mínimo`,
              colIndex === 0 ? '' : '',
              ...Array(colIndex).fill(''),
              parseFloat(min.toFixed(2))
            ]);
          }
        }
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const colWidths = config.columns.map(col => ({
      wch: col.width || (col.header.length + 5)
    }));
    ws['!cols'] = colWidths;

    const metadataOffset = config.metadata ? 5 : 0;
    const headerRowIndex = metadataOffset;

    if (config.metadata) {
      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (!ws[titleCell]) ws[titleCell] = { t: 's', v: '' };
      ws[titleCell].s = {
        font: { bold: true, sz: 16, color: { rgb: "3B82F6" } },
        alignment: { horizontal: "left", vertical: "center" }
      };

      for (let i = 1; i <= 3; i++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: 0 });
        if (ws[cell]) {
          ws[cell].s = {
            font: { italic: true, sz: 10, color: { rgb: "6B7280" } },
            alignment: { horizontal: "left" }
          };
        }
      }
    }

    config.columns.forEach((col, colIndex) => {
      const headerCell = XLSX.utils.encode_cell({ r: headerRowIndex, c: colIndex });
      if (!ws[headerCell]) ws[headerCell] = { t: 's', v: col.header };
      ws[headerCell].s = {
        font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "3B82F6" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };

      config.data.forEach((row, rowIndex) => {
        const dataRowIndex = headerRowIndex + 1 + rowIndex;
        const cell = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });

        if (ws[cell]) {
          const cellStyle: any = {
            alignment: { horizontal: col.align || (col.type === 'number' || col.type === 'percentage' ? 'right' : 'left') },
            border: {
              top: { style: "thin", color: { rgb: "E5E7EB" } },
              bottom: { style: "thin", color: { rgb: "E5E7EB" } },
              left: { style: "thin", color: { rgb: "E5E7EB" } },
              right: { style: "thin", color: { rgb: "E5E7EB" } }
            }
          };

          if (rowIndex % 2 === 1) {
            cellStyle.fill = { fgColor: { rgb: "F9FAFB" } };
          }

          if (col.type === 'percentage') {
            ws[cell].z = '0.00%';
          } else if (col.type === 'number') {
            ws[cell].z = '0.00';
          }

          if (config.conditionalFormatting) {
            config.conditionalFormatting.forEach(format => {
              if (format.column === col.key) {
                const value = row[col.key];
                format.rules.forEach(rule => {
                  if (rule.condition(value)) {
                    if (rule.style.bgColor) {
                      cellStyle.fill = { fgColor: { rgb: rule.style.bgColor } };
                    }
                    if (rule.style.textColor) {
                      cellStyle.font = { ...cellStyle.font, color: { rgb: rule.style.textColor } };
                    }
                    if (rule.style.bold) {
                      cellStyle.font = { ...cellStyle.font, bold: true };
                    }
                  }
                });
              }
            });
          }

          ws[cell].s = cellStyle;
        }
      });
    });

    if (config.includeStatistics) {
      const statsStartRow = headerRowIndex + config.data.length + 2;
      const statsHeaderCell = XLSX.utils.encode_cell({ r: statsStartRow, c: 0 });

      if (ws[statsHeaderCell]) {
        ws[statsHeaderCell].s = {
          font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "22C55E" } },
          alignment: { horizontal: "left", vertical: "center" }
        };
      }
    }

    this.currentSheet = ws;
    XLSX.utils.book_append_sheet(this.workbook, ws, config.name);
  }

  save(filename: string): void {
    XLSX.writeFile(this.workbook, filename);
  }

  getWorkbook(): XLSX.WorkBook {
    return this.workbook;
  }
}

export function generateExcel(config: {
  filename: string;
  sheets: Array<ExcelSheet & { metadata?: ExcelMetadata }>;
}): void {
  const excel = new ProfessionalExcelGenerator();

  config.sheets.forEach(sheet => {
    excel.addSheet(sheet);
  });

  excel.save(config.filename);
}

export function gradeConditionalFormat(): ConditionalFormat {
  return {
    column: 'final',
    rules: [
      {
        condition: (value: number) => value >= 4.5,
        style: { bgColor: 'D1FAE5', textColor: '065F46', bold: true }
      },
      {
        condition: (value: number) => value >= 4.0 && value < 4.5,
        style: { bgColor: 'DBEAFE', textColor: '1E40AF' }
      },
      {
        condition: (value: number) => value >= 3.5 && value < 4.0,
        style: { bgColor: 'FEF3C7', textColor: '92400E' }
      },
      {
        condition: (value: number) => value >= 3.0 && value < 3.5,
        style: { bgColor: 'FED7AA', textColor: '9A3412' }
      },
      {
        condition: (value: number) => value < 3.0,
        style: { bgColor: 'FEE2E2', textColor: '991B1B', bold: true }
      }
    ]
  };
}

export function attendanceConditionalFormat(): ConditionalFormat {
  return {
    column: 'porcentajeAsistencia',
    rules: [
      {
        condition: (value: number) => value >= 90,
        style: { bgColor: 'D1FAE5', textColor: '065F46', bold: true }
      },
      {
        condition: (value: number) => value >= 80 && value < 90,
        style: { bgColor: 'DBEAFE', textColor: '1E40AF' }
      },
      {
        condition: (value: number) => value >= 70 && value < 80,
        style: { bgColor: 'FEF3C7', textColor: '92400E' }
      },
      {
        condition: (value: number) => value < 70,
        style: { bgColor: 'FEE2E2', textColor: '991B1B', bold: true }
      }
    ]
  };
}
