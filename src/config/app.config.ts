import dotenv from "dotenv"
dotenv.config()

interface Config {
  JWT_SECRET?: string
  DATABASE_HOST?: string
  DATABASE_PORT?: string
  DATABASE_USERNAME?: string
  DATABASE_PASSWORD?: string
  DATABASE_NAME?: string
  DATABASE_URL?: string
  NODE_ENV: string
  ADMIN_PORTAL_FRONTEND_URL?: string
  APP_PORT: string | number
  SESSION_DURATION: string | undefined
}

const config: Config = {
  DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME || "BITSELAH_DB",
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  ADMIN_PORTAL_FRONTEND_URL: process.env.ADMIN_PORTAL_FRONTEND_URL,
  APP_PORT: process.env.APP_PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_DURATION: process.env.SESSION_DURATION,
}

export default config
