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
        └── 📄 auth.ts      # Authentication service handler
```
