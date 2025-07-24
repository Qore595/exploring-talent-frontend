# Rich Text Editor Features Documentation

## Overview
The Rich Text Editor has been successfully integrated into the CreateEmailTemplatePage component, replacing the basic textarea with a comprehensive Microsoft Word-like editing experience.

## ✅ Implemented Features

### Essential Formatting Options
- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Font Family Selection**: Arial, Helvetica, Times New Roman, Courier New, Verdana, Georgia, Palatino, Garamond, Bookman, Trebuchet MS
- **Font Size Selection**: 10px to 36px with predefined sizes
- **Text Colors**: Full color picker for text and background colors
- **Text Alignment**: Left, Center, Right, Justify
- **Lists**: Bulleted and numbered lists with indentation controls
- **Paragraph Spacing**: Built-in paragraph and line height controls

### Advanced Features
- **Insert Links**: URL validation with custom link text
- **Insert Images**: Image URL insertion with alt text support
- **Tables**: Dynamic table creation with customizable rows and columns
- **Undo/Redo**: Full history management with 50-step stack
- **Copy/Paste**: Formatting preservation with clipboard integration
- **Find and Replace**: Text search and replacement functionality
- **Print Preview**: Dedicated print functionality with proper styling

### Template-Specific Requirements
- **Variable Placeholders**: Visual highlighting of {{variableName}} patterns
- **Quick Variable Insertion**: Dedicated buttons for common variables:
  - {{candidateName}}
  - {{position}}
  - {{company}}
- **HTML Output**: Clean HTML generation for email compatibility
- **Preview Mode**: Full-screen preview dialog with formatted content
- **Responsive Design**: Mobile-friendly interface that adapts to screen size

### Technical Implementation
- **React Integration**: Seamless integration with existing form state management
- **Form Validation**: Enhanced validation that checks for actual content (strips HTML)
- **Security**: DOMPurify integration for content sanitization
- **Performance**: Optimized with React.memo and useCallback hooks
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Component Structure

### Main Component
- **File**: `src/components/ui/rich-text-editor.tsx`
- **Styling**: `src/components/ui/rich-text-editor.css`
- **Dependencies**: react-quill, quill, dompurify

### Key Props
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}
```

## Usage Example

```tsx
import RichTextEditor from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';

const MyComponent = () => {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start creating your content..."
      minHeight="400px"
    />
  );
};
```

## Features in Detail

### 1. Variable Highlighting
- Automatically detects `{{variableName}}` patterns
- Applies blue background with bold text styling
- Hover effects for better user experience
- Monospace font for better readability

### 2. Custom Toolbar
- Organized into logical groups with separators
- Responsive design that adapts to screen size
- Tooltip support for all buttons
- Custom styling that matches the application theme

### 3. Dialog-Based Features
- **Link Dialog**: URL validation and custom link text
- **Image Dialog**: Image URL with optional alt text
- **Table Dialog**: Customizable rows and columns (1-10 each)
- **Find & Replace Dialog**: Text search and replacement
- **Preview Dialog**: Full-screen formatted content preview

### 4. Content Sanitization
- DOMPurify integration for XSS protection
- Whitelist of allowed HTML tags and attributes
- Safe handling of user-generated content

### 5. Print Functionality
- Opens content in new window for printing
- Preserves formatting and variable highlighting
- Clean print layout without editor controls

## Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support
- Mobile browsers: Responsive support

## Performance Considerations
- Lazy loading of Quill modules
- Debounced content updates
- Optimized re-renders with React hooks
- Efficient DOM manipulation

## Customization Options
- Theme customization through CSS variables
- Toolbar configuration through modules prop
- Custom formats and blots support
- Extensible plugin architecture

## Security Features
- Content sanitization with DOMPurify
- XSS protection for user input
- Safe HTML output for email templates
- Validation of URLs and image sources

## Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management and indicators

## Future Enhancements
- [ ] Spell check integration
- [ ] Grammar checking
- [ ] Template library integration
- [ ] Collaborative editing
- [ ] Version history
- [ ] Export to different formats
- [ ] Advanced table editing
- [ ] Image upload to cloud storage
- [ ] Emoji picker
- [ ] Advanced find/replace with regex

## Troubleshooting

### Common Issues
1. **Styles not loading**: Ensure CSS import is included
2. **Content not saving**: Check onChange handler implementation
3. **Variables not highlighting**: Verify regex pattern matching
4. **Print not working**: Check popup blocker settings

### Debug Mode
Enable debug mode by setting `DEBUG=true` in environment variables for detailed logging.

## Support
For technical support or feature requests, please refer to the development team or create an issue in the project repository.
