export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private cache: Map<string, Promise<TOutput>> = new Map();
  private pending: Map<string, Promise<TOutput>> = new Map();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  
  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    // This will check if there is already existing data in the cache
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // This will check if there is a pending execution
    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }

    const promise = this.handler(...args)
      .then((result) => {
        // When the successful execution is done, it will add the result to the cache
        this.cache.set(key, Promise.resolve(result));
        return result;
      }).catch((error) => {
        // this will catch any error when there is issue in handler
        throw error;
      }).finally(() => {
        // This will execute every time when the promise is executed and delete the current cache
        this.pending.delete(key);
      })
      
    // This will set the result of the promise to the cache
    this.pending.set(key, promise);
    
    return promise;
  }
}
