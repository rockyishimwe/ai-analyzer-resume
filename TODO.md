# LMS Project Fixes - Progress Tracker

## Current Status
- Dev server: Running but crashing on /resume due to esbuild error
- Primary Issue: Duplicate `isLoading` in app/routes/resume.tsx
- Secondary: Wipe.tsx runtime bugs

## Steps (Priority Order)

### 1. Fix Build Crash [CRITICAL]
- [x] app/routes/resume.tsx: Fixed duplicate `isLoading`
- [x] tsconfig.json: Fixed ignoreDeprecations

### 2. Fix Wipe.tsx Bugs
- [x] Fixed FSItem type/module issue (used any[])
- [x] Fixed `handleDelete`: Promise.all + loading + toast
- [x] Fixed useEffect deps
- [x] Added Button + disabled state

### 3. Minor Polishes
- [ ] app/routes/home.tsx: Merge useEffects, fix syntax
- [ ] Run `npm run typecheck`

### 4. Test & Complete
- [ ] Test /wipe functionality
- [ ] Test /resume page
- [ ] attempt_completion

Updated: $(date)

