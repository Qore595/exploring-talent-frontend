import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubjectBuilder from '../SubjectBuilder';
import { SubjectTemplate } from '@/types/hotlists';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div data-testid="card-description" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div data-testid="card-title" {...props}>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label data-testid="label" {...props}>{children}</label>,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-testid="textarea" {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select">
      <select onChange={(e) => onValueChange?.(e.target.value)} value={value}>
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ children }: any) => <div data-testid="popover-trigger">{children}</div>,
}));

describe('SubjectBuilder', () => {
  const mockOnChange = jest.fn();
  const mockOnSaveTemplate = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onSaveTemplate: mockOnSaveTemplate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the subject builder component', () => {
    render(<SubjectBuilder {...defaultProps} />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent('Subject Builder');
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
  });

  it('should display the current value in the textarea', () => {
    const value = 'Test subject template';
    render(<SubjectBuilder {...defaultProps} value={value} />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue(value);
  });

  it('should call onChange when textarea value changes', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} />);
    
    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, 'New subject');
    
    expect(mockOnChange).toHaveBeenCalledWith('New subject');
  });

  it('should display preview when value is provided', () => {
    const value = 'Hello {{candidate_name}}, we have a {{job_title}} position';
    render(<SubjectBuilder {...defaultProps} value={value} />);
    
    // Should show preview with replaced tokens
    expect(screen.getByText(/Hello John Doe, we have a Senior Full Stack Developer position/)).toBeInTheDocument();
  });

  it('should filter tokens by category', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} />);
    
    // Find the category select
    const select = screen.getByTestId('select').querySelector('select');
    expect(select).toBeInTheDocument();
    
    // Change to candidate category
    if (select) {
      await user.selectOptions(select, 'candidate');
    }
    
    // Should show candidate tokens
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
  });

  it('should filter tokens by search term', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} />);
    
    // Find the search input
    const searchInput = screen.getAllByTestId('input')[0]; // First input is search
    await user.type(searchInput, 'name');
    
    // Should show tokens containing "name"
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
  });

  it('should insert token when token button is clicked', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} />);
    
    // Find and click a token button
    const candidateNameButton = screen.getByText('Candidate Name');
    await user.click(candidateNameButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('{{candidate_name}}');
  });

  it('should show save template form when save button is clicked', async () => {
    const user = userEvent.setup();
    const value = 'Test template {{candidate_name}}';
    render(<SubjectBuilder {...defaultProps} value={value} />);
    
    // Find and click save template button
    const saveButton = screen.getByText('Save as Template');
    await user.click(saveButton);
    
    // Should show template name input
    expect(screen.getByPlaceholderText('Enter template name...')).toBeInTheDocument();
  });

  it('should save template with correct data', async () => {
    const user = userEvent.setup();
    const value = 'Test template {{candidate_name}}';
    render(<SubjectBuilder {...defaultProps} value={value} />);
    
    // Click save template button
    const saveButton = screen.getByText('Save as Template');
    await user.click(saveButton);
    
    // Fill in template name
    const nameInput = screen.getByPlaceholderText('Enter template name...');
    await user.type(nameInput, 'My Template');
    
    // Fill in category
    const categoryInput = screen.getByPlaceholderText('Enter category (optional)...');
    await user.type(categoryInput, 'General');
    
    // Click save
    const saveTemplateButton = screen.getByText('Save Template');
    await user.click(saveTemplateButton);
    
    expect(mockOnSaveTemplate).toHaveBeenCalledWith({
      name: 'My Template',
      template: value,
      tokens: expect.arrayContaining([
        expect.objectContaining({
          id: 'candidate_name',
          label: 'Candidate Name',
          value: '{{candidate_name}}'
        })
      ]),
      category: 'General',
      isDefault: false
    });
  });

  it('should show used tokens when template contains tokens', () => {
    const value = 'Hello {{candidate_name}}, {{job_title}} position at {{company_name}}';
    render(<SubjectBuilder {...defaultProps} value={value} />);
    
    // Should show used tokens section
    expect(screen.getByText('Tokens Used in Template')).toBeInTheDocument();
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
  });

  it('should disable save button when value is empty', () => {
    render(<SubjectBuilder {...defaultProps} value="" />);
    
    const saveButton = screen.getByText('Save as Template');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when value is provided', () => {
    render(<SubjectBuilder {...defaultProps} value="Test template" />);
    
    const saveButton = screen.getByText('Save as Template');
    expect(saveButton).not.toBeDisabled();
  });

  it('should handle cursor position for token insertion', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} value="Hello  world" />);
    
    const textarea = screen.getByTestId('textarea');
    
    // Set cursor position (simulate click at position 6)
    fireEvent.click(textarea);
    
    // Click a token
    const candidateNameButton = screen.getByText('Candidate Name');
    await user.click(candidateNameButton);
    
    // Should insert token at cursor position
    expect(mockOnChange).toHaveBeenCalledWith('Hello {{candidate_name}} world');
  });

  it('should cancel template saving', async () => {
    const user = userEvent.setup();
    render(<SubjectBuilder {...defaultProps} value="Test template" />);
    
    // Open save template form
    const saveButton = screen.getByText('Save as Template');
    await user.click(saveButton);
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    // Should hide the form
    expect(screen.queryByPlaceholderText('Enter template name...')).not.toBeInTheDocument();
  });

  it('should show token descriptions in popover', () => {
    render(<SubjectBuilder {...defaultProps} />);
    
    // Should have popover triggers for tokens
    const popoverTriggers = screen.getAllByTestId('popover-trigger');
    expect(popoverTriggers.length).toBeGreaterThan(0);
  });

  it('should group tokens by category', () => {
    render(<SubjectBuilder {...defaultProps} />);
    
    // Should show category headers
    expect(screen.getByText('candidate')).toBeInTheDocument();
    expect(screen.getByText('company')).toBeInTheDocument();
    expect(screen.getByText('job')).toBeInTheDocument();
    expect(screen.getByText('custom')).toBeInTheDocument();
  });
});
