import Word from "./components/Word";
import Buttons from "./components/Buttons";
import Result from "./components/Result";
import Hangman from "./components/Hangman";
import MistakeCounter from "./components/MistakeCounter"
import { useSnapshot } from "valtio";
import { game, newGame, guess } from "./state/game";
import { isCurrentPlayer, nextPlayer } from "./state/rounds";

export default function HangmanGame() {
  
  const snapshot = useSnapshot(game)

  const handleNewGameClick = () => {
    newGame()
  };

  const handleLetterButtonOnClick = (e) => {
    if (isCurrentPlayer()) {
      guess(e);

      nextPlayer()
    }
  };

  return (
    <>
      <h1>Hangman</h1>
      <Result result={snapshot.result} />

      <Word word={snapshot.word} guesses={snapshot.guesses} />
      <br />
      <button onClick={handleNewGameClick}>New game</button>
      <br />
      <Buttons
        letterButtonOnClick={handleLetterButtonOnClick}
        guesses={snapshot.guesses}
        mistakes={snapshot.mistakes}
      />

      <MistakeCounter mistakes={snapshot.mistakes} maxMistakes={snapshot.maxMistakes} />

      <Hangman mistakes={snapshot.mistakes} />
    </>
  );
}
