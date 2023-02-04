import type { Animations } from './types.js';

import { animate } from './animate.js';

export function riffle(text: string, time: number, animations: Animations) {
  for (const key of Object.keys(animations)) {
    const replace = animations[key];
    const regex = new RegExp(`%${key}%`, 'g');
    text = text.replace(regex, animate(replace, time));
  }
  return text;
}
