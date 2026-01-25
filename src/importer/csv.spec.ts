/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest, describe, it, expect } from "@jest/globals";
import fs from "fs";
import * as csv from "fast-csv";
import { parseCSV, writeCsv } from "./csv";
import { createMock } from "@test/helpers";

jest.mock("fs");
jest.mock("fast-csv");

describe("parseCSV", () => {
  it("should parse CSV file and return array of objects", async () => {
    const data = [
      { name: "Card1", count: "1" },
      { name: "Card2", count: "2" },
    ];

    const readStream = createMock<fs.ReadStream>({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (
        this: any,
        event: string,
        handler: (data?: any) => void,
      ) {
        if (event === "data") {
          data.forEach((data) => handler(data));
        } else if (event === "end") {
          handler();
        }

        return this;
      } as any),
    });

    const csvStream = createMock<
      csv.CsvParserStream<(typeof data)[0], (typeof data)[0]>
    >({});

    jest.spyOn(fs, "createReadStream").mockReturnValue(readStream);
    jest.spyOn(csv, "parse").mockReturnValue(csvStream);

    const actual = await parseCSV("/path/to/file.csv", {
      headers: ["name", "count"],
    });

    expect(actual).toEqual(data);
    expect(fs.createReadStream).toHaveBeenCalledWith("/path/to/file.csv");
    expect(csv.parse).toHaveBeenCalledWith({ headers: ["name", "count"] });
  });

  it("should reject on error", async () => {
    const error = new Error("Read error");

    const readStream = createMock<fs.ReadStream>({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (
        this: any,
        event: string,
        handler: (error?: any) => void,
      ) {
        if (event === "error") {
          handler(error);
        }
        return this;
      } as any),
    });

    jest.spyOn(fs, "createReadStream").mockReturnValue(readStream);

    await expect(
      parseCSV("/path/to/file.csv", { headers: ["name"] }),
    ).rejects.toThrow(error);
  });
});

describe("writeCsv", () => {
  it("should write CSV file successfully", async () => {
    const data = [
      { name: "Card1", count: 1 },
      { name: "Card2", count: 2 },
    ];

    const stream = createMock<fs.WriteStream>({
      on: jest.fn().mockImplementation(function (
        this: any,
        event: string,
        handler: () => void,
      ) {
        if (event === "finish") {
          handler();
        }
        return this;
      } as any),
    });

    jest.spyOn(csv, "writeToPath").mockReturnValue(stream);

    await writeCsv("/path/to/output.csv", data);

    expect(csv.writeToPath).toHaveBeenCalledWith("/path/to/output.csv", data, {
      headers: true,
    });
  });

  it("should reject on error", async () => {
    const error = new Error("Write error");

    const stream = createMock<fs.WriteStream>({
      on: jest.fn().mockImplementation(function (
        this: any,
        event: string,
        handler: (error?: any) => void,
      ) {
        if (event === "error") {
          handler(error);
        }
        return this;
      } as any),
    });

    jest.spyOn(csv, "writeToPath").mockReturnValue(stream);

    await expect(writeCsv("/path/to/output.csv", [])).rejects.toThrow(
      "Write error",
    );
  });
});
