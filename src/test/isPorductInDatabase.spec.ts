import { isProductInDatabase, ValidationResult, stopServer } from "../index";

afterAll(() => {
	stopServer();
});

describe("isProductInDatabase function", () => {
	test("should return true when product code is found in the CSV file", async () => {
		const csvPath: string =
			"C:/Users/wolek/OneDrive/Pulpit/Crawler/src/data/kamperologia_produkty_sku.csv";
		const kodProduktu: string = "BU7241270N";
		const result: ValidationResult = isProductInDatabase(csvPath, kodProduktu);

		expect(result.result).toBe(true);
		expect(result.message).toBe("The product code is located in the CSV file");
	});
    test("should return false when product code is not in the CSV file", async () => {
		const csvPath: string =
			"C:/Users/wolek/OneDrive/Pulpit/Crawler/src/data/kamperologia_produkty_sku.csv";
		const kodProduktu: string = "AAAAAA";
		const result: ValidationResult = isProductInDatabase(csvPath, kodProduktu);

		expect(result.result).toBe(false);
		expect(result.message).toBe("The product code was not found in the CSV file.");
	});
	
});
