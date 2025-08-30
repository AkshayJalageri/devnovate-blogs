import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ 
  title, 
  subtitle, 
  content, 
  image, 
  footer, 
  link, 
  className = '',
  onClick,
  hoverEffect = true,
  rounded = true,
  shadow = true,
  padding = true,
  border = false,
  children
}) => {
  // Base classes
  const baseClasses = 'bg-white overflow-hidden';
  
  // Conditional classes
  const roundedClass = rounded ? 'rounded-lg' : '';
  const shadowClass = shadow ? 'shadow-md hover:shadow-lg' : '';
  const paddingClass = padding ? 'p-6' : '';
  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hoverEffect ? 'transition duration-300 ease-in-out transform hover:-translate-y-1' : '';
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${roundedClass} ${shadowClass} ${paddingClass} ${borderClass} ${hoverClass} ${className}`;
  
  // Card content
  const cardContent = (
    <>
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={image} 
            alt={title || 'Card image'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={padding ? '' : 'p-6'}>
        {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
        {subtitle && <h4 className="text-gray-600 text-sm mb-3">{subtitle}</h4>}
        {content && <div className="text-gray-700">{content}</div>}
        {children}
      </div>
      {footer && <div className="border-t border-gray-100 px-6 py-4">{footer}</div>}
    </>
  );
  
  // If link is provided, wrap the card in a Link component
  if (link) {
    return (
      <Link to={link} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }
  
  // If onClick is provided, make the card clickable
  if (onClick) {
    return (
      <div className={`${cardClasses} cursor-pointer`} onClick={onClick}>
        {cardContent}
      </div>
    );
  }
  
  // Default: regular card
  return <div className={cardClasses}>{cardContent}</div>;
};

export default Card;