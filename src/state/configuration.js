import { proxy } from "valtio";

export const configuration = proxy(undefined);

export function initStore() {
  Object.assign(configuration, {
    synced: false,
    clients: [],
  });
}

export function addClient(clientId) {
  configuration.clients.push({ id: clientId, nickname: "" });
  sessionStorage.setItem("playerId", JSON.stringify(clientId))
}

export function deleteClient(clientId) {
  configuration.clients.filter(client => client.id !== clientId)
  sessionStorage.removeItem("playerId")
}
