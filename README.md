# React Native Expo & NestJS Full-Stack Template

This repository is a comprehensive template for building end-to-end type-safe applications using [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) for the frontend and [NestJS](https://nestjs.com/) for the backend.

The key feature of this template is its **full-stack type safety**, achieved using [ts-rest](https://ts-rest.com/). A single API "contract" is defined in the backend and shared directly with the frontend. This means your frontend client, hooks, and components are always perfectly in sync with your API's routes, request bodies, and responses, eliminating a whole class of common runtime errors.

---

## Architecture Overview: A Virtual Monorepo

While the `Frontend` and `Backend` are in separate folders, this template is configured to act as a **virtual monorepo**. This setup allows the frontend to directly import TypeScript code from the backend (specifically, the `ts-rest` contract), enabling seamless type sharing without requiring a complex monorepo tooling setup like Nx or Turborepo.

**Key Benefits:**
*   **End-to-End Type Safety:** Catch API-related errors at compile time, not in production.
*   **Superior Developer Experience:** Get autocompletion for API calls in your frontend code.
*   **Simplified Maintenance:** Refactor with confidence. TypeScript will immediately flag any breaking changes between the frontend and backend.
*   **Clear Separation of Concerns:** Maintain distinct `package.json` files and `node_modules` for each part of the stack.

---

## Frontend (Expo)

The frontend is a modern, robust, and scalable mobile application built with Expo and TypeScript.

### Core Technologies

| Technology | Description |
| :--- | :--- |
| **Expo SDK** | A framework and platform for universal React applications. |
| **React Native** | The core framework for building native apps using React. |
| **TypeScript** | A typed superset of JavaScript that compiles to plain JavaScript. |
| **PNPM** | A fast, disk space-efficient package manager. |

### Included Libraries & Features

#### Type-Safe Data Fetching: `ts-rest` with TanStack Query
*   **Libraries:** [ts-rest](https://ts-rest.com/), [@ts-rest/react-query](https://ts-rest.com/docs/react-query/introduction), [TanStack Query v5](https://tanstack.com/query/latest)
*   **Description:** This is the core of the template's type safety. Instead of manual `fetch` or `axios` calls, you use a typed `ts-rest` client that understands your backend's API contract. This client is built on top of TanStack Query, giving you powerful caching, refetching, and server state management out of the box.
*   **Implementation:** A `ts-rest` client is initialized in `src/lib/ts-rest.ts` and a type-safe query hook `useHealthCheckQuery` is exported from `src/api/index.ts`.

#### Monorepo-Style Code Sharing
*   **Description:** To enable the frontend to import the backend's API contract, several tools are configured to work in concert.
*   **Configuration:**
    *   **Metro (`metro.config.js`):** The `watchFolders` property is configured to include the entire project root, allowing the bundler to "see" the `Backend` directory.
    *   **TypeScript (`tsconfig.json`):** A path alias (`@contract`) is defined to point directly to the backend's contract file.
    *   **Babel (`babel.config.js`):** The `babel-plugin-module-resolver` is used to resolve the `@contract` path alias at build time.

#### Styling: NativeWind
*   **Library:** [NativeWind v4](https://www.nativewind.dev/)
*   **Description:** Allows you to use [Tailwind CSS](https://tailwindcss.com/) utility classes directly in your React Native components for fast and consistent styling.

#### Authentication Flow & Session Persistence
*   **Libraries:** [Zustand](https://github.com/pmndrs/zustand), [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
*   **Description:** The template includes a complete authentication flow.
    1.  On startup, the app attempts to load a JWT from `AsyncStorage`.
    2.  If a token is found, the `useMeQuery` hook makes a request to the backend's `/auth/me` endpoint to validate the token and fetch user data.
    3.  During this check, a loading screen is displayed.
    4.  If successful, the user data and token are saved to a global Zustand store (`user-store.ts`), and the user is taken directly to the main application, bypassing the login screen.
    5.  If the token is invalid or not present, the user is directed to the `Auth` screen to log in or register.
    6.  Upon successful login, the new JWT is saved to both `AsyncStorage` and the Zustand store.

#### State Management: Zustand
*   **Library:** [Zustand](https://github.com/pmndrs/zustand)
*   **Description:** A small, fast, and scalable state-management solution for managing global app state. A sample `user-store.ts` is provided.

#### Environment Variables: `react-native-dotenv`
*   **Library:** [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv)
*   **Description:** Loads environment variables from a `.env` file, configured via `babel.config.js`.

### Project Structure

```
Frontend/
├── src/
│   ├── api/          # For type-safe data fetching hooks (ts-rest)
│   │   └── index.ts
│   ├── lib/
│   │   ├── react-query.ts  # TanStack Query client initialization
│   │   └── ts-rest.ts      # ts-rest client initialization
│   └── store/        # For global state management (Zustand)
│       └── user-store.ts
├── .env.example      # Example environment variables file
├── App.tsx           # Main application entry point
├── babel.config.js   # Babel configuration (with module-resolver)
├── metro.config.js   # Metro bundler configuration (for monorepo support)
└── tsconfig.json     # TypeScript configuration (with path aliases)
```

### Getting Started

#### 1. Navigate to the Frontend Directory
```bash
cd Frontend
```

#### 2. Create Your Environment File (Optional)
This template automatically uses the correct local URLs for development (`localhost` for web, `10.0.2.2` for native).

You only need a `.env` file in two cases:
1.  **For Production:** To set your production `API_URL`.
2.  **For Development:** To override the default local URLs with a specific `DEV_API_URL` (e.g., for testing against a staging server).

To create it, copy the example:
```bash
cp .env.example .env
```
Update `.env` with either your production `API_URL` or a development `DEV_API_URL`.

#### 3. Install Dependencies
This project uses `pnpm`. You also need to install the module resolver for the path aliases to work.
```bash
pnpm install
pnpm add -D babel-plugin-module-resolver
```

#### 4. Start the Application
Make sure your backend server is running first!
```bash
pnpm start
```
This starts the Metro bundler. The app will automatically connect to your local backend.

---

## Backend (NestJS)

The backend is a robust and scalable application built with [NestJS](https://nestjs.com/) and TypeScript, serving as the "source of truth" for the API contract.

### Core Technologies

| Technology | Description |
| :--- | :--- |
| **NestJS** | A progressive Node.js framework for building efficient and scalable server-side applications. |
| **TypeScript** | A typed superset of JavaScript that enhances code quality and maintainability. |
| **PNPM** | A fast, disk space-efficient package manager. |

### Included Libraries & Features

#### Type-Safe API Contracts: `ts-rest`
*   **Library:** [ts-rest](https://ts-rest.com/)
*   **Description:** The cornerstone of the template's type safety. Instead of using decorators to define routes, we define them in a plain TypeScript object called a "contract."
*   **Implementation:**
    1.  Each module defines its routes in a `*.contract.ts` file (e.g., `health.contract.ts`, `auth.contract.ts`). This file exports a simple `const` object.
    2.  A central contract in `src/contracts/index.ts` imports all module routes and assembles them into a single master `contract` that is shared with the frontend.
    3.  Controllers use the `@ts-rest/nest` library to implement the contract, ensuring the implementation always matches the definition.

#### Authentication: JWT with Passport
*   **Libraries:** [@nestjs/jwt](https://github.com/nestjs/jwt), [@nestjs/passport](https://github.com/nestjs/passport), [passport-jwt](https://github.com/mikenicholson/passport-jwt)
*   **Description:** The backend uses a standard JWT-based authentication strategy.
    *   The `/auth/login` endpoint returns a signed JWT upon successful authentication.
    *   The `/auth/me` endpoint is a protected route that uses the `JwtAuthGuard` to validate the incoming JWT from the `Authorization: Bearer <token>` header and returns the corresponding user's information.
    *   The `JWT_SECRET` used for signing tokens must be configured in your `.env` file.

#### Database (Prisma & Kysely)
*   **Prisma:** Used for its powerful schema migration capabilities.
*   **Kysely:** A type-safe SQL query builder used for all runtime database queries.
*   **Convention:** All Prisma model names must be in `lowercase_snake_case` (e.g., `user`, `blog_post`). This convention is important for consistency.

#### Validation: Zod
*   **Library:** [Zod](https://zod.dev/)
*   **Description:** Used to define the schemas for API request bodies, query parameters, and responses within the `ts-rest` contract. This provides automatic, type-safe validation for all incoming requests.

### Project Structure

The structure is designed for scalability, with the contract at its core.

```
Backend/
├── src/
│   ├── auth/             # Authentication module (JWT strategy, controller)
│   ├── contracts/
│   │   └── index.ts        # The master API contract, shared with the frontend
│   ├── main.ts           # Application entry point (CORS & Swagger enabled)
│   ├── app.module.ts     # Root application module
│   └── health/           # Example module
│       ├── health.contract.ts # Defines the routes for this module
│       ├── health.controller.ts # Implements the contract
│       └── ...
└── .env.example
```
**Request Flow:** A request matches a path in the master `Contract` -> The `Controller` implements that part of the contract -> The `Service` contains business logic -> The `Repository` handles database interaction.

### Getting Started

#### 1. Navigate to the Backend Directory
```bash
cd Backend
```

#### 2. Create and Configure Environment File
```bash
cp .env.example .env
```
You will need to add a `DATABASE_URL` for your PostgreSQL database. You also need a secret for signing JWTs.
```
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
JWT_SECRET="your-super-secret-key-that-is-long-and-random"
```

#### 3. Install Dependencies
```bash
pnpm install
```

#### 4. Run Database Migrations
```bash
pnpm run prisma:migrate
```

#### 5. Start the Application
```bash
pnpm run start:dev
```
The backend server will start on `http://localhost:3000`. CORS is enabled by default to allow requests from your frontend.
