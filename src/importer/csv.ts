import fs from "fs";
import * as csv from "fast-csv";

type CSVOptions = {
  headers: string[];
  skipLines?: number;
};

/**
 * Reads a CSV file from disk and collects every row into an array.
 *
 * @param path - The path of the CSV file to read.
 * @param options - The parsing options: the column headers and, optionally, how many leading lines to skip.
 * @returns A Promise resolving to the parsed rows.
 * @throws {Error} When the file cannot be read or a row cannot be parsed.
 */
export async function parseCSV<T>(
  path: string,
  options: CSVOptions,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];

    fs.createReadStream(path)
      .pipe(csv.parse(options))
      .on("data", (data: T) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

/**
 * Writes rows to a CSV file, prefixed with a header line derived from the data.
 *
 * @param path - The path of the CSV file to write.
 * @param data - The rows to serialize.
 * @returns A Promise that resolves once the file has been fully written.
 * @throws {Error} When the file cannot be written.
 */
export async function writeCsv<T extends csv.FormatterRow>(
  path: string,
  data: T[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    csv
      .writeToPath(path, data, { headers: true })
      .on("finish", resolve)
      .on("error", reject);
  });
}
