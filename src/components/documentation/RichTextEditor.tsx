import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Type,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  const toolbarButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      command: 'bold',
      title: 'Bold'
    },
    {
      icon: <Italic className="h-4 w-4" />,
      command: 'italic',
      title: 'Italic'
    },
    {
      icon: <Underline className="h-4 w-4" />,
      command: 'underline',
      title: 'Underline'
    },
    {
      icon: <List className="h-4 w-4" />,
      command: 'insertUnorderedList',
      title: 'Bullet List'
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      command: 'insertOrderedList',
      title: 'Numbered List'
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      command: 'justifyLeft',
      title: 'Align Left'
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      command: 'justifyCenter',
      title: 'Align Center'
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      command: 'justifyRight',
      title: 'Align Right'
    },
    {
      icon: <Link className="h-4 w-4" />,
      command: 'link',
      title: 'Insert Link',
      onClick: insertLink
    },
    {
      icon: <Undo className="h-4 w-4" />,
      command: 'undo',
      title: 'Undo'
    },
    {
      icon: <Redo className="h-4 w-4" />,
      command: 'redo',
      title: 'Redo'
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
          {/* Text Format Dropdown */}
          <select
            className="px-2 py-1 text-sm border rounded mr-2"
            onChange={(e) => formatBlock(e.target.value)}
            defaultValue=""
          >
            <option value="">Format</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Paragraph</option>
          </select>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Formatting Buttons */}
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={button.onClick || (() => executeCommand(button.command))}
              title={button.title}
              type="button"
            >
              {button.icon}
            </Button>
          ))}
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className={`
            min-h-[200px] p-4 outline-none prose prose-sm max-w-none
            focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            ${!value && !isEditorFocused ? 'text-muted-foreground' : ''}
          `}
          onInput={handleInput}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          suppressContentEditableWarning={true}
          style={{
            minHeight: '200px'
          }}
        />

        {/* Placeholder */}
        {!value && !isEditorFocused && (
          <div 
            className="absolute top-[60px] left-4 text-muted-foreground pointer-events-none"
            style={{ top: '60px' }}
          >
            {placeholder}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
