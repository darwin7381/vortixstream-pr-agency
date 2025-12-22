import React from 'react';
import { cn } from './utils';

export interface MaterialSymbolProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Symbol name from Google Material Symbols */
  name: string;
  /** Symbol variant style */
  variant?: 'outlined' | 'rounded' | 'sharp';
  /** Symbol size */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | number;
  /** Fill level (0-1) */
  fill?: 0 | 1;
  /** Weight (100-700) */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Optical size (20-48) */
  opticalSize?: number;
  /** Grade (-50 to 200) */
  grade?: number;
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',     // 12px
  sm: 'text-sm',     // 14px
  base: 'text-base', // 16px
  lg: 'text-lg',     // 18px
  xl: 'text-xl',     // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
};

const variantClasses = {
  outlined: 'material-symbols-outlined',
  rounded: 'material-symbols-rounded', 
  sharp: 'material-symbols-sharp',
};

/**
 * Material Symbol component for Google Fonts Material Symbols
 * 支援新一代的 Material Symbols 系統，包含 ev_shadow 等圖標
 * 
 * @example
 * // 基本用法
 * <MaterialSymbol name="ev_shadow" />
 * 
 * // 帶變體和尺寸
 * <MaterialSymbol name="ev_shadow" variant="outlined" size="lg" />
 * 
 * // 帶自訂樣式和屬性
 * <MaterialSymbol 
 *   name="ev_shadow" 
 *   variant="rounded" 
 *   size={24}
 *   fill={1}
 *   weight={500}
 *   className="text-orange-500 hover:text-orange-600" 
 * />
 */
export const MaterialSymbol: React.FC<MaterialSymbolProps> = ({
  name,
  variant = 'outlined',
  size = 'base',
  fill = 0,
  weight = 400,
  opticalSize = 24,
  grade = 0,
  className,
  style,
  ...props
}) => {
  const baseClass = variantClasses[variant];
  
  const sizeClass = typeof size === 'number' 
    ? undefined 
    : sizeClasses[size];
    
  const customStyle = typeof size === 'number' 
    ? { 
        fontSize: `${size}px`, 
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        ...style 
      }
    : { 
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        ...style 
      };

  return (
    <span
      className={cn(
        baseClass,
        sizeClass,
        'inline-block leading-none select-none',
        className
      )}
      style={customStyle}
      {...props}
    >
      {name}
    </span>
  );
};

// Export commonly used Material Symbols constants
export const MATERIAL_SYMBOLS = {
  // Electric Vehicle & Energy
  EV_SHADOW: 'ev_shadow',
  ELECTRIC_CAR: 'electric_car',
  ELECTRIC_BOLT: 'electric_bolt',
  BATTERY_CHARGING_FULL: 'battery_charging_full',
  ENERGY_SAVINGS_LEAF: 'energy_savings_leaf',
  POWER: 'power',
  FLASH_ON: 'flash_on',
  
  // Navigation
  HOME: 'home',
  MENU: 'menu',
  CLOSE: 'close',
  ARROW_BACK: 'arrow_back',
  ARROW_FORWARD: 'arrow_forward',
  EXPAND_MORE: 'expand_more',
  EXPAND_LESS: 'expand_less',
  
  // Actions
  SEARCH: 'search',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SAVE: 'save',
  SHARE: 'share',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  
  // Status & Feedback
  CHECK: 'check',
  CHECK_CIRCLE: 'check_circle',
  DONE: 'done',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  
  // Communication
  EMAIL: 'email',
  PHONE: 'phone',
  MESSAGE: 'message',
  CHAT: 'chat',
  
  // Media & Content
  PLAY_ARROW: 'play_arrow',
  PAUSE: 'pause',
  STOP: 'stop',
  VOLUME_UP: 'volume_up',
  VOLUME_OFF: 'volume_off',
  
  // UI Elements
  STAR: 'star',
  FAVORITE: 'favorite',
  BOOKMARK: 'bookmark',
  VISIBILITY: 'visibility',
  VISIBILITY_OFF: 'visibility_off',
  
  // Settings & Tools
  SETTINGS: 'settings',
  TUNE: 'tune',
  BUILD: 'build',
  
  // Security
  LOCK: 'lock',
  LOCK_OPEN: 'lock_open',
  SECURITY: 'security',
} as const;

export default MaterialSymbol;