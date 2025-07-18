import type { AsyncFunction, DoResult } from './types';

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
