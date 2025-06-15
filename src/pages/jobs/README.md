# TalentPulse Jobs Management

This directory contains the components for the unified jobs management interface in the TalentPulse application.

## Overview

The Jobs Management interface combines the functionality of the previous separate interfaces:
- Job Listings
- Job Descriptions
- Job Matching

## Components

### UnifiedJobsPage.tsx

The main entry point for the jobs management interface. This component provides:

- Multiple view options (Table, Kanban, Cards)
- Comprehensive filtering and search capabilities
- Role-based access control
- Job assignment functionality
- Priority management
- Status tracking

### JobDetailsPage.tsx

Displays detailed information about a specific job, including:

- Job overview and description
- Candidate management
- TalentPulse matching (RAG-based candidate matching)
- Profit tracking with role-based visibility

### JobCreatePage.tsx

Provides a form for creating new jobs with:

- Detailed job information
- Profit configuration
- Client details
- Requirements and responsibilities

## Workflow

The jobs management interface supports the following workflow:

1. **Draft**: Initial job creation and configuration
2. **Published**: Job is active and visible to candidates
3. **In Progress**: Actively working on filling the position
4. **Filled/Closed**: Job has been filled or closed

## Role-Based Access

The interface provides different functionality based on user roles:

- **CEO**: Full access to all jobs and profit information across all locations
- **Branch Manager**: Access to jobs and profit information for their location
- **Marketing Head**: Access to marketing jobs across all locations
- **Marketing Supervisor**: Access to marketing jobs for their location
- **Marketing Recruiter**: Access to assigned jobs with ability to match and manage candidates
- **Marketing Associate**: Access to assigned jobs with limited editing capabilities

## TalentPulse Matching

The TalentPulse matching feature uses Retrieval-Augmented Generation (RAG) to match job requirements with candidate resumes. The system analyzes skills, experience, education, and other factors to provide a comprehensive match score.

## Profit Tracking

The interface implements two-level profit tracking:

1. **Client-to-Company**: Visible only to CEO, Branch Manager, and Marketing Supervisor
2. **Company-to-Candidate**: Visible to all employees

## Navigation

The unified jobs interface is accessible at `/jobs-management`. The previous routes (`/jobs`, `/job-descriptions`, and `/job-matching-results`) now redirect to this unified interface.
