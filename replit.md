# Family Financial Literacy App

## Overview

The Family Financial Literacy App is a comprehensive web application designed to help families manage their finances, track goals, create budgets, and learn about financial literacy together. The application provides features for family financial management including budget tracking, goal setting, educational content, smart alerts, investment options, and AI-powered financial advice. Built with modern web technologies, it offers a responsive interface that works across desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query v4) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Structure**: Feature-based organization with reusable UI components in `/components/ui/`

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js for HTTP server and API routing
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database versioning
- **API Design**: RESTful endpoints with JSON data exchange
- **Error Handling**: Centralized error middleware with structured error responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL for relational data storage
- **ORM**: Drizzle ORM with Zod schema validation for type safety
- **Schema Design**: Multi-table structure supporting families, members, goals, budgets, transactions, alerts, educational content, and financial services
- **Data Types**: Support for JSON columns for flexible data structures (categories, contributors)
- **Migrations**: Automated database schema management through Drizzle migrations

### Authentication and Authorization
- **Current State**: Basic session-based approach (implementation not fully visible in codebase)
- **Family-Based Access**: Data isolation by family ID with member-level permissions
- **API Security**: Credential-based requests with error handling for unauthorized access

### External Dependencies
- **AI Integration**: Google Gemini AI for financial advice and educational content generation
- **UI Components**: Extensive use of Radix UI primitives for accessibility
- **Fonts**: Google Fonts integration (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Icons**: Font Awesome for consistent iconography
- **Development**: Replit-specific plugins for development environment integration

### Key Architectural Decisions

**Full-Stack TypeScript**: Chosen for type safety across the entire application, reducing runtime errors and improving developer experience. Shared types between client and server through the `/shared` directory.

**Component-First Design**: shadcn/ui provides a comprehensive set of accessible, customizable components that maintain design consistency while allowing for customization.

**Server State Management**: TanStack Query handles all server interactions, providing caching, background refetching, and optimistic updates, reducing the need for complex client-side state management.

**Database-First Approach**: Drizzle ORM with PostgreSQL provides strong typing from database schema to application code, ensuring data consistency and reducing migration issues.

**Mobile-Responsive Design**: Tailwind CSS breakpoints and dedicated mobile navigation ensure the application works well across all device sizes.

**Modular API Structure**: RESTful API design with clear separation of concerns, making it easy to extend functionality and maintain code quality.

**AI-Powered Features**: Integration with Google Gemini provides contextual financial advice and educational content generation, enhancing the user experience with personalized recommendations.