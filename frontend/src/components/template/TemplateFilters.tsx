import { Search, X } from 'lucide-react';
import { TEMPLATE_CATEGORIES, INDUSTRY_TAGS, SORT_OPTIONS } from '../../constants/templateData';

interface TemplateFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalResults: number;
}

export default function TemplateFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedIndustry,
  setSelectedIndustry,
  sortBy,
  setSortBy,
  totalResults
}: TemplateFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedIndustry !== '全部';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedIndustry('全部');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates by name, category, or keyword..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white text-[16px] font-sans placeholder:text-white/40 focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white text-[14px] font-sans focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all cursor-pointer"
            >
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#1a1a1a]">
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
              ▼
            </div>
          </div>

          {/* Industry Filter */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white text-[14px] font-sans focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all cursor-pointer"
            >
              {INDUSTRY_TAGS.map((tag) => (
                <option key={tag} value={tag} className="bg-[#1a1a1a]">
                  {tag === 'All' ? 'All Industries' : tag}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
              ▼
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-[14px] font-sans font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort & Results Count */}
        <div className="flex items-center gap-4">
          <div className="text-white/60 text-[14px] font-sans whitespace-nowrap">
            <span className="text-[#FF7400] font-bold">{totalResults}</span> {totalResults === 1 ? 'template' : 'templates'}
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white text-[14px] font-sans focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-white/60 text-[12px] font-sans">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-[#FF7400]/20 border border-[#FF7400]/40 text-[#FF7400] text-[12px] font-sans font-semibold px-3 py-1 rounded-full">
              Keyword: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-[#FF7400]/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#FF7400]/20 border border-[#FF7400]/40 text-[#FF7400] text-[12px] font-sans font-semibold px-3 py-1 rounded-full">
              Category: {TEMPLATE_CATEGORIES.find(c => c.value === selectedCategory)?.label}
              <button
                onClick={() => setSelectedCategory('all')}
                className="hover:bg-[#FF7400]/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedIndustry !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#FF7400]/20 border border-[#FF7400]/40 text-[#FF7400] text-[12px] font-sans font-semibold px-3 py-1 rounded-full">
              Industry: {selectedIndustry}
              <button
                onClick={() => setSelectedIndustry('All')}
                className="hover:bg-[#FF7400]/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

