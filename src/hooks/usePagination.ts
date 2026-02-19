import { useState, useMemo } from 'react';

interface UsePaginationProps {
  items: any[];
  itemsPerPage?: number;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  paginatedItems: any[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const usePagination = ({
  items,
  itemsPerPage = 15,
}: UsePaginationProps): PaginationState => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    canGoPrev,
    canGoNext,
  };
};
