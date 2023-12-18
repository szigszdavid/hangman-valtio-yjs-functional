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
}
