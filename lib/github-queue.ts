// lib/github-queue.ts
export class GitHubQueue {
    private queue: Array<() => Promise<void>> = [];
    private activeRequests = 0;
    private MAX_CONCURRENT = 2;
  
    async add<T>(task: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
          try {
            this.activeRequests++;
            const result = await task();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            this.activeRequests--;
            this.next();
          }
        });
        this.next();
      });
    }
  
    private next() {
      while (this.queue.length > 0 && this.activeRequests < this.MAX_CONCURRENT) {
        const task = this.queue.shift();
        task?.();
      }
    }
  }
  
  // Create and export the queue instance
  export const githubQueue = new GitHubQueue();