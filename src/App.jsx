import HangmanGame from "./HangmanGame";
import MultiplayerComponentFunctional from "./components/MultiplayerComponentFunctional";
import { game } from "./state/game";
import { rounds } from "./state/rounds";

const App = () => {
  return (
    <MultiplayerComponentFunctional gameProxy={game} roundProxy={rounds}>
      <HangmanGame />
    </MultiplayerComponentFunctional>
  );
};

export default App;
