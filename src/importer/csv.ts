import fs from "fs";
import * as csv from "fast-csv";

type CSVOptions = {
  headers: string[];
  skipLines?: number;
};

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
