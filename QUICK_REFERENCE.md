# Quick Reference Guide - New Utilities & Components

## 🔧 New Utilities/Hooks

### Validation
```tsx
import { uploadResumeSchema, validateFile } from '~/lib/validation';
// Use for form validation and file checks
```

### Notifications
```tsx
import { useToast } from '~/hooks/useToast';
const { success, error, warning, info } = useToast();
```

### Performance
```tsx
import {
  useDebounce,
  useThrottle,
  useLazyLoadImage,
  useMemoized,
  useCallbackMemo,
  useAnimationFrame,
  useDynamicImport,
  useVirtualScroll,
} from '~/lib/performance';
```

### Accessibility
```tsx
import {
  SkipToMainContent,
  ScreenReaderOnly,
  useFocusTrap,
} from '~/lib/accessibility';
```

### Responsive Design
```tsx
import {
  useResponsive,
  RESPONSIVE_CONTAINER,
  RESPONSIVE_PATTERNS,
  getResponsiveGridCols,
  getResponsiveSpacing,
  getResponsiveFontSize,
} from '~/lib/responsive';
```

---

## 🧩 New Components

### Form Components
```tsx
import { FormInput, FormTextarea } from '~/components/FormComponents';

<FormInput
  label="Name"
  error={errors.name}
  helperText="Your full name"
  required
/>

<FormTextarea
  label="Description"
  error={errors.description}
  placeholder="Enter description"
/>
```

### Score Display
```tsx
import { ScoreCard } from '~/components/ScoreCard';

<ScoreCard
  title="ATS Score"
  score={85}
  showProgress
  description="Your ATS compatibility"
/>
```

### Loading States
```tsx
import {
  ResumeCardSkeleton,
  SummaryCardSkeleton,
  ATSSkeleton,
  DetailsPageSkeleton,
} from '~/components/LoadingSkeletons';
```

### Toast Notifications
```tsx
import { ToastContainer } from '~/components/ToastContainer';
// Already added to root.tsx
```

### UX Enhancements
```tsx
import {
  EmptyState,
  QuickStats,
  ResomeActionMenu,
  ProgressIndicator,
  FeatureHighlight,
  SuccessMessage,
} from '~/components/UXEnhancements';

<EmptyState
  icon="📄"
  title="No Resumes"
  description="Upload your first resume to get started"
  action={{ label: "Upload", href: "/upload" }}
/>
```

---

## 🎨 Enhanced UI Components (shadcn)

```tsx
import { Input } from '~/components/ui/input';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
```

---

## 📋 Common Patterns

### Form Validation
```tsx
const validation = uploadResumeSchema.safeParse(formData);
if (!validation.success) {
  validation.error.errors.forEach(err => {
    // Handle error
  });
}
```

### Error Handling with Toast
```tsx
const { error } = useToast();
try {
  // Do something
} catch (err) {
  error(err instanceof Error ? err.message : 'Unknown error');
}
```

### Debounced Search
```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // Perform search with debouncedSearch
}, [debouncedSearch]);
```

### Loading State with Skeleton
```tsx
{isLoading ? (
  <ResumeCardSkeleton />
) : (
  <ResumeCard resume={resume} />
)}
```

### Responsive Layout
```tsx
<div className={RESPONSIVE_PATTERNS.sidePanel}>
  <div>Left Column</div>
  <div>Right Column</div>
</div>
```

### Accessibility
```tsx
<div
  role="region"
  aria-label="Score breakdown"
  aria-describedby="score-info"
>
  {/* Content */}
</div>
```

---

## 📊 Migration Guide

### Before (Old Code)
```tsx
<div className="bg-white rounded-2xl shadow-md">
  <div className="flex gap-3">
    <p className="text-xl">{title}</p>
    <p className="text-gray-600">{score}/100</p>
  </div>
</div>
```

### After (New Code)
```tsx
<ScoreCard
  title={title}
  score={score}
  showProgress
/>
```

---

## 🚀 Getting Started

1. **Use the new form components** for all forms
2. **Add error handling** with try-catch and useToast
3. **Use skeletons** for loading states
4. **Add ARIA labels** to interactive elements
5. **Test responsive design** on mobile
6. **Use performance hooks** for optimization

---

## 📚 File Structure

```
app/
├── lib/
│   ├── validation.ts           # Form validation
│   ├── accessibility.tsx       # A11y utilities
│   ├── performance.ts          # Performance hooks
│   ├── responsive.tsx          # Responsive utilities
│   └── puter.ts               # (existing)
├── hooks/
│   └── useToast.ts            # Toast notifications
├── components/
│   ├── FormComponents.tsx      # Form inputs
│   ├── ScoreCard.tsx           # Score display
│   ├── LoadingSkeletons.tsx    # Skeleton loaders
│   ├── ToastContainer.tsx      # Toast UI
│   ├── UXEnhancements.tsx      # UX components
│   └── ui/
│       ├── input.tsx           # (new)
│       ├── alert.tsx           # (new)
│       └── skeleton.tsx        # (new)
└── routes/
    ├── upload.tsx             # (enhanced)
    ├── resume.tsx             # (enhanced)
    └── home.tsx               # (enhanced)
```

---

## ✅ Checklist for New Features

When adding new features, remember to:

- [ ] Add form validation if needed
- [ ] Add error handling with try-catch
- [ ] Show toast notifications for success/error
- [ ] Add loading skeleton while fetching
- [ ] Include ARIA labels for accessibility
- [ ] Test on mobile (responsive)
- [ ] Use reusable components (FormInput, ScoreCard, etc.)
- [ ] Add empty state if applicable
- [ ] Optimize with performance hooks if needed

---

## 🆘 Troubleshooting

### Toast not showing?
- Make sure `ToastContainer` is in `root.tsx`
- Check that you're using `useToast()` hook

### Validation errors not showing?
- Use `.safeParse()` instead of `.parse()`
- Map error.errors array to fields

### Components not responsive?
- Check Tailwind breakpoints (sm, md, lg, xl)
- Use `RESPONSIVE_PATTERNS` for consistent layouts

### Accessibility warnings?
- Add `aria-label` to all interactive elements
- Use semantic HTML (button, input, label)
- Check color contrast with DevTools

---

## 📖 References

- Zod Docs: https://zod.dev
- Shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- React Best Practices: https://react.dev
