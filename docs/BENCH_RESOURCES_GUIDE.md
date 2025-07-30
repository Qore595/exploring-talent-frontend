# Bench Resource Management System

## Overview

The Bench Resource Management system is a comprehensive solution for managing available talent resources and tracking their progress through the recruitment pipeline. It provides automated enrollment, status tracking, and role-based access controls.

## Features

### 1. Resource Management
- **Available Resources Listing**: View all bench resources with filtering and search capabilities
- **Status Pipeline**: Track resources through Available → In Hotlist → Submitted → Interviewing → Offered → Deployed
- **Resource Details**: Comprehensive profiles including skills, preferences, rates, and availability

### 2. Auto-Enrollment System
- **Automated Detection**: Automatically identifies resources becoming available based on assignment end dates
- **Alert System**: Notifies Bench Sales, Account Managers, and CIO/CTO for confirmation
- **Manual Override**: Ability to manually add candidates to the bench list
- **Configurable Settings**: Customize enrollment criteria and notification preferences

### 3. Role-Based Access Control
- **Work Authorization Visibility**: Controlled by Sales role permissions
- **Resource Management**: Different access levels based on user roles
- **Data Filtering**: Users see only resources they're authorized to access

## User Roles and Permissions

### Administrator
- Full access to all features
- Can view work authorization details
- Can manage auto-enrollment settings
- Can create, update, and delete resources

### Bench Sales
- Full resource management capabilities
- Can view work authorization details
- Can create and manage hotlists
- Can view analytics and reports

### Account Manager
- Can view and update resources for their accounts
- Can view work authorization details
- Can create hotlists for their accounts
- Limited analytics access

### CIO/CTO
- Can view all resources
- Can manage auto-enrollment settings
- Cannot create hotlists
- Full analytics access

### Recruiter
- Read-only access to resources
- Cannot view work authorization details
- Limited analytics access

### HR
- Read-only access to resources
- Cannot view work authorization details
- Basic analytics access

### Employee
- Can only view their own bench resource record
- No access to other features

## Getting Started

### Accessing Bench Resources
1. Navigate to the "Bench Resources" menu in the sidebar
2. Select "Available Resources" to view the main listing
3. Use filters and search to find specific resources

### Adding a New Resource
1. Click the "Add Resource" button (requires appropriate permissions)
2. Fill in the required information:
   - Employee selection
   - Skills summary
   - Preferred roles
   - Location flexibility
   - Availability date
   - Rate information
3. Save the resource

### Managing the Status Pipeline
1. Navigate to "Status Pipeline" from the Bench Resources menu
2. View resources organized by status columns
3. Drag and drop resources between statuses
4. Add notes when updating status

### Configuring Auto-Enrollment
1. Navigate to "Auto-Enrollment Settings" (Admin/CIO access required)
2. Configure:
   - Enable/disable auto-enrollment
   - Days before end date to trigger alerts
   - Roles to notify
   - Confirmation requirements
   - Default status for new resources

## API Endpoints

### Bench Resources
- `GET /api/bench-resources` - List resources with filtering
- `GET /api/bench-resources/:id` - Get specific resource
- `POST /api/bench-resources` - Create new resource
- `PUT /api/bench-resources/:id` - Update resource
- `DELETE /api/bench-resources/:id` - Delete resource
- `GET /api/bench-resources/stats` - Get statistics

### Auto-Enrollment
- `GET /api/bench-resources/auto-enrollment/settings` - Get settings
- `PUT /api/bench-resources/auto-enrollment/settings` - Update settings
- `POST /api/bench-resources/auto-enrollment/trigger` - Manual trigger
- `GET /api/bench-resources/auto-enrollment/alerts` - Get pending alerts
- `POST /api/bench-resources/auto-enrollment/alerts/:id/confirm` - Confirm enrollment
- `POST /api/bench-resources/auto-enrollment/alerts/:id/dismiss` - Dismiss alert

## Data Models

### BenchResource
```typescript
interface BenchResource {
  id: string;
  employeeId: string;
  skillsSummary?: string;
  preferredRoles?: string[];
  locationFlexibility: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  availabilityDate: string;
  lastRate?: number;
  desiredRate?: number;
  workAuthorization?: string;
  status: 'available' | 'in_hotlist' | 'submitted' | 'interviewing' | 'offered' | 'deployed';
  autoEnrolled: boolean;
  enrollmentSource: 'manual' | 'auto_assignment_end' | 'auto_project_completion';
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Assignment
```typescript
interface Assignment {
  id: string;
  employeeId: string;
  projectName: string;
  clientName?: string;
  role: string;
  startDate: string;
  endDate?: string;
  confirmedEndDate?: string;
  status: 'active' | 'completed' | 'terminated' | 'on_hold';
  rate?: number;
  location?: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  autoBenchEnrollment: boolean;
  benchAlertSent: boolean;
  notes?: string;
}
```

## Best Practices

### Resource Management
1. **Regular Updates**: Keep resource information current
2. **Status Tracking**: Update status promptly as resources progress
3. **Notes Documentation**: Add detailed notes for status changes
4. **Rate Management**: Keep rate information accurate and up-to-date

### Auto-Enrollment
1. **Confirmation Process**: Use confirmation alerts for quality control
2. **Regular Monitoring**: Check pending alerts regularly
3. **Settings Review**: Periodically review auto-enrollment settings
4. **Alert Management**: Respond to alerts promptly

### Security
1. **Role Compliance**: Ensure users have appropriate role assignments
2. **Work Authorization**: Protect sensitive work authorization data
3. **Data Access**: Follow principle of least privilege
4. **Audit Trail**: Monitor access and changes

## Troubleshooting

### Common Issues

**Auto-enrollment not working**
- Check if auto-enrollment is enabled in settings
- Verify assignment end dates are properly set
- Ensure assignments have auto_bench_enrollment flag set to true

**Permission denied errors**
- Verify user role assignments
- Check if user has necessary permissions for the action
- Contact administrator for role updates

**Missing work authorization data**
- Verify user has Sales role or appropriate permissions
- Check if work authorization visibility is enabled
- Ensure data is properly populated in employee records

**Resources not appearing in lists**
- Check filter settings
- Verify resource is marked as active
- Ensure user has permission to view the resource

### Support
For technical support or feature requests, contact the development team or submit a ticket through the internal support system.

## Changelog

### Version 1.0.0
- Initial release of Bench Resource Management system
- Auto-enrollment functionality
- Role-based access controls
- Status pipeline management
- Basic reporting and analytics
