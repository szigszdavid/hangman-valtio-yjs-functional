import { proxy } from "valtio";
import { configuration, deleteClient } from "./configuration";

export const rounds = proxy({
  currentPlayerIndex: 0,
  currentStateID: -1,
  players: [],
});

export function addEveryPlayer(playerData) {
  for (const client of configuration.clients) {
    addPlayer(client.id, playerData);
  }

  setCurrentPlayerIndex(Math.floor(Math.random() * rounds.players.length));
}

export function addPlayer(clientId, playerData) {
  rounds.players.push({
    id: rounds.players.length,
    clientId: clientId,
    ...playerData,
  });
}

export function deletePlayer(clientId) {
  deleteClient(clientId);
  rounds.players = rounds.players.filter(
    (player) => player.clientId !== clientId
  );
}

export function isCurrentPlayer() {
    return rounds.currentPlayerIndex === rounds.players.map(player => player.clientId).indexOf(parseInt(JSON.parse(sessionStorage.getItem("playerId"))))
}

export function nextPlayer() {
  setCurrentPlayerIndex(
    rounds.players.length - 1 === rounds.currentPlayerIndex
      ? 0
      : rounds.currentPlayerIndex + 1
  );
}

export function setNextPlayer(player) {
  setCurrentPlayerIndex(rounds.players.map(player => player.clientId).indexOf(player));
}

function setCurrentPlayerIndex(index) {
  rounds.currentPlayerIndex = index;
}
