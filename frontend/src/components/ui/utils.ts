import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Google Material Icons variants
export type MaterialIconVariant = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone';

export const materialIconVariants: Record<MaterialIconVariant, string> = {
  filled: 'material-icons',
  outlined: 'material-icons-outlined', 
  round: 'material-icons-round',
  sharp: 'material-icons-sharp',
  'two-tone': 'material-icons-two-tone',
};

// Google Material Symbols variants (新一代圖標系統)
export type MaterialSymbolVariant = 'outlined' | 'rounded' | 'sharp';

export const materialSymbolVariants: Record<MaterialSymbolVariant, string> = {
  outlined: 'material-symbols-outlined',
  rounded: 'material-symbols-rounded',
  sharp: 'material-symbols-sharp',
};
