# do

An elegant JavaScript/TypeScript asynchronous error handling library inspired by the Go language's error handling model.

## ✨ Features

- 🚀 **Zero Dependencies** - Lightweight, no external dependencies
- 🎯 **Type-safe** - full TypeScript support
- 🔄 **Go style** - returns `[error, data]` tuples, avoiding the cumbersome syntax of try-catch
- 🛡️ **Elegant Degradation** - support default values for more elegant error handling
- 📦 **Multi-format** - support for CommonJS and ES Modules
- 🧪 **Fully tested** - 100% test coverage

## 📦 Installation

```bash
npm install go-style-error
# or
yarn add go-style-error
# or
pnpm add go-style-error
```

## 🚀 Quick start

### basic usage

```typescript
import { to } from 'go-style-error';

// traditional approach
try {
  const user = await fetchUser(id);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error.message);
}

// Using the go-style-error Library
const [error, user] = await to(() => fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}
console.log(user);
```

### Error handling with default values

```typescript
import { to } from 'go-style-error';

// If the API call fails, use the default
const [error, users] = await to(() => fetchUsers(), []);
// users will be [] if fetchUsers() fails

// Error Handling with Default Objects
const [error, settings] = await to(
  () => fetchUserSettings(userId),
  { theme: 'light', notifications: false }
);

### 📚 API reference

### `to<T>(asyncFn, defaultValue?)`

Executes an asynchronous function and returns the `[error, data]` tuple.

** Parameters.
- `asyncFn: (... .args: any[]) => Promise<T>` - the asynchronous function to execute
- `defaultValue?: T` - optional, default value when an error occurs

**Returns:**
- `Promise<[Error | null, T | undefined]>` - tuple, the first element is the error (null on success), the second element is the data

### `toSync<T>(fn, defaultValue?)` - the first element is the error (null on success), the second is the data

Synchronized version of the `to` function for handling synchronized functions that may throw errors.

**Arguments:**
- `fn: () => T` - the synchronization function to be executed
- `defaultValue?: T` - optional, default value when an error occurs

**Returns:**
- `[Error | null, T | undefined]` - the tuple

### `toPromise<T>(promise, defaultValue?)`

Wraps the Promise instance directly.

**Parameters:**
- `promise: Promise<T>` - the Promise to be wrapped
- `defaultValue?: T` - optionally, the default value when the Promise is rejected

**Returns:**
- `Promise<[Error | null, T | undefined]>` - The tuple

## 💡 Usage Examples

### 1. API call handling

```typescript
import { to } from 'go-style-error';

async function loadUserProfile(userId: number) {
  const [userError, user] = await to(() => fetchUser(userId));
  const [postsError, posts] = await to(() => fetchUserPosts(userId), []);
  const [settingsError, settings] = await to(
    () => fetchUserSettings(userId),
    { theme: 'light', notifications: false }
  );

  // We can continue to use the defaults even if something fails.
  return {
    user: user || { id: 0, name: 'Anonymous' },
    posts: posts || [],
    settings: settings || { theme: 'light', notifications: false }
  };
}

### 2. JSON parsing

```typescript
import { toSync } from 'go-style-error';

function parseUserData(jsonString: string) {
  const [error, userData] = toSync(() => JSON.parse(jsonString), {});
  
  if (error) {
    console.error('Invalid JSON:', error.message);
    return null;
  }
  
  return userData;
}

### 3. Database operations

```typescript
import { to } from 'go-style-error';

async function createUser(userData: UserData) {
  const [validationError, validatedData] = await to(() => validateUser(userData));
  if (validationError) {
    return { success: false, error: validationError.message };
  }

  const [dbError, user] = await to(() => db.users.create(validatedData));
  if (dbError) {
    return { success: false, error: 'Failed to create user' };
  }

  return { success: true, user };
}

### 4. Documentation operations

```typescript
import { toSync } from 'go-style-error';
import fs from 'fs';

function readConfigFile(path: string) {
  const [readError, content] = toSync(() => fs.readFileSync(path, 'utf8'));
  if (readError) {
    console.error('Failed to read config file:', readError.message);
    return null;
  }

  const [parseError, config] = toSync(() => JSON.parse(content), {});
  if (parseError) {
    console.error('Invalid config format:', parseError.message);
    return null;
  }

  return config;
}

### 5. network request

```typescript
import { toPromise } from 'go-style-error';

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const promise = fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .finally(() => clearTimeout(timeoutId));

  const [error, data] = await toPromise(promise, null);
  
  if (error) {
    console.error('Request failed:', error.message);
    return null;
  }

  return data;
}

## 🔧 Development

### Install dependencies

```bash 
pnpm install 
```

### Run tests

```bash 
pnpm test:watch 
```

### Build the library

```bash 
pnpm build 
```

### Code formatting

```bash 
pnpm format 
```

### Type checking

```bash 
pnpm typecheck 
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

This library was inspired by:
- Go language's error handling model
- [await-to-js](https://github.com/scopsy/await-to-js) Library
- Community discussions on graceful error handling

---

** Makes asynchronous error handling simple and elegant! ** 🎉