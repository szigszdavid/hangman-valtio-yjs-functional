import { proxy } from "valtio";

const answers = ["alma", "szilva", "körte"];

export const state = proxy(undefined)

export const game = proxy({
  word: "labda",
  guesses: [],
  mistakes: 0,
  result: "",
  maxMistakes: 9,
})

export function guess(letter) {
  state.game.guesses.push(letter);

  if (!state.game.word.includes(letter)) {
    state.game.mistakes++;

    if (state.game.mistakes === state.game.maxMistakes) {
      state.game.result = "You lost!";
    }
  } else {
    if (
      state.game.word
        .split("")
        .every((wordElement) => state.game.guesses.includes(wordElement))
    ) {
      state.game.result = "You won!";
    }
  }
}

export function newGame() {
  Object.assign(state.game, {
    word: answers[Math.floor(Math.random() * answers.length)],
    guesses: [],
    mistakes: 0,
    result: "",
    maxMistakes: 9,
  });
}

export function initStore() {
  Object.assign(state, {
    game: {
      word: answers[Math.floor(Math.random() * answers.length)],
      guesses: [],
      mistakes: 0,
      result: "",
      maxMistakes: 9,
    },
    configuration: {
      synced: false,
      clients: [],
    },
  });
}

export function addClient(clientId) {
  state.configuration.clients.push({ id: clientId, nickname: "" });
}
