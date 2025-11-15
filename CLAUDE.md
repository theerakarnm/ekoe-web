# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - starts React Router dev server with HMR at http://localhost:5173
- **Build**: `npm run build` - creates production build
- **Production server**: `npm start` - runs production server from build output
- **Type checking**: `npm run typecheck` - runs TypeScript compiler with React Router typegen

## Project Architecture

This is a React Router v7 application with the following structure:

### Core Architecture
- **Framework**: React Router v7 with server-side rendering (SSR)
- **Styling**: TailwindCSS v4 with Vite integration
- **UI Components**: Custom component library built on Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: Component-level state (no global state management detected)

### Directory Structure
- `app/` - Main application code
  - `routes/` - Route files (React Router file-based routing)
  - `components/` - Reusable UI components
    - `ui/` - Base UI components (buttons, cards, forms, etc.)
    - `share/` - Shared application components (header, product-card)
  - `landing/` - Landing page specific components
  - `lib/` - Utility functions
  - `interface/` - TypeScript type definitions
- `build/` - Generated build output (client and server)

### Key Patterns

#### UI Component System
- Base UI components in `app/components/ui/` follow Radix UI patterns
- Components use `class-variance-authority` for variant management
- Styling combines Tailwind with `clsx` and `tailwind-merge` utilities
- Consistent component export pattern: `export function ComponentName()`

#### Routing
- Single route configuration in `app/routes.ts` pointing to `routes/home.tsx`
- Home route renders the `Landing` component from `app/landing/landing.tsx`
- Type-safe route definitions using React Router's type system

#### TypeScript Configuration
- Path aliases configured with `~` prefix pointing to app directory
- Strict TypeScript settings with React Router type generation
- Interface definitions in `app/interface/` (e.g., `IProduct` for e-commerce entities)

### Current Application State
The application appears to be an e-commerce landing page with:
- Header component with landing-specific styling
- Hero section for main marketing content
- Best seller section showcasing products
- Product card components for displaying product information

### Development Notes
- Uses modern React patterns (React 19, functional components, hooks)
- Form validation handled by React Hook Form + Zod schemas
- Responsive design with TailwindCSS utilities
- Server-side rendering ready with proper meta tags and error boundaries
- Build process optimized for production with asset bundling