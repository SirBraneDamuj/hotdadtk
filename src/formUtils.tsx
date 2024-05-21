import { ActionConfig } from "./types";

export function queueOptions(actionConfig: ActionConfig) {
  return actionConfig.queues
    .sort(({ name: nameA }, { name: nameB }) => (nameA < nameB ? -1 : 1))
    .map(({ name, id }) => (
      <option value={id} key={id}>
        {name}
      </option>
    ));
}
