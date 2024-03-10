import { v4 as uuidv4 } from "uuid";
import {
  Action,
  ActionConfig,
  DelaySubAction,
  MediaVisibilitySubAction,
  RunActionSubAction,
  SubAction,
} from "./types";

export function findAllActionGroups(actionConfig: ActionConfig): string[] {
  const { actions } = actionConfig;
  const actionGroups = new Set<string>();
  for (const { group } of actions) {
    if (group) {
      actionGroups.add(group);
    }
  }
  return Array.from(actionGroups);
}

export function findAllRandomBitTriggeredActions(
  actionConfig: ActionConfig
): { action: Action; bitsCost: number }[] {
  const { actions } = actionConfig;
  return actions
    .filter(
      ({ randomAction, triggers }) =>
        randomAction &&
        triggers?.find(({ type: triggerType }) => triggerType === 102)
    )
    .map((action) => ({
      action,
      bitsCost:
        action.triggers?.find(({ type: triggerType }) => triggerType === 102)
          ?.max ?? -1,
    }))
    .sort(({ bitsCost: a }, { bitsCost: b }) => a - b);
}

function nextSubActionIndex(action: Action): number {
  let lastSubAction: SubAction | null = null;
  for (const subAction of action.actions) {
    if (lastSubAction && subAction.index > lastSubAction.index) {
      lastSubAction = subAction;
    }
  }
  return lastSubAction?.index ?? 0;
}

export type NewClip = {
  sourceName: string;
  name: string;
  duration: number;
  queueId?: string;
  groupName?: string;
  randomGroupActionId: string;
};

export function addNewClipToRandomGroup(
  actionConfig: ActionConfig,
  {
    sourceName,
    name,
    duration,
    queueId,
    groupName,
    randomGroupActionId,
  }: NewClip
): ActionConfig {
  const enableAction: MediaVisibilitySubAction = {
    id: uuidv4(),
    sceneName: "All Stream Media",
    sourceName,
    state: 0,
    connectionId: "3e5211f9-a1cd-4b9c-b4b6-38f752fffe6e",
    weight: 0.0,
    type: 30,
    group: null,
    enabled: true,
    index: 0,
  };
  const delayAction: DelaySubAction = {
    id: uuidv4(),
    value: duration,
    maxValue: 0,
    random: false,
    weight: 0.0,
    type: 1002,
    group: null,
    enabled: true,
    index: 1,
  };
  const hideAction: MediaVisibilitySubAction = {
    id: uuidv4(),
    sceneName: "All Stream Media",
    sourceName,
    state: 1,
    connectionId: "3e5211f9-a1cd-4b9c-b4b6-38f752fffe6e",
    weight: 0.0,
    type: 30,
    group: null,
    enabled: true,
    index: 2,
  };
  const newAction: Action = {
    id: uuidv4(),
    name,
    queue: queueId ?? null,
    group: groupName ?? null,
    enabled: true,
    excludeFromHistory: false,
    randomAction: false,
    concurrent: false,
    actions: [enableAction, delayAction, hideAction],
    triggers: null,
    actionGroups: [],
    collapsedGroups: [],
  };
  const randomGroupAction = actionConfig.actions.find(
    ({ id }) => id === randomGroupActionId
  );
  if (!randomGroupAction) {
    throw new Error(
      `Random group action ID: ${randomGroupActionId} not found...`
    );
  }
  const newSubAction: RunActionSubAction = {
    actionId: newAction.id,
    runImmediately: true,
    id: uuidv4(),
    weight: 0.0,
    type: 4,
    group: null,
    enabled: true,
    index: nextSubActionIndex(randomGroupAction),
  };
  const newActionsList = actionConfig.actions.filter(
    ({ id }) => id !== randomGroupActionId
  );
  const newRandomGroupAction = {
    ...randomGroupAction,
    actions: [...randomGroupAction.actions, newSubAction],
  };
  newActionsList.push(newAction, newRandomGroupAction);
  return {
    ...actionConfig,
    actions: newActionsList,
  };
}
