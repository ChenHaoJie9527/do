# go-style-error v1.0.0 Release Notes

## 🎉 Initial Release

Welcome to the first release of `go-style-error`! This library brings Go-style error handling to JavaScript/TypeScript, making async/await error handling more elegant and linear.

## ✨ Features

### Core Functions

- **`to<T>(asyncFn, defaultValue?)`** - Handle async functions with Go-style error tuples
- **`toSync<T>(fn, defaultValue?)`** - Handle synchronous functions that might throw
- **`toPromise<T>(promise, defaultValue?)`** - Wrap existing Promise instances

### Key Benefits

- 🚀 **Zero Dependencies** - Lightweight, no external dependencies
- 🎯 **Type Safe** - Full TypeScript support with proper type inference
- 🔄 **Go Style** - Returns `[error, data]` tuples instead of throwing exceptions
- 🛡️ **Elegant Fallbacks** - Support for default values when errors occur
- 📦 **Multi-format** - Support for CommonJS and ES Modules

## 📦 Installation

```bash
npm install go-style-error
# or
yarn add go-style-error
# or
pnpm add go-style-error
```

## 🚀 Quick Start

### Before (Traditional try-catch)
```typescript
try {
  const user = await fetchUser(id);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error.message);
}
```

### After (Go-style)
```typescript
import { to } from 'go-style-error';

const [error, user] = await to(() => fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}
console.log(user);
```

### With Default Values
```typescript
const [error, users] = await to(() => fetchUsers(), []);
// users will be [] if fetchUsers() fails
```

## 🔧 API Reference

### `to<T>(asyncFn, defaultValue?)`
Executes an async function and returns a `[error, data]` tuple.

**Parameters:**
- `asyncFn: (...args: unknown[]) => Promise<T>` - The async function to execute
- `defaultValue?: T` - Optional default value when an error occurs

**Returns:**
- `Promise<[Error | null, T | undefined]>` - Tuple with error (null on success) and data

### `toSync<T>(fn, defaultValue?)`
Synchronous version for functions that might throw.

**Parameters:**
- `fn: () => T` - The sync function to execute
- `defaultValue?: T` - Optional default value when an error occurs

**Returns:**
- `[Error | null, T | undefined]` - Tuple with error and data

### `toPromise<T>(promise, defaultValue?)`
Wraps an existing Promise instance.

**Parameters:**
- `promise: Promise<T>` - The Promise to wrap
- `defaultValue?: T` - Optional default value when the promise rejects

**Returns:**
- `Promise<[Error | null, T | undefined]>` - Tuple with error and data

## 💡 Use Cases

### API Calls
```typescript
const [userError, user] = await to(() => fetchUser(userId));
const [postsError, posts] = await to(() => fetchUserPosts(userId), []);
```

### JSON Parsing
```typescript
const [error, parsed] = toSync(() => JSON.parse(jsonString), {});
```

### Database Operations
```typescript
const [dbError, user] = await to(() => db.users.create(userData));
```

### File Operations
```typescript
const [readError, content] = toSync(() => fs.readFileSync(path, 'utf8'));
```

## 🧪 Testing

The library includes comprehensive tests covering:
- ✅ Async error handling
- ✅ Sync error handling
- ✅ Promise wrapping
- ✅ Edge cases (non-Error values, null/undefined)
- ✅ Type safety
- ✅ Real-world scenarios

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

---

**Make async error handling simple and elegant!** 🎉 