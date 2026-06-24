# DailyNest — Frontend

Static single-page application built with **vanilla HTML, CSS, and JavaScript** — no framework, no build step. Served in production by **Nginx** inside a Docker container.

---

## Tech Stack

| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| HTML5             | Page structure                       |
| CSS3              | Styling (custom properties + modules)|
| Vanilla JS (ES6+) | Routing, API calls, UI logic         |
| Framer Motion     | Declarative animations (via CDN)     |
| Nginx (Alpine)    | Static file server                   |

---

## Project Structure

```
frontend/
├── index.html          # Landing page
├── login.html          # Login page
├── register.html       # Registration page
├── tasks.html          # Tasks module
├── agenda.html         # Agenda / calendar module
├── notepad.html        # Notepad module
├── files.html          # File manager module
├── profile.html        # User profile page
├── how-it-works.html   # Public info page
│
├── css/
│   ├── variables.css   # Design tokens (colours, spacing, typography)
│   ├── reset.css       # CSS normalisation
│   ├── layout.css      # Page-level layout (sidebar, content area)
│   ├── components.css  # Reusable component styles (buttons, cards, forms)
│   ├── animations.css  # Framer Motion + CSS transition helpers
│   └── modules/        # Per-page styles
│       ├── agenda.css
│       ├── tasks.css
│       ├── notepad.css
│       └── files.css
│
├── js/
│   ├── api.js          # Centralised fetch wrapper with auth headers
│   ├── auth.js         # Login, register, token storage, guard
│   ├── router.js       # Client-side hash/path routing
│   ├── toast.js        # Toast notification component
│   ├── validations.js  # Form validation helpers
│   ├── animations.js   # Framer Motion initialisation and helpers
│   ├── components/
│   │   └── sidebar.js  # Sidebar rendering and navigation state
│   └── modules/        # Per-page logic
│       ├── tasks.js
│       ├── agenda.js
│       ├── notepad.js
│       ├── files.js
│       └── profile.js
│
└── Dockerfile
```

---

## Pages

| Page               | File                | Description                         |
|--------------------|---------------------|-------------------------------------|
| Landing            | `index.html`        | Public marketing / entry point      |
| How it works       | `how-it-works.html` | Feature overview (public)           |
| Login              | `login.html`        | Authenticate an existing user       |
| Register           | `register.html`     | Create a new account                |
| Tasks              | `tasks.html`        | To-do list management               |
| Agenda             | `agenda.html`       | Calendar event scheduling           |
| Notepad            | `notepad.html`      | Free-form note taking               |
| Files              | `files.html`        | File upload and management          |
| Profile            | `profile.html`      | Account settings                    |

---

## JavaScript Architecture

### `api.js`
Central wrapper around the browser `fetch` API. Attaches the JWT token from `localStorage` to every request and handles base URL configuration so individual modules never hardcode the API address.

### `auth.js`
Manages authentication state: storing and reading the JWT token, redirecting unauthenticated users away from protected pages, and handling logout.

### `router.js`
Lightweight client-side router — maps URLs to page-specific initialisation functions so the app behaves as a SPA without a framework.

### `modules/`
Each file maps 1:1 to a protected page. It fetches data from the API, renders the UI, and wires up event listeners for CRUD actions.

### `components/sidebar.js`
Renders the sidebar navigation and highlights the active page. Shared across all authenticated pages.

### `toast.js`
Displays temporary notification messages (success, error, info) that auto-dismiss after a few seconds.

### `animations.js`
Initialises Framer Motion (loaded via CDN) and applies entrance animations to page elements on load.

---

## Styling Conventions

- **`variables.css`** is the single source of truth for all design tokens (colours, border-radius, font sizes, spacing). Edit here first before touching component styles.
- **`layout.css`** handles the two-column authenticated layout (fixed sidebar + scrollable content area) and responsive breakpoints.
- **`components.css`** contains styles for buttons, form inputs, cards, modals, and other reusable elements.
- **Module CSS files** (`css/modules/`) scope styles to a single page and should not leak into other pages.

---

## Running Locally (without Docker)

No build step is required. Open any `.html` file directly in a browser, or use a simple static server:

```bash
cd frontend

# Python built-in server
python3 -m http.server 8080

# Node (npx)
npx serve .
```

The app will call the API at `http://localhost:8000` by default. Adjust the base URL in `js/api.js` if needed.

## Running with Docker

From the project root:

```bash
docker compose up -d frontend
```

The app will be available at **http://localhost:8080**.
