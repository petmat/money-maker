import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import { initialBalance as configInitialBalance } from "../../../../config/config";

const filterTransactionFiles = (fileNames) =>
  fileNames.filter((f) => f.match(/^\d{8}\.json$/));

const getYear = (fileName) => fileName.slice(0, 4);
const getMonth = (fileName) => fileName.slice(4, 6);

const pad = (str, char, min) =>
  str.length < min ? `${char.repeat(min - str.length)}${str}` : str;

const findFile = (fileNames, year, month) => {
  const foundFile = fileNames.find((f) => {
    return (
      getYear(f) === year.toString() &&
      getMonth(f) === pad(month.toString(), "0", 2)
    );
  });
  return foundFile;
};

const firstArg = (arg: string | string[]): string =>
  typeof arg === "string" ? arg : arg[0];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const root = process.env.ROOT;
  const { year: yearArg, month: monthArg } = req.query;
  const files = await fs.readdir(path.join(root, "data"));

  const transactionFiles = filterTransactionFiles(files);

  const year = parseInt(firstArg(yearArg));
  const month = parseInt(firstArg(monthArg));

  const [previousMonth, previousMonthYear] =
    month === 1 ? [12, year - 1] : [month - 1, year];

  const previousFile = findFile(
    transactionFiles,
    previousMonthYear,
    previousMonth
  );

  if (!previousFile) {
    const currentFile = findFile(transactionFiles, year, month);

    if (currentFile) {
      res.statusCode = 200;
      res.json({ initialBalance: configInitialBalance });
      return;
    } else {
      res.statusCode = 200;
      res.json({ initialBalance: null });
      return;
    }
  }

  const data = JSON.parse(
    await fs.readFile(path.join(root, "data", previousFile), "utf-8")
  );

  res.statusCode = 200;
  res.json({ initialBalance: data ? data[0].balance : null });
};
