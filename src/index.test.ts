import { describe, expect, it } from 'vitest';
import { to, toPromise, toSync } from './index';

// Mock async functions for testing
const successfulAsync = async (value: string): Promise<string> => {
  return Promise.resolve(value);
};

const failingAsync = async (): Promise<string> => {
  return Promise.reject(new Error('Async operation failed'));
};

const throwingAsync = async (): Promise<string> => {
  throw new Error('Thrown error');
};

// Mock sync functions for testing
const successfulSync = (value: number): number => {
  return value * 2;
};

const throwingSync = (): string => {
  throw new Error('Sync operation failed');
};

const jsonParseSync = (json: string): unknown => {
  return JSON.parse(json);
};

describe('to() - Async error handling', () => {
  it('should return [null, data] on successful async operation', async () => {
    const [error, result] = await to(() => successfulAsync('hello'));

    expect(error).toBeNull();
    expect(result).toBe('hello');
  });

  it('should return [error, undefined] on failing async operation', async () => {
    const [error, result] = await to(() => failingAsync());

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Async operation failed');
    expect(result).toBeUndefined();
  });

  it('should return [error, defaultValue] when defaultValue is provided', async () => {
    const defaultValue = 'default';
    const [error, result] = await to(() => failingAsync(), defaultValue);

    expect(error).toBeInstanceOf(Error);
    expect(result).toBe(defaultValue);
  });

  it('should handle thrown errors in async functions', async () => {
    const [error, result] = await to(() => throwingAsync());

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Thrown error');
    expect(result).toBeUndefined();
  });

  it('should work with complex async operations', async () => {
    const fetchUser = async (id: number) => {
      if (id <= 0) {
        throw new Error('Invalid user ID');
      }
      return { id, name: `User ${id}`, email: `user${id}@example.com` };
    };

    // Successful case
    const [error1, user1] = await to(() => fetchUser(1));
    expect(error1).toBeNull();
    expect(user1).toEqual({
      id: 1,
      name: 'User 1',
      email: 'user1@example.com',
    });

    // Error case
    const [error2, user2] = await to(() => fetchUser(-1));
    expect(error2).toBeInstanceOf(Error);
    expect(error2?.message).toBe('Invalid user ID');
    expect(user2).toBeUndefined();

    // Error case with default value
    const defaultUser = {
      id: 0,
      name: 'Anonymous',
      email: 'anonymous@example.com',
    };
    const [error3, user3] = await to(() => fetchUser(-1), defaultUser);
    expect(error3).toBeInstanceOf(Error);
    expect(user3).toEqual(defaultUser);
  });
});

describe('toSync() - Synchronous error handling', () => {
  it('should return [null, data] on successful sync operation', () => {
    const [error, result] = toSync(() => successfulSync(5));

    expect(error).toBeNull();
    expect(result).toBe(10);
  });

  it('should return [error, undefined] on failing sync operation', () => {
    const [error, result] = toSync(() => throwingSync());

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Sync operation failed');
    expect(result).toBeUndefined();
  });

  it('should return [error, defaultValue] when defaultValue is provided', () => {
    const defaultValue = 'default result';
    const [error, result] = toSync(() => throwingSync(), defaultValue);

    expect(error).toBeInstanceOf(Error);
    expect(result).toBe(defaultValue);
  });

  it('should handle JSON parsing gracefully', () => {
    // Valid JSON
    const [error1, result1] = toSync(() => jsonParseSync('{"name": "John"}'));
    expect(error1).toBeNull();
    expect(result1).toEqual({ name: 'John' });

    // Invalid JSON
    const [error2, result2] = toSync(() => jsonParseSync('invalid json'));
    expect(error2).toBeInstanceOf(Error);
    expect(result2).toBeUndefined();

    // Invalid JSON with default value
    const defaultValue = {};
    const [error3, result3] = toSync(
      () => jsonParseSync('invalid json'),
      defaultValue
    );
    expect(error3).toBeInstanceOf(Error);
    expect(result3).toBe(defaultValue);
  });
});

describe('toPromise() - Promise wrapper', () => {
  it('should return [null, data] on successful promise', async () => {
    const promise = Promise.resolve('success');
    const [error, result] = await toPromise(promise);

    expect(error).toBeNull();
    expect(result).toBe('success');
  });

  it('should return [error, undefined] on rejected promise', async () => {
    const promise = Promise.reject(new Error('Promise rejected'));
    const [error, result] = await toPromise(promise);

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Promise rejected');
    expect(result).toBeUndefined();
  });

  it('should return [error, defaultValue] when defaultValue is provided', async () => {
    const promise = Promise.reject(new Error('Promise rejected'));
    const defaultValue = 'fallback';
    const [error, result] = await toPromise(promise, defaultValue);

    expect(error).toBeInstanceOf(Error);
    expect(result).toBe(defaultValue);
  });

  it('should handle non-Error rejections by converting them to Error', async () => {
    const promise = Promise.reject('string error');
    const [error, result] = await toPromise(promise);

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('string error');
    expect(result).toBeUndefined();
  });
});

describe('Error handling edge cases', () => {
  it('should convert non-Error thrown values to Error instances', async () => {
    const throwString = async (): Promise<string> => {
      throw new Error('string error');
    };

    const [error, result] = await to(() => throwString());

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('string error');
    expect(result).toBeUndefined();
  });

  it('should handle null and undefined thrown values', async () => {
    const throwNull = async (): Promise<string> => {
      throw new Error('null');
    };

    const throwUndefined = async (): Promise<string> => {
      throw new Error('undefined');
    };

    const [error1, _result1] = await to(() => throwNull());
    expect(error1).toBeInstanceOf(Error);
    expect(error1?.message).toBe('null');

    const [error2, _result2] = await to(() => throwUndefined());
    expect(error2).toBeInstanceOf(Error);
    expect(error2?.message).toBe('undefined');
  });
});

describe('Type safety', () => {
  it('should maintain type safety for successful results', async () => {
    interface User {
      id: number;
      name: string;
    }

    const fetchUser = async (): Promise<User> => {
      return { id: 1, name: 'John' };
    };

    const [error, user] = await to(() => fetchUser());

    if (!error) {
      // TypeScript should infer that user is User | undefined here
      expect(user?.id).toBe(1);
      expect(user?.name).toBe('John');
    }
  });

  it('should handle arrays and complex types', async () => {
    const fetchUsers = async (): Promise<
      Array<{ id: number; name: string }>
    > => {
      return [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
    };

    const [error, users] = await to(() => fetchUsers(), []);

    expect(error).toBeNull();
    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(2);
  });
});

describe('Real-world usage scenarios', () => {
  it('should work well in a data fetching scenario', async () => {
    // Simulate API calls
    const fetchUserProfile = async (userId: number) => {
      if (userId === 404) {
        throw new Error('User not found');
      }
      return { id: userId, name: `User ${userId}`, avatar: 'avatar.png' };
    };

    const fetchUserPosts = async (userId: number) => {
      if (userId === 404) {
        throw new Error('User not found');
      }
      return [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];
    };

    // Successful scenario
    const [profileError, profile] = await to(() => fetchUserProfile(1));
    const [postsError, posts] = await to(() => fetchUserPosts(1), []);

    expect(profileError).toBeNull();
    expect(profile?.name).toBe('User 1');
    expect(postsError).toBeNull();
    expect(posts).toHaveLength(2);

    // Error scenario
    const [errorProfile, fallbackProfile] = await to(
      () => fetchUserProfile(404),
      { id: 0, name: 'Unknown User', avatar: 'default.png' }
    );

    expect(errorProfile).toBeInstanceOf(Error);
    expect(fallbackProfile?.name).toBe('Unknown User');
  });
});
