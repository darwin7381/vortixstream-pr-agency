import React from 'react';
import { cn, materialIconVariants, MaterialIconVariant } from './utils';

export interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon name from Google Material Icons */
  name: string;
  /** Icon variant style */
  variant?: MaterialIconVariant;
  /** Icon size */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | number;
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

/**
 * Material Icon component for Google Fonts Material Icons
 * 
 * @example
 * // Basic usage
 * <MaterialIcon name="home" />
 * 
 * // With variant and size
 * <MaterialIcon name="favorite" variant="outlined" size="lg" />
 * 
 * // With custom styles
 * <MaterialIcon 
 *   name="star" 
 *   variant="round" 
 *   className="text-yellow-500 hover:text-yellow-600" 
 * />
 */
export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  variant = 'filled',
  size = 'base',
  className,
  style,
  ...props
}) => {
  const baseClass = materialIconVariants[variant];
  
  const sizeClass = typeof size === 'number' 
    ? undefined 
    : sizeClasses[size];
    
  const customStyle = typeof size === 'number' 
    ? { fontSize: `${size}px`, ...style }
    : style;

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

// Export commonly used icons as constants for better developer experience
export const MATERIAL_ICONS = {
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
  
  // Communication
  EMAIL: 'email',
  PHONE: 'phone',
  MESSAGE: 'message',
  CHAT: 'chat',
  
  // Social
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  
  // Business
  BUSINESS: 'business',
  WORK: 'work',
  PAYMENT: 'payment',
  ACCOUNT_BALANCE: 'account_balance',
  TRENDING_UP: 'trending_up',
  ANALYTICS: 'analytics',
  
  // Technology
  COMPUTER: 'computer',
  SMARTPHONE: 'smartphone',
  CLOUD: 'cloud',
  WIFI: 'wifi',
  BLUETOOTH: 'bluetooth',
  
  // Media
  PLAY_ARROW: 'play_arrow',
  PAUSE: 'pause',
  STOP: 'stop',
  VOLUME_UP: 'volume_up',
  VOLUME_OFF: 'volume_off',
  
  // Status
  CHECK: 'check',
  CHECK_CIRCLE: 'check_circle',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  
  // UI Elements
  STAR: 'star',
  FAVORITE: 'favorite',
  BOOKMARK: 'bookmark',
  VISIBILITY: 'visibility',
  VISIBILITY_OFF: 'visibility_off',
  
  // Location
  LOCATION_ON: 'location_on',
  MAP: 'map',
  PLACE: 'place',
  
  // Time
  ACCESS_TIME: 'access_time',
  SCHEDULE: 'schedule',
  EVENT: 'event',
  
  // Files
  FOLDER: 'folder',
  FOLDER_OPEN: 'folder_open',
  DESCRIPTION: 'description',
  PICTURE_AS_PDF: 'picture_as_pdf',
  
  // Settings
  SETTINGS: 'settings',
  TUNE: 'tune',
  BUILD: 'build',
  
  // Security
  LOCK: 'lock',
  LOCK_OPEN: 'lock_open',
  SECURITY: 'security',
  VERIFIED_USER: 'verified_user',
} as const;

export default MaterialIcon;