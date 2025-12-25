# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AI-powered React Native App Builder** that generates React Native applications from natural language prompts. The app demonstrates:
- Real-time AI code generation using OpenAI GPT-5 Codex with streaming responses
- Dynamic code execution where generated React Native components are compiled and rendered at runtime
- InstantDB for authentication, real-time data sync, and as the backend for generated mini-apps
- Each user build gets its own InstantDB app instance created via the InstantDB Platform API

## Available Commands

```bash
# Development
bun start              # Start Expo development server
bun run android        # Build and run on Android
bun run ios            # Build and run on iOS
bun run web            # Start web version

# Code quality
bun run lint           # Run ESLint

# Project setup (first time only)
bunx expo prebuild     # Generate native code
```

## Environment Variables Required

Create a `.env` file with:
```env
EXPO_PUBLIC_INSTANT_APP_ID=your-instant-app-id
INSTANT_APP_ADMIN_TOKEN=your-admin-token
INSTANT_ORG_ID=your-org-id
OPENAI_API_KEY=your-openai-api-key
```

Note: The main app uses `EXPO_PUBLIC_` prefix for client-side variables (read via `process.env.EXPO_PUBLIC_*`), while server-side code uses unprefixed variables.

## Architecture

### Database Schema (`instant.schema.ts`)

The schema defines three main entities:
- **`$users`**: Authenticated users with email
- **`builds`**: Generated apps linked to users via `buildOwner` relationship. Each build has:
  - `instantAppId`: ID of the InstantDB app created for this build
  - `code`: Generated React Native code
  - `reasoning`: AI's reasoning process (optional)
  - `isPreviewable`: Whether the build is ready for preview
  - `title`: User's prompt as the title
- **`$files`**: File storage entity

### Key Database Clients

There are two separate InstantDB clients:

1. **`lib/db.ts`** - Client-side database for React Native
   - Uses `@instantdb/react-native`
   - Used in components with `db.useAuth()`, `db.useQuery()`
   - For frontend data fetching and auth

2. **`lib/adminDB.ts`** - Admin client for privileged operations
   - Uses `@instantdb/admin` with admin token
   - Used in API routes for server-side operations
   - Can act as users via `adminDB.asUser({ email })`

### Routing with Expo Router

File-based routing in `/app` directory:
- `index.tsx` - Main app screen (protected, requires auth)
- `login.tsx` - Authentication screen (shown when not authenticated)
- `_layout.tsx` - Root layout with auth guards using `Stack.Protected`
- `build/[id].tsx` - Dynamic route for individual builds
- `api/generate+api.tsx` - Server-side API endpoint for code generation

Protected routes use `Stack.Protected guard={condition}` - when `user` exists, shows `index`; when `!user`, shows `login`.

### AI Code Generation Flow

1. User submits prompt → `POST /api/generate`
2. API creates new InstantDB app via Platform API (`lib/platformAPI.ts`)
3. Creates build record linked to user
4. Streams response from GPT-5 Codex with both `text-delta` (code) and `reasoning-delta`
5. Progressive saves build as code streams in (debounced via `triggerSave`)
6. Sets `isPreviewable: true` when complete

### Dynamic Code Execution

**`utils/codeStrToReactElement.ts`** is the core utility that:
1. Takes generated code string and `instantAppId`
2. Replaces placeholder `instantAppId` with actual ID
3. Cleans code (finds import/export boundaries)
4. Transpiles with Babel (JSX → JS, TypeScript, modules → CommonJS)
5. Creates a custom `require` function providing React, React Native, and InstantDB
6. Executes the code in a sandboxed Function constructor
7. Returns a React element that can be rendered

**Important**: This allows user-generated code to run in the app. The code only has access to `react`, `react-native`, and `@instantdb/react-native` modules.

### Authentication Pattern

InstantDB auth is managed through:
- `db.useAuth()` hook for auth state (`isLoading`, `user`, `error`)
- `db.auth.signOut()` for logout
- Token verification in API routes via `adminDB.auth.verifyToken(token)`
- Headers use `RefreshToken` key to pass auth token to API

### Real-time Data Updates

Components use `db.useQuery()` which automatically re-renders when data changes:
```tsx
const { data } = db.useQuery({ builds: {} }, { isActive: true });
```

The `buildOwner` relationship allows querying builds linked to the current user.

## Important Patterns

- **InstantDB transactions**: Use `db.tx.builds[id].create().link()` to create entities with relationships
- **Acting as users**: Server-side operations use `adminDB.asUser({ email })` to maintain user context
- **Streaming AI**: Use `for await (const chunk of fullStream)` to handle text and reasoning deltas
- **Expo Router**: All routes in `/app` with file-based naming; dynamic routes use `[param].tsx`
- **Platform API**: `lib/platformAPI.ts` wraps the InstantDB Platform API for programmatic app management

## Development Notes

- The app uses Bun as the package manager (npm-compatible)
- TypeScript is enabled with strict mode
- React 19.1.0 with React Native 0.81.5
- Polyfills loaded in `utils/polyfills.ts` for web compatibility
- System prompt for AI is in `resources/systemPrompt.txt` loaded via `utils/systemPrompt.ts`
