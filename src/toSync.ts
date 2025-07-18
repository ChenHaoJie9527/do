import type { DoResult } from './types';

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
