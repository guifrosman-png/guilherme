# Architecture Overview

Hub.App is a **multi-tenant SaaS platform** for micro and small businesses built with React + TypeScript + Vite, using Supabase as backend.

Si## Core Architecture Principles

- **Multi-tenant**: Complete data isolation using Supabase RLS (Row Level Security)
- **Mobile-First**: Responsive design that works perfectly on mobile, scales to desktop
- **Modular System**: Dynamic module loading with permission-based access
- **Provider Pattern**: Context providers for state management

## Key Architectural Patterns

### Provider Hierarchy (App.tsx)
```
AuthProvider
├── PermissionsProvider
├── ModulesProvider
├── NotificationsProvider
└── SettingsProvider
```

### Multi-tenant Data Flow
1. User authenticates → Gets tenant_id from `perfis` table
2. All data queries are filtered by tenant_id via RLS policies
3. Permissions checked via `user_permissions` and role-based access

### Module System
- Modules stored in `modulos` table with metadata (name, icon, category, permissions)
- Dynamic module loading via `useModules` hook
- Permission-based visibility via `usePermissions` hook
- App Store interface for module management

## Database Schema (Supabase)

### Critical Tables
- `tenants` - Company/organization data
- `perfis` - User profiles linked to auth.users
- `modulos` - Available modules with metadata
- `user_modules` - Active modules per user
- `user_permissions` - Granular permissions system

RLS policies enforce tenant isolation on all tables.

## State Management

### Custom Hooks Pattern
- `useAuth` - Authentication, tenant management, company creation
- `useModules` - Dynamic module loading and management
- `usePermissions` - Role-based and granular permissions
- `useSettings` - UI customization (backgrounds, logos, banners)
- `useNotifications` - Notification system with unread counts

## Component Architecture

### Layout Components
- `ResponsiveLayout` - Main responsive wrapper, handles mobile/desktop switching
- `AppSidebar` - Desktop sidebar with collapsible modules
- `AnimatedAppGrid` - Mobile grid layout for app icons

### Feature Components
- Authentication flow: `LoginPage` → `CompanySetupPage` → Main app
- Settings system: Modular settings pages in `/settings/` folder
- Module system: Dynamic loading via `ModuleCard` components

## Responsive Design Pattern

**Mobile (< 768px)**: 4-column grid layout with full-screen background
**Desktop (≥ 768px)**: Sidebar + main content area layout

Components automatically adapt using `window.innerWidth` checks and CSS breakpoints.

## Figma Integration

This codebase was generated from Figma designs using "Figma Make". The original design is available at:
https://figma.com/design/QOchgC88cALxe1YZtGdsQU/hub.App--3-