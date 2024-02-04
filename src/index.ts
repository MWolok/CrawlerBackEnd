import * as fs from "fs";
import express, { Request, Response } from "express";
const app = express();
const port = 3000;

const csvPath: string = " /home/ubuntu/CrawlerBackEnd/src/data/kamperologia_produkty_sku.csv";

app.get("/checkProduct/:productCode", (req: Request, res: Response) => {
	const { productCode } = req.params;

	if (!productCode) {
		return res.status(400).json({ result: false, message: "No product code provided." });
	}

	const decodedProductCode = decodeURIComponent(productCode);
	const result = isProductInDatabase(csvPath, decodedProductCode);
	res.json(result);
});

interface ValidationResult {
	result: boolean;
	message: string;
}

function isProductInDatabase(
	csvPath: string,
	productCode: string
): ValidationResult {
	try {
		const fileData: string = fs.readFileSync(csvPath, "utf8");
		const rows: string[] = fileData.split("\n");

		if (rows.length < 2) {
			return {
				result: false,
				message: "The CSV file does not contain any data.",
			};
		}

		const headers: string[] = rows[0]
			.replace(/"/g, "")
			.split(";")
			.map((header) => header.trim());
		const productCodeIndex: number = headers.indexOf("sku");

		if (productCodeIndex === -1) {
			return {
				result: false,
				message: "The 'sku' column is missing in the CSV file",
			};
		}

		for (let i = 1; i < rows.length; i++) {
			const rowData: string[] = rows[i]
				.replace(/"/g, "")
				.split(";")
				.map((value) => value.trim());
			if (rowData[productCodeIndex] === productCode) {
				return {
					result: true,
					message: "The product code is located in the CSV file",
				};
			}
		}

		return {
			result: false,
			message: "The product code was not found in the CSV file.",
		};
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
			return { result: false, message: `Error: ${error.message}` };
		} else {
			console.error(`Unknown error.`);
			return { result: false, message: "Unknown error" };
		}
	}
}

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
const stopServer = () => {
	server.close();
};

export { isProductInDatabase, ValidationResult, stopServer };
