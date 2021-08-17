
import fs from 'fs'

const columnDelimiter = ",";
const lineDelimiter = "\n";
const header = ["id", "VIN", "odometer", "coordinates"]

/**
 *  Parses the information to string format valid for CSV containing headers
 * @param {Array} info  Array of data to convert to CSV string format
 * @returns {string} CSV string generated from the info containg the CSV headers
 */
export const generateCSVFile = (info) => {
    let result, ctr, data;

    data = info;
    if (data == null || !data.length) {
        return null;
    }

    result = "";
    result += header.join(columnDelimiter);
    result += lineDelimiter;

    result += appendLines(data)

    if (result == null) {
        return;
    }

    return result;
}

/**
 *  Parses the information to string format valid for CSV without headers
 * @param {Array} data Array of data to convert to CSV string format
 * @returns {string} CSV string generated from the info without CSV headers
 */
export const appendLines = (data) => {
    let result = ""
    let ctr
    data.forEach(function (item) {
        ctr = 0;
        header.forEach(function (key) {
            if (ctr > 0) {
                result += columnDelimiter;
            }

            result += item[key] ? item[key] : "";
            ctr++;
        });
        result += lineDelimiter;
    });
    return result
}

/**
 *  Saves data to the specified file
 * @param {string} path Path of the file where to save the data. If the file doesn't exist it will be created, if it does exist then data will be appended 
 * @param {Array} data  Data to be saved on the file
 */
export const saveToFile = (path, data) => {
    fs.stat(path, (err, stat) => {
        if (err == null) {
            const csv = appendLines(data)
            fs.appendFile(path, csv, function (err) {
                if (err) {
                    console.error(err)
                    return
                }
            });
            console.log("[saveToFile] CSV append successful", new Date().toISOString())
        }
        else {
            const csvData = generateCSVFile(data)
            fs.writeFile(path, csvData, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            console.log("[saveToFile] CSV creation successful", new Date().toISOString())
        }
    })
}