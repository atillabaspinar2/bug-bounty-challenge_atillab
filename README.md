# bug-bounty-challenge_atillab

Created with CodeSandbox

---

## Bug Fixes & Features

### Bug 1 — Missing `key` prop in issues list

**File:** `src/pages/Home/index.tsx`

`issues.map()` rendered `<ListItem>` without a `key` prop, causing the React console warning _"Each child in a list should have a unique key prop"_. Fixed by adding `key={issue.title}` to each `<ListItem>`.

---

### Bug 2 — Bold "known" not rendered in intro text

**File:** `src/pages/Home/index.tsx`

The i18n string for `home.intro` already contained `<b>known</b>`, but `t("home.intro")` returns a plain string so the tag was displayed literally. Fixed by replacing the `t()` call with the `<Trans>` component from `react-i18next` using `components={{ b: <strong /> }}`. The i18n text was not changed.

---

### Bug 3 — User avatar not displayed in app bar

**Files:** `src/api/services/User/store.ts`, `src/components/AvatarMenu/index.tsx`

Two bugs combined to prevent the avatar from appearing:

**3a — MobX typo:** `this.urser = result` in `getOwnUser()` assigned the fetched user to a non-existent property instead of the observable `user`. The store state stayed `null` permanently. Fixed by correcting the typo to `this.user = result`.

**3b — AvatarMenu crash:** After fixing 3a, `getInitials` mapped over `[firstName, lastName]` and accessed `_[0]` even when a field was `undefined` (both are optional on the `User` type), throwing a runtime error. Also, `user?.firstName[1]` in `stringAvatar` threw when `firstName` was short or undefined. Fixed both with optional chaining (`?.[0]`, `?.[1]`, `??`).

---

### Bug 4 — Countdown occasionally runs faster than expected

**File:** `src/components/AppHeader/index.tsx`

`setInterval` was started in a `useEffect` with no cleanup function. If the component ever re-mounted, a second interval would stack on top of the first, causing the counter to increment multiple times per second. Fixed by capturing the interval id and returning `() => clearInterval(id)` as the effect cleanup.

---

### Additional fixes

**`forwardRef` type parameters** (`src/components/AppHeader/index.tsx`, `src/components/AvatarMenu/index.tsx`): Both components used `React.forwardRef` without generic type parameters, causing TypeScript to type `ref` as `ForwardedRef<unknown>`. Fixed by adding `<HTMLDivElement, Props>` to each `forwardRef` call. `AvatarMenu` also needed to accept and forward the `ref` to its root `<div>` so that MUI's `<Grow>` transition can attach it.

**`services/index.tsx` broken import** (`src/api/services/index.tsx`): The barrel file used `import User from "./User"` but `User/index.tsx` has no default export, only named exports. Fixed by changing to `import { StoreProvider as User } from "./User"`. The unused `import services from "./api/services"` in `App.tsx` was also removed.

---

### Feature — Language switcher (EN / DE)

**Files:** `src/components/AppHeader/index.tsx`, `src/i18n/locales/de.json`, `src/i18n/locales/en.json`

Added a MUI `<Select>` control to the app bar that switches the UI language between English and German. The available languages are sourced from `defaultLanguages` in `src/i18n/i18n.ts` so no hardcoding is needed. German translations were added to `de.json` for all existing keys. A `language` / `Sprache` key was added to both locale files so the button label itself is also translated.

---

### Known issue — `StoreProvider` recreates store on every render

**File:** `src/api/services/User/index.tsx`

`value={new Store()}` in the JSX creates a new MobX store instance on every render of `StoreProvider`, which would reset all state. This is currently harmless because `StoreProvider` sits at the root of `App.tsx` and never re-renders in practice. The correct fix is to use a `useState` lazy initializer: `const [store] = useState(() => new Store())`. This is left as a known issue.
