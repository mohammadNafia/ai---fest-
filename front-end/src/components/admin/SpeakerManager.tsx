import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Image as ImageIcon,
  Linkedin, Twitter, Globe, RefreshCw, ChevronUp, ChevronDown,
  Star, Eye, EyeOff, Save
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cmsService, CMSSpeaker } from '@/services/cmsService';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeakerManagerProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface SpeakerFormData {
  name: string;
  name_ar: string;
  role: string;
  role_ar: string;
  company: string;
  company_ar: string;
  image: string;
  topic: string;
  topic_ar: string;
  bio: string;
  bio_ar: string;
  linkedin: string;
  twitter: string;
  website: string;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
}

const emptySpeaker: SpeakerFormData = {
  name: '',
  name_ar: '',
  role: '',
  role_ar: '',
  company: '',
  company_ar: '',
  image: '',
  topic: '',
  topic_ar: '',
  bio: '',
  bio_ar: '',
  linkedin: '',
  twitter: '',
  website: '',
  order_index: 0,
  is_featured: false,
  is_active: true,
};

const SpeakerManager: React.FC<SpeakerManagerProps> = ({ onSuccess, onError }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [speakers, setSpeakers] = useState<CMSSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<CMSSpeaker | null>(null);
  const [formData, setFormData] = useState<SpeakerFormData>(emptySpeaker);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    setLoading(true);
    try {
      const result = await cmsService.getAllSpeakers();
      if (result.success) {
        setSpeakers(result.data || []);
        // Only show error if explicitly failed, not for empty data
        if (!result.data || result.data.length === 0) {
          console.log('[SpeakerManager] No speakers found in database');
        }
      } else {
        console.error('[SpeakerManager] Failed to load speakers:', result.error);
        // Don't show error toast for empty data, just set empty array
        setSpeakers([]);
      }
    } catch (err) {
      console.error('[SpeakerManager] Unexpected error loading speakers:', err);
      setSpeakers([]);
    }
    setLoading(false);
  };

  const handleOpenModal = (speaker?: CMSSpeaker) => {
    if (speaker) {
      setEditingSpeaker(speaker);
      setFormData({
        name: speaker.name || '',
        name_ar: speaker.name_ar || '',
        role: speaker.role || '',
        role_ar: speaker.role_ar || '',
        company: speaker.company || '',
        company_ar: speaker.company_ar || '',
        image: speaker.image || '',
        topic: speaker.topic || '',
        topic_ar: speaker.topic_ar || '',
        bio: speaker.bio || '',
        bio_ar: speaker.bio_ar || '',
        linkedin: speaker.linkedin || '',
        twitter: speaker.twitter || '',
        website: speaker.website || '',
        order_index: speaker.order_index ?? speakers.length,
        is_featured: speaker.is_featured || false,
        is_active: speaker.is_active ?? true,
      });
    } else {
      setEditingSpeaker(null);
      setFormData({ ...emptySpeaker, order_index: speakers.length });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpeaker(null);
    setFormData(emptySpeaker);
    setActiveTab('en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingSpeaker?.id) {
        const result = await cmsService.updateSpeaker(editingSpeaker.id, formData);
        if (result.success) {
          onSuccess(lang === 'ar' ? 'تم تحديث المتحدث بنجاح' : 'Speaker updated successfully');
          handleCloseModal();
          loadSpeakers();
        } else {
          onError(result.error || 'Failed to update speaker');
        }
      } else {
        const result = await cmsService.createSpeaker(formData);
        if (result.success) {
          onSuccess(lang === 'ar' ? 'تم إضافة المتحدث بنجاح' : 'Speaker added successfully');
          handleCloseModal();
          loadSpeakers();
        } else {
          onError(result.error || 'Failed to create speaker');
        }
      }
    } catch (error) {
      onError('An error occurred');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const result = await cmsService.deleteSpeaker(id);
    if (result.success) {
      onSuccess(lang === 'ar' ? 'تم حذف المتحدث' : 'Speaker deleted');
      loadSpeakers();
    } else {
      onError(result.error || 'Failed to delete speaker');
    }
    setDeleteConfirm(null);
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = speakers.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === speakers.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...speakers];
    const [removed] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, removed);

    setSpeakers(reordered);
    
    // Update in database
    const ids = reordered.map(s => s.id!);
    await cmsService.reorderSpeakers(ids);
  };

  const toggleActive = async (speaker: CMSSpeaker) => {
    const result = await cmsService.updateSpeaker(speaker.id!, { is_active: !speaker.is_active });
    if (result.success) {
      loadSpeakers();
    }
  };

  const toggleFeatured = async (speaker: CMSSpeaker) => {
    const result = await cmsService.updateSpeaker(speaker.id!, { is_featured: !speaker.is_featured });
    if (result.success) {
      loadSpeakers();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {lang === 'ar' ? 'إدارة المتحدثين' : 'Speaker Management'}
          </h2>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {speakers.length} {lang === 'ar' ? 'متحدث' : 'speakers'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadSpeakers}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-400 hover:bg-white/10'
            }`}
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium transition-all hover:shadow-lg"
          >
            <Plus size={18} />
            {lang === 'ar' ? 'إضافة متحدث' : 'Add Speaker'}
          </button>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakers.map((speaker, index) => (
          <motion.div
            key={speaker.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-xl border overflow-hidden ${
              !speaker.is_active ? 'opacity-60' : ''
            } ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
            }`}
          >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
              {speaker.image ? (
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {speaker.is_featured && (
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                    <Star size={12} /> Featured
                  </span>
                )}
                {!speaker.is_active && (
                  <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full font-medium">
                    Hidden
                  </span>
                )}
              </div>

              {/* Order Index */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  theme === 'light' ? 'bg-white/90 text-gray-700' : 'bg-black/70 text-white'
                }`}>
                  #{index + 1}
                </span>
              </div>

              {/* Reorder buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  onClick={() => handleReorder(speaker.id!, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded ${
                    index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
                  } bg-black/50 text-white`}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => handleReorder(speaker.id!, 'down')}
                  disabled={index === speakers.length - 1}
                  className={`p-1 rounded ${
                    index === speakers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
                  } bg-black/50 text-white`}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {speaker.name}
              </h3>
              {speaker.name_ar && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} dir="rtl">
                  {speaker.name_ar}
                </p>
              )}
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                {speaker.role} {speaker.company && `• ${speaker.company}`}
              </p>

              {/* Social Links */}
              <div className="flex gap-2 mt-3">
                {speaker.linkedin && (
                  <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Linkedin size={14} />
                  </a>
                )}
                {speaker.twitter && (
                  <a href={speaker.twitter} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    <Twitter size={14} />
                  </a>
                )}
                {speaker.website && (
                  <a href={speaker.website} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400">
                    <Globe size={14} />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => toggleFeatured(speaker)}
                  className={`p-2 rounded-lg transition-colors ${
                    speaker.is_featured
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                      : theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  title={speaker.is_featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => toggleActive(speaker)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  title={speaker.is_active ? 'Hide speaker' : 'Show speaker'}
                >
                  {speaker.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleOpenModal(speaker)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(speaker.id!)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            <AnimatePresence>
              {deleteConfirm === speaker.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center p-4"
                >
                  <div className="text-center">
                    <p className="text-white mb-4">
                      {lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Delete this speaker?'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => handleDelete(speaker.id!)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                      >
                        {lang === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {speakers.length === 0 && (
        <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>{lang === 'ar' ? 'لا يوجد متحدثين بعد' : 'No speakers yet'}</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-500 hover:underline"
          >
            {lang === 'ar' ? 'أضف أول متحدث' : 'Add your first speaker'}
          </button>
        </div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${
                theme === 'light' ? 'bg-white' : 'bg-[#0a0a1a]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
              }`}>
                <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {editingSpeaker
                    ? (lang === 'ar' ? 'تعديل المتحدث' : 'Edit Speaker')
                    : (lang === 'ar' ? 'إضافة متحدث جديد' : 'Add New Speaker')}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
                >
                  <X size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Language Tabs */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'en'
                        ? 'bg-blue-600 text-white'
                        : theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ar')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'ar'
                        ? 'bg-blue-600 text-white'
                        : theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    🇮🇶 العربية
                  </button>
                </div>

                {/* Image Preview & URL */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Image URL
                  </label>
                  <div className="flex gap-4">
                    <div className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-white/10'
                    }`}>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white text-gray-900'
                          : 'border-white/10 bg-white/5 text-white'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    />
                  </div>
                </div>

                {/* English Fields */}
                {activeTab === 'en' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Topic
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                  </div>
                )}

                {/* Arabic Fields */}
                {activeTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          الاسم
                        </label>
                        <input
                          type="text"
                          value={formData.name_ar}
                          onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          المنصب
                        </label>
                        <input
                          type="text"
                          value={formData.role_ar}
                          onChange={(e) => setFormData(prev => ({ ...prev, role_ar: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        الشركة
                      </label>
                      <input
                        type="text"
                        value={formData.company_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_ar: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        الموضوع
                      </label>
                      <input
                        type="text"
                        value={formData.topic_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, topic_ar: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        النبذة
                      </label>
                      <textarea
                        rows={3}
                        value={formData.bio_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio_ar: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/10">
                  <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {lang === 'ar' ? 'روابط التواصل' : 'Social Links'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Linkedin size={14} /> LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/..."
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Twitter size={14} /> Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="https://twitter.com/..."
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Globe size={14} /> Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://..."
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                  </div>
                </div>

                {/* Order & Visibility */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/10">
                  <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {lang === 'ar' ? 'الترتيب والرؤية' : 'Order & Visibility'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Order Index
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.order_index}
                        onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-white/10 bg-white/5 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                    </div>
                    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-white/5'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                        {lang === 'ar' ? 'متحدث مميز' : 'Featured Speaker'}
                      </span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-white/5'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                        {lang === 'ar' ? 'نشط (مرئي)' : 'Active (Visible)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving 
                      ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                      : (editingSpeaker ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add'))}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeakerManager;
