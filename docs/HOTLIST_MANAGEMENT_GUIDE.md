# Hotlist Management System

## Overview

The Hotlist Management system enables efficient creation, scheduling, and tracking of candidate email campaigns. It provides batch management, subject line customization, scheduling automation, and comprehensive performance analytics.

## Features

### 1. Hotlist Creation and Management
- **Batch Selection**: Choose candidates from available bench resources
- **Customizable Batch Sizes**: Configure the number of candidates per hotlist
- **Work Authorization Control**: Option to include/exclude work authorization details
- **Template Management**: Save and reuse email templates and subject lines

### 2. Subject Builder
- **Tokenized Templates**: Use dynamic tokens for personalization
- **Token Categories**: Candidate, Company, Job, and Custom tokens
- **Live Preview**: See how subjects will appear with real data
- **Template Library**: Save frequently used subject templates

### 3. Scheduling System
- **Multiple Schedule Types**: Immediate, Daily, Weekly, Bi-weekly, Custom
- **Time Zone Support**: Configure send times with timezone awareness
- **Auto-Lock Feature**: Automatically lock hotlists after sending
- **Recurring Campaigns**: Set up ongoing hotlist campaigns

### 4. Performance Analytics
- **Email Tracking**: Monitor opens, clicks, and responses
- **Conversion Metrics**: Track interviews and placements
- **Response Time Analysis**: Measure vendor response times
- **Revenue Tracking**: Monitor placement revenue and ROI

## User Roles and Permissions

### Administrator
- Full access to all hotlist features
- Can create, edit, and delete hotlists
- Access to all analytics and reports
- Can manage system settings

### Bench Sales
- Can create and manage hotlists
- Full access to analytics
- Can view work authorization details
- Can manage email templates

### Account Manager
- Can create hotlists for their accounts only
- Limited analytics access (own accounts)
- Can view work authorization details
- Can use existing templates

### CIO/CTO
- Read-only access to hotlists
- Full analytics access
- Cannot create new hotlists
- Can view work authorization details

### Recruiter
- Read-only access to hotlists
- Limited analytics access
- Cannot view work authorization details

## Getting Started

### Creating a Hotlist

1. **Navigate to Hotlist Management**
   - Click "Hotlist Management" in the sidebar
   - Select "Create Hotlist"

2. **Basic Information**
   - Enter hotlist name and description
   - Set batch size (number of candidates)
   - Choose work authorization visibility

3. **Select Candidates**
   - Browse available bench resources
   - Use filters to find specific skills/roles
   - Select candidates up to batch size limit

4. **Configure Email Content**
   - Use Subject Builder for dynamic subject lines
   - Select or create email template
   - Preview email content

5. **Set Schedule**
   - Choose schedule type (immediate, daily, weekly, etc.)
   - Configure time and timezone
   - Set end conditions if needed

6. **Review and Send**
   - Review all settings
   - Save as draft or schedule/send immediately

### Using the Subject Builder

1. **Access the Builder**
   - Available during hotlist creation
   - Also accessible from Templates menu

2. **Add Tokens**
   - Browse available tokens by category
   - Click tokens to insert into subject line
   - Use search to find specific tokens

3. **Preview Results**
   - See live preview with sample data
   - Verify token replacement works correctly

4. **Save Templates**
   - Save frequently used subjects as templates
   - Organize by category
   - Reuse across multiple hotlists

### Managing Schedules

1. **Immediate Sending**
   - Hotlist sent immediately upon creation
   - Use for urgent requirements

2. **Recurring Schedules**
   - Set up daily, weekly, or bi-weekly sends
   - Configure specific days and times
   - Set end dates or maximum occurrences

3. **Custom Schedules**
   - Define custom intervals
   - Set specific send times
   - Configure timezone preferences

## Available Tokens

### Candidate Tokens
- `{{candidate_name}}` - Full name
- `{{candidate_first_name}}` - First name only
- `{{candidate_skills}}` - Key skills
- `{{candidate_experience}}` - Years of experience
- `{{candidate_location}}` - Location preference

### Company Tokens
- `{{company_name}}` - Your company name
- `{{sender_name}}` - Email sender name
- `{{sender_title}}` - Sender's job title

### Job Tokens
- `{{job_title}}` - Position title
- `{{job_location}}` - Job location
- `{{job_type}}` - Employment type
- `{{client_name}}` - End client name

### Custom Tokens
- `{{current_date}}` - Today's date
- `{{urgency}}` - Urgency indicator
- `{{batch_number}}` - Batch sequence number

## API Endpoints

### Hotlists
- `GET /api/hotlists` - List hotlists with filtering
- `GET /api/hotlists/:id` - Get specific hotlist
- `POST /api/hotlists` - Create new hotlist
- `PUT /api/hotlists/:id` - Update hotlist
- `DELETE /api/hotlists/:id` - Delete hotlist

### Candidates
- `GET /api/hotlists/:id/candidates` - Get hotlist candidates
- `POST /api/hotlists/:id/candidates` - Add candidates to hotlist
- `PUT /api/hotlist-candidates/:id` - Update candidate status
- `DELETE /api/hotlist-candidates/:id` - Remove candidate

### Scheduling
- `POST /api/hotlists/:id/schedule` - Schedule hotlist
- `POST /api/hotlists/:id/send` - Send immediately
- `POST /api/hotlists/:id/cancel` - Cancel scheduled send

### Analytics
- `GET /api/hotlists/analytics` - Get analytics data
- `GET /api/hotlists/:id/metrics` - Get hotlist performance
- `GET /api/hotlists/stats` - Get summary statistics

### Templates
- `GET /api/hotlists/subject-templates` - List templates
- `POST /api/hotlists/subject-templates` - Create template
- `PUT /api/hotlists/subject-templates/:id` - Update template
- `DELETE /api/hotlists/subject-templates/:id` - Delete template

## Data Models

### Hotlist
```typescript
interface Hotlist {
  id: string;
  name: string;
  description?: string;
  batchSize: number;
  status: 'draft' | 'scheduled' | 'sent' | 'completed' | 'cancelled';
  emailTemplateId?: string;
  subjectTemplate?: string;
  emailContent?: string;
  scheduleType: 'immediate' | 'daily' | 'weekly' | 'bi_weekly' | 'custom';
  scheduleConfig?: ScheduleConfig;
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
  targetAudience?: string[];
  showWorkAuthorization: boolean;
  autoLockEnabled: boolean;
  lockedAt?: string;
  lockedBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### HotlistCandidate
```typescript
interface HotlistCandidate {
  id: string;
  hotlistId: string;
  benchResourceId: string;
  employeeId: string;
  positionInBatch: number;
  includeWorkAuthorization: boolean;
  customNotes?: string;
  status: 'selected' | 'sent' | 'responded' | 'interviewed' | 'placed' | 'rejected';
  sentAt?: string;
  responseReceivedAt?: string;
  vendorResponse?: string;
  vendorEmail?: string;
  interviewScheduledAt?: string;
  placementConfirmedAt?: string;
  rejectionReason?: string;
}
```

## Performance Analytics

### Key Metrics
- **Open Rate**: Percentage of emails opened
- **Click Rate**: Percentage of emails clicked
- **Response Rate**: Percentage of vendor responses
- **Conversion Rate**: Percentage leading to placements
- **Average Response Time**: Time from send to response
- **Revenue per Hotlist**: Total placement revenue

### Tracking Events
- Email sent
- Email opened
- Email clicked
- Vendor reply received
- Interview scheduled
- Placement confirmed

### Reports Available
- Hotlist performance comparison
- Trend analysis over time
- Top performing subject lines
- Vendor response patterns
- Revenue attribution

## Best Practices

### Hotlist Creation
1. **Targeted Selection**: Choose candidates that match specific requirements
2. **Batch Sizing**: Optimal batch sizes are typically 5-15 candidates
3. **Work Authorization**: Include only when relevant to the position
4. **Quality over Quantity**: Focus on relevant, qualified candidates

### Subject Line Optimization
1. **Personalization**: Use candidate and job tokens for relevance
2. **Clarity**: Be clear about the opportunity
3. **Urgency**: Include urgency indicators when appropriate
4. **A/B Testing**: Test different subject lines for effectiveness

### Scheduling Strategy
1. **Timing**: Send during business hours in recipient timezone
2. **Frequency**: Avoid over-sending to the same vendors
3. **Consistency**: Maintain regular sending schedules
4. **Monitoring**: Track performance and adjust timing

### Analytics Usage
1. **Regular Review**: Monitor performance weekly
2. **Trend Analysis**: Look for patterns in response rates
3. **Optimization**: Use data to improve future hotlists
4. **ROI Tracking**: Monitor revenue per hotlist

## Troubleshooting

### Common Issues

**Hotlist not sending**
- Check schedule configuration
- Verify candidates are selected
- Ensure email template is complete
- Check for system errors in logs

**Low open rates**
- Review subject line effectiveness
- Check send timing
- Verify email deliverability
- Consider sender reputation

**Missing analytics data**
- Ensure tracking pixels are enabled
- Check email client compatibility
- Verify analytics service is running
- Review data collection settings

**Permission errors**
- Verify user role assignments
- Check hotlist ownership
- Ensure account access permissions
- Contact administrator for role updates

### Support
For technical issues or feature requests, contact the development team or submit a support ticket.

## Changelog

### Version 1.0.0
- Initial release of Hotlist Management system
- Subject Builder with tokenization
- Scheduling system with multiple options
- Performance analytics and tracking
- Role-based access controls
- Template management system
