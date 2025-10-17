# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains a React/TypeScript financial module prototype:

```
Hub.App/
└── Modulo Financeiro/
    └── Prototipo Módulo Financeiro/
        ├── src/
        │   ├── components/          # React components
        │   │   ├── ui/             # Reusable UI components (shadcn/ui)
        │   │   ├── figma/          # Figma-generated components
        │   │   └── utils/          # Component utilities
        │   ├── styles/             # CSS and styling
        │   ├── utils/              # General utilities
        │   └── guidelines/         # Development guidelines
        ├── package.json
        ├── vite.config.ts
        └── README.md
```

## Development Commands

All commands should be run from `Hub.App/Modulo Financeiro/Prototipo Módulo Financeiro/`:

- **Install dependencies**: `npm i`
- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`

The development server runs on port 3000 and opens automatically.

## Architecture Overview

### Core Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 with SWC for fast compilation
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: Tailwind CSS with class-variance-authority
- **Charts**: Recharts for financial visualizations
- **Forms**: React Hook Form for transaction forms
- **Theming**: next-themes for dark/light mode support

### Application Structure
- **Main App**: Single-page application with tab-based navigation
- **Navigation**: Responsive navigation system (mobile bottom nav, desktop side nav)
- **State Management**: Local React state for transactions and UI state
- **Core Interface**: `Transaction` interface defines the data model for financial transactions

### Key Components
- `FinancialDashboard`: Main dashboard with charts and overview
- `TransactionsTab`: Transaction management interface
- `ReportsTab`: Financial reports and analytics
- `UploadTab`: File upload for importing transactions
- `ResponsiveNavigation`: Adaptive navigation component
- `FloatingButtons`: Quick action buttons
- `UserProfile`: User profile component

### Transaction Model
The core `Transaction` interface includes:
- Basic info: id, type (receita/despesa), description, amount
- Dates: transaction date and launch date
- Status: a_pagar, agendado, atrasado, pago, cancelado
- Optional: recurring transactions and categories

## Development Notes

### Import Alias Configuration
The project uses extensive Vite alias configuration for versioned package imports and a `@/` alias pointing to `./src`.

### UI Components
Uses shadcn/ui components built on Radix UI primitives. All UI components are located in `src/components/ui/`.

### Figma Integration
Contains Figma-generated components in `src/components/figma/` for design system consistency.

### Browser Compatibility
Build target is set to `esnext` for modern browser features.