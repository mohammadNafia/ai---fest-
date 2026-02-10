import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminAPI } from '@/api/admin';
import { AttendeeFormData, SpeakerFormData, PartnerFormData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminPrintView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const type = searchParams.get('type') || 'all';
  const [attendees, setAttendees] = useState<AttendeeFormData[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerFormData[]>([]);
  const [partners, setPartners] = useState<PartnerFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await adminAPI.getAllSubmissions();
      if (result.success) {
        setAttendees(result.data.attendees);
        setSpeakers(result.data.speakers);
        setPartners(result.data.partners);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Auto-trigger print after a short delay
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const renderTable = (
    title: string,
    data: any[],
    columns: { key: string; label: string }[]
  ) => {
    if (data.length === 0) return null;

    return (
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border border-gray-300 px-3 py-2 text-left font-semibold text-black ${
                    lang === 'ar' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border border-gray-300 px-3 py-2 text-black ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {row[col.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* Watermark background */}
      <div className="fixed inset-0 pointer-events-none print:block hidden print:opacity-10 print:z-0" style={{
        backgroundImage: 'url(/Summit-Logo.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        backgroundPosition: 'center',
        opacity: 0.05
      }} />
      
      <div className="min-h-screen bg-white p-8 print:p-4 relative z-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Print header - appears on every page */}
        <div className="print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:border-b print:border-gray-300 print:px-4 print:py-2 print:z-20 hidden print:block">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-black">
                {lang === 'ar' ? 'قمة بغداد للذكاء الاصطناعي 2026' : 'Baghdad AI Summit 2026'}
              </h2>
              <p className="text-xs text-gray-600">
                {lang === 'ar' ? 'تقرير إداري' : 'Administrative Report'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Print footer - appears on every page */}
        <div className="print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:border-t print:border-gray-300 print:px-4 print:py-2 print:z-20 hidden print:block">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>{lang === 'ar' ? 'مستند سري' : 'Confidential Document'}</span>
            <span>{lang === 'ar' ? 'صفحة' : 'Page'} <span className="page-number"></span> {lang === 'ar' ? 'من' : 'of'} <span className="total-pages"></span></span>
            <span>© 2026 Baghdad AI Summit</span>
          </div>
        </div>

        {/* Main content with top margin for fixed header */}
        <div className="print:mt-16">
          {/* Document header */}
          <div className="mb-6 print:mb-4 print:break-after-avoid">
            <h1 className="text-3xl font-bold text-black mb-2">
              {lang === 'ar' ? 'تقرير قمة بغداد للذكاء الاصطناعي 2026' : 'Baghdad AI Summit 2026 - Report'}
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

      {/* Back button (hidden in print) */}
      <div className="mb-6 print:hidden">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {(type === 'all' || type === 'attendees') &&
          renderTable(
            lang === 'ar' ? 'المشاركون' : 'Attendees',
            attendees,
            lang === 'ar'
              ? [
                  { key: 'name', label: 'الاسم' },
                  { key: 'age', label: 'العمر' },
                  { key: 'occupation', label: 'المهنة' },
                  { key: 'institution', label: 'المؤسسة' },
                  { key: 'email', label: 'البريد الإلكتروني' },
                  { key: 'phone', label: 'الهاتف' }
                ]
              : [
                  { key: 'name', label: 'Name' },
                  { key: 'age', label: 'Age' },
                  { key: 'occupation', label: 'Occupation' },
                  { key: 'institution', label: 'Institution' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' }
                ]
          )}

        {(type === 'all' || type === 'speakers') &&
          renderTable(
            lang === 'ar' ? 'المتحدثون' : 'Speakers',
            speakers,
            lang === 'ar'
              ? [
                  { key: 'name', label: 'الاسم' },
                  { key: 'occupation', label: 'المهنة' },
                  { key: 'institution', label: 'المؤسسة' },
                  { key: 'email', label: 'البريد الإلكتروني' },
                  { key: 'phone', label: 'الهاتف' },
                  { key: 'topics', label: 'المواضيع' }
                ]
              : [
                  { key: 'name', label: 'Name' },
                  { key: 'occupation', label: 'Occupation' },
                  { key: 'institution', label: 'Institution' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'topics', label: 'Topics' }
                ]
          )}

        {(type === 'all' || type === 'partners') &&
          renderTable(
            lang === 'ar' ? 'الشركاء' : 'Partners',
            partners,
            lang === 'ar'
              ? [
                  { key: 'organization', label: 'المنظمة' },
                  { key: 'email', label: 'البريد الإلكتروني' },
                  { key: 'category', label: 'الفئة' },
                  { key: 'requirements', label: 'المتطلبات' }
                ]
              : [
                  { key: 'organization', label: 'Organization' },
                  { key: 'email', label: 'Email' },
                  { key: 'category', label: 'Category' },
                  { key: 'requirements', label: 'Requirements' }
                ]
          )}
      </div>

          {/* Content */}
          <div className="space-y-6 print:space-y-4">
            {(type === 'all' || type === 'attendees') &&
              renderTable(
                lang === 'ar' ? 'المشاركون' : 'Attendees',
                attendees,
                lang === 'ar'
                  ? [
                      { key: 'name', label: 'الاسم' },
                      { key: 'age', label: 'العمر' },
                      { key: 'occupation', label: 'المهنة' },
                      { key: 'institution', label: 'المؤسسة' },
                      { key: 'email', label: 'البريد الإلكتروني' },
                      { key: 'phone', label: 'الهاتف' }
                    ]
                  : [
                      { key: 'name', label: 'Name' },
                      { key: 'age', label: 'Age' },
                      { key: 'occupation', label: 'Occupation' },
                      { key: 'institution', label: 'Institution' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' }
                    ]
              )}

            {(type === 'all' || type === 'speakers') &&
              renderTable(
                lang === 'ar' ? 'المتحدثون' : 'Speakers',
                speakers,
                lang === 'ar'
                  ? [
                      { key: 'name', label: 'الاسم' },
                      { key: 'occupation', label: 'المهنة' },
                      { key: 'institution', label: 'المؤسسة' },
                      { key: 'email', label: 'البريد الإلكتروني' },
                      { key: 'phone', label: 'الهاتف' },
                      { key: 'topics', label: 'المواضيع' }
                    ]
                  : [
                      { key: 'name', label: 'Name' },
                      { key: 'occupation', label: 'Occupation' },
                      { key: 'institution', label: 'Institution' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'topics', label: 'Topics' }
                    ]
              )}

            {(type === 'all' || type === 'partners') &&
              renderTable(
                lang === 'ar' ? 'الشركاء' : 'Partners',
                partners,
                lang === 'ar'
                  ? [
                      { key: 'organization', label: 'المنظمة' },
                      { key: 'email', label: 'البريد الإلكتروني' },
                      { key: 'category', label: 'الفئة' },
                      { key: 'requirements', label: 'المتطلبات' }
                    ]
                  : [
                      { key: 'organization', label: 'Organization' },
                      { key: 'email', label: 'Email' },
                      { key: 'category', label: 'Category' },
                      { key: 'requirements', label: 'Requirements' }
                    ]
              )}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            margin: 2.5cm 1cm 2.5cm 1cm;
            size: A4;
            @top-center {
              content: "Baghdad AI Summit 2026 - Administrative Report";
              font-size: 10pt;
              color: #666;
              border-bottom: 1px solid #ddd;
              padding-bottom: 0.5cm;
            }
            @bottom-center {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 10pt;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 0.5cm;
            }
          }
          
          body {
            background: white;
            color: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          
          .print\\:p-4 {
            padding: 1rem;
          }
          
          .print\\:mt-16 {
            margin-top: 4rem;
          }
          
          .print\\:break-after-avoid {
            page-break-after: avoid;
          }
          
          /* Enhanced Watermark */
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('/Summit-Logo.png');
            background-repeat: repeat;
            background-size: 350px 350px;
            background-position: center;
            opacity: 0.04;
            z-index: 0;
            pointer-events: none;
            transform: rotate(-45deg);
          }
          
          /* Table page break rules */
          table {
            page-break-inside: auto;
            border-collapse: collapse;
            width: 100%;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          /* Keep table headers on each page */
          thead tr {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          /* Avoid breaking inside cells */
          td, th {
            page-break-inside: avoid;
            word-wrap: break-word;
          }
          
          /* Section breaks */
          h1, h2 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          /* Page number counter */
          .page-number::after {
            content: counter(page);
          }
          
          .total-pages::after {
            content: counter(pages);
          }
        }
      `}</style>
    </>
  );
};

export default AdminPrintView;

