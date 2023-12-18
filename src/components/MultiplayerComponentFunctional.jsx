import { useState, useEffect } from "react";
import CreateRoomView from "./CreateRoomView";
import React from "react";
import { state, initStore, addClient } from "../state/store";
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
const createSyncedStore = async (room, state) => {
  try {
    const ydoc = new Doc();
    const websocketProvider = new WebsocketProvider(
      "ws://localhost:1234",
      room,
      ydoc
    );
    await waitForSync(websocketProvider);
    const yStore = ydoc.getMap("store");
    bind(state, yStore);
    return { clientId: ydoc.clientID };
  } catch (e) {
    console.error(e);
  }
};

export default function MultiplayerComponentFunctional(props) {
  const [roomId, setRoomId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const snapshot = useSnapshot(state);
  const synced = Object.keys(snapshot).length !== 0 ? snapshot.configuration.synced : false;

  const handleCreate = async (id) => {
    let result = await createSyncedStore(id, state);
    setRoomId(id);
    const clientId = result.clientId;

    if (state.configuration === undefined || state.configuration.clients === undefined) {
      console.log("hello");
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
    let result = await createSyncedStore(id, state);
    setRoomId(id);
    const clientId = result.clientId;

    if (state.configuration !== undefined && state.configuration.clients !== undefined) {
      setClientId(clientId);
      addClient(clientId);
    } else if (state.configuration === undefined || state.configuration.clients === undefined) {
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
