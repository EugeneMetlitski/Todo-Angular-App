# Frontend Architecture: Standalone Angular Layout

The user interface layer is built using a modern **Standalone Angular** framework layout. It uses ultra-fast compilation engines and strict dependency rules managed via the isolated **pnpm** store.

---

## 📁 Workspace Blueprint

The frontend workspace sits entirely inside the main repository container, allowing JetBrains Rider to index cross-stack files natively:

```text
📁 src/client/
├── 📄 proxy.conf.json      # Vite development reverse proxy engine mapping
├── 📄 package.json         # Pnpm dependency scripts map
└── 📁 src/
    ├── 📄 main.ts          # Core framework bootstrapped root entry file
    └── 📁 app/             # Application structural modules
        ├── 📄 app.config.ts # Global application dependency injection tokens
        ├── 📄 app.ts       # Root layout component script execution controller
        ├── 📄 app.html     # Presentation structural layout template
        ├── 📄 app.spec.ts  # Root component unit tests
        ├── 📁 core/        # Core services and HTTP interceptors
        │   ├── 📄 auth.service.ts
        │   ├── 📄 auth.service.spec.ts
        │   ├── 📄 auth.interceptor.ts
        │   ├── 📄 auth.interceptor.spec.ts
        │   └── 📁 layout/
        │       ├── 📄 layout.component.ts
        │       └── 📄 layout.component.spec.ts
        └── 📁 features/    # Feature domains
            ├── 📁 auth/
            │   ├── 📄 login.component.ts
            │   └── 📄 login.component.spec.ts
            └── 📁 todo/
                ├── 📁 todo-dashboard/
                │   ├── 📄 todo-dashboard.component.ts
                │   └── 📄 todo-dashboard.component.spec.ts
                └── 📁 todo-item/
                    ├── 📄 todo-item.component.ts
                    └── 📄 todo-item.component.spec.ts
```

---

## 🧪 Tests & Libraries

* **Tests:** Frontend unit tests are located alongside components and services under `src/client/src/app/` (`*.spec.ts`). They test Angular components, authentication, and state management. Run them with `pnpm test` inside `src/client`.
* **Notable Libraries:** `Vitest` with `JSDOM` for fast component testing, Angular Signals for reactive state, and Angular Material for UI components.
