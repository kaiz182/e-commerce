import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const BlurCircle = ({
  // Position props
  top = "auto",
  left = "auto", 
  right = "auto",
  bottom = "auto",
  
  // Size props
  size = 58,
  width,
  height,
  
  // Appearance props
  color = "primary",
  opacity = 0.3,
  blur = "3xl",
  
  // Animation props
  animate = false,
  animationType = "pulse",
  animationDuration = "3s",
  animationDelay = "0s",
  
  // Additional props
  className = "",
  gradient = false,
  gradientFrom,
  gradientTo,
  zIndex = -50,
  
  // Responsive props
  responsive = false,
  smSize,
  mdSize,
  lgSize,
  xlSize,
  
  // Interaction props
  interactive = false,
  hoverScale = 1.1,
  
  // Custom styles
  style = {},
  
  // Accessibility
  ariaHidden = true
}) => {
  
  // Color mapping for predefined colors
  const colorMap = {
    primary: 'bg-red-500',
    secondary: 'bg-blue-500', 
    accent: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
    info: 'bg-cyan-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
    orange: 'bg-orange-500'
  };

  // Blur size mapping
  const blurMap = {
    'sm': 'blur-sm',
    'md': 'blur-md', 
    'lg': 'blur-lg',
    'xl': 'blur-xl',
    '2xl': 'blur-2xl',
    '3xl': 'blur-3xl'
  };

  // Animation mapping
  const animationMap = {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
    ping: 'animate-ping',
    float: 'animate-[float_6s_ease-in-out_infinite]',
    glow: 'animate-[glow_4s_ease-in-out_infinite_alternate]',
    breathe: 'animate-[breathe_4s_ease-in-out_infinite]'
  };

  // Generate dynamic classes
  const dynamicClasses = useMemo(() => {
    let classes = ['absolute', 'rounded-full', 'pointer-events-none'];
    
    // Base color or gradient
    if (gradient && gradientFrom && gradientTo) {
      classes.push(`bg-gradient-radial from-${gradientFrom} to-${gradientTo}`);
    } else if (gradient) {
      classes.push('bg-gradient-radial from-current to-transparent');
    } else {
      const baseColor = colorMap[color] || color.startsWith('bg-') ? color : `bg-${color}`;
      classes.push(baseColor);
    }
    
    // Opacity
    if (typeof opacity === 'number') {
      const opacityValue = Math.round(opacity * 100);
      classes.push(`opacity-${opacityValue}`);
    } else {
      classes.push(`opacity-${Math.round(parseFloat(opacity) * 100)}`);
    }
    
    // Blur
    classes.push(blurMap[blur] || `blur-${blur}`);
    
    // Size classes
    const finalWidth = width || size;
    const finalHeight = height || size;
    
    if (responsive) {
      // Responsive sizes
      if (smSize) classes.push(`sm:w-${smSize} sm:h-${smSize}`);
      if (mdSize) classes.push(`md:w-${mdSize} md:h-${mdSize}`);
      if (lgSize) classes.push(`lg:w-${lgSize} lg:h-${lgSize}`);
      if (xlSize) classes.push(`xl:w-${xlSize} xl:h-${xlSize}`);
      
      // Base size for mobile
      classes.push(`w-${finalWidth} h-${finalHeight}`);
    } else {
      classes.push(`w-${finalWidth} h-${finalHeight}`);
    }
    
    // Animation
    if (animate) {
      classes.push(animationMap[animationType] || animationType);
    }
    
    // Interactive effects
    if (interactive) {
      classes.push('transition-transform duration-500 ease-out');
      classes.push(`hover:scale-${hoverScale.toString().replace('.', '')}`);
      classes.push('cursor-pointer pointer-events-auto');
    }
    
    return classes.join(' ');
  }, [color, opacity, blur, size, width, height, animate, animationType, interactive, hoverScale, responsive, smSize, mdSize, lgSize, xlSize, gradient, gradientFrom, gradientTo]);

  // Generate inline styles
  const inlineStyles = useMemo(() => {
    const styles = {
      top,
      left, 
      right,
      bottom,
      zIndex,
      ...style
    };

    // Custom animation duration and delay
    if (animate) {
      styles.animationDuration = animationDuration;
      styles.animationDelay = animationDelay;
    }

    // Custom opacity if not predefined
    if (typeof opacity === 'number' && (opacity < 0.1 || opacity > 0.9)) {
      styles.opacity = opacity;
    }

    return styles;
  }, [top, left, right, bottom, zIndex, style, animate, animationDuration, animationDelay, opacity]);

  return (
    <div
      className={`${dynamicClasses} ${className}`}
      style={inlineStyles}
      aria-hidden={ariaHidden}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    />
  );
};

// PropTypes for better development experience
BlurCircle.propTypes = {
  // Position
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Size
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Appearance
  color: PropTypes.string,
  opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  blur: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  // Animation
  animate: PropTypes.bool,
  animationType: PropTypes.oneOf(['pulse', 'bounce', 'spin', 'ping', 'float', 'glow', 'breathe']),
  animationDuration: PropTypes.string,
  animationDelay: PropTypes.string,
  
  // Additional
  className: PropTypes.string,
  gradient: PropTypes.bool,
  gradientFrom: PropTypes.string,
  gradientTo: PropTypes.string,
  zIndex: PropTypes.number,
  
  // Responsive
  responsive: PropTypes.bool,
  smSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mdSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lgSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  xlSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Interaction
  interactive: PropTypes.bool,
  hoverScale: PropTypes.number,
  
  // Custom
  style: PropTypes.object,
  ariaHidden: PropTypes.bool
};

export default BlurCircle;