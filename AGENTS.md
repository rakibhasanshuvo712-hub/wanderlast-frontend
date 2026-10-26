# wanderlust — Next.js 16 + shadcn/ui + Tailwind CSS v4

## Commands
- `npm run dev` — starts dev server (Turbopack + Tailwind v4)
- `npm run build` — builds the app
- `npm run start` — serves the production build
- `npm run lint` — runs ESLint (extends `eslint-config-next`)

## Project structure
- `src/app/` — Next.js app router entries (page.tsx, layout.tsx, globals.css)
- `src/components/ui/` — shadcn UI components (generated via `npx shadcn-ui add <name>`)
- `src/components/` — additional components (combobox, questionnaire, etc.)
- `src/hooks/` — custom hooks (use-mobile, use-highlighted-code)
- `src/lib/` — utilities (highlighter, cn helper)
- Path alias: `@/` → `src/` (tsconfig.json paths)

## shadcn/ui
- Schema: `components.json` at root
- Run `npx shadcn-ui add <component>` to add new UI components
- Components use Tailwind v4 classes and Tailwind CSS variables
- Default base color: `neutral`; icon library: `lucide`

## Tailwind CSS v4
- Config in `src/app/globals.css` — `@import` tailwind, tw-animate-css, shadcn
- `@theme` block defines custom properties (colors, radii, fonts)
- Dark mode: `.dark` class variant
- `@layer base` uses `@apply` — beware Tailwind v4 class changes

## React Compiler
- Enabled in `next.config.ts` (`reactCompiler: true`)
- Components may be compiled RSC — avoid `useState` in client-only contexts unless needed

## shiki code highlighting
- Languages lazily loaded in `src/lib/highlighter.tsx` `languages` object
- Add new language entries there when using new code blocks
- `loadHighlighter(language)` must be called before `highlightCode()`

## ESLint
- Extends `eslint-config-next` (core-vitals + typescript)
- Ignores `.next/`, `out/`, `build/`
- No custom rules beyond Next.js defaults

## Testing
- No test script configured in `package.json`
- Add `jest` or `vitest` config if adding tests; no fixtures or services currently defined

## Deployment
- Deploy to Vercel via `vercel` CLI or the dashboard
- Output: `.next/` directory (git-ignored)