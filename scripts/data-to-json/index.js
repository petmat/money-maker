const fs = require("fs").promises;
const path = require("path");
const windows1252 = require("windows-1252");
const R = require("ramda");
const { parse, format } = require("date-fns/fp");

const readFileData = async (file) => {
  const dataBuffer = await fs.readFile(file);
  return windows1252.decode(dataBuffer.toString("binary"));
};

const isQuote = (char) => char === '"';

const stripQuotes = (str) =>
  str.slice(
    isQuote(str[0]) ? 1 : 0,
    isQuote(R.last(str)) ? str.length - 1 : str.length
  );

const convertToDate = (date) => parse(new Date(), "dd.MM.yyyy", date);

const convertToAmount = (amount) =>
  parseFloat(amount.replace(",", ".").replace(" ", ""));

const convertToData = ([date, payee, amount, balance]) => ({
  date: convertToDate(date),
  payee,
  amount: convertToAmount(amount),
  balance: convertToAmount(balance),
});

const convertToRow = (row) =>
  R.compose(convertToData, R.map(stripQuotes), R.split(/;(?=")/))(row);

const convertToRows = (rows) => rows.map(convertToRow);

const convertTo = (data) =>
  R.compose(convertToRows, R.drop(1), R.split("\r\n"))(data);

const run = async () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Provide path to CSV file as argument");
    process.exit(-1);
  }

  const data = await readFileData(filePath);
  const outputData = convertTo(data);
  const date = format("yyyyMMdd", outputData[0].date);
  const writePath = path.join(__dirname, "../../server/data/", `${date}.json`);

  await fs.writeFile(writePath, JSON.stringify(outputData, null, 2), "utf8");
};

run().catch(console.error);
