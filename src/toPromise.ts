import type { DoResult } from './types';

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
