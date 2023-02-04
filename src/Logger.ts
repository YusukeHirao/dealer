import type { Animations, FPS } from './types.js';

import readline from 'readline';

import c from 'ansi-colors';

import { countDownFunctionParser } from './countDownFunctionParser.js';
import { riffle } from './riffle.js';
import { writeVerbosely } from './writeVerbosely.js';

const animationPresets = {
  earth: ['🌏', '🌍', '🌎'],
  dots: ['.  ', '.. ', '...'],
  block: ['▘', '▀', '▜', '▉', '▟', '▃', '▖', ' '],
  propeller: ['\\', '|', '/', '-'],
};

interface Options {
  animations?: Animations;
  fps?: FPS;
}

export class Logger {
  #lastWroteLineNum = 0;
  #stack: string[] | null = null;
  #timer: NodeJS.Timer | null = null;
  #time = 0;
  #animations: Animations;
  #verbose = false;
  #frameInterval: number;
  #coundDownMap = new Map<string, number>();

  constructor(options?: Options) {
    this.#animations = {
      ...animationPresets,
      ...options?.animations,
    };

    const fps = options?.fps ?? 30;
    this.#frameInterval = 1000 / fps;

    process.stdout.on('resize', () => this._resize());
  }

  clear() {
    if (this.#verbose) {
      return;
    }

    const cursorY = this.#lastWroteLineNum * -1;

    readline.moveCursor(process.stdout, 0, cursorY);
    readline.cursorTo(process.stdout, 0);
  }

  close() {
    if (this.#verbose) {
      return;
    }

    // Writing last stack
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    this._write();
    this.#time = 0;
    this.#lastWroteLineNum = 0;
    this.#stack = null;
  }

  verboseMode() {
    this.#verbose = true;
  }

  write(...logs: string[]) {
    if (this.#verbose) {
      writeVerbosely(...logs);
      return;
    }

    this.#stack = logs;
    if (this.#timer) {
      return;
    }
    this._run();
  }

  private _countDown(text: string) {
    const parsed = countDownFunctionParser(text);

    if (!parsed) {
      return text;
    }

    const { id, time, placeholder, unit } = parsed;

    const currentTime = this.#coundDownMap.get(id);

    let displayTimeMS: number;

    if (currentTime == null) {
      this.#coundDownMap.set(id, Date.now());
      displayTimeMS = time;
    } else {
      const elapsedTime = Date.now() - currentTime;
      displayTimeMS = Math.max(time - elapsedTime, 0);
    }

    const displayTime =
      unit === 's' ? Math.round(displayTimeMS / 1000) : displayTimeMS;

    return text.replace(placeholder, `${displayTime}`);
  }

  private _resize() {
    if (this.#verbose) {
      return;
    }

    this._write();
  }

  private _run() {
    this.#time += 1;
    this.#timer = setTimeout(() => this._run(), this.#frameInterval);
    this._write();
  }

  private _write() {
    if (!this.#stack) {
      return;
    }

    this.clear();

    const reset = c.reset('');

    for (const line of this.#stack) {
      readline.clearLine(process.stdout, 0);
      let text = riffle(line, this.#time, this.#animations ?? {});
      text = this._countDown(text);
      const displayText = text.slice(0, process.stdout.columns);
      process.stdout.write(`${reset}${displayText}${reset}\n`);
    }

    this.#lastWroteLineNum = this.#stack.length;
  }
}
