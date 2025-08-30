import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiEye, FiEdit2, FiHelpCircle } from 'react-icons/fi';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const MarkdownEditor = ({ value, onChange, error, placeholder }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant={isPreview ? 'outline' : 'primary'}
            size="sm"
            icon={<FiEdit2 />}
            onClick={() => setIsPreview(false)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button 
            variant={isPreview ? 'primary' : 'outline'}
            size="sm"
            icon={<FiEye />}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>
        <Button 
          variant="link" 
          size="sm"
          icon={<FiHelpCircle />}
          onClick={toggleHelp}
        >
          Markdown Help
        </Button>
      </div>
      
      {/* Editor/Preview Area */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div className="p-4 prose max-w-none h-full overflow-auto">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Nothing to preview</p>
            )}
          </div>
        ) : (
          <TextArea
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Write your content in Markdown...'}
            rows={12}
            error={error}
            className="border-none focus:ring-0"
          />
        )}
      </div>
      
      {/* Markdown Help */}
      {showHelp && (
        <div className="border-t border-gray-300 p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Markdown Cheatsheet</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1"><code># Heading 1</code></p>
              <p className="mb-1"><code>## Heading 2</code></p>
              <p className="mb-1"><code>### Heading 3</code></p>
              <p className="mb-1"><code>**Bold Text**</code></p>
              <p className="mb-1"><code>*Italic Text*</code></p>
            </div>
            <div>
              <p className="mb-1"><code>[Link Text](URL)</code></p>
              <p className="mb-1"><code>![Alt Text](Image URL)</code></p>
              <p className="mb-1"><code>- Bullet Point</code></p>
              <p className="mb-1"><code>1. Numbered List</code></p>
              <p className="mb-1"><code>```Code Block```</code></p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleHelp} 
            className="mt-2"
          >
            Close Help
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;