# Shar'AI - Shariah Compliance Analysis Platform

## Overview

Shar'AI is a modern full-stack web application that provides AI-powered Shariah compliance analysis for contract documents. The platform allows users to upload contracts and receive instant feedback on Islamic financial compliance, with intelligent suggestions for problematic clauses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with custom providers
- **Routing**: React Router v6 for client-side navigation
- **Animation**: Framer Motion for smooth transitions and micro-interactions
- **Data Fetching**: TanStack React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **File Upload**: Cloudinary integration for document storage
- **Authentication**: JWT-based authentication with session management

### UI/UX Design System
- **Theme System**: Light/dark mode with smooth transitions
- **Internationalization**: English and Arabic support with RTL layout
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Accessibility**: WCAG compliant with keyboard navigation support

## Key Components

### Authentication System
- **Guest Mode**: Users can access the platform without registration
- **User Registration**: Email/password authentication
- **Role-based Access**: Regular users and Shariah experts
- **Session Management**: Persistent authentication state

### Document Analysis Pipeline
1. **File Upload**: Support for PDF, DOCX, and TXT formats
2. **Text Extraction**: Automated content parsing
3. **AI Analysis**: Shariah compliance assessment
4. **Term Identification**: Flagging of problematic clauses
5. **Suggestion Generation**: AI-powered alternative recommendations
6. **Document Generation**: Modified and marked contract versions

### Multi-language Support
- **Languages**: English and Arabic
- **RTL Support**: Complete right-to-left layout for Arabic
- **Dynamic Switching**: Real-time language toggling
- **Localized Content**: Comprehensive translation system

### Real-time Features
- **Progress Tracking**: Live upload and analysis progress
- **Interactive Feedback**: User confirmation and editing of suggestions
- **Question System**: AI-powered Q&A for contract clarification

## Data Flow

1. **User uploads contract** → File sent to Cloudinary for storage
2. **Backend processes document** → Text extraction and AI analysis
3. **Analysis results stored** → Database persistence with session management
4. **Frontend displays results** → Interactive term-by-term review
5. **User interactions tracked** → Confirmations and edits saved
6. **Final documents generated** → PDF and DOCX exports available

## External Dependencies

### Database & Storage
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Cloudinary**: Document storage and processing
- **Drizzle Kit**: Database migrations and schema management

### Authentication & Security
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing (inferred from auth patterns)
- **CORS**: Cross-origin request handling

### UI & Animation Libraries
- **Radix UI**: Headless component primitives
- **Framer Motion**: Animation and gesture library
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling

### Development Tools
- **ESBuild**: Fast bundling for production
- **TSX**: TypeScript execution for development
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` with hot reloading
- **Database**: Drizzle push for schema updates
- **Environment**: NODE_ENV=development with Vite dev server

### Production Deployment
- **Build Process**: Vite build for frontend, ESBuild for backend
- **Server**: Express.js serving static files and API routes
- **Database**: PostgreSQL with connection string from environment
- **Port Configuration**: Configurable port (default 5000)

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Auto-deployment**: Configured for autoscale deployment target
- **Port Mapping**: Internal port 5000 mapped to external port 80

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```