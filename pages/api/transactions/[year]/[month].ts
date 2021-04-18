import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

const filterTransactionFiles = (fileNames) =>
  fileNames.filter((f) => f.match(/^\d{8}\.json$/));

const getYear = (fileName) => fileName.slice(0, 4);
const getMonth = (fileName) => fileName.slice(4, 6);

const pad = (str, char, min) =>
  str.length < min ? `${char.repeat(min - str.length)}${str}` : str;

const findFile = (fileNames, year, month) => {
  const foundFile = fileNames.find((f) => {
    return getYear(f) === year && getMonth(f) === pad(month.toString(), "0", 2);
  });
  return foundFile;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { year, month } = req.query;
  const root = process.env.ROOT;
  const files = await fs.readdir(path.join(root, "data"));

  const transactionFiles = filterTransactionFiles(files);
  const currentFile = findFile(transactionFiles, year, month);

  const data = currentFile
    ? JSON.parse(
        await fs.readFile(path.join(root, "data", currentFile), "utf-8")
      )
    : [];
  res.statusCode = 200;
  res.json(data);
};
