
export class TaskQueue {
  private queue: (() => Promise<any>)[] = [];
  private isProcessing = false;

  constructor(private delay: number) {}

  add(task: () => Promise<any>): void {
    this.queue.push(task);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }

    this.isProcessing = false;
  }
}
