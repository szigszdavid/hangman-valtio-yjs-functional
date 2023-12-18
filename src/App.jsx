import HangmanGame from "./HangmanGame";
import MultiplayerComponentFunctional from "./components/MultiplayerComponentFunctional";

const App = () => {
  return (
    <MultiplayerComponentFunctional>
      <HangmanGame />
    </MultiplayerComponentFunctional>
  );
};

export default App;
