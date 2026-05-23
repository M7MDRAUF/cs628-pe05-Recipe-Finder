# Recipe Finder

> **CS 628 – Full-Stack Web Development | Programming Exercise 05**
>
> A full-stack Recipe Finder application built with **React 18 + TypeScript**, **Node.js / Express**, and **MongoDB Atlas**. Demonstrates React Router v6 nested routes, RESTful API design, full CRUD operations, and responsive UI.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [API Reference](#api-reference)
6. [Screenshots](#screenshots)
7. [Implementation Highlights](#implementation-highlights)
8. [License](#license)

---

## Features

| Feature | Details |
|---------|---------|
| **Recipe List** | Responsive grid of all recipes with search (name/ingredient) and category filter |
| **Nested Route Details** | Clicking a recipe renders `RecipeDetails` as a **nested route** (`/recipes/:id`) inside `RecipeList` using `<Outlet>` and `useParams` |
| **Add Recipe** | Full form with dynamic ingredient list, client-side validation, and server-side validation via `express-validator` |
| **Edit Recipe** | Pre-populated form for in-place updates via `PUT /api/recipes/:id` |
| **Delete Recipe** | Confirmation modal before permanent delete via `DELETE /api/recipes/:id` |
| **Toast Notifications** | Auto-dismissing success / error / warning toasts after every mutation |
| **Loading & Error States** | Spinner on every fetch; error banners with retry buttons |
| **404 Page** | Catch-all `*` route renders a styled Not Found page |
| **Responsive Design** | Mobile-first layout; hamburger menu below 640 px |
| **TypeScript** | Strict mode — zero `tsc --noEmit` errors |
| **ESLint** | Zero lint errors across all frontend and backend files |
| **No security vulnerabilities** | `npm audit --audit-level=high` → 0 vulnerabilities on both client and server |

---

## Tech Stack

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 | UI library |
| TypeScript | Static typing |
| Vite 6 | Build tool & dev server |
| react-router-dom v6 | Client-side routing (nested routes, `useParams`, `<Outlet>`) |
| axios | HTTP client with error-normalising interceptor |
| CSS Modules | Component-scoped styling |
| ESLint + Prettier | Linting and formatting |

### Backend
| Package | Purpose |
|---------|---------|
| Node.js 24 | Runtime |
| Express 4 | REST API framework |
| MongoDB Node.js Driver | Official Atlas driver (no Mongoose) |
| express-validator | Server-side input validation |
| dotenv | Environment variable loading |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Project Structure

```
recipe-finder/
├── client/                      # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Modal/           # ConfirmModal (accessible, focus-trap)
│   │   │   ├── Navbar/          # Sticky header, hamburger mobile menu
│   │   │   ├── RecipeCard/      # Grid card with links to details & edit
│   │   │   ├── RecipeForm/      # Shared Add/Edit form with validation
│   │   │   ├── Spinner/         # Loading spinner (sm/md/lg)
│   │   │   └── Toast/           # Toast notification container
│   │   ├── context/
│   │   │   └── ToastContext.tsx # Global toast state + useToast() hook
│   │   ├── pages/
│   │   │   ├── AddRecipe/       # POST new recipe
│   │   │   ├── EditRecipe/      # PUT update recipe (useParams)
│   │   │   ├── Home/            # Landing / hero page
│   │   │   ├── NotFound/        # 404 catch-all
│   │   │   ├── RecipeDetails/   # NESTED route — reads useParams(:id)
│   │   │   └── RecipeList/      # Parent route — renders <Outlet>
│   │   ├── services/
│   │   │   └── api.ts           # Axios instance + all API helpers
│   │   ├── types/
│   │   │   └── recipe.ts        # Recipe, RecipeFormData, ApiResponse
│   │   ├── App.tsx              # BrowserRouter + all Route definitions
│   │   ├── index.css            # Global design tokens & reset
│   │   └── main.tsx             # React 18 createRoot entry
│   ├── tsconfig.app.json        # TypeScript config (bundler mode)
│   ├── vite.config.ts           # Vite proxy /api → :5000, path alias @/
│   └── eslint.config.js         # ESLint flat config (react-hooks, refresh)
│
├── server/                      # Node.js + Express
│   ├── db/
│   │   └── connection.js        # MongoDB Atlas singleton (pool, Stable API v1)
│   ├── middleware/
│   │   ├── errorHandler.js      # 404 + global error handler
│   │   └── validateObjectId.js  # Reject malformed :id params (400)
│   ├── routes/
│   │   └── recipes.js           # Full CRUD router + express-validator rules
│   ├── server.js                # Express entry — graceful shutdown, CORS
│   ├── .env.example             # Environment variable template
│   └── .eslintrc.js             # Backend ESLint config
│
├── screenshots/                 # UI screenshots (for this README)
└── package.json                 # Root convenience scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (tested on v24)
- **npm** ≥ 9
- A **MongoDB Atlas** cluster (free M0 tier is sufficient)

### 1 — Clone the repository

```bash
git clone https://github.com/M7MDRAUF/cs628-pe05-Recipe-Finder.git
cd cs628-pe05-Recipe-Finder/recipe-finder
```

### 2 — Configure the backend

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set your values:

```
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DB_NAME>?retryWrites=true&w=majority
DB_NAME=recipe_finder
PORT=5000
```

### 3 — Install all dependencies

```bash
# from recipe-finder/
npm run install:all
```

Or individually:

```bash
cd server && npm install
cd ../client && npm install
```

### 4 — Start development servers

Open **two** terminal tabs:

```bash
# Tab 1 — backend
cd server && npm run dev

# Tab 2 — frontend
cd client && npm run dev
```

The app will be available at **http://localhost:5173**

The API will be at **http://localhost:5000/api**

### 5 — Build for production

```bash
cd client && npm run build   # outputs to client/dist/
```

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/recipes` | List all recipes (`?search=&category=`) |
| `GET` | `/recipes/:id` | Get a single recipe |
| `POST` | `/recipes` | Create a new recipe |
| `PUT` | `/recipes/:id` | Update an existing recipe |
| `DELETE` | `/recipes/:id` | Delete a recipe |

### Recipe Schema

```json
{
  "_id": "ObjectId",
  "name": "string (required, 2–120 chars)",
  "ingredients": ["string (required, ≥1 item)"],
  "instructions": "string (required, ≥10 chars)",
  "category": "string (optional)",
  "prepTime": "string (optional)",
  "cookTime": "string (optional)",
  "servings": "number (optional, 1–100)",
  "imageUrl": "string (optional, valid URL)",
  "createdAt": "ISO-8601 date",
  "updatedAt": "ISO-8601 date"
}
```

---

## Screenshots

### Home Page
![Home Page](recipe-finder/screenshots/01-home-page.png)

### Recipe List — Empty State
![Recipe List Empty](recipe-finder/screenshots/02-recipe-list-empty.png)

### Add Recipe — Blank Form
![Add Recipe Form](recipe-finder/screenshots/03-add-recipe-empty-form.png)

### Add Recipe — Validation Errors
![Validation Errors](recipe-finder/screenshots/04-add-recipe-validation-errors.png)

### Add Recipe — Filled Form
![Filled Form](recipe-finder/screenshots/05-add-recipe-filled-form.png)

### Recipe Added — Success Toast
![Success Toast](recipe-finder/screenshots/06-recipe-added-success-toast.png)

### Recipe Details (standalone)
![Recipe Details](recipe-finder/screenshots/07-recipe-details-page.png)

### Recipe List — Populated Grid
![Recipe List](recipe-finder/screenshots/08-recipe-list-with-recipes.png)

### Search Filter
![Search Filter](recipe-finder/screenshots/09-recipe-list-search-filter.png)

### Category Filter
![Category Filter](recipe-finder/screenshots/10-recipe-list-category-filter.png)

### Recipe Details — Nested Route
> Rendered as a nested route inside Recipe List via `<Outlet>` — the left panel shows the list and the right panel shows details for the selected recipe.

![Nested Route](recipe-finder/screenshots/11-recipe-details-nested-route.png)

### Delete Confirmation Modal
![Delete Modal](recipe-finder/screenshots/12-delete-confirmation-modal.png)

### Edit Recipe Form
![Edit Recipe](recipe-finder/screenshots/13-edit-recipe-form.png)

### Edit Saved — Success Toast
![Edit Toast](recipe-finder/screenshots/14-edit-saved-toast.png)

### Delete Success Toast
![Delete Toast](recipe-finder/screenshots/15-delete-success-toast.png)

### 404 Not Found
![404 Page](recipe-finder/screenshots/16-404-not-found-page.png)

### Mobile — Recipe List
![Mobile List](recipe-finder/screenshots/17-mobile-recipe-list.png)

### Mobile — Hamburger Menu Open
![Mobile Nav](recipe-finder/screenshots/18-mobile-hamburger-menu-open.png)

---

## Implementation Highlights

### 1. Nested Routes with `useParams` and `<Outlet>`

`RecipeList` is the **parent route** at `/recipes`. It renders an `<Outlet>` that displays `RecipeDetails` when the URL matches `/recipes/:id`.

```tsx
// App.tsx
<Route path="/recipes" element={<RecipeList />}>
  <Route path=":id" element={<RecipeDetails />} />
</Route>

// RecipeList.tsx — passes refresh callback to child
<Outlet context={{ onUpdate: refreshList }} />

// RecipeDetails.tsx — reads :id with useParams
const { id } = useParams<{ id: string }>();
```

### 2. MongoDB Atlas via Official Driver (no Mongoose)

```js
// db/connection.js
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  maxPoolSize: 10,
  connectTimeoutMS: 10_000,
});
```

### 3. Abort-Controller–safe Data Fetching

Each `useEffect` that fetches data uses a `cancelled` flag to prevent setting state after unmount:

```tsx
useEffect(() => {
  let cancelled = false;
  async function load() {
    // ...
    if (!cancelled) setRecipe(data);
  }
  load();
  return () => { cancelled = true; };
}, [id, retryCount]);
```

### 4. Full Server-Side Validation

Every POST / PUT request is validated by `express-validator` before any database operation:

```js
body("name").trim().isLength({ min: 2, max: 120 }).withMessage("…"),
body("ingredients").isArray({ min: 1 }).withMessage("…"),
body("instructions").trim().isLength({ min: 10 }).withMessage("…"),
```

### 5. Responsive CSS Modules

All component styles use CSS Modules to avoid class-name collisions. The design system is driven by CSS custom properties declared in `index.css`.

---

## License

MIT © 2025 M7MDRAUF
