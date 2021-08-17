
import GeotabApi from "mg-api-js";
import { geotabDatabase, geotabPath, geotabUserName, geotabPassword } from "../constants/env.variables.js";

/**
 * Fetches vehicles from GeoTab using GeoTab SDK
 * 
 *  @param {string} version last version from the set of data returned
 *  @returns {promise} a promise which when resolved will return an object containing the obtained version and vehicles result
 */
export const fetchVehicles = async (version) => {

    try {
        const authentication = {
            credentials: {
                database: geotabDatabase,
                userName: geotabUserName,
                password: geotabPassword
            },
            path: geotabPath
        }
        const api = new GeotabApi(authentication);
        const results = [];
        const { data: devices, toVersion } = await api.call("GetFeed", {
            typeName: "Device",
            fromVersion: version,
        })
        console.log("[fetchVehicles] Fetched devices", devices.length, new Date().toISOString())

        const now = new Date().toISOString()
        const statusCalls = []
        const infoCalls = []
        const diagnostic = {
            id: "DiagnosticOdometerAdjustmentId"
        };

        for (let index = 0; index < devices.length; index++) {
            const device = devices[index]
            results.push({
                id: device.id,
                VIN: device.vehicleIdentificationNumber
            });
            statusCalls.push({
                method: "Get",
                params: {
                    typeName: "StatusData",
                    search: {
                        fromDate: now,
                        toDate: now,
                        diagnosticSearch: diagnostic,
                        deviceSearch: device
                    }
                }
            });
            infoCalls.push({
                method: "Get",
                params: {
                    typeName: "DeviceStatusInfo",
                    search: {
                        deviceSearch: device,
                    }
                }
            });
        }

        // Fetching odometer information
        let callResults = await api.call("ExecuteMultiCall", { calls: statusCalls })
        console.log("[fetchVehicles] Fetched odometers", callResults.length, new Date().toISOString())
        let statusData = {}
        for (let i = 0; i < callResults.length; i++) {
            statusData = callResults[i][0];
            if (statusData) {
                results[i].odometer = statusData.data;
            }
        }


        // Fetching coordinates information
        callResults = await api.call("ExecuteMultiCall", { calls: infoCalls })
        console.log("[fetchVehicles] Fetched coordinates", callResults.length, new Date().toISOString())
        let coordinatesData = {}
        for (let i = 0; i < callResults.length; i++) {
            coordinatesData = callResults[i][0];
            if (coordinatesData) {
                results[i].coordinates = `"${coordinatesData.latitude}, ${coordinatesData.longitude}"`
            }
        }

        return { results, toVersion }
    }
    catch (error) {
        console.error("[fetchVehicles] Failed to fetch vehicles", error)
        return { results: [], version }
    }

}