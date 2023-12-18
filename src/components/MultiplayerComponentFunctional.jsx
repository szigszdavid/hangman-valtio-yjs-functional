import { useState, useEffect } from "react";
import CreateRoomView from "./CreateRoomView";
import React from "react";
import { configuration, initStore, addClient } from "../state/configuration";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { bind } from "valtio-yjs";
import { useSnapshot } from "valtio";

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
const createSyncedStore = async (room, configuration, game) => {
  try {
    const ydoc = new Doc();
    const websocketProvider = new WebsocketProvider(
      "ws://localhost:1234",
      room,
      ydoc
    );
    await waitForSync(websocketProvider);
    const yConfiguration = ydoc.getMap("configuration");
    const yGame = ydoc.getMap("game")
    bind(configuration, yConfiguration);
    bind(game, yGame)
    return { clientId: ydoc.clientID };
  } catch (e) {
    console.error(e);
  }
};

export default function MultiplayerComponentFunctional(props) {
  const [roomId, setRoomId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const snapshot = useSnapshot(configuration);
  const synced = Object.keys(snapshot).length !== 0 ? snapshot.synced : false;

  const handleCreate = async (id) => {
    let result = await createSyncedStore(id, configuration, props.gameProxy);
    setRoomId(id);
    const clientId = result.clientId;

    if (configuration.clients === undefined) {
      setClientId(clientId);
      initStore()
      addClient(clientId);
    } else {
      alert(
        "This room is already created! Change the name to an unused roomname or try to join to the prevoius."
      );
    }
  };

  const handleJoin = async (id) => {
    let result = await createSyncedStore(id, configuration, props.gameProxy);
    setRoomId(id);
    const clientId = result.clientId;

    if (configuration.clients !== undefined) {
      setClientId(clientId);
      addClient(clientId);
    } else if (configuration.clients === undefined) {
        alert(
          "This room is not created yet! If you click on CREATE NEW ROOM you will create it."
        );
    }
  };

  useEffect(() => {
    if (clientId && synced) {
      addClient(clientId);
    }
  }, [synced, clientId]);

  return (
    <>
      {roomId === null ? (
        <CreateRoomView
          createRoom={(id) => handleCreate(id)}
          joinRoom={(id) => handleJoin(id)}
        />
      ) : (
        <>
          <h1>{clientId}</h1>
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, child.props)
          )}
        </>
      )}
    </>
  );
}
