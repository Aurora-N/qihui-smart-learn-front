---
description: 'React, Vite, TypeScript, Tailwind CSS, and shadcn/ui best practices and guidelines. Use when writing or modifying code in the admin-platform.'
applyTo: 'packages/admin-platform/**/*.{ts,tsx}'
---

# Admin Platform Best Practices

This document outlines the coding standards for the `admin-platform` project, utilizing React (v19), Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Components & Styling

- **shadcn/ui First**: Always check if a component exists in [shadcn/ui](https://ui.shadcn.com/) before building custom UI components (e.g., Buttons, Modals, Forms, Tables).
- **Tailwind CSS**: Use Tailwind utility classes for styling. Avoid custom `.css` or `.scss` files unless handling global base styles or complex animations that Tailwind cannot handle cleanly. Follow standard responsive design practices (`sm:`, `md:`, `lg:`).
- **React Patterns**: Use functional components with hooks. Start with Client Components (standard React) for the admin interactive UI.

## TypeScript usage

- **Strict Typing**: Avoid `any`. Use custom `interface` or `type` declarations for Component properties, API responses, and state objects.
- **Props**: Destructure props in the function signature and define explicit types.
  ```tsx
  interface UserCardProps {
    id: string;
    username: string;
    isActive?: boolean;
  }
  export function UserCard({ id, username, isActive = true }: UserCardProps) { ... }
  ```

## State & Data Fetching

- **Global State**: Use [Zustand](https://zustand-demo.pmnd.rs/) for global state management. Keep stores modular and focused on specific domains. Avoid tightly coupling stores to UI components.
- **Data Fetching**: Use `axios` combined with `useEffect` (and `useState`) for data fetching. For more complex fetching requirements, encapsulate the `axios` calls within custom hooks to manage `loading`, `error`, and `data` states cleanly.
- **Local State**: Keep UI-specific state (like toggle states) as local as possible using `useState` or `useReducer`.

## File Organization & Architecture

- **Feature-Sliced Design (FSD)**: Adopt the FSD architectural methodology to strictly organize code into structured layers:
  - `app/`: App-wide settings, routing initialization, and global styles.
  - `pages/`: Page components composed from widgets and features.
  - `widgets/`: Complex, cross-cutting UI blocks (e.g., `Header`, `Sidebar`) composed from features and entities.
  - `features/`: User interactions and business value (e.g., `AuthForm`, `UserProfileUpdate`).
  - `entities/`: Business entities (e.g., `User`, `Article`).
  - `shared/`: Reusable, domain-agnostic UI components (shadcn/ui), utilities, and API configuration (e.g., configured axios instance).
- **Naming Conventions**:
  - **PascalCase** for React components and their files (`Sidebar.tsx`, `UserProfile.tsx`).
  - **camelCase** for hooks, utilities, and instances (`useTheme.ts`, `formatDate.ts`).

## Performance

- Let React handle re-renders naturally; only introduce `useMemo` or `useCallback` when profiling indicates a bottleneck or to preserve referential equality for `useEffect` dependencies.
- Leverage Vite's fast HMR by keeping component files focused and avoiding large monolithic files.
