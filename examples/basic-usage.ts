import { to, toPromise, toSync } from '../src/index';

// Example: Basic async/await error handling
async function basicExample() {
  // Simulate an API call that might fail
  const fetchUser = async (id: number) => {
    if (id <= 0) {
      throw new Error('Invalid user ID');
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
    return { id, name: `User ${id}`, email: `user${id}@example.com` };
  };

  // Without do library (traditional approach)
  try {
    const user = await fetchUser(1);
    console.log(user);
  } catch (_error) {
    console.error(_error);
  }

  // With do library (Go-style approach)
  const [error, _user] = await to(() => fetchUser(1));
  if (error) {
    return;
  }
}

// Example: Error handling with default values
async function defaultValueExample() {
  const fetchUsers = async () => {
    // Simulate a failing API call
    throw new Error('API is down');
  };

  // With default value
  const [error, _users] = await to(() => fetchUsers(), []);
  if (error) {
    console.error(error);
  } else {
    console.log(_users);
  }
}

// Example: Synchronous error handling
function syncExample() {
  // JSON parsing that might fail
  const jsonStrings = ['{"valid": "json"}', 'invalid json'];

  for (const jsonString of jsonStrings) {
    const [error, _parsed] = toSync(() => JSON.parse(jsonString), {});

    if (error) {
      console.error(error);
    } else {
      console.log(_parsed);
    }
  }
}

// Example: Promise wrapper
async function promiseWrapperExample() {
  // When you already have a Promise instance
  const userPromise = fetch(
    'https://jsonplaceholder.typicode.com/users/1'
  ).then((res) => res.json());

  const [error, _userData] = await toPromise(userPromise, {
    name: 'Anonymous',
  });

  if (error) {
    console.error(error);
  } else {
    console.log(_userData);
  }
}

// Example: Complex real-world scenario
async function realWorldExample() {
  // Simulate database operations
  const db = {
    async getUser(id: number) {
      if (id === 999) {
        throw new Error('User not found');
      }
      return { id, name: `User ${id}`, preferences: {} };
    },

    async getUserPosts(_userId: number) {
      if (_userId === 999) {
        throw new Error('User not found');
      }
      return [
        { id: 1, title: 'Hello World', content: 'First post' },
        { id: 2, title: 'Second Post', content: 'Another post' },
      ];
    },

    async getUserSettings(_userId: number) {
      if (_userId === 999) {
        throw new Error('Settings not found');
      }
      return { theme: 'dark', notifications: true };
    },
  };

  // Fetch multiple pieces of data with graceful error handling
  const userId = 1;

  const [_userError, user] = await to(() => db.getUser(userId));
  const [_postsError, posts] = await to(() => db.getUserPosts(userId), []);
  const [_settingsError, settings] = await to(
    () => db.getUserSettings(userId),
    {
      theme: 'light',
      notifications: false,
    }
  );

  // Even if some operations fail, we can continue with defaults
  const _profile = {
    user: user || { id: 0, name: 'Anonymous', preferences: {} },
    posts: posts || [],
    settings: settings || { theme: 'light', notifications: false },
  };
}

// Run all examples
async function runExamples() {
  await basicExample();
  await defaultValueExample();
  syncExample();
  await promiseWrapperExample();
  await realWorldExample();
}

// Export for potential use in other files
export {
  basicExample,
  defaultValueExample,
  syncExample,
  promiseWrapperExample,
  realWorldExample,
};

// Run if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}
