import React, { useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Badge from '../ui/Badge';

const TagInput = ({ tags, setTags, maxTags = 5, error }) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle key down events
  const handleKeyDown = (e) => {
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Add a new tag
  const addTag = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      setTags([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  // Remove a tag by index
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Focus the input when clicking on the container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Handle focus and blur events
  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => {
    setIsInputFocused(false);
    // Add the current input value as a tag when the input loses focus
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags <span className="text-gray-500 text-xs">({tags.length}/{maxTags})</span>
      </label>
      
      <div 
        className={`
          flex flex-wrap items-center gap-2 p-2 border rounded-md
          ${isInputFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          min-h-[42px] cursor-text
        `}
        onClick={handleContainerClick}
      >
        {/* Render existing tags */}
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="primary"
            className="flex items-center"
          >
            {tag}
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 focus:outline-none"
            >
              <FiX size={14} />
            </button>
          </Badge>
        ))}
        
        {/* Input for new tags */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? "Add tags (press Enter or comma to add)" : ""}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[120px] outline-none border-none focus:ring-0 p-0 text-sm"
        />
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add a tag. Maximum {maxTags} tags.
      </p>
    </div>
  );
};

export default TagInput;