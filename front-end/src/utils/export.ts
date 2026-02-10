import { AttendeeFormData, SpeakerFormData, PartnerFormData } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Legacy synchronous CSV export (fallback)
export const exportToCSV = (filename: string, rows: any[], columns: string[]): void => {
  if (rows.length === 0) {
    console.warn('No data to export');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}-${timestamp}.csv`;

  // Create CSV header
  const headers = columns.join(',');
  
  // Create CSV rows
  const csvRows = rows.map(row => {
    return columns.map(col => {
      const value = row[col] || '';
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  const csv = [headers, ...csvRows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Async CSV export using Web Worker (preferred for large datasets)
export const exportToCSVAsync = async (
  filename: string,
  rows: any[],
  columns: string[],
  lang: string = 'en'
): Promise<void> => {
  if (rows.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // Use worker for datasets (>50 rows), fallback to sync for small datasets
    if (rows.length > 50) {
      const worker = new Worker(
        new URL('../workers/csvWorker.ts', import.meta.url),
        { type: 'module' }
      );

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error('CSV export timeout'));
        }, 30000); // 30 second timeout

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          if (e.data.success && e.data.data) {
            const timestamp = new Date().toISOString().split('T')[0];
            const fullFilename = `${filename}-${timestamp}.csv`;
            const blob = new Blob([e.data.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fullFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            worker.terminate();
            resolve();
          } else {
            worker.terminate();
            reject(new Error(e.data.error || 'CSV export failed'));
          }
        };

        worker.onerror = (err) => {
          clearTimeout(timeout);
          worker.terminate();
          reject(err);
        };

        worker.postMessage({
          type: 'buildCSV',
          data: { items: rows, headers: columns, lang },
        });
      });
    } else {
      // Fallback to synchronous for small datasets
      exportToCSV(filename, rows, columns);
    }
  } catch (error) {
    console.warn('Worker-based CSV export failed, falling back to sync:', error);
    exportToCSV(filename, rows, columns);
  }
};

export const exportToJSON = (filename: string, data: any): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}-${timestamp}.json`;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper functions for specific data types
export const exportAttendeesCSV = (attendees: AttendeeFormData[], lang: 'en' | 'ar' = 'en'): void => {
  const columns = lang === 'ar' 
    ? ['الاسم', 'العمر', 'المهنة', 'المؤسسة', 'البريد الإلكتروني', 'الهاتف', 'الدافع', 'تاريخ التقديم']
    : ['name', 'age', 'occupation', 'institution', 'email', 'phone', 'motivation', 'dateSubmitted'];
  
  exportToCSV('attendees', attendees, columns);
};

export const exportAttendeesCSVAsync = async (attendees: AttendeeFormData[], lang: 'en' | 'ar' = 'en'): Promise<void> => {
  const columns = lang === 'ar' 
    ? ['الاسم', 'العمر', 'المهنة', 'المؤسسة', 'البريد الإلكتروني', 'الهاتف', 'الدافع', 'تاريخ التقديم']
    : ['name', 'age', 'occupation', 'institution', 'email', 'phone', 'motivation', 'dateSubmitted'];
  
  await exportToCSVAsync('attendees', attendees, columns, lang);
};

export const exportSpeakersCSV = (speakers: SpeakerFormData[], lang: 'en' | 'ar' = 'en'): void => {
  const columns = lang === 'ar'
    ? ['الاسم', 'المهنة', 'المؤسسة', 'البريد الإلكتروني', 'الهاتف', 'المهارات', 'الخبرة', 'المواضيع', 'الإنجازات', 'تاريخ التقديم']
    : ['name', 'occupation', 'institution', 'email', 'phone', 'skills', 'experience', 'topics', 'achievements', 'dateSubmitted'];
  
  exportToCSV('speakers', speakers, columns);
};

export const exportSpeakersCSVAsync = async (speakers: SpeakerFormData[], lang: 'en' | 'ar' = 'en'): Promise<void> => {
  const columns = lang === 'ar'
    ? ['الاسم', 'المهنة', 'المؤسسة', 'البريد الإلكتروني', 'الهاتف', 'المهارات', 'الخبرة', 'المواضيع', 'الإنجازات', 'تاريخ التقديم']
    : ['name', 'occupation', 'institution', 'email', 'phone', 'skills', 'experience', 'topics', 'achievements', 'dateSubmitted'];
  
  await exportToCSVAsync('speakers', speakers, columns, lang);
};

export const exportPartnersCSV = (partners: PartnerFormData[], lang: 'en' | 'ar' = 'en'): void => {
  const columns = lang === 'ar'
    ? ['المنظمة', 'البريد الإلكتروني', 'الفئة', 'المتطلبات', 'تاريخ التقديم']
    : ['organization', 'email', 'category', 'requirements', 'dateSubmitted'];
  
  exportToCSV('partners', partners, columns);
};

export const exportPartnersCSVAsync = async (partners: PartnerFormData[], lang: 'en' | 'ar' = 'en'): Promise<void> => {
  const columns = lang === 'ar'
    ? ['المنظمة', 'البريد الإلكتروني', 'الفئة', 'المتطلبات', 'تاريخ التقديم']
    : ['organization', 'email', 'category', 'requirements', 'dateSubmitted'];
  
  await exportToCSVAsync('partners', partners, columns, lang);
};

export const exportPartnersJSON = (partners: PartnerFormData[]): void => {
  exportToJSON('partners', partners);
};

/**
 * Export data to PDF using jsPDF and html2canvas
 */
export const exportToPDF = async (
  elementId: string,
  filename: string,
  options: {
    title?: string;
    watermark?: boolean;
    header?: string;
    footer?: string;
  } = {}
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  try {
    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add watermark if requested
    if (options.watermark) {
      pdf.setFontSize(60);
      pdf.setTextColor(200, 200, 200);
      pdf.setGState(pdf.GState({ opacity: 0.1 }));
      pdf.text('BAGHDAD AI SUMMIT', 105, 150, {
        align: 'center',
        angle: 45,
      });
      pdf.setGState(pdf.GState({ opacity: 1 }));
    }

    // Add header if provided
    if (options.header) {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(options.header, 105, 10, { align: 'center' });
      position = 15;
    }

    // Add title if provided
    if (options.title) {
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(options.title, 105, position + 10, { align: 'center' });
      position += 20;
    }

    // Add image
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      
      // Add watermark to additional pages
      if (options.watermark) {
        pdf.setFontSize(60);
        pdf.setTextColor(200, 200, 200);
        pdf.setGState(pdf.GState({ opacity: 0.1 }));
        pdf.text('BAGHDAD AI SUMMIT', 105, 150, {
          align: 'center',
          angle: 45,
        });
        pdf.setGState(pdf.GState({ opacity: 1 }));
      }

      // Add header to additional pages
      if (options.header) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(options.header, 105, 10, { align: 'center' });
      }

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Add footer to all pages
    if (options.footer) {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          options.footer,
          105,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          `Page ${i} of ${pageCount}`,
          200,
          pageHeight - 10,
          { align: 'right' }
        );
      }
    }

    // Save PDF
    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`${filename}-${timestamp}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Export attendees to PDF
 */
export const exportAttendeesPDF = async (
  attendees: AttendeeFormData[],
  lang: 'en' | 'ar' = 'en'
): Promise<void> => {
  // Create a temporary element with the data
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-export-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '20px';
  tempDiv.style.backgroundColor = '#ffffff';
  
  const title = lang === 'ar' ? 'قائمة الحضور' : 'Attendees List';
  tempDiv.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 20px;">${title}</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          ${lang === 'ar' 
            ? '<th style="border: 1px solid #ddd; padding: 8px;">الاسم</th><th style="border: 1px solid #ddd; padding: 8px;">البريد الإلكتروني</th><th style="border: 1px solid #ddd; padding: 8px;">المهنة</th>'
            : '<th style="border: 1px solid #ddd; padding: 8px;">Name</th><th style="border: 1px solid #ddd; padding: 8px;">Email</th><th style="border: 1px solid #ddd; padding: 8px;">Occupation</th>'
          }
        </tr>
      </thead>
      <tbody>
        ${attendees.map(attendee => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${attendee.name || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${attendee.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${attendee.occupation || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.body.appendChild(tempDiv);
  
  try {
    await exportToPDF('pdf-export-temp', 'attendees', {
      title,
      watermark: true,
      header: 'Baghdad AI Summit 2026',
      footer: `Generated on ${new Date().toLocaleDateString()}`,
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

/**
 * Export speakers to PDF
 */
export const exportSpeakersPDF = async (
  speakers: SpeakerFormData[],
  lang: 'en' | 'ar' = 'en'
): Promise<void> => {
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-export-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '20px';
  tempDiv.style.backgroundColor = '#ffffff';
  
  const title = lang === 'ar' ? 'قائمة المتحدثين' : 'Speakers List';
  tempDiv.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 20px;">${title}</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          ${lang === 'ar'
            ? '<th style="border: 1px solid #ddd; padding: 8px;">الاسم</th><th style="border: 1px solid #ddd; padding: 8px;">البريد الإلكتروني</th><th style="border: 1px solid #ddd; padding: 8px;">المهنة</th>'
            : '<th style="border: 1px solid #ddd; padding: 8px;">Name</th><th style="border: 1px solid #ddd; padding: 8px;">Email</th><th style="border: 1px solid #ddd; padding: 8px;">Occupation</th>'
          }
        </tr>
      </thead>
      <tbody>
        ${speakers.map(speaker => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${speaker.name || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${speaker.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${speaker.occupation || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.body.appendChild(tempDiv);
  
  try {
    await exportToPDF('pdf-export-temp', 'speakers', {
      title,
      watermark: true,
      header: 'Baghdad AI Summit 2026',
      footer: `Generated on ${new Date().toLocaleDateString()}`,
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

/**
 * Export partners to PDF
 */
export const exportPartnersPDF = async (
  partners: PartnerFormData[],
  lang: 'en' | 'ar' = 'en'
): Promise<void> => {
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-export-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '20px';
  tempDiv.style.backgroundColor = '#ffffff';
  
  const title = lang === 'ar' ? 'قائمة الشركاء' : 'Partners List';
  tempDiv.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 20px;">${title}</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          ${lang === 'ar'
            ? '<th style="border: 1px solid #ddd; padding: 8px;">المنظمة</th><th style="border: 1px solid #ddd; padding: 8px;">البريد الإلكتروني</th><th style="border: 1px solid #ddd; padding: 8px;">الفئة</th>'
            : '<th style="border: 1px solid #ddd; padding: 8px;">Organization</th><th style="border: 1px solid #ddd; padding: 8px;">Email</th><th style="border: 1px solid #ddd; padding: 8px;">Category</th>'
          }
        </tr>
      </thead>
      <tbody>
        ${partners.map(partner => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${partner.organization || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${partner.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${partner.category || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.body.appendChild(tempDiv);
  
  try {
    await exportToPDF('pdf-export-temp', 'partners', {
      title,
      watermark: true,
      header: 'Baghdad AI Summit 2026',
      footer: `Generated on ${new Date().toLocaleDateString()}`,
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

