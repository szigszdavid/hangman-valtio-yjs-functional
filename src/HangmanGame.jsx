import Word from "./components/Word";
import Buttons from "./components/Buttons";
import Result from "./components/Result";
import Hangman from "./components/Hangman";
import MistakeCounter from "./components/MistakeCounter";
import { newGame, guess, state } from "./state/store";
import { useSnapshot } from "valtio";

export default function HangmanGame() {
  
  const snapshot = useSnapshot(state)

  const handleNewGameClick = () => {
    newGame();
  };

  const handleLetterButtonOnClick = (e) => {
    guess(e);
  };

  return (
    <>
      <h1>Hangman</h1>
      { JSON.stringify(snapshot.game) }
      <Result result={snapshot.game.result} />

      <Word word={snapshot.game.word} guesses={snapshot.game.guesses} />
      <br />
      <button onClick={handleNewGameClick}>New game</button>
      <br />
      <Buttons
        letterButtonOnClick={handleLetterButtonOnClick}
        guesses={snapshot.game.guesses}
        mistakes={snapshot.game.mistakes}
      />

      <MistakeCounter mistakes={snapshot.game.mistakes} maxMistakes={snapshot.game.maxMistakes} />

      <Hangman mistakes={snapshot.game.mistakes} />
    </>
  );
}
