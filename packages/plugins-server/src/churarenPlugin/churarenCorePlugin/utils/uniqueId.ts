export function uniqueId(): string {
  return Date.now().toString(16) + Math.floor(Math.random() * 1000000).toString(16)
}
