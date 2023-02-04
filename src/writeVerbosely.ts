export function writeVerbosely(...lines: string[]) {
  process.stdout.write(lines.map((line) => line.trim()).join('\n'));
}
