/**
 * Responsive Design Utilities
 * 
 * Tailwind breakpoints:
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */

/**
 * Mobile-first responsive grid
 * Automatically adjusts columns based on screen size
 */
export const getResponsiveGridCols = () => ({
  // Mobile: 1 column
  // Tablet (md): 2 columns
  // Desktop (lg): 3 columns
  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
});

/**
 * Responsive spacing scale
 */
export const getResponsiveSpacing = (type: 'small' | 'medium' | 'large') => {
  const spacing = {
    small: 'px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4',
    medium: 'px-6 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8',
    large: 'px-8 py-6 md:px-12 md:py-8 lg:px-16 lg:py-12',
  };
  return spacing[type];
};

/**
 * Responsive font sizes
 */
export const getResponsiveFontSize = (type: 'heading' | 'subheading' | 'body' | 'caption') => {
  const sizes = {
    heading: 'text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base lg:text-lg',
    caption: 'text-xs md:text-sm lg:text-base',
  };
  return sizes[type];
};

/**
 * Responsive container class
 */
export const RESPONSIVE_CONTAINER = 'max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-4xl mx-auto';

/**
 * Mobile-first layout patterns
 */
export const RESPONSIVE_PATTERNS = {
  // Stacks on mobile, side-by-side on larger screens
  sidePanel: 'flex flex-col lg:flex-row gap-4 lg:gap-8',
  
  // Grid that adapts to screen size
  adaptiveGrid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  
  // Modal-friendly padding
  modalPadding: 'p-4 sm:p-6 md:p-8',
  
  // Form container
  formContainer: 'space-y-3 md:space-y-4 lg:space-y-5',
};

/**
 * Viewport height utilities
 */
export const RESPONSIVE_HEIGHTS = {
  // Full screen on mobile, fit content on desktop
  heroHeight: 'h-auto md:h-[50vh] lg:h-[60vh]',
  
  // Sticky header
  stickyHeader: 'h-16 md:h-20',
  
  // Content area
  contentArea: 'min-h-screen',
};

/**
 * Hook to detect screen size
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

import React from 'react';
