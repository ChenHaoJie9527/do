/**
 * Result tuple type: [error, data]
 * - If successful: [null, data]
 * - If failed: [error, defaultValue | undefined]
 */
export type DoResult<T> = [Error | null, T | undefined];

/**
 * Async function type that can be passed to to()
 */
export type AsyncFunction<T> = (...args: unknown[]) => Promise<T>;

/**
 * Executes an async function and returns a Go-style [error, data] tuple
 * instead of throwing exceptions.
 *
 * @param asyncFn - An async function that returns a Promise<T>
 * @param defaultValue - Optional default value to return when an error occurs
 * @returns Promise<[Error | null, T | undefined]>
 *
 * @example
 * ```typescript
 * // Basic usage
 * const [error, user] = await to(() => fetchUser(id));
 * if (error) {
 *   console.error('Failed to fetch user:', error.message);
 *   return;
 * }
 * console.log('User:', user);
 *
 * // With default value
 * const [error, users] = await to(() => fetchUsers(), []);
 * // users will be [] if fetchUsers() fails
 * ```
 */
export async function to<T>(
  asyncFn: AsyncFunction<T>,
  defaultValue?: T
): Promise<DoResult<T>> {
  try {
    const result = await asyncFn();
    return [null, result];
  } catch (error) {
    // Ensure we always return an Error instance
    const errorInstance =
      error instanceof Error ? error : new Error(String(error));

    return [errorInstance, defaultValue];
  }
}

/**
 * Synchronous version of to() for handling functions that might throw
 *
 * @param fn - A function that might throw an error
 * @param defaultValue - Optional default value to return when an error occurs
 * @returns [Error | null, T | undefined]
 *
 * @example
 * ```typescript
 * const [error, parsed] = toSync(() => JSON.parse(jsonString), {});
 * if (error) {
 *   console.error('Invalid JSON:', error.message);
 *   return;
 * }
 * ```
 */
export function toSync<T>(fn: () => T, defaultValue?: T): DoResult<T> {
  try {
    const result = fn();
    return [null, result];
  } catch (error) {
    const errorInstance =
      error instanceof Error ? error : new Error(String(error));

    return [errorInstance, defaultValue];
  }
}

/**
 * Wraps a Promise directly (for cases where you already have a Promise instance)
 *
 * @param promise - A Promise to wrap
 * @param defaultValue - Optional default value to return when the promise rejects
 * @returns Promise<[Error | null, T | undefined]>
 *
 * @example
 * ```typescript
 * const userPromise = fetchUser(id);
 * const [error, user] = await toPromise(userPromise);
 * ```
 */
export async function toPromise<T>(
  promise: Promise<T>,
  defaultValue?: T
): Promise<DoResult<T>> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    const errorInstance =
      error instanceof Error ? error : new Error(String(error));

    return [errorInstance, defaultValue];
  }
}

// Export as default for convenient importing
export default to;
