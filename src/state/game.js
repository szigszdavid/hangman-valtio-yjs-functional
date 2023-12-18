import { proxy } from "valtio";

const answers = ["alma", "szilva", "körte"];

export const game = proxy({
  word: answers[Math.floor(Math.random() * answers.length)],
  guesses: [],
  mistakes: 0,
  result: "",
  maxMistakes: 9,
});

export function guess(letter) {
  game.guesses.push(letter);

  if (!game.word.includes(letter)) {
    game.mistakes++;

    if (game.mistakes === game.maxMistakes) {
      game.result = "You lost!";
    }
  } else {
    if (
      game.word
        .split("")
        .every((wordElement) => game.guesses.includes(wordElement))
    ) {
      game.result = "You won!";
    }
  }
}

export function newGame() {
  Object.assign(game, {
    word: answers[Math.floor(Math.random() * answers.length)],
    guesses: [],
    mistakes: 0,
    result: "",
    maxMistakes: 9,
  });
}
