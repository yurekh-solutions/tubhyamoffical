import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  canGoPrev,
  canGoNext,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-secondary/50"
      >
        <ChevronLeft size={18} />
        <span className="text-sm font-medium">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="px-2 py-2 text-muted-foreground">
                …
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground border border-primary'
                  : 'border border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-secondary/50"
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight size={18} />
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
