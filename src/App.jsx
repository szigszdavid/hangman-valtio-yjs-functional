import HangmanGame from "./HangmanGame";
import MultiplayerComponentFunctional from "./components/MultiplayerComponentFunctional";
import { game } from "./state/game";

const App = () => {
  return (
    <MultiplayerComponentFunctional gameProxy={game}>
      <HangmanGame />
    </MultiplayerComponentFunctional>
  );
};

export default App;
