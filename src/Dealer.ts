import type { Animations, FPS } from './types.js';

import { Logger } from './Logger.js';

type Log = [id: number, message: string];
type SortFunc = (a: Log, b: Log) => number;

interface Options {
  animations?: Animations;
  fps?: FPS;
  indent?: string;
  sort?: SortFunc;
}

export class Dealer {
  #logger: Logger;
  #logs = new Map<number, string>();
  #indent = '';
  #sort: SortFunc = ([a], [b]) => a - b;
  #header?: string;

  constructor(options?: Options) {
    this.#logger = new Logger({
      animations: options?.animations,
      fps: options?.fps,
    });
    this.#indent = options?.indent ?? this.#indent;
    this.#sort = options?.sort ?? this.#sort;
  }

  close() {
    this.#logger.close();
  }

  header(text: string) {
    this.#header = text;
    this.write();
  }

  push(id: number, log: string) {
    this.#logs.set(id, log);
    this.write();
  }

  write() {
    const logs = Array.from(this.#logs.entries());
    logs.sort(this.#sort);
    const messages = logs.map(([, message]) => `${this.#indent}${message}`);
    if (this.#header) {
      messages.unshift(this.#header);
    }
    this.#logger.write(...messages);
  }
}
