export function animate(chars: string[], time: number) {
  return chars[time % chars.length];
}
