import { useState, useMemo, useEffect } from 'react';
import { Eye, Download, Rocket, TrendingUp, Award, Megaphone, FileText, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { templateAPI, PRTemplate } from '../../api/templateClient';
import TemplateFilters from './TemplateFilters';
import TemplatePreviewModal from './TemplatePreviewModal';
import TemplateDownloadForm from './TemplateDownloadForm';
import ComingSoonBanner from './ComingSoonBanner';

// Icon mapping
const iconMap: Record<string, any> = {
  Rocket,
  TrendingUp,
  Award,
  Megaphone,
  FileText
};

export default function TemplateContent() {
  // Data states
  const [templates, setTemplates] = useState<PRTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Modal states
  const [previewTemplate, setPreviewTemplate] = useState<PRTemplate | null>(null);
  const [downloadTemplate, setDownloadTemplate] = useState<PRTemplate | null>(null);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await templateAPI.getTemplates({ sort: sortBy });
        setTemplates(data);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError('Failed to load templates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [sortBy]);

  // Filter templates (client-side filtering for better UX)
  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.industryTags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((template) => template.category === selectedCategory);
    }

    // Industry filter
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter((template) =>
        template.industryTags.includes(selectedIndustry) ||
        template.industryTags.includes('All Industries')
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.download_count - a.download_count);
        break;
      case 'latest':
        // 假設 ID 越大越新
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
        break;
    }

    return filtered;
  }, [templates, searchQuery, selectedCategory, selectedIndustry, sortBy]);

  const handlePreview = (template: PRTemplate) => {
    setPreviewTemplate(template);
  };

  const handleDownload = (template: PRTemplate) => {
    setPreviewTemplate(null);
    setDownloadTemplate(template);
  };

  return (
    <section className="bg-black py-section-medium">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto">
        {/* Filters */}
        <TemplateFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredTemplates.length}
        />

        {/* Templates Grid */}
        <div className="mt-12">
          {loading ? (
            // Loading state
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 size={48} className="text-[#FF7400] animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-[16px] font-sans">Loading templates...</p>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-20">
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="text-white text-[24px] font-sans font-bold mb-3">
                Failed to Load Templates
              </h3>
              <p className="text-white/60 text-[16px] font-sans mb-6">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#FF7400] text-white hover:bg-[#FF7400]/90 transition-all"
              >
                Retry
              </Button>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => {
                const Icon = iconMap[template.icon] || FileText;
                return (
                  <div
                    key={template.id}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-[#FF7400]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,116,0,0.15)] group flex flex-col"
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${template.category_color}20`,
                        border: `1px solid ${template.category_color}40`
                      }}
                    >
                      <Icon size={28} style={{ color: template.category_color }} />
                    </div>

                    {/* Category Badge */}
                    <div className="inline-block mb-4">
                      <span
                        className="text-[12px] font-sans font-semibold px-3 py-1 rounded-full border"
                        style={{
                          color: template.category_color,
                          backgroundColor: `${template.category_color}10`,
                          borderColor: `${template.category_color}20`
                        }}
                      >
                        {template.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-[22px] font-sans font-bold mb-3">
                      {template.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-[14px] font-sans leading-relaxed mb-4 flex-grow line-clamp-3">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-2 mb-6 text-white/50 text-[12px] font-sans">
                      <Download size={14} />
                      <span>{template.download_count.toLocaleString()} downloads</span>
                      {template.download_count > 800 && (
                        <span className="ml-auto text-[#FF7400]">🔥 Popular</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handlePreview(template)}
                        className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all text-[14px] h-10"
                      >
                        <Eye size={14} className="mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleDownload(template)}
                        className="bg-transparent border border-[#FF7400]/40 text-[#FF7400] hover:bg-[#FF7400]/10 hover:border-[#FF7400]/60 transition-all text-[14px] h-10"
                      >
                        <Download size={14} className="mr-2" />
                        Use
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // No results
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-white text-[24px] font-sans font-bold mb-3">
                No Templates Found
              </h3>
              <p className="text-white/60 text-[16px] font-sans mb-6">
                Try adjusting your search criteria or clear all filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedIndustry('All');
                }}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Coming Soon Banner */}
        <ComingSoonBanner />
      </div>

      {/* Modals */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onDownload={handleDownload}
      />

      <TemplateDownloadForm
        template={downloadTemplate}
        isOpen={!!downloadTemplate}
        onClose={() => setDownloadTemplate(null)}
      />
    </section>
  );
}
