# Azure Static Web Apps JSX Runtime Fix

## 🎯 Problem Summary

Azure deployment was failing with:
```
Could not resolve "./cjs/react-jsx-runtime.production.min.js"
from "./cjs/react-jsx-runtime.production.min.js?commonjs-external"
```

This error occurred during Azure Oryx build with:
- Node.js: v22.20.0 (installed by Oryx)
- Vite: v7.3.0
- React: v18.3.1

## 🔍 Root Causes Identified

1. **Version Mismatches**: Critical React-related packages had version mismatches:
   - `react-is`: v19.2.3 (incompatible with React v18.3.1)
   - `@types/react`: v19.2.7 (incompatible with React v18.3.1)
   - `@types/react-dom`: v19.2.3 (incompatible with react-dom v18.3.1)

2. **Vite Build Configuration**: Missing proper handling for React JSX runtime in production builds:
   - No explicit JSX runtime configuration
   - Missing `optimizeDeps` configuration for React
   - Manual chunks didn't properly handle `react/jsx-runtime`
   - No CommonJS transformation options

3. **Node Version**: Azure Oryx was using Node 22.20.0, which may have compatibility issues with Vite 7 + React 18

4. **Rollup Resolution**: Rollup was trying to resolve React's JSX runtime as a CommonJS external, causing module resolution failures

## ✅ Fixes Applied

### 1. Fixed Version Mismatches in `package.json`

**Before:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-is": "^19.2.3"  // ❌ Wrong version
  },
  "devDependencies": {
    "@types/react": "^19.2.7",      // ❌ Wrong version
    "@types/react-dom": "^19.2.3"   // ❌ Wrong version
  },
  "engines": {
    "node": ">=20.19.0"  // ❌ Too permissive
  }
}
```

**After:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-is": "^18.3.1"  // ✅ Matches React version
  },
  "devDependencies": {
    "@types/react": "^18.3.12",     // ✅ Matches React version
    "@types/react-dom": "^18.3.1"   // ✅ Matches react-dom version
  },
  "engines": {
    "node": "20.19.0"  // ✅ Exact version lock
  }
}
```

### 2. Enhanced `vite.config.js` Build Configuration

**Key Changes:**

1. **Explicit JSX Runtime Configuration:**
   ```javascript
   react({
     jsxRuntime: 'automatic',
   })
   ```

2. **Dependency Deduplication:**
   ```javascript
   resolve: {
     dedupe: ['react', 'react-dom'],
   }
   ```

3. **Optimize Dependencies:**
   ```javascript
   optimizeDeps: {
     include: ['react', 'react-dom', 'react/jsx-runtime'],
   }
   ```

4. **CommonJS Transformation:**
   ```javascript
   build: {
     commonjsOptions: {
       include: [/node_modules/],
       transformMixedEsModules: true,
     }
   }
   ```

5. **Fixed Manual Chunks:**
   ```javascript
   manualChunks: (id) => {
     // Ensure react/jsx-runtime is bundled with react
     if (id.includes('react/jsx-runtime') || id.includes('react-jsx-runtime')) {
       return 'react-vendor'
     }
     // ... rest of chunking logic
   }
   ```

### 3. Updated GitHub Actions Workflow

**Changes:**
- Added `check-latest: false` to prevent Node version drift
- Added `NODE_VERSION` environment variable to the build step
- Ensured Node 20.19.0 is used consistently

### 4. Node Version Lock Files

- `.nvmrc`: Already set to `20.19.0` ✅
- `package.json` engines: Now locked to exact version `20.19.0` ✅

## 📋 Complete File Changes

### `package.json`
- ✅ Changed `react-is` from `^19.2.3` to `^18.3.1`
- ✅ Changed `@types/react` from `^19.2.7` to `^18.3.12`
- ✅ Changed `@types/react-dom` from `^19.2.3` to `^18.3.1`
- ✅ Changed `engines.node` from `>=20.19.0` to `20.19.0`

### `vite.config.js`
- ✅ Added explicit `jsxRuntime: 'automatic'` to React plugin
- ✅ Added `resolve.dedupe` for React packages
- ✅ Added `optimizeDeps.include` for React JSX runtime
- ✅ Added `build.commonjsOptions` for CommonJS transformation
- ✅ Fixed `manualChunks` to properly handle `react/jsx-runtime`

### `.github/workflows/azure-static-web-apps-calm-coast-0cd7dff00.yml`
- ✅ Added `check-latest: false` to Node setup
- ✅ Added `NODE_VERSION: '20.19.0'` environment variable

## 🔬 Why This Error Occurred

1. **Version Mismatch Impact**: React v19 types (`@types/react@19`) expect different module structures than React v18. When Rollup tried to bundle, it encountered type definitions pointing to v19 module paths that don't exist in v18.

2. **JSX Runtime Resolution**: Vite 7 with Rollup was trying to resolve `react-jsx-runtime.production.min.js` as a CommonJS external module, but the path resolution failed because:
   - The module structure didn't match what the types expected
   - CommonJS transformation wasn't properly configured
   - The JSX runtime wasn't explicitly included in optimization

3. **Node 22 Compatibility**: While Node 22 should work, there may be subtle differences in module resolution that caused issues with the version mismatches. Locking to Node 20 ensures consistency.

## 🚀 Why The Fix Works

1. **Version Alignment**: All React-related packages now use v18, ensuring consistent module structures and type definitions.

2. **Explicit JSX Runtime Handling**: By explicitly configuring the JSX runtime and including it in `optimizeDeps`, Vite knows to bundle it correctly rather than trying to resolve it as an external.

3. **CommonJS Transformation**: The `transformMixedEsModules: true` option ensures that any CommonJS modules (like some React internals) are properly transformed during the build.

4. **Proper Chunking**: The updated `manualChunks` function ensures that `react/jsx-runtime` is always bundled with the React vendor chunk, preventing resolution issues.

5. **Node Version Lock**: Locking to Node 20.19.0 ensures consistent behavior across local and Azure builds.

## 🧪 Verification Steps

After applying these fixes:

1. **Local Build Test:**
   ```bash
   npm install
   npm run build
   ```
   Should complete without errors.

2. **Check Dependencies:**
   ```bash
   npm list react react-dom react-is @types/react @types/react-dom
   ```
   All should show v18.x versions.

3. **Azure Deployment:**
   - Push to main branch
   - Monitor GitHub Actions workflow
   - Verify build completes successfully
   - Check Azure Static Web Apps deployment logs

## ⚠️ Important Notes

- **DO NOT** mix React v18 and v19 packages - always keep them aligned
- **DO NOT** remove the `optimizeDeps.include` for `react/jsx-runtime`
- **DO NOT** change Node version without testing thoroughly
- **ALWAYS** verify version compatibility before updating React-related packages

## 🎉 Expected Result

- ✅ No Rollup resolution errors
- ✅ No React JSX runtime issues
- ✅ Clean Oryx build on Azure
- ✅ Successful deployment to Azure Static Web Apps

## 📚 Additional Resources

- [Vite Build Configuration](https://vitejs.dev/config/build-options.html)
- [React JSX Runtime](https://react.dev/learn/writing-markup-with-jsx)
- [Azure Static Web Apps Oryx](https://github.com/microsoft/Oryx)
