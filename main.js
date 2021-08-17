
import fs from 'fs'
import path from 'path'
import storage from "node-persist";
import { intervalTime, reportsFolder } from "./src/constants/env.variables.js";
import { fetchVehicles } from "./src/helpers/geotab.js";
import { saveToFile } from "./src/helpers/csv.js";

await storage.init({ dir: './storage', });

const reportsPath = path.join("./", reportsFolder)
let initialVersion = await storage.getItem('version')

if (!fs.existsSync(reportsPath)) {
    fs.mkdirSync(reportsPath)
}

if (!initialVersion) {
    storage.setItem('version', "0000000000000000")
    initialVersion = "0000000000000000"
}

/**
 * Main function that will download data from GeoTab DB and save it to a CSV file
 */
const main = async () => {
    let version = await storage.getItem('version')
    console.log("[main] Incremental Fetch started with version", version, new Date().toISOString())

    const { results, toVersion } = await fetchVehicles(version)

    if (results.length > 0) {
        try {
            saveToFile(`./${reportsPath}/vehicles.csv`, results)
            await storage.setItem('version', toVersion)
        }
        catch (error) {
            console.error("[saveToFile] Failed to save data to CSV file", error)
        }
    }
    console.log("[main] Incremental Fetch ended", new Date().toISOString())
}

console.log(`Backup Application started with data set version: ${initialVersion}, interval set to:`, `${intervalTime}ms`)
setInterval(main, intervalTime);