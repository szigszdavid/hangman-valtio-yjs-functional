import HangmanGame from "./HangmanGame";
import ValtioMultiplayerComponent from "./components/ValtioMultiplayerComponent";
import { game } from "./state/game";
import { rounds } from "./state/rounds";

const App = () => {
  return (
    <ValtioMultiplayerComponent gameProxy={game} roundProxy={rounds}>
      <HangmanGame />
    </ValtioMultiplayerComponent>
  );
};

export default App;
