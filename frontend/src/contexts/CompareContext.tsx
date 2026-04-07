import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = 'vortixpr_compare_list';

export interface CompareItem {
  id: string;
  slug: string;
  name: string;
  price: string;
  description: string;
  badge: string | null;
  guaranteed_publications: number | null;
  features: string[];
  category_id: string;
}

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => boolean;
  removeItem: (slug: string) => void;
  clearAll: () => void;
  isInCompare: (slug: string) => boolean;
  toggleItem: (item: CompareItem) => void;
  isFull: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextType | null>(null);

function loadFromStorage(): CompareItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_COMPARE_ITEMS);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(items: CompareItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addItem = useCallback((item: CompareItem): boolean => {
    let added = false;
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      if (prev.some((i) => i.slug === item.slug)) return prev;
      added = true;
      return [...prev, item];
    });
    return added;
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isInCompare = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggleItem = useCallback(
    (item: CompareItem) => {
      if (isInCompare(item.slug)) {
        removeItem(item.slug);
      } else {
        addItem(item);
      }
    },
    [isInCompare, removeItem, addItem]
  );

  return (
    <CompareContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearAll,
        isInCompare,
        toggleItem,
        isFull: items.length >= MAX_COMPARE_ITEMS,
        count: items.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
