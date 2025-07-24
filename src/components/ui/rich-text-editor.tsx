import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Search,
  Printer,
  Eye,
  Type,
  Palette
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

// Custom Quill formats for variable highlighting
const Inline = Quill.import('blots/inline');

class VariableBlot extends Inline {
  static blotName = 'variable';
  static tagName = 'span';
  static className = 'ql-variable';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('data-variable', value);
    node.textContent = value;
    node.style.backgroundColor = '#e3f2fd';
    node.style.color = '#1976d2';
    node.style.padding = '2px 4px';
    node.style.borderRadius = '3px';
    node.style.fontWeight = 'bold';
    return node;
  }

  static formats(node: HTMLElement) {
    return node.getAttribute('data-variable');
  }
}

Quill.register(VariableBlot);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start creating your email template content...",
  className = "",
  minHeight = "300px"
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [showLinkDialog, setShowLinkDialog] = React.useState(false);
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showTableDialog, setShowTableDialog] = React.useState(false);
  const [showFindDialog, setShowFindDialog] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkText, setLinkText] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');
  const [tableRows, setTableRows] = React.useState(3);
  const [tableCols, setTableCols] = React.useState(3);
  const [findText, setFindText] = React.useState('');
  const [replaceText, setReplaceText] = React.useState('');

  // Font families
  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Trebuchet MS'
  ];

  // Font sizes
  const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];

  // Custom toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': fontFamilies }],
        [{ 'size': fontSizes }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image',
    'variable'
  ];

  // Handle variable insertion
  const insertVariable = useCallback((variableName: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, `{{${variableName}}}`, 'variable', `{{${variableName}}}`);
      }
    }
  }, []);

  // Handle link insertion
  const handleInsertLink = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill && linkUrl && linkText) {
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, linkText, 'link', linkUrl);
      }
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  }, [linkUrl, linkText]);

  // Handle image insertion
  const handleInsertImage = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill && imageUrl) {
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', imageUrl);
        if (imageAlt) {
          // Add alt text to the image
          const img = quill.root.querySelector('img:last-child');
          if (img) {
            img.setAttribute('alt', imageAlt);
          }
        }
      }
    }
    setShowImageDialog(false);
    setImageUrl('');
    setImageAlt('');
  }, [imageUrl, imageAlt]);

  // Handle table insertion
  const handleInsertTable = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        let tableHTML = '<table style="border-collapse: collapse; width: 100%;">';

        // Create header row
        tableHTML += '<tr>';
        for (let j = 0; j < tableCols; j++) {
          tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header ' + (j + 1) + '</th>';
        }
        tableHTML += '</tr>';

        // Create data rows
        for (let i = 1; i < tableRows; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < tableCols; j++) {
            tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">Cell ' + i + ',' + (j + 1) + '</td>';
          }
          tableHTML += '</tr>';
        }
        tableHTML += '</table><p><br></p>';

        quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      }
    }
    setShowTableDialog(false);
  }, [tableRows, tableCols]);

  // Handle find and replace
  const handleFindReplace = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill && findText) {
      const text = quill.getText();
      const index = text.indexOf(findText);

      if (index !== -1) {
        quill.setSelection(index, findText.length);

        if (replaceText) {
          quill.deleteText(index, findText.length);
          quill.insertText(index, replaceText);
        }
      } else {
        // Show toast that text not found
        console.log('Text not found');
      }
    }
  }, [findText, replaceText]);

  // Handle undo
  const handleUndo = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.history.undo();
    }
  }, []);

  // Handle redo
  const handleRedo = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.history.redo();
    }
  }, []);

  // Handle content change with variable detection
  const handleChange = useCallback((content: string) => {
    // Detect and highlight variables
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let processedContent = content;
    
    // Replace variable patterns with custom format
    processedContent = processedContent.replace(variableRegex, (match, variableName) => {
      return `<span class="ql-variable" data-variable="${match}" style="background-color: #e3f2fd; color: #1976d2; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${match}</span>`;
    });

    onChange(processedContent);
  }, [onChange]);

  // Sanitize content for security
  const sanitizedValue = useMemo(() => {
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'ol', 'ul', 'li', 'a', 'img', 'table', 'tr', 'td', 'th', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'style', 'class', 'data-variable', 'target']
    });
  }, [value]);

  // Print functionality
  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Email Template Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .ql-variable { background-color: #e3f2fd; color: #1976d2; padding: 2px 4px; border-radius: 3px; font-weight: bold; }
            </style>
          </head>
          <body>
            ${sanitizedValue}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [sanitizedValue]);

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Custom Toolbar */}
      <div className="custom-toolbar">
        {/* Variable Insertion */}
        <div className="toolbar-group">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="variable-button"
            onClick={() => insertVariable('candidateName')}
            title="Insert Candidate Name"
          >
            {`{{candidateName}}`}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="variable-button"
            onClick={() => insertVariable('position')}
            title="Insert Position"
          >
            {`{{position}}`}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="variable-button"
            onClick={() => insertVariable('company')}
            title="Insert Company"
          >
            {`{{company}}`}
          </Button>
        </div>

        {/* Separator */}
        <div className="toolbar-separator" />

        {/* Action Buttons */}
        <div className="toolbar-group">
        {/* Link Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="Insert Link">
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>Add a link to your email template</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText">Link Text</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              <Button onClick={handleInsertLink} disabled={!linkUrl || !linkText}>
                Insert Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="Insert Image">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>Add an image to your email template</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Alt Text (Optional)</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image"
                />
              </div>
              <Button onClick={handleInsertImage} disabled={!imageUrl}>
                Insert Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="Preview">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Template Preview</DialogTitle>
              <DialogDescription>Preview how your email template will look</DialogDescription>
            </DialogHeader>
            <div 
              className="prose max-w-none p-4 border rounded-md bg-white"
              dangerouslySetInnerHTML={{ __html: sanitizedValue }}
            />
          </DialogContent>
        </Dialog>

        {/* Table Dialog */}
        <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="Insert Table">
              <Table className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Table</DialogTitle>
              <DialogDescription>Create a table for your email template</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableRows">Number of Rows</Label>
                <Input
                  id="tableRows"
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                />
              </div>
              <div>
                <Label htmlFor="tableCols">Number of Columns</Label>
                <Input
                  id="tableCols"
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                />
              </div>
              <Button onClick={handleInsertTable}>
                Insert Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Find and Replace Dialog */}
        <Dialog open={showFindDialog} onOpenChange={setShowFindDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="Find & Replace">
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Find & Replace</DialogTitle>
              <DialogDescription>Search and replace text in your template</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="findText">Find</Label>
                <Input
                  id="findText"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Enter text to find"
                />
              </div>
              <div>
                <Label htmlFor="replaceText">Replace with</Label>
                <Input
                  id="replaceText"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement text"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleFindReplace} disabled={!findText}>
                  Find & Replace
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Undo/Redo Buttons */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        {/* Print Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrint}
          title="Print Preview"
        >
          <Printer className="h-4 w-4" />
        </Button>
        </div>
      </div>

      {/* Quill Editor */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          minHeight: minHeight,
          backgroundColor: 'white'
        }}
      />

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground mt-2">
        Use the variable buttons above to insert dynamic content like {`{{candidateName}}`}, {`{{position}}`}, etc.
        Variables will be highlighted in blue for easy identification.
      </p>
    </div>
  );
};

export default RichTextEditor;
