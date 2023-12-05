import * as fs from "fs";

enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

const rules = {
  [Color.Red]: 12,
  [Color.Green]: 13,
  [Color.Blue]: 14,
};

const isColorImpossible = (color: Color, amount: number): boolean =>
  amount > rules[color];

const gamePartsFromString = (gameString: string) => {
  const [fullGameIdentifier, gameRounds] = gameString.split(":");
  const id = fullGameIdentifier.replace("Game ", "");
  const rounds = gameRounds.split(";").map((round) => round.trim());
  return { rounds, gameId: parseInt(id) };
};

const isGamePossible = (gameString: string): [number, boolean] => {
  const { rounds, gameId } = gamePartsFromString(gameString);
  const allRoundsArePossible = rounds.every((roundString) => {
    const roundValues = roundString.split(", ");
    return roundValues.every((roundValue) => {
      const [amountString, color] = roundValue.split(" ");
      const amount = parseInt(amountString);
      return !isColorImpossible(color as Color, amount);
    });
  });

  // console.log(gameIdentifier, "Possible?", allRoundsArePossible);

  return [gameId, allRoundsArePossible];
};

const powerOfFewestCubes = (gameString: string): number => {
  const { rounds } = gamePartsFromString(gameString);
  const maxAmountsInGame = rounds.reduce(
    (aggregate, currentRoundString) => {
      const colorValueString = currentRoundString.split(", ");
      colorValueString.forEach((colorValue) => {
        const [amountString, color] = colorValue.split(" ");
        const amount = parseInt(amountString);
        aggregate[color] = Math.max(aggregate[color], amount);
      });
      return aggregate;
    },
    {
      [Color.Blue]: 0,
      [Color.Green]: 0,
      [Color.Red]: 0,
    }
  );
  // console.log(maxAmountsInGame);
  return Object.keys(maxAmountsInGame).reduce((power, color) => {
    power *= maxAmountsInGame[color];
    return power;
  }, 1);
};

const partOne = (games: string[]) => {
  const sumOfPossibleGameIds = games.reduce((legalGames, game) => {
    const [gameIdentifier, possible] = isGamePossible(game);
    if (possible) {
      legalGames += gameIdentifier;
    }
    return legalGames;
  }, 0);
  console.log(sumOfPossibleGameIds);
};

const partTwo = (games: string[]) => {
  const allRoundPowersSum = games
    .map(powerOfFewestCubes)
    .reduce((sum, current) => {
      sum += current;
      return sum;
    }, 0);
  console.log("All powers sum", allRoundPowersSum);
};

const inputStream = fs.readFileSync("day2-input.txt");
const inputString = inputStream.toString();
const games = inputString.split("\r\n");

partTwo(games);
