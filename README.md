# do

一个优雅的 JavaScript/TypeScript 异步错误处理库，灵感来源于 Go 语言的错误处理模式。

## ✨ 特性

- 🚀 **零依赖** - 轻量级，无外部依赖
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🔄 **Go 风格** - 返回 `[error, data]` 元组，避免 try-catch 的繁琐语法
- 🛡️ **优雅降级** - 支持默认值，让错误处理更加优雅
- 📦 **多格式** - 支持 CommonJS 和 ES Modules
- 🧪 **全面测试** - 100% 测试覆盖率

## 📦 安装

```bash
npm install do
# 或
yarn add do
# 或
pnpm add do
```

## 🚀 快速开始

### 基本用法

```typescript
import { to } from 'do';

// 传统方式
try {
  const user = await fetchUser(id);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error.message);
}

// 使用 do 库
const [error, user] = await to(() => fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}
console.log(user);
```

### 带默认值的错误处理

```typescript
import { to } from 'do';

// 如果 API 调用失败，使用默认值
const [error, users] = await to(() => fetchUsers(), []);
// users 将是 [] 如果 fetchUsers() 失败

// 带默认对象的错误处理
const [error, settings] = await to(
  () => fetchUserSettings(userId),
  { theme: 'light', notifications: false }
);
```

## 📚 API 参考

### `to<T>(asyncFn, defaultValue?)`

执行异步函数并返回 `[error, data]` 元组。

**参数：**
- `asyncFn: (...args: any[]) => Promise<T>` - 要执行的异步函数
- `defaultValue?: T` - 可选，当错误发生时的默认值

**返回：**
- `Promise<[Error | null, T | undefined]>` - 元组，第一个元素是错误（成功时为 null），第二个元素是数据

### `toSync<T>(fn, defaultValue?)`

同步版本的 `to` 函数，用于处理可能抛出错误的同步函数。

**参数：**
- `fn: () => T` - 要执行的同步函数
- `defaultValue?: T` - 可选，当错误发生时的默认值

**返回：**
- `[Error | null, T | undefined]` - 元组

### `toPromise<T>(promise, defaultValue?)`

直接包装 Promise 实例。

**参数：**
- `promise: Promise<T>` - 要包装的 Promise
- `defaultValue?: T` - 可选，当 Promise 拒绝时的默认值

**返回：**
- `Promise<[Error | null, T | undefined]>` - 元组

## 💡 使用示例

### 1. API 调用处理

```typescript
import { to } from 'do';

async function loadUserProfile(userId: number) {
  const [userError, user] = await to(() => fetchUser(userId));
  const [postsError, posts] = await to(() => fetchUserPosts(userId), []);
  const [settingsError, settings] = await to(
    () => fetchUserSettings(userId),
    { theme: 'light', notifications: false }
  );

  // 即使某些操作失败，我们仍可以继续使用默认值
  return {
    user: user || { id: 0, name: 'Anonymous' },
    posts: posts || [],
    settings: settings || { theme: 'light', notifications: false }
  };
}
```

### 2. JSON 解析

```typescript
import { toSync } from 'do';

function parseUserData(jsonString: string) {
  const [error, userData] = toSync(() => JSON.parse(jsonString), {});
  
  if (error) {
    console.error('Invalid JSON:', error.message);
    return null;
  }
  
  return userData;
}
```

### 3. 数据库操作

```typescript
import { to } from 'do';

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
```

### 4. 文件操作

```typescript
import { toSync } from 'do';
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
```

### 5. 网络请求

```typescript
import { toPromise } from 'do';

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
```

## 🔧 开发

### 安装依赖

```bash
pnpm install
```

### 运行测试

```bash
pnpm test
```

### 构建库

```bash
pnpm build
```

### 代码格式化

```bash
pnpm format
```

### 类型检查

```bash
pnpm typecheck
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

这个库的设计灵感来源于：
- Go 语言的错误处理模式
- [await-to-js](https://github.com/scopsy/await-to-js) 库
- 社区中关于优雅错误处理的讨论

---

**让异步错误处理变得简单而优雅！** 🎉 