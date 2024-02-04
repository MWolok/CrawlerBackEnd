import * as fs from "fs";

function processCSVFile(filePath: string): void {
    try {
        const fileData: string = fs.readFileSync(filePath, "utf8");

        
        console.log("File Data:", fileData);

        const rows: string[] = fileData.split("\n");

        if (rows.length < 2) {
            console.log("The CSV file does not contain any data.");
            return;
        }

        const headers: string[] = rows[0].replace(/"/g, "").split(";").map((header) => header.trim());
        const productCodeIndex: number = headers.indexOf("sku");

        if (productCodeIndex === -1) {
            console.log("The 'sku' column is missing in the CSV file");
            return;
        }

        for (let i = 1; i < rows.length; i++) {
            const rowData: string[] = rows[i].replace(/"/g, "").split(";").map((value) => value.trim());

           
            if (rowData.length >= productCodeIndex + 1) {
                const originalProductCode = rowData[productCodeIndex];
                const sanitizedProductCode = removeSlashOnce(originalProductCode);
                rowData[productCodeIndex] = sanitizedProductCode;
                rows[i] = rowData.join(";");
            } else {
                console.log(`Skipping row ${i + 1} as it does not have the expected number of columns.`);
            }
        }

        const modifiedData: string = rows.join("\n");
        fs.writeFileSync(filePath, modifiedData, "utf8");

        console.log("Processing completed successfully.");
    } catch (error: any) {
        // Specify the type of 'error' variable explicitly
        console.error(`Error: ${error.message}`);
    }
}

function removeSlashOnce(productCode: string): string {
    return productCode.replace("/", "");
}

// Ścieżka do pliku CSV
const csvPath: string = "../src/data/kamperologia_produkty_sku.csv";
processCSVFile(csvPath);
