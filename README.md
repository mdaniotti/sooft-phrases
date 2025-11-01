# Phrase Manager

Application that allows adding, deleting, and searching phrases represented by cards in a grid.

## 📸 Screenshots
<img width="1437" height="783" alt="Screenshot4" src="https://github.com/user-attachments/assets/72642433-e2ce-4c7e-a71d-cbc0bbe1a9a6" />
<img width="1437" height="784" alt="Screenshot3" src="https://github.com/user-attachments/assets/eaa6f8b2-8e36-4c85-bedd-164aa77f4f27" />
<img width="421" height="804" alt="Screenshot2" src="https://github.com/user-attachments/assets/c445df92-21cc-47f8-899b-a5ea51f7c386" />
<img width="767" height="804" alt="Screenshot1" src="https://github.com/user-attachments/assets/cc3af1df-c4ba-49d8-a6f6-ad803cc81669" />
https://github.com/user-attachments/assets/d657dd61-3869-4816-b9f2-c75d8e0c2caa

## 🚀 Features

- ✅ Add inspirational phrases with character limit (280 chars)
- ✅ Search phrases with real-time filtering
- ✅ Delete phrases with confirmation
- ✅ Persistent storage using localStorage
- ✅ Responsive design
- ✅ Error boundaries for unexpected errors
- ✅ Loading states
- ✅ Accessibility support (ARIA labels)

## 🛠️ Tech Stack

- **React 19.1.1** - Latest React with new features
- **TypeScript 5.9.3** - Type safety and developer experience
- **Vite 7.1.7** - Fast build tool and dev server
- **Jest 30.2.0** - Testing framework
- **Testing Library** - Component testing utilities
- **Lucide React** - Icon library
- **use-debounce** - Debounce hook for search

## 📦 Installation

```bash
npm install
```

## 🏃 Running

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AddPhraseForm.tsx
│   ├── SearchBar.tsx
│   ├── PhraseCard.tsx
│   ├── PhraseGrid.tsx
│   ├── EmptyData.tsx
│   ├── Footer.tsx
│   ├── ErrorBoundary.tsx
│   └── index.tsx
├── context/            # React Context & State Management
│   ├── PhrasesContext.tsx
│   └── phrasesCore.ts
├── hooks/              # Custom React hooks
│   ├── usePhrases.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── hoc/                # Higher Order Components
│   └── LoadingState.tsx
├── constants/          # App constants
│   └── index.ts
├── __tests__/          # Test files
└── App.tsx             # Main component
```

## 🎯 Key Technical Decisions

### React 19 with `Activity` Component

**Decision**: Use React 19's new `Activity` component for conditional rendering instead of ternary operators.

**Why**:

- `Activity` provides better performance by keeping components mounted but hidden
- Avoids unmounting/remounting cycles which improves state preservation
- Cleaner API than complex conditional rendering logic
- Demonstrates adoption of latest React features

**Example**:

```tsx
<Activity mode={filter && filteredPhrases.length === 0 ? "visible" : "hidden"}>
  <EmptyData />
</Activity>
```

### State Management: Context + useReducer

**Decision**: Use React Context API with `useReducer` instead of Redux or Zustand.

**Why**:

- **Simplicity**: The app's state is relatively simple, no need for external libraries
- **Built-in**: No additional dependencies, uses React's native APIs
- **Predictable**: Reducer pattern ensures predictable state updates
- **Separation of concerns**: Core logic (`phrasesCore.ts`) separated from React code
- **Type safety**: Full TypeScript support with discriminated unions for actions

**Structure**:

- `phrasesCore.ts`: Pure reducer logic, types, and actions (framework-agnostic)
- `PhrasesContext.tsx`: React integration with provider and hooks

### TypeScript for Type Safety

**Decision**: Full TypeScript implementation with strict typing.

**Why**:

- **Catch errors at compile time**: Prevents runtime errors from type mismatches
- **Refactoring safety**: TypeScript catches breaking changes across the codebase

**Key patterns**:

- Discriminated unions for reducer actions
- Generic hooks (`useLocalStorage<T>`)
- Strict null checks

### Vite over Create React App

**Decision**: Use Vite as build tool instead of CRA.

**Why**:

- **Faster dev server**: Instant HMR (Hot Module Replacement)
- **Faster builds**: Uses esbuild for dependencies
- **Better DX**: Modern tooling, simpler config
- **Smaller bundle**: Better tree-shaking
- **Native ESM**: Modern JavaScript module system

### Custom Hooks Architecture

**Decision**: Create custom hooks (`usePhrases`, `useLocalStorage`) instead of accessing Context directly.

**Why**:

- **Encapsulation**: Hides implementation details from components
- **Reusability**: Hooks can be used across different components
- **Error handling**: `usePhrases` throws clear error if used outside provider
- **Testability**: Easier to test hooks in isolation
- **Future-proof**: Easy to swap implementation (e.g., from Context to Redux)

### localStorage Persistence

**Decision**: Use `localStorage` for data persistence via custom `useLocalStorage` hook.

**Why**:

- **No backend required**: Simplifies architecture for the Challenge
- **Instant persistence**: No network latency
- **Simple migration path**: Can easily swap to backend API later
- **Custom hook abstraction**: Easy to replace storage mechanism

**Implementation notes**:

- Automatic sync: `useEffect` syncs state changes to localStorage
- Error handling: Gracefully falls back to initial value on parse errors
- Type-safe: Generic hook preserves TypeScript types

### Debounced Search

**Decision**: Debounce search input with 300ms delay using `use-debounce` library.

**Why**:

- **Performance**: Reduces filtering operations on every keystroke
- **UX**: Smooth search experience without lag
- **Efficiency**: Only filters when user pauses typing

**Alternative considered**: Custom `useDebounce` hook exists but library provides more features (cancel, immediate mode, etc.)

### Error Boundary Implementation

**Decision**: Implement class-based Error Boundary component.

**Why**:

- **Required pattern**: Error boundaries must be class components (React limitation)
- **Graceful degradation**: App doesn't crash completely on errors
- **Developer experience**: Shows error details in development mode
- **User experience**: Provides recovery options (retry, reload)

**Implementation**:

- Wraps entire app in `main.tsx`
- Shows user-friendly error message in production
- Shows stack traces in development mode
- Provides recovery actions

### HOC for Loading State

**Decision**: Use Higher Order Component (`withLoadingState`) instead of conditional rendering or loading prop.

**Why**:

- **Separation of concerns**: Loading logic separate from component logic
- **Reusability**: Can wrap any component with loading state
- **Consistent UX**: Standardized loading experience across app
- **Flexibility**: Easy to modify loading behavior in one place

**Trade-off**: HOC pattern less common in modern React (hooks preferred), but appropriate for cross-cutting concerns like loading states.

### Memoization Strategy

**Decision**: Use `React.memo` on `PhraseCard` and `useMemo` for filtered phrases.

**Why**:

- **Performance optimization**: Prevents unnecessary re-renders
- `PhraseCard` memo: Only re-renders when props change (phrase data or delete handler)
- `useMemo` for filtering: Only recalculates when `phrases` or `filter` change
- **Measured optimization**: Only memoize where it matters (render-heavy components)

### CSS over CSS-in-JS or Tailwind

**Decision**: Use plain CSS files instead of styled-components, emotion, or Tailwind.

**Why**:

- **Simplicity**: No runtime overhead, faster performance
- **No dependencies**: One less thing to configure and bundle
- **Flexibility**: Full control over styles without library constraints
- **Debugging**: Easier to inspect in browser dev tools
- **Note**: Consider Tailwind for larger projects (see TODO in code)

### Component Composition

**Decision**: Prefer composition over inheritance, small focused components.

**Why**:

- **Maintainability**: Easier to understand and modify
- **Testability**: Smaller components are easier to test
- **Reusability**: Components like `EmptyData` can be used in multiple contexts
- **Separation**: Clear boundaries (Form, Search, Grid, Card, Footer)

### Testing Strategy

**Decision**: Jest + React Testing Library for component and integration tests.

**Why**:

- **User-centric testing**: Tests user interactions, not implementation
- **Accessibility**: Testing Library queries encourage accessible code
- **Coverage**: Tests main user flows (add, delete, search)
- **Mock strategy**: Mock localStorage and external dependencies

**Test structure**:

- Component tests: Test individual component behavior
- Integration tests: Test user flows in `App.test.tsx`
- Test utilities: Custom render with providers for DRY code

### Accessibility

**Decision**: Include ARIA labels and semantic HTML.

**Why**:

- **Inclusivity**: App usable with screen readers
- **Best practice**: Semantic HTML improves SEO and UX
- **Future-proof**: Meets accessibility standards

## 📝 Development Notes

### ID Generation

Currently using `Date.now() + Math.random()` for unique IDs. This is a temporary solution. For production, consider:

- UUID v4 (`uuid` package)
- Backend-generated IDs

### Activity Component

Using React 19's `Activity` component which is still experimental. Monitor React releases for stability.

### Performance Considerations

- Filtering is memoized with `useMemo`
- `PhraseCard` uses `React.memo` to prevent unnecessary re-renders
- Debounced search reduces filtering operations
- Consider virtual scrolling if phrase list grows beyond 1000 items

## 🐛 Known Limitations

- No edit functionality (only add/delete)
- No sorting or advanced filtering
- localStorage has size limits (~5-10MB depending on browser)
- No offline sync when multiple tabs are open
- IDs use timestamp + random (not guaranteed unique in edge cases)

## 📄 License

Private project for Sooft challenge.
