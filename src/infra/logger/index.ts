import pino from 'pino'
import { isDev } from '../../support/utils'

const logger = pino(
  {
    name: 'partithura-graphql',
    messageKey: 'message',
    level: process.env.LOG_LEVEL || 'info',
    transport: isDev ? { 
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      }
    } : undefined,
    formatters: {
      level(label) {
        return { level: label }
      },
      log(object) {
        return { ...object }
      }
    },
    base: {
      instance: process.env.NODE_APP_INSTANCE,
      processName: process.env.name,
      appVersion:
        process.env.APP_VERSION || require('../../../package.json').version
    }
  },
  pino.destination()
)

export { logger }
