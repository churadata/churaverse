type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelRank: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function getCurrentLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toLowerCase()
  if (raw === 'debug' || raw === 'info' || raw === 'warn' || raw === 'error') return raw
  return 'info'
}

function shouldLog(level: LogLevel): boolean {
  return levelRank[level] >= levelRank[getCurrentLevel()]
}

export const logger = {
  debug: (...args: unknown[]): void => {
    if (shouldLog('debug')) console.log('[DEBUG]', ...args)
  },
  info: (...args: unknown[]): void => {
    if (shouldLog('info')) console.log('[INFO]', ...args)
  },
  warn: (...args: unknown[]): void => {
    if (shouldLog('warn')) console.warn('[WARN]', ...args)
  },
  error: (...args: unknown[]): void => {
    if (shouldLog('error')) console.error('[ERROR]', ...args)
  },
}
