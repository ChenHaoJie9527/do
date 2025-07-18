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
