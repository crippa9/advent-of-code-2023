import * as fs from "fs";

type PartNumber = {
  row: number;
  startIndex: number;
  endIndex: number;
  value: string;
};

const findPartNumbers = (rows: string[]): PartNumber[] => {
  const numbers: PartNumber[] = [];
  rows.forEach((row, y) => {
    let foundNumber: PartNumber | undefined = undefined;
    for (let x = 0; x < row.length; x++) {
      const cellCharacter = row[x];
      const characterIsNumber = !isNaN(+cellCharacter);
      if (characterIsNumber) {
        if (foundNumber) {
          foundNumber.value += cellCharacter;
          foundNumber.endIndex = x;
          continue;
        }
        foundNumber = {
          row: y,
          value: cellCharacter,
          startIndex: x,
          endIndex: x,
        };
        continue;
      }
      if (foundNumber) {
        numbers.push(foundNumber);
        foundNumber = undefined;
      }
    }
    if (foundNumber) {
      numbers.push(foundNumber);
    }
  });
  return numbers;
};

const inputStream = fs.readFileSync("day3-input.txt");
const inputString = inputStream.toString();
const rows = inputString.split("\r\n");

const numbers = findPartNumbers(rows);

const isSymbol = (character: string): boolean => /[^\.0-9]/.test(character);

const adjacentSymbolInRow = (
  rows: string[],
  rowIndex: number,
  partNumber: PartNumber
): boolean => {
  const row = rows[rowIndex];
  for (
    let x = Math.max(0, partNumber.startIndex - 1);
    x < Math.min(row.length, partNumber.endIndex + 2);
    x++
  ) {
    const cellCharacter = row[x];
    if (isSymbol(cellCharacter)) {
      return true;
    }
  }
  return false;
};

const numbersWithAdjacentSymbol = numbers.filter((partNumber) => {
  // search above
  if (partNumber.row > 0) {
    if (adjacentSymbolInRow(rows, partNumber.row - 1, partNumber)) {
      return true;
    }
  }

  // search below
  const hasRowBelow = partNumber.row < rows.length - 1;
  if (
    hasRowBelow &&
    adjacentSymbolInRow(rows, partNumber.row + 1, partNumber)
  ) {
    return true;
  }

  // search left
  const isNotStartOfRow = partNumber.startIndex > 0;
  if (isNotStartOfRow) {
    const characterOnLeftSide = rows[partNumber.row][partNumber.startIndex - 1];
    if (isSymbol(characterOnLeftSide)) {
      return true;
    }
  }

  // search right
  const isNotEndOfRow = partNumber.endIndex < rows[partNumber.row].length - 1;
  if (isNotEndOfRow) {
    const characterOnRightSide = rows[partNumber.row][partNumber.endIndex + 1];
    if (isSymbol(characterOnRightSide)) {
      return true;
    }
  }

  return false;
});

const sum = numbersWithAdjacentSymbol.reduce(
  (sum, current) => (sum += parseInt(current.value)),
  0
);
console.log(sum);
