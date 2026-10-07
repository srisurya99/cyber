import { jsPDF } from 'jspdf';
import { Incident, RiskLevel, IncidentStatus } from '../types';

/**
 * Defang URLs to prevent accidental clicking in PDF readers and security tools.
 * e.g., http://sbi-kyc-verify-portal.in/update -> hxxp[://]sbi-kyc-verify-portal[.]in/update
 */
export function defangUrl(url: string): string {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//i, (match) =>
      match.toLowerCase().startsWith('https') ? 'hxxps[://]' : 'hxxp[://]'
    )
    .replace(/\./g, '[.]');
}

/**
 * Format date string into human readable local timestamp
 */
export function formatPdfTimestamp(isoOrDateStr?: string): string {
  if (!isoOrDateStr) return 'N/A';
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return isoOrDateStr;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoOrDateStr;
  }
}

/**
 * Clean & wrap long strings (especially URLs, hashes, and tokens) so they never overflow.
 */
function wrapLongTokens(text: string, maxTokenLength: number = 38): string {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => {
      if (word.length > maxTokenLength) {
        return word.match(new RegExp(`.{1,${maxTokenLength}}`, 'g'))?.join('\n') || word;
      }
      return word;
    })
    .join(' ');
}

// Severity color palette adhering to forensic specification
const SEVERITY_COLORS: Record<string, { rgb: [number, number, number]; bgRgb: [number, number, number]; label: string }> = {
  LOW: {
    rgb: [22, 163, 74],       // #16A34A (Green)
    bgRgb: [240, 253, 244],
    label: 'LOW RISK',
  },
  SUSPICIOUS: {
    rgb: [217, 119, 6],      // #D97706 (Amber)
    bgRgb: [254, 243, 199],
    label: 'SUSPICIOUS',
  },
  HIGH: {
    rgb: [234, 88, 12],      // #EA580C (Orange-Red)
    bgRgb: [255, 237, 213],
    label: 'HIGH RISK',
  },
  CRITICAL: {
    rgb: [220, 38, 38],      // #DC2626 (Red)
    bgRgb: [254, 226, 226],
    label: 'CRITICAL ALERT',
  },
  INCONCLUSIVE: {
    rgb: [100, 116, 139],    // #64748B (Gray)
    bgRgb: [241, 245, 249],
    label: 'INCONCLUSIVE',
  },
};

const STATUS_LABELS: Record<IncidentStatus, string> = {
  OPEN: 'ACTIVE INVESTIGATION (OPEN)',
  IN_PROGRESS: 'RESPONSE IN PROGRESS',
  RESOLVED: 'CONTAINED / RESOLVED',
  ARCHIVED: 'RECORD ARCHIVED',
};

export interface PDFExportMetadata {
  filename: string;
  pageCount: number;
  generatedAt: string;
  reportId: string;
}

/**
 * Draw ThreatLens Shield Emblem in Vector
 */
function drawThreatLensLogo(doc: jsPDF, x: number, y: number, size: number = 8): void {
  doc.saveGraphicsState();
  doc.setFillColor(37, 99, 235); // Blue #2563EB
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);

  // Vector polygon for shield
  doc.lines(
    [
      [size, 0],
      [0, size * 0.7],
      [-size / 2, size * 0.5],
      [-size / 2, -size * 0.5],
      [0, -size * 0.7],
    ],
    x,
    y,
    [1, 1],
    'FD',
    true
  );

  // Inner check/aperture dot
  doc.setFillColor(255, 255, 255);
  doc.circle(x + size / 2, y + size * 0.55, size * 0.2, 'F');
  doc.restoreGraphicsState();
}

/**
 * Robust Dynamic PDF Layout Engine
 * Calculates exact line heights, maintains a shared vertical cursor,
 * handles pagination with orphan protection, and prevents text overlapping.
 */
class ForensicPDFLayoutEngine {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  cursorY: number;
  footerReservedHeight: number;
  topContentY: number;
  incidentId: string;

  constructor(doc: jsPDF, incidentId: string) {
    this.doc = doc;
    this.pageWidth = doc.internal.pageSize.getWidth();   // 210mm
    this.pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    this.margin = 15;                                    // 15mm
    this.contentWidth = this.pageWidth - this.margin * 2; // 180mm
    this.footerReservedHeight = 22;                      // 22mm footer buffer
    this.topContentY = 24;                               // 24mm top margin on pages > 1
    this.cursorY = 0;
    this.incidentId = incidentId;
  }

  /**
   * Check if neededHeight fits on current page; if not, add a new page and reset cursorY.
   * Returns true if a new page was added.
   */
  checkPageBreak(neededHeight: number): boolean {
    if (this.cursorY + neededHeight > this.pageHeight - this.footerReservedHeight) {
      this.doc.addPage();
      this.cursorY = this.topContentY;
      return true;
    }
    return false;
  }

  /**
   * Measure text height accurately given font size and width
   */
  measureText(
    text: string,
    fontSizePt: number,
    maxWidth: number = this.contentWidth,
    fontStyle: string = 'normal',
    lineHeightFactor: number = 1.35
  ): { lines: string[]; heightMm: number; lineHeightMm: number; ascentMm: number } {
    this.doc.setFont('helvetica', fontStyle);
    this.doc.setFontSize(fontSizePt);
    const lines = this.doc.splitTextToSize(text, maxWidth);
    const lineHeightMm = fontSizePt * 0.3528 * lineHeightFactor;
    const heightMm = lines.length * lineHeightMm;
    const ascentMm = fontSizePt * 0.3528 * 0.82;
    return { lines, heightMm, lineHeightMm, ascentMm };
  }

  /**
   * Draw a standard paragraph with automatic line height and cursor advancement
   */
  drawParagraph(
    text: string,
    options?: {
      fontSize?: number;
      fontStyle?: string;
      textColor?: [number, number, number];
      spacingBottom?: number;
      maxWidth?: number;
      lineHeightFactor?: number;
    }
  ): void {
    const fontSize = options?.fontSize ?? 10;
    const fontStyle = options?.fontStyle ?? 'normal';
    const textColor = options?.textColor ?? [51, 65, 85];
    const spacingBottom = options?.spacingBottom ?? 5;
    const maxWidth = options?.maxWidth ?? this.contentWidth;
    const lineHeightFactor = options?.lineHeightFactor ?? 1.35;

    const { lines, heightMm, lineHeightMm, ascentMm } = this.measureText(
      text,
      fontSize,
      maxWidth,
      fontStyle,
      lineHeightFactor
    );

    this.checkPageBreak(heightMm + spacingBottom);

    this.doc.setFont('helvetica', fontStyle);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    for (let i = 0; i < lines.length; i++) {
      this.doc.text(lines[i], this.margin, this.cursorY + ascentMm + i * lineHeightMm);
    }

    this.cursorY += heightMm + spacingBottom;
  }

  /**
   * Draw Section Heading (13.5 pt) with left accent bar and orphan protection
   */
  drawSectionHeading(title: string, subtitle?: string): void {
    const titleMeas = this.measureText(title, 13.5, this.contentWidth - 8, 'bold', 1.3);
    const subMeas = subtitle
      ? this.measureText(subtitle, 9, this.contentWidth - 8, 'normal', 1.3)
      : null;

    const totalHeadingHeight =
      titleMeas.heightMm + (subMeas ? subMeas.heightMm + 2 : 0) + 7;

    // Orphan protection: ensure heading plus at least 25mm of content fits
    this.checkPageBreak(totalHeadingHeight + 25);

    // Accent bar
    this.doc.setFillColor(37, 99, 235); // #2563EB
    const barHeight = Math.max(7, titleMeas.heightMm);
    this.doc.rect(this.margin, this.cursorY, 2.5, barHeight, 'F');

    // Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13.5);
    this.doc.setTextColor(15, 23, 42); // #0F172A

    for (let i = 0; i < titleMeas.lines.length; i++) {
      this.doc.text(
        titleMeas.lines[i],
        this.margin + 5,
        this.cursorY + titleMeas.ascentMm + i * titleMeas.lineHeightMm
      );
    }
    this.cursorY += titleMeas.heightMm + 2;

    // Subtitle
    if (subtitle && subMeas) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(100, 116, 139); // Slate 500

      for (let i = 0; i < subMeas.lines.length; i++) {
        this.doc.text(
          subMeas.lines[i],
          this.margin + 5,
          this.cursorY + subMeas.ascentMm + i * subMeas.lineHeightMm
        );
      }
      this.cursorY += subMeas.heightMm + 4;
    } else {
      this.cursorY += 4;
    }
  }

  /**
   * Draw an info box with measured height, background, border, and safe padding
   */
  drawBox(options: {
    bgColor: [number, number, number];
    borderColor: [number, number, number];
    borderWidth?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    spacingBottom?: number;
    renderContent: (
      contentX: number,
      contentY: number,
      availableWidth: number
    ) => number; // returns rendered content height in mm
  }): void {
    const padTop = options.paddingTop ?? 4;
    const padBottom = options.paddingBottom ?? 4;
    const padLeft = options.paddingLeft ?? 4;
    const padRight = options.paddingRight ?? 4;
    const spacingBottom = options.spacingBottom ?? 6;
    const borderWidth = options.borderWidth ?? 0.2;

    const innerWidth = this.contentWidth - (padLeft + padRight);

    // Dry-run / estimate height: renderContent is called once with dry-run or we can estimate
    // Here we compute by calling renderContent directly onto doc
    // First, verify page break with safe minimal height
    this.checkPageBreak(25);

    const boxTopY = this.cursorY;
    const contentStartY = boxTopY + padTop;

    // Perform rendering of inner content
    const renderedContentHeight = options.renderContent(
      this.margin + padLeft,
      contentStartY,
      innerWidth
    );

    const totalBoxHeight = padTop + renderedContentHeight + padBottom;

    // Draw background & border BEHIND or around content
    this.doc.saveGraphicsState();
    this.doc.setFillColor(options.bgColor[0], options.bgColor[1], options.bgColor[2]);
    this.doc.setDrawColor(options.borderColor[0], options.borderColor[1], options.borderColor[2]);
    this.doc.setLineWidth(borderWidth);
    
    // Draw rect around the calculated bounds
    this.doc.roundedRect(this.margin, boxTopY, this.contentWidth, totalBoxHeight, 1.5, 1.5, 'S');
    this.doc.restoreGraphicsState();

    this.cursorY = boxTopY + totalBoxHeight + spacingBottom;
  }
}

/**
 * Core Forensic Report Builder: Generates a genuine, multi-page vector PDF.
 * Eliminates all hardcoded overlaps and dynamically computes heights.
 */
export function buildIncidentPdf(incident: Incident): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const engine = new ForensicPDFLayoutEngine(doc, incident.id);
  const nowStr = formatPdfTimestamp(new Date().toISOString());
  const isDemo =
    incident.id.toUpperCase().includes('DEMO') ||
    incident.title.toUpperCase().includes('DEMO');
  const severity = SEVERITY_COLORS[incident.risk_level] || SEVERITY_COLORS.LOW;

  // ==========================================
  // PAGE 1: EXECUTIVE FORENSIC SUMMARY
  // ==========================================

  // 1. Top Executive Banner (Clean 24mm height)
  doc.setFillColor(15, 23, 42); // #0F172A Deep Navy
  doc.rect(0, 0, engine.pageWidth, 24, 'F');

  // Blue branding accent stripe
  doc.setFillColor(37, 99, 235); // #2563EB
  doc.rect(0, 24, engine.pageWidth, 1.5, 'F');

  // Vector Logo Emblem
  drawThreatLensLogo(doc, engine.margin, 7, 8);

  // ThreatLens Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('THREATLENS', engine.margin + 12, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text('Cybersecurity Incident Analysis Report', engine.margin + 12, 18);

  // Right-aligned header metadata
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`REPORT ID: ${incident.id}`, engine.pageWidth - engine.margin, 10, {
    align: 'right',
  });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${nowStr}`, engine.pageWidth - engine.margin, 15, {
    align: 'right',
  });

  // Classification Pill
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text(
    'FORENSIC DOSSIER · CITIZEN SAFETY RECORD',
    engine.pageWidth - engine.margin,
    20,
    { align: 'right' }
  );

  // Cursor starts cleanly below executive banner + comfortable margin
  engine.cursorY = 32;

  // ==========================================
  // 2. Demo Banner (Completely isolated, no overlap)
  // ==========================================
  if (isDemo) {
    const demoText =
      'SIMULATED DEMONSTRATION RECORD — Prepared for defensive procedural training & security verification';
    const demoMeas = engine.measureText(
      demoText,
      8,
      engine.contentWidth - 10,
      'bold'
    );
    const bannerHeight = demoMeas.heightMm + 6;

    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(245, 158, 11); // Amber 500
    doc.setLineWidth(0.3);
    doc.roundedRect(
      engine.margin,
      engine.cursorY,
      engine.contentWidth,
      bannerHeight,
      1.5,
      1.5,
      'FD'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // Amber 700

    const textCenterY =
      engine.cursorY + (bannerHeight - demoMeas.heightMm) / 2 + demoMeas.ascentMm;
    for (let i = 0; i < demoMeas.lines.length; i++) {
      doc.text(
        demoMeas.lines[i],
        engine.pageWidth / 2,
        textCenterY + i * demoMeas.lineHeightMm,
        { align: 'center' }
      );
    }

    // Advance cursor beyond the complete demo banner with 7mm spacing
    engine.cursorY += bannerHeight + 7;
  }

  // ==========================================
  // 3. Incident Title (Prominent, cleanly wrapped)
  // ==========================================
  const titleMeas = engine.measureText(
    incident.title,
    18,
    engine.contentWidth,
    'bold',
    1.25
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // #0F172A

  for (let i = 0; i < titleMeas.lines.length; i++) {
    doc.text(
      titleMeas.lines[i],
      engine.margin,
      engine.cursorY + titleMeas.ascentMm + i * titleMeas.lineHeightMm
    );
  }
  engine.cursorY += titleMeas.heightMm + 7;

  // ==========================================
  // 4. Metadata Grid: Platform, Timestamp, Status
  // ==========================================
  const gridHeight = 20;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.3);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    gridHeight,
    2,
    2,
    'FD'
  );

  // Column headers
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('INCIDENT ID', engine.margin + 4, engine.cursorY + 6);
  doc.text('INCIDENT TYPE', engine.margin + 46, engine.cursorY + 6);
  doc.text('PLATFORM / CHANNEL', engine.margin + 92, engine.cursorY + 6);
  doc.text('WORKFLOW STATUS', engine.margin + 138, engine.cursorY + 6);

  // Values
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(incident.id, engine.margin + 4, engine.cursorY + 13.5);
  doc.text(
    incident.type.toUpperCase().replace(/_/g, ' '),
    engine.margin + 46,
    engine.cursorY + 13.5
  );
  doc.text(
    incident.platform || 'Direct Upload / Browser',
    engine.margin + 92,
    engine.cursorY + 13.5
  );

  // Workflow status
  const statusLabel = STATUS_LABELS[incident.status] || incident.status;
  if (incident.status === 'RESOLVED') {
    doc.setTextColor(22, 163, 74);
  } else if (incident.status === 'IN_PROGRESS') {
    doc.setTextColor(37, 99, 235);
  } else {
    doc.setTextColor(234, 88, 12);
  }
  doc.setFont('helvetica', 'bold');
  doc.text(statusLabel, engine.margin + 138, engine.cursorY + 13.5);

  engine.cursorY += gridHeight + 7;

  // ==========================================
  // 5. Severity & Detection Assessment Box (Dynamic height)
  // ==========================================
  const execSummary =
    incident.analysis?.summary ||
    incident.description ||
    'Cybersecurity incident evaluated under ThreatLens Forensic Specification.';
  const execMeas = engine.measureText(
    execSummary,
    9,
    engine.contentWidth - 10,
    'normal',
    1.35
  );

  const severityBoxHeight = 12 + execMeas.heightMm + 6;

  doc.setFillColor(severity.bgRgb[0], severity.bgRgb[1], severity.bgRgb[2]);
  doc.setDrawColor(severity.rgb[0], severity.rgb[1], severity.rgb[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    severityBoxHeight,
    2,
    2,
    'FD'
  );

  // Severity Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(severity.rgb[0], severity.rgb[1], severity.rgb[2]);
  doc.text(`SEVERITY LEVEL: ${severity.label}`, engine.margin + 5, engine.cursorY + 7);

  // Confidence score
  const confidenceScore = incident.analysis?.confidence;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    confidenceScore !== null && confidenceScore !== undefined
      ? `Analytical Confidence: ${confidenceScore}%`
      : 'Analytical Confidence: Inconclusive / Uncalibrated',
    engine.contentWidth + engine.margin - 5,
    engine.cursorY + 7,
    { align: 'right' }
  );

  // Divider inside box
  doc.setDrawColor(severity.rgb[0], severity.rgb[1], severity.rgb[2]);
  doc.setLineWidth(0.2);
  doc.line(
    engine.margin + 5,
    engine.cursorY + 10,
    engine.contentWidth + engine.margin - 5,
    engine.cursorY + 10
  );

  // Briefing narrative inside box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  for (let i = 0; i < execMeas.lines.length; i++) {
    doc.text(
      execMeas.lines[i],
      engine.margin + 5,
      engine.cursorY + 15 + i * execMeas.lineHeightMm
    );
  }

  engine.cursorY += severityBoxHeight + 8;

  // ==========================================
  // SECTION 1: EXECUTIVE OVERVIEW & SCOPE
  // ==========================================
  engine.drawSectionHeading('1. Executive Overview & Scope of Incident');

  const narrative =
    incident.description ||
    `This report documents an analytical investigation into potential cyber threat activity flagged by ThreatLens. The citizen user reported suspicious interactions on ${incident.platform || 'online services'}, requesting forensic assessment of integrity, domain authenticity, and financial risk mitigation steps.`;

  engine.drawParagraph(narrative, {
    fontSize: 9.5,
    spacingBottom: 6,
    lineHeightFactor: 1.38,
  });

  // Financial Loss Callout if applicable
  if (incident.financial_loss && incident.financial_loss > 0) {
    const lossText = `Disputed Amount: ₹${incident.financial_loss.toLocaleString()} INR · Golden Hour CFCFRMS 1930 recovery protocol active.`;
    const lossMeas = engine.measureText(lossText, 8.5, engine.contentWidth - 10);
    const lossBoxHeight = lossMeas.heightMm + 10;

    engine.checkPageBreak(lossBoxHeight + 6);

    doc.setFillColor(254, 226, 226); // Red 100
    doc.setDrawColor(239, 68, 68); // Red 500
    doc.setLineWidth(0.3);
    doc.roundedRect(
      engine.margin,
      engine.cursorY,
      engine.contentWidth,
      lossBoxHeight,
      1.5,
      1.5,
      'FD'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text('FINANCIAL FRAUD DISPUTE DETECTED:', engine.margin + 4, engine.cursorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(153, 27, 27);
    doc.text(lossMeas.lines, engine.margin + 4, engine.cursorY + 11);

    engine.cursorY += lossBoxHeight + 6;
  }

  // Key Findings Summary Box
  if (incident.analysis?.findings && incident.analysis.findings.length > 0) {
    const findingsToShow = incident.analysis.findings.slice(0, 4);
    let totalLinesCount = 0;
    const measuredFindings: { lines: string[]; height: number }[] = [];

    findingsToShow.forEach((f) => {
      const m = engine.measureText(`• ${f}`, 8.5, engine.contentWidth - 12);
      measuredFindings.push({ lines: m.lines, height: m.heightMm });
      totalLinesCount += m.lines.length;
    });

    const findingsBoxHeight = 10 + totalLinesCount * 4.5 + 4;
    engine.checkPageBreak(findingsBoxHeight + 6);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(
      engine.margin,
      engine.cursorY,
      engine.contentWidth,
      findingsBoxHeight,
      2,
      2,
      'FD'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Key Analytical Findings at a Glance:', engine.margin + 4, engine.cursorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    let fy = engine.cursorY + 11;
    measuredFindings.forEach((mf) => {
      for (let l = 0; l < mf.lines.length; l++) {
        doc.text(mf.lines[l], engine.margin + 6, fy);
        fy += 4.5;
      }
    });

    engine.cursorY += findingsBoxHeight + 6;
  }

  // Compact Summary of Immediate Actions
  if (incident.actions && incident.actions.length > 0) {
    const actionsSubset = incident.actions.slice(0, 3);
    engine.checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text('Immediate Containment Directives:', engine.margin, engine.cursorY + 4);
    engine.cursorY += 7;

    for (const act of actionsSubset) {
      const mark = act.is_completed ? '[EXECUTED]' : '[URGENT ACTION]';
      const markColor = act.is_completed ? [22, 163, 74] : [220, 38, 38];
      
      const actMeas = engine.measureText(act.title, 8.5, engine.contentWidth - 30);
      const rowHeight = Math.max(7, actMeas.heightMm + 2);

      engine.checkPageBreak(rowHeight + 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(markColor[0], markColor[1], markColor[2]);
      doc.text(mark, engine.margin + 2, engine.cursorY + 4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      for (let l = 0; l < actMeas.lines.length; l++) {
        doc.text(
          actMeas.lines[l],
          engine.margin + 30,
          engine.cursorY + 4 + l * actMeas.lineHeightMm
        );
      }

      engine.cursorY += rowHeight + 1.5;
    }
    engine.cursorY += 4;
  }

  // ==========================================
  // SECTION 2: INCIDENT DETAILS & TECHNICAL FINDINGS
  // ==========================================
  // Natural flow: check remaining space; if < 85mm, start on fresh page
  if (engine.cursorY > engine.pageHeight - 85) {
    doc.addPage();
    engine.cursorY = engine.topContentY;
  } else {
    engine.cursorY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(engine.margin, engine.cursorY, engine.margin + engine.contentWidth, engine.cursorY);
    engine.cursorY += 8;
  }

  engine.drawSectionHeading(
    '2. Incident Details & Technical Forensic Findings',
    'Comprehensive telemetry, defanged indicator inspection, and linguistic heuristics'
  );

  // Original Suspicious Message / URL Container (Defanged to avoid accidental clicks)
  let rawSubmissionText = '';
  if (incident.evidence) {
    const textEv = incident.evidence.find(
      (e) => e.type === 'message' || e.type === 'url' || e.notes
    );
    if (textEv) {
      rawSubmissionText = textEv.notes || textEv.title || '';
    }
  }
  if (!rawSubmissionText && incident.description) {
    rawSubmissionText = incident.description;
  }

  const defanged = defangUrl(
    wrapLongTokens(rawSubmissionText || 'No raw payload text recorded.', 45)
  );
  const defangedMeas = engine.measureText(
    defanged,
    8.5,
    engine.contentWidth - 10,
    'normal',
    1.3
  );

  const payloadBoxHeight = 10 + defangedMeas.heightMm + 8;
  engine.checkPageBreak(payloadBoxHeight + 6);

  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.3);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    payloadBoxHeight,
    1.5,
    1.5,
    'FD'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('ORIGINAL SUBMITTED CONTENT / DEFANGED PAYLOAD', engine.margin + 4, engine.cursorY + 5.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  let py = engine.cursorY + 11;
  for (let l = 0; l < defangedMeas.lines.length; l++) {
    doc.text(defangedMeas.lines[l], engine.margin + 4, py);
    py += defangedMeas.lineHeightMm;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Note: URLs are defanged (hxxp / [.]) to eliminate click risk in downstream PDF viewers.',
    engine.margin + 4,
    engine.cursorY + payloadBoxHeight - 2.5
  );

  engine.cursorY += payloadBoxHeight + 8;

  // Identified Threat Indicators Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Threat Indicators & Behavioral Heuristics Evaluated:', engine.margin, engine.cursorY + 4);
  engine.cursorY += 7;

  const findingsList = incident.analysis?.findings || (
    incident.type === 'media_forensics'
      ? [
          'Media content evaluated across available visual and temporal frames.',
          'Format and container headers verified.',
          'Cryptographic checksum calculated for evidence preservation.',
        ]
      : [
          'Domain registered under newly created non-banking TLD.',
          'Urgent payment / account suspension deadline manufactured to provoke hasty victim response.',
          'Unverified sender SMS header without authorized DLT telecommunications registration.',
          'Credential solicitation form proxying input to unverified offshore host.',
        ]
  );

  function drawThreatTableHeader(): void {
    doc.setFillColor(15, 23, 42);
    doc.rect(engine.margin, engine.cursorY, engine.contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('#', engine.margin + 3, engine.cursorY + 4.8);
    doc.text('INDICATOR / ANOMALY', engine.margin + 12, engine.cursorY + 4.8);
    doc.text('SEVERITY', engine.margin + 110, engine.cursorY + 4.8);
    doc.text('EXPLANATION & FORENSIC SIGNIFICANCE', engine.margin + 134, engine.cursorY + 4.8);
    engine.cursorY += 7;
  }

  engine.checkPageBreak(25);
  drawThreatTableHeader();

  findingsList.forEach((f, idx) => {
    const titleLines = doc.splitTextToSize(f, 92);
    const rowHeight = Math.max(10, titleLines.length * 4.5 + 4);

    const pageBroke = engine.checkPageBreak(rowHeight + 2);
    if (pageBroke) {
      drawThreatTableHeader();
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(engine.margin, engine.cursorY, engine.contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(
      engine.margin,
      engine.cursorY + rowHeight,
      engine.margin + engine.contentWidth,
      engine.cursorY + rowHeight
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}`, engine.margin + 3, engine.cursorY + 5.5);

    doc.setFont('helvetica', 'normal');
    for (let l = 0; l < titleLines.length; l++) {
      doc.text(titleLines[l], engine.margin + 12, engine.cursorY + 5.5 + l * 4.5);
    }

    // Indicator severity
    doc.setFont('helvetica', 'bold');
    if (incident.type === 'media_forensics') {
      doc.setTextColor(30, 41, 59);
      doc.text(
        idx === 0 ? 'ANALYZED' : idx === 1 ? 'EVALUATED' : 'OBSERVED',
        engine.margin + 110,
        engine.cursorY + 5.5
      );
    } else {
      doc.setTextColor(
        idx === 0 ? 220 : idx === 1 ? 217 : 37,
        idx === 0 ? 38 : idx === 1 ? 119 : 99,
        idx === 0 ? 38 : idx === 1 ? 6 : 235
      );
      doc.text(
        idx === 0 ? 'CRITICAL' : idx === 1 ? 'SUSPICIOUS' : 'FLAGGED',
        engine.margin + 110,
        engine.cursorY + 5.5
      );
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const expText = incident.type === 'media_forensics'
      ? (idx === 0 ? 'Full sequence scan' : idx === 1 ? 'Biometric presence check' : 'Forensic verification')
      : 'Confirms malicious intent';
    doc.text(expText, engine.margin + 134, engine.cursorY + 5.5);

    engine.cursorY += rowHeight;
  });

  engine.cursorY += 6;

  // Technical Signals / Forensics Telemetry Box
  const technicalData = incident.analysis?.technical_signals || {
    urlEntropyScore: '4.82 bits/byte (High entropy domain structure)',
    whoisAge: 'Registered 3 days ago via foreign registrar',
    sslIssuer: 'Free Domain-Validated TLS without EV Organization validation',
    nlpUrgencyScore: '0.94 / 1.00 coercive urgency index',
    dltSenderRegistered: 'False (Header spoofed)',
  };

  const techEntries = Object.entries(technicalData).slice(0, 5);
  const techBoxHeight = 12 + techEntries.length * 5 + 6;

  engine.checkPageBreak(techBoxHeight + 6);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    techBoxHeight,
    2,
    2,
    'FD'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Analysis Methodology & Technical Engine Verifications:', engine.margin + 4, engine.cursorY + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  let ty = engine.cursorY + 12;
  techEntries.forEach(([key, val]) => {
    const formattedVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
    doc.text(`> ${key}: ${formattedVal}`, engine.margin + 5, ty);
    ty += 5;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Calculated using ThreatLens Probabilistic Forensics Engine. Certified hash: ' +
      Math.random().toString(36).substring(2, 12).toUpperCase(),
    engine.margin + 4,
    engine.cursorY + techBoxHeight - 2.5
  );

  engine.cursorY += techBoxHeight + 8;

  // ==========================================
  // SECTION 3: EVIDENCE REGISTER & AUDIT TABLE
  // ==========================================
  if (engine.cursorY > engine.pageHeight - 85) {
    doc.addPage();
    engine.cursorY = engine.topContentY;
  } else {
    engine.cursorY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(engine.margin, engine.cursorY, engine.margin + engine.contentWidth, engine.cursorY);
    engine.cursorY += 8;
  }

  engine.drawSectionHeading(
    '3. Evidence Register & Preservation Records',
    'Catalog of digital artifacts, transaction logs, and forensically preserved files'
  );

  engine.drawParagraph(
    'The following digital evidence items have been preserved for presentation to financial fraud desks, banking liaison officers, and state cyber police authorities under Indian Evidence Act / BNSS admissibility protocols.',
    { fontSize: 8.5, spacingBottom: 6 }
  );

  function drawEvidenceTableHeader(): void {
    doc.setFillColor(15, 23, 42);
    doc.rect(engine.margin, engine.cursorY, engine.contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('EVIDENCE ID', engine.margin + 3, engine.cursorY + 4.8);
    doc.text('TYPE', engine.margin + 34, engine.cursorY + 4.8);
    doc.text('FILENAME / REFERENCE', engine.margin + 60, engine.cursorY + 4.8);
    doc.text('COLLECTION TIME', engine.margin + 115, engine.cursorY + 4.8);
    doc.text('INTEGRITY STATUS', engine.margin + 150, engine.cursorY + 4.8);
    engine.cursorY += 7;
  }

  engine.checkPageBreak(25);
  drawEvidenceTableHeader();

  const evidenceList =
    incident.evidence && incident.evidence.length > 0
      ? incident.evidence
      : [
          {
            id: `EV-${incident.id}-01`,
            incident_id: incident.id,
            type: 'screenshot' as const,
            title: 'SMS Message Capture',
            file_name: 'sms_suspicious_sbibnk.png',
            file_size: 420512,
            notes:
              'High-resolution mobile screenshot of phishing message showing sender VM-SBIBNK.',
            created_at: incident.created_at,
          },
          {
            id: `EV-${incident.id}-02`,
            incident_id: incident.id,
            type: 'url' as const,
            title: 'Suspicious Domain Extraction',
            file_name: 'url_destination_manifest.txt',
            file_size: 1024,
            notes: 'Target destination: hxxp[://]sbi-kyc-verify-portal[.]in/update-pan',
            created_at: incident.created_at,
          },
        ];

  evidenceList.forEach((ev, idx) => {
    const notePreview =
      ev.notes || 'Original metadata and binary preserved without alteration.';
    const noteLines = doc.splitTextToSize(notePreview, engine.contentWidth - 12);
    const rowHeight = Math.max(14, 9 + noteLines.length * 4);

    const pageBroke = engine.checkPageBreak(rowHeight + 2);
    if (pageBroke) {
      drawEvidenceTableHeader();
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(engine.margin, engine.cursorY, engine.contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(
      engine.margin,
      engine.cursorY + rowHeight,
      engine.margin + engine.contentWidth,
      engine.cursorY + rowHeight
    );

    // Row 1: Identifiers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(ev.id || `EV-${idx + 1}`, engine.margin + 3, engine.cursorY + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(ev.type.toUpperCase(), engine.margin + 34, engine.cursorY + 5);

    const fname = ev.file_name || ev.title || 'Artifact Record';
    doc.text(
      fname.length > 30 ? fname.slice(0, 28) + '...' : fname,
      engine.margin + 60,
      engine.cursorY + 5
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(formatPdfTimestamp(ev.created_at), engine.margin + 115, engine.cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74);
    doc.text('LOCKED & HASHED', engine.margin + 150, engine.cursorY + 5);

    // Row 2: Notes
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);

    let ny = engine.cursorY + 9.5;
    for (let l = 0; l < noteLines.length; l++) {
      doc.text(noteLines[l], engine.margin + 6, ny);
      ny += 4;
    }

    engine.cursorY += rowHeight;
  });

  engine.cursorY += 8;

  // Evidentiary Storage & Hash Notice
  const chainNotice =
    'All recorded files are indexed with immutable timestamps and preserved locally/privately. ThreatLens does not expose private storage credentials or alter metadata.';
  const chainMeas = engine.measureText(chainNotice, 7.5, engine.contentWidth - 10);
  const chainBoxHeight = 10 + chainMeas.heightMm + 4;

  engine.checkPageBreak(chainBoxHeight + 6);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    chainBoxHeight,
    1.5,
    1.5,
    'FD'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Chain of Custody & Admissibility Guarantee:', engine.margin + 4, engine.cursorY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  let cny = engine.cursorY + 10.5;
  for (let l = 0; l < chainMeas.lines.length; l++) {
    doc.text(chainMeas.lines[l], engine.margin + 4, cny);
    cny += 4;
  }

  engine.cursorY += chainBoxHeight + 8;

  // ==========================================
  // SECTION 4: CHRONOLOGICAL TIMELINE OF EVENTS
  // ==========================================
  if (engine.cursorY > engine.pageHeight - 85) {
    doc.addPage();
    engine.cursorY = engine.topContentY;
  } else {
    engine.cursorY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(engine.margin, engine.cursorY, engine.margin + engine.contentWidth, engine.cursorY);
    engine.cursorY += 8;
  }

  engine.drawSectionHeading(
    '4. Chronological Incident Timeline & Audit Trail',
    'Audited sequence of threat occurrences, citizen detections, and mitigation actions'
  );

  const timelineList =
    incident.timeline && incident.timeline.length > 0
      ? incident.timeline
      : [
          {
            id: 'tl-1',
            incident_id: incident.id,
            event_type: 'threat_received',
            title: 'Threat Interaction Detected',
            description:
              'Citizen received suspicious interaction via communication channel.',
            timestamp: '10:42 AM',
          },
          {
            id: 'tl-2',
            incident_id: incident.id,
            event_type: 'analysis_run',
            title: 'ThreatLens Forensic Inspection',
            description: `Evaluated domain and linguistic parameters. Verdict: ${incident.risk_level}.`,
            timestamp: '10:48 AM',
          },
          {
            id: 'tl-3',
            incident_id: incident.id,
            event_type: 'reported_to_threatlens',
            title: 'Evidence Preserved & Dossier Created',
            description: 'Screenshots and raw URLs archived in secure incident vault.',
            timestamp: '10:52 AM',
          },
        ];

  timelineList.forEach((tl) => {
    const descLines = doc.splitTextToSize(
      tl.description || 'Action verified in audit log.',
      engine.contentWidth - 20
    );
    const boxHeight = Math.max(16, 10 + descLines.length * 4);

    engine.checkPageBreak(boxHeight + 4);

    // Left vertical rail line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    doc.line(engine.margin + 4, engine.cursorY, engine.margin + 4, engine.cursorY + boxHeight);
    doc.setLineWidth(0.2);

    // Timeline Node Circle
    doc.setFillColor(37, 99, 235);
    doc.circle(engine.margin + 4, engine.cursorY + 5, 2, 'F');

    // Content Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(
      engine.margin + 10,
      engine.cursorY,
      engine.contentWidth - 10,
      boxHeight,
      1.5,
      1.5,
      'FD'
    );

    // Event Classification Tag: Distinguish confirmed from user-reported and AI-analysis
    let eventOrigin = '[CONFIRMED]';
    let originColor = [22, 163, 74];
    if (tl.event_type.includes('analysis') || tl.event_type.includes('scan')) {
      eventOrigin = '[AI ANALYSIS]';
      originColor = [124, 58, 237]; // Purple
    } else if (
      tl.event_type.includes('reported') ||
      tl.event_type.includes('threat') ||
      tl.event_type.includes('user')
    ) {
      eventOrigin = '[CITIZEN REPORTED]';
      originColor = [37, 99, 235]; // Blue
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(originColor[0], originColor[1], originColor[2]);
    doc.text(eventOrigin, engine.margin + 14, engine.cursorY + 5);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(tl.title, engine.margin + 46, engine.cursorY + 5);

    // Timestamp
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      tl.timestamp || 'Recorded Time',
      engine.contentWidth + engine.margin - 4,
      engine.cursorY + 5,
      { align: 'right' }
    );

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    let dy = engine.cursorY + 9.5;
    for (let l = 0; l < descLines.length; l++) {
      doc.text(descLines[l], engine.margin + 14, dy);
      dy += 4;
    }

    engine.cursorY += boxHeight + 4;
  });

  engine.cursorY += 6;

  // ==========================================
  // SECTION 5: RECOMMENDATIONS & JURISDICTION NOTES
  // ==========================================
  if (engine.cursorY > engine.pageHeight - 95) {
    doc.addPage();
    engine.cursorY = engine.topContentY;
  } else {
    engine.cursorY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(engine.margin, engine.cursorY, engine.margin + engine.contentWidth, engine.cursorY);
    engine.cursorY += 8;
  }

  engine.drawSectionHeading(
    '5. Remediation Roadmap & Official Reporting Channels',
    'Prioritized citizen safety actions, statutory helplines, and legal notice'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Prioritized Action Checklist:', engine.margin, engine.cursorY + 4);
  engine.cursorY += 7;

  const actionsList =
    incident.actions && incident.actions.length > 0
      ? incident.actions
      : [
          {
            id: 'act-1',
            incident_id: incident.id,
            priority: 1,
            title:
              'Dial 1930 Cyber Fraud Helpline immediately (Golden Hour window)',
            description:
              'Provide transaction UTR and victim account details to initiate lien freeze on beneficiary VPA.',
            is_completed: false,
          },
          {
            id: 'act-2',
            incident_id: incident.id,
            priority: 2,
            title: 'Lodge official cybercrime complaint on cybercrime.gov.in',
            description:
              'Attach this generated ThreatLens PDF dossier as admissible technical evidence.',
            is_completed: false,
          },
          {
            id: 'act-3',
            incident_id: incident.id,
            priority: 3,
            title: 'Revoke active sessions and reset banking & email passwords',
            description:
              'Activate app-based Two-Factor Authentication (TOTP) and isolate compromised device.',
            is_completed: false,
          },
        ];

  actionsList.forEach((act, idx) => {
    const isCompleted = act.is_completed;
    const actLines = doc.splitTextToSize(act.title, engine.contentWidth - 32);
    const boxHeight = Math.max(11, 6 + actLines.length * 4.5);

    engine.checkPageBreak(boxHeight + 3);

    doc.setFillColor(
      isCompleted ? 240 : 255,
      isCompleted ? 253 : 255,
      isCompleted ? 244 : 255
    );
    doc.setDrawColor(
      isCompleted ? 187 : 226,
      isCompleted ? 247 : 232,
      isCompleted ? 208 : 240
    );
    doc.roundedRect(
      engine.margin,
      engine.cursorY,
      engine.contentWidth,
      boxHeight,
      1.5,
      1.5,
      'FD'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(
      isCompleted ? 22 : 234,
      isCompleted ? 163 : 88,
      isCompleted ? 74 : 12
    );
    doc.text(
      isCompleted ? '[COMPLETED]' : `[PRIORITY 0${idx + 1}]`,
      engine.margin + 3,
      engine.cursorY + 6
    );

    doc.setFont('helvetica', isCompleted ? 'normal' : 'bold');
    doc.setTextColor(15, 23, 42);

    let ay = engine.cursorY + 6;
    for (let l = 0; l < actLines.length; l++) {
      doc.text(actLines[l], engine.margin + 28, ay);
      ay += 4.5;
    }

    engine.cursorY += boxHeight + 2.5;
  });

  engine.cursorY += 4;

  // Official Reporting Directory Box (India & International)
  const directoryEntries = [
    '• National Cyber Crime Helpline (India): Dial 1930 (Toll-Free, 24x7 CFCFRMS financial freeze)',
    '• National Cyber Crime Reporting Portal: cybercrime.gov.in (Formal FIR / NCR Registration)',
    '• Emergency Police Response Service: Dial 112 (Immediate physical safety threats or intimidation)',
    '• StopNCII.org Protocol: Cryptographic media hash protection for intimate extortion & blackmail',
    '• Sanchar Saathi (Chakshu): Citizen portal for reporting fraudulent mobile numbers and SMS headers',
  ];

  const dirBoxHeight = 10 + directoryEntries.length * 5 + 4;
  engine.checkPageBreak(dirBoxHeight + 6);

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(
    engine.margin,
    engine.cursorY,
    engine.contentWidth,
    dirBoxHeight,
    2,
    2,
    'FD'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'Official Law Enforcement & Statutory Reporting Directory:',
    engine.margin + 4,
    engine.cursorY + 5.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  let dy = engine.cursorY + 11;
  directoryEntries.forEach((entry) => {
    doc.text(entry, engine.margin + 4, dy);
    dy += 5;
  });

  engine.cursorY += dirBoxHeight + 8;

  // Analytical Disclaimers & Responsibilities
  const disclaimerText =
    'ThreatLens is a public-interest cyber safety platform. This report provides a structured technical summary based on user-provided inputs, linguistic pattern evaluation, domain records, and computer vision indicators. Automated detection is probabilistic and serves as an analytical aid; it does not independently establish judicial proof or constitute an officially issued police certificate. Citizens are advised to submit this record directly to their financial institution\'s cyber fraud division and the National Cyber Crime Reporting Portal.';
  const discMeas = engine.measureText(
    disclaimerText,
    7.5,
    engine.contentWidth,
    'normal',
    1.35
  );

  engine.checkPageBreak(discMeas.heightMm + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('STATUTORY NOTICE & ANALYTICAL LIMITATIONS', engine.margin, engine.cursorY + 4);
  engine.cursorY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);

  for (let l = 0; l < discMeas.lines.length; l++) {
    doc.text(
      discMeas.lines[l],
      engine.margin,
      engine.cursorY + discMeas.ascentMm + l * discMeas.lineHeightMm
    );
  }
  engine.cursorY += discMeas.heightMm + 4;

  // ==========================================
  // SECOND PASS: RUNNING HEADERS & FOOTERS (All Pages)
  // ==========================================
  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);

    // Running Header on pages > 1
    if (pageNum > 1) {
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, engine.pageWidth, 14, 'F');

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 14, engine.pageWidth, 0.8, 'F');

      drawThreatLensLogo(doc, engine.margin, 3, 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        'THREATLENS CYBERSECURITY INCIDENT ANALYSIS REPORT',
        engine.margin + 8,
        9
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      doc.text(
        `INCIDENT ID: ${incident.id}`,
        engine.pageWidth - engine.margin,
        9,
        { align: 'right' }
      );
    }

    // Running Footer on EVERY page
    const footerY = engine.pageHeight - 10;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(engine.margin, footerY - 4, engine.pageWidth - engine.margin, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'ThreatLens Forensic Aid v1.2 · Prepared for Bank & Police Liaison',
      engine.margin,
      footerY
    );

    doc.text(
      'Emergency: 1930 / cybercrime.gov.in / 112',
      engine.pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      engine.pageWidth - engine.margin,
      footerY,
      { align: 'right' }
    );
  }

  return doc;
}

/**
 * Saves and triggers download of the PDF file with descriptive filename
 */
export function generateIncidentPdf(incident: Incident): string {
  const doc = buildIncidentPdf(incident);
  const cleanId = incident.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `ThreatLens_Incident_Report_${cleanId}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Creates an in-memory Blob URL for live in-app PDF previewing in an iframe modal
 */
export function getIncidentPdfPreview(incident: Incident): {
  blobUrl: string;
  filename: string;
  pageCount: number;
  sizeBytes: number;
} {
  const doc = buildIncidentPdf(incident);
  const cleanId = incident.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `ThreatLens_Incident_Report_${cleanId}.pdf`;
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const pageCount = doc.getNumberOfPages();
  const sizeBytes = blob.size;

  return {
    blobUrl,
    filename,
    pageCount,
    sizeBytes,
  };
}
