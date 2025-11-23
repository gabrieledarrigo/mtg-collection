import { jest, describe, it, expect } from "@jest/globals";
import fs from "fs";
import * as csv from "fast-csv";
import { parseCSV, writeCsv } from "./csv";

jest.mock("fs");
jest.mock("fast-csv");

describe("parseCSV", () => {
  it("should parse CSV file and return array of objects", async () => {
    const data = [
      { name: "Card1", count: "1" },
      { name: "Card2", count: "2" },
    ];

    const stream = {
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
    };

    (fs.createReadStream as jest.Mock).mockReturnValue(stream);
    (csv.parse as jest.Mock).mockReturnValue(stream);

    const result = await parseCSV("/path/to/file.csv", {
      headers: ["name", "count"],
    });

    expect(result).toEqual(data);
    expect(fs.createReadStream).toHaveBeenCalledWith("/path/to/file.csv");
    expect(csv.parse).toHaveBeenCalledWith({ headers: ["name", "count"] });
  });

  it("should reject on error", async () => {
    const error = new Error("Read error");
    const stream = {
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
    };

    (fs.createReadStream as jest.Mock).mockReturnValue(stream);
    (csv.parse as jest.Mock).mockReturnValue(stream);

    await expect(
      parseCSV("/path/to/file.csv", { headers: ["name"] }),
    ).rejects.toThrow("Read error");
  });
});

describe("writeCsv", () => {
  it("should write CSV file successfully", async () => {
    const data = [
      { name: "Card1", count: 1 },
      { name: "Card2", count: 2 },
    ];

    const stream = {
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
    };

    (csv.writeToPath as jest.Mock).mockReturnValue(stream);

    await writeCsv("/path/to/output.csv", data);

    expect(csv.writeToPath).toHaveBeenCalledWith("/path/to/output.csv", data, {
      headers: true,
    });
  });

  it("should reject on error", async () => {
    const error = new Error("Write error");
    const stream = {
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
    };

    (csv.writeToPath as jest.Mock).mockReturnValue(stream);

    await expect(writeCsv("/path/to/output.csv", [])).rejects.toThrow(
      "Write error",
    );
  });
});
