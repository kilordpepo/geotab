
import dotenv from 'dotenv'

dotenv.config();

export const intervalTime = process.env.INTERVAL_TIME
export const reportsFolder = process.env.REPORTS_FOLDER_NAME
export const geotabDatabase = process.env.GEOTAB_DATABASE
export const geotabUserName = process.env.GEOTAB_USERNAME
export const geotabPassword = process.env.GEOTAB_PASSWORD
export const geotabPath = process.env.GEOTAB_PATH