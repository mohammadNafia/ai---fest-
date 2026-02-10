import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Clock, CheckCircle2, XCircle, Home, Download, Calendar, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { SummitLogo } from '@/components/SummitLogo';
import ParticlesBackground from '@/components/ParticlesBackground';
import { AttendeeFormData } from '@/types';
import { registrationService } from '@/services/registrationService';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CheckTicket: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<AttendeeFormData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async (attendee: AttendeeFormData) => {
    try {
      // Use attendee ID if available, otherwise use email
      const qrData = attendee.id ? attendee.id.toString() : attendee.email;
      
      const url = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setNotFound(false);
    setSearchResult(null);
    
    try {
      console.log('[CheckTicket] Searching for email:', email);
      
      // Search in Supabase via registrationService
      const result = await registrationService.findAttendeeByEmail(email);
      
      if (result.success && result.data) {
        console.log('[CheckTicket] Found registration:', result.data);
        setSearchResult(result.data);
        // Generate QR code for approved attendees
        if (result.data.status === 'approved') {
          await generateQRCode(result.data);
        } else {
          // Clear QR code for non-approved statuses
          setQrCodeUrl('');
        }
      } else {
        console.log('[CheckTicket] No registration found:', result.error);
        setNotFound(true);
      }
    } catch (error) {
      console.error('[CheckTicket] Search error:', error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const downloadTicketPDF = async () => {
    if (!ticketRef.current || !searchResult) return;
    
    setIsGeneratingPDF(true);
    try {
      // Capture the ticket element with high quality
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: ticketRef.current.scrollWidth,
        windowHeight: ticketRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions to fit the ticket
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Create PDF with appropriate size
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      // Add image to PDF, centered
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Generate filename with attendee name
      const filename = `Baghdad_AI_Ticket_${searchResult.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(lang === 'ar' ? 'حدث خطأ أثناء إنشاء PDF' : 'An error occurred while generating PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' 
        : 'bg-[#00040F]'
    }`}>
      {theme === 'dark' && <ParticlesBackground theme={theme} />}
      
      {/* Decorative blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[100px] ${
          theme === 'light' ? 'bg-blue-200/50' : 'bg-blue-600/20'
        }`}></div>
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[100px] ${
          theme === 'light' ? 'bg-cyan-200/50' : 'bg-cyan-600/20'
        }`}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            theme === 'light'
              ? 'bg-white/80 text-gray-700 hover:bg-white shadow-sm border border-gray-200'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10'
          }`}
        >
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-md space-y-8">
          {/* Search Card */}
          <div className={`rounded-2xl shadow-2xl border overflow-hidden ${
            theme === 'light'
              ? 'bg-white/90 backdrop-blur-xl border-gray-200'
              : 'bg-[#0a0a1a]/90 backdrop-blur-xl border-white/10'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              theme === 'light' ? 'border-gray-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-blue-100' : 'bg-blue-600/20'
                }`}>
                  <Search size={20} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'تحقق من تذكرتك' : 'Check Your Ticket'}
                  </h1>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? 'أدخل بريدك الإلكتروني للتحقق' : 'Enter your email to check status'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-6 space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Enter your email'}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white'
                  } focus:outline-none`}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !email}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  isSearching || !email
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSearching 
                  ? (lang === 'ar' ? 'جاري البحث...' : 'Searching...') 
                  : (lang === 'ar' ? 'بحث' : 'Search')}
              </button>
            </form>
          </div>

          {/* Not Found Message */}
          {notFound && (
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'light'
                ? 'bg-red-50 border-red-200'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <XCircle size={48} className={`mx-auto mb-3 ${
                theme === 'light' ? 'text-red-500' : 'text-red-400'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === 'light' ? 'text-red-800' : 'text-red-300'
              }`}>
                {lang === 'ar' ? 'لم يتم العثور على طلب' : 'No Application Found'}
              </h3>
              <p className={`text-sm ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                {lang === 'ar' 
                  ? 'لم نجد طلباً مرتبطاً بهذا البريد الإلكتروني'
                  : 'We couldn\'t find an application with this email'}
              </p>
            </div>
          )}

          {/* Pending Status */}
          {searchResult && searchResult.status === 'pending' && (
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'light'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <Clock size={48} className={`mx-auto mb-3 ${
                theme === 'light' ? 'text-amber-500' : 'text-amber-400'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-300'
              }`}>
                {lang === 'ar' ? 'طلبك قيد المراجعة' : 'Application Under Review'}
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'light' ? 'text-amber-600' : 'text-amber-400'
              }`}>
                {lang === 'ar' 
                  ? 'طلبك قيد المراجعة حالياً.'
                  : 'Your application is under review.'}
              </p>
              <p className={`text-xs ${
                theme === 'light' ? 'text-amber-500' : 'text-amber-500'
              }`}>
                {lang === 'ar' ? `مقدم الطلب: ${searchResult.name}` : `Applicant: ${searchResult.name}`}
              </p>
            </div>
          )}

          {/* Rejected Status */}
          {searchResult && searchResult.status === 'rejected' && (
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'light'
                ? 'bg-red-50 border-red-200'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <XCircle size={48} className={`mx-auto mb-3 ${
                theme === 'light' ? 'text-red-500' : 'text-red-400'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === 'light' ? 'text-red-800' : 'text-red-300'
              }`}>
                {lang === 'ar' ? 'لم يتم قبول الطلب' : 'Application Not Accepted'}
              </h3>
              <p className={`text-sm ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                {lang === 'ar' 
                  ? 'لم يتم قبول الطلب.'
                  : 'Application not accepted.'}
              </p>
            </div>
          )}

          {/* Approved - Show Ticket */}
          {searchResult && searchResult.status === 'approved' && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold">
                    {lang === 'ar' ? 'تمت الموافقة! تذكرتك جاهزة' : 'Approved! Your ticket is ready'}
                  </span>
                </div>
              </div>

              {/* Ticket */}
              <div 
                id="ticket-content" 
                ref={ticketRef}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-100"
              >
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white/20 rounded-full p-3">
                      <SummitLogo className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-xl tracking-tight">Baghdad AI Summit</h3>
                  <p className="text-blue-100 text-sm mt-1">2026</p>
                </div>
                
                {/* Ticket Body */}
                <div className="p-6 space-y-5">
                  {/* Attendee Name */}
                  <div className="text-center border-b border-dashed border-gray-200 pb-5">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                      {lang === 'ar' ? 'اسم المشارك' : 'Attendee Name'}
                    </p>
                    <p className="text-gray-900 font-bold text-2xl tracking-tight">{searchResult.name}</p>
                  </div>
                  
                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1.5">
                        <Calendar size={14} />
                        <span className="text-xs uppercase tracking-wider font-medium">
                          {lang === 'ar' ? 'التاريخ' : 'Date'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">Jan 27, 2026</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1.5">
                        <MapPin size={14} />
                        <span className="text-xs uppercase tracking-wider font-medium">
                          {lang === 'ar' ? 'المكان' : 'Venue'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">The Station</p>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center pt-5 border-t border-dashed border-gray-200">
                    {qrCodeUrl && (
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28 mx-auto" />
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-3 font-mono">{searchResult.email}</p>
                  </div>
                </div>
                
                {/* Ticket Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
                  <p className="text-gray-400 text-xs">
                    {lang === 'ar' ? 'احتفظ بهذه التذكرة للدخول' : 'Present this ticket at entry'}
                  </p>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="flex justify-center">
                <button
                  onClick={downloadTicketPDF}
                  disabled={isGeneratingPDF}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 ${
                    isGeneratingPDF
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Download size={18} />
                  {isGeneratingPDF 
                    ? (lang === 'ar' ? 'جاري التحميل...' : 'Generating...') 
                    : (lang === 'ar' ? 'تحميل التذكرة (PDF)' : 'Download Ticket (PDF)')}
                </button>
              </div>
            </div>
          )}

          {/* Return Home */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Home size={16} />
              {lang === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckTicket;