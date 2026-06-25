# Contributing to AutoTube

Welcome to the AutoTube frontend team! To keep our codebase clean, organized, and easy to maintain, please read and follow these simple guidelines before starting your tasks.

---

## 📜 1. Coding Guidelines

We want the code to look like it was written by one person. Please follow these rules:

**Naming Conventions:**

- **Components:** Always use `PascalCase` (e.g., `VideoCard.tsx`, `Sidebar.tsx`).
- **Functions & Hooks:** Always use `camelCase` (e.g., `useYouTubeData.ts`, `formatDate.ts`).

**Separation of Concerns (Logic vs. UI):**

- Components are mainly for displaying the UI.
- If you have complex logic or API calls, move them to a Custom Hook or the `src/services/` folder.

**TypeScript:**

- **NO `any` allowed!** \* You must write an `interface` or `type` for all data, especially API responses.

**Formatting:**

- We use **Prettier**. Please install the Prettier extension in your VS Code.
- The codebase has a `.prettierrc` file. Ensure your code formats automatically on save.

---

## 🔀 2. Git & GitHub Workflow

To avoid merge conflicts, we follow the standard GitHub Flow:

**Branches:**

- `main`: The 100% stable code. **Nobody pushes directly to main.**
- `develop`: The main working branch where all team work is collected.
- **Feature Branches:** When taking a task, branch out from `develop`.
  - Name it clearly: `feature/task-name` or `bugfix/issue-name`.
  - _Examples:_ `feature/youtube-auth`, `feature/thumbnail-generator`, `bugfix/sidebar-responsive`.

**Commit Messages:**
Use "Conventional Commits" to keep the history readable:

- `feat: add script generation UI` (For new features)
- `fix: resolve metrics chart overlap` (For bug fixes)
- `style: format dashboard layout` (For CSS and styling)
- `refactor: update auth logic` (For code changes without adding new features)

**Pull Requests (PRs):**

1. When your task is done, create a PR from your feature branch to the `develop` branch.
2. The Team Lead will review your code.
3. PRs will only be approved if they follow these guidelines and have no errors.

---

## 🚀 3. Getting Started (First Steps)

1. **Environment Variables:** Copy the `.env.example` file and rename it to `.env.local`. Ask the Team Lead for the secret API keys (YouTube, Gemini, etc.) and paste them there.
2. **UI Components (Shadcn UI):** We are using **Shadcn UI**. Do not build basic components (like Buttons, Modals, Inputs) from scratch. Check Shadcn first to save time and keep a premium look.

3. **Pre-commit Checks:** We use Husky & lint-staged. This means your code will be automatically checked for errors before a commit is allowed. If there is an unused variable or a TypeScript error, the commit will fail until you fix it.

Let's build an amazing platform! 🚀
