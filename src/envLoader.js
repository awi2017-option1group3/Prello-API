import dotenv from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(path.dirname(__dirname), '/.env') })
}
