import { useState } from "react";
import CreateRoomView from "./CreateRoomView";
import React from "react";
import { configuration, initStore, addClient } from "../state/configuration";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { bind } from "valtio-yjs";
import { useSnapshot } from "valtio";
import { addPlayer, deletePlayer } from "../state/rounds";
import QuitButton from "./QuitButton";

const waitForSync = (websocketProvider) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => reject("timeout"), 5000);
    websocketProvider.on("sync", (isSynced) => {
      if (isSynced) {
        clearTimeout(timerId);
        resolve();
      }
    });
  });
const createSyncedStore = async (room, configuration, game, rounds) => {
  try {
    const ydoc = new Doc();
    const websocketProvider = new WebsocketProvider(
      "ws://localhost:1234",
      room,
      ydoc
    );
    await waitForSync(websocketProvider);
    const yConfiguration = ydoc.getMap("configuration");
    const yGame = ydoc.getMap("game");
    bind(configuration, yConfiguration);
    bind(game, yGame);
    if (rounds !== undefined) {
      const yRounds = ydoc.getMap("rounds");
      bind(rounds, yRounds);
    }
    return { clientId: ydoc.clientID };
  } catch (e) {
    console.error(e);
  }
};

export default function ValtioMultiplayerComponent(props) {
  const [roomId, setRoomId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const snapshot = useSnapshot(configuration);
  const synced = Object.keys(snapshot).length !== 0 ? snapshot.synced : false;

  const handleCreate = async (id) => {
    let result = await createSyncedStore(
      id,
      configuration,
      props.gameProxy,
      props.roundProxy
    );
    setRoomId(id);
    const clientId = result.clientId;

    if (configuration.clients === undefined) {
      setClientId(clientId);
      initStore();
      addClient(clientId);
      if (props.roundProxy !== undefined) {
        addPlayer(clientId);
      }
    } else {
      alert(
        "This room is already created! Change the name to an unused roomname or try to join to the prevoius."
      );
    }
  };

  const handleJoin = async (id) => {
    let result = await createSyncedStore(
      id,
      configuration,
      props.gameProxy,
      props.roundProxy
    );
    setRoomId(id);
    const clientId = result.clientId;

    if (configuration.clients !== undefined) {
      setClientId(clientId);
      addClient(clientId);
      if (props.roundProxy !== undefined) {
        addPlayer(clientId);
      }
    } else if (configuration.clients === undefined) {
      alert(
        "This room is not created yet! If you click on CREATE NEW ROOM you will create it."
      );
    }
  };

  const handleQuitGame = () => {
    if (
      props.roundProxy !== undefined &&
      JSON.parse(sessionStorage.getItem("playerId")) !== undefined
    ) {
      deletePlayer(JSON.parse(sessionStorage.getItem("playerId")));
      setRoomId(null)
    }
  };

  return (
    <>
      {roomId === null ? (
        <CreateRoomView
          createRoom={(id) => handleCreate(id)}
          joinRoom={(id) => handleJoin(id)}
        />
      ) : (
        <>
          <h1>ClientId: {clientId}</h1>
          <QuitButton quitGame={handleQuitGame} />
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, child.props)
          )}
        </>
      )}
    </>
  );
}
