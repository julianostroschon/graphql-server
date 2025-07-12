import { config } from 'dotenv'
import { z } from 'zod'
config()

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  // DATABASE_URL: z.string().url().nullable(),
  // JWT_SECRET: z.string().min(1),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('production'),
    ])
    .default('development'),
})
const env = envSchema.parse(process.env)

export default env