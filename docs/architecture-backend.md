# Backend Architecture: Modular Monolith

This backend utilizes a highly isolated **Modular Monolith architecture** written in .NET 10. All distinct domain capabilities are broken down into logical **Bounded Contexts** (Modules), keeping the codebase maintainable and preparing it for a microservices migration if ever needed.

---

## 📁 System Folder Blueprint

All core operations live cleanly separated under the root source directory:

```text
📁 building-blocks/         # Reusable structural framework infrastructure
│   └── 📁 Web.Auth/        # Shared token validation and security logic
│
└── 📁 src/
    ├── 📁 apps/            # Application Orchestrators (Zero business logic)
    │   └── 📁 WebApp/      # Dynamic runtime bootstrapper & module endpoint configuration
    │
    └── 📁 modules/         # Isolated Domain Bounded Contexts
        └── 📁 ToDo/        # Complete feature isolation for the ToDo Module
```

---

## 🧱 The Bounded Context Layering (Clean Architecture)

Every functional folder inside the `modules/` directory implements a rigid variant of Clean Architecture to enforce unidirectional dependencies:

### 1. `ToDo.Domain`
*   **Role:** Holds core domain enterprise logic.
*   **Contents:** Pure entities, value objects, domain rules, and aggregate invariants.
*   **Dependencies:** Completely isolated. Zero reference parameters to outside layers.

### 2. `ToDo.UseCases`
*   **Role:** Orchestrates application specific business workflows.
*   **Contents:** Command/Query boundary orchestrators, business handlers, and infrastructure interface ports.
*   **Dependencies:** References `ToDo.Domain` exclusively.

### 3. `ToDo.Infrastructure`
*   **Role:** Wireframes operational, out-of-process interactions.
*   **Contents:** Database contexts, data repositories, cache implementations, and third-party API handlers.
*   **Dependencies:** References `ToDo.UseCases` to satisfy technical infrastructure contracts.

### 4. `ToDo.Web`
*   **Role:** Presentational api adapters.
*   **Contents:** Controllers, Minimal API endpoint mappings, and Data Transfer Objects (DTOs).
*   **Dependencies:** References `ToDo.UseCases` to handle outside incoming input payloads.
