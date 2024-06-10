import { v4 as uuidv4 } from "uuid";
import {
  Action,
  ActionConfig,
  DelaySubAction,
  MediaVisibilitySubAction,
  RunActionSubAction,
  SubAction,
} from "./types";
import { groupBy } from "./util";

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
    if (!lastSubAction) {
      lastSubAction = subAction;
    } else if (subAction.index > lastSubAction.index) {
      lastSubAction = subAction;
    }
  }
  if (lastSubAction) {
    return lastSubAction.index + 1;
  } else {
    return 0;
  }
}

export const NO_GROUP = "NO GROUP";

export function groupSubActionsByGroup(
  subActions: SubAction[]
): Record<string, SubAction[]> {
  return groupBy(subActions, (subAction) => subAction.group || NO_GROUP);
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
    triggers: [],
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

export type SubActionExtractionParams = {
  subActions: SubAction[];
  actionName: string;
  groupName: string;
  queueId: string;
};

export function extractSubActionGroupToNewAction(
  actionConfig: ActionConfig,
  actionId: string,
  oldGroupName: string,
  { subActions, actionName, groupName, queueId }: SubActionExtractionParams
) {
  const newSubActions = subActions.map((subAction) => ({
    ...subAction,
    group: null,
  }));
  const newAction = {
    id: uuidv4(),
    name: actionName,
    queue: queueId === "N/A" ? null : queueId,
    group: groupName === "N/A" ? "" : groupName,
    enabled: true,
    excludeFromHistory: false,
    randomAction: false,
    concurrent: false,
    actions: newSubActions,
    triggers: [],
    actionGroups: [],
    collapsedGroups: [],
  };
  const oldAction = actionConfig.actions.find(({ id }) => id === actionId);
  if (!oldAction) {
    throw Error(
      "Trying to extract a sub action but... what the hell is goin' on?!"
    );
  }
  const subActionIds = subActions.reduce((ids, { id }) => {
    return ids.add(id);
  }, new Set<string>());
  const { id: oldGroupId } = oldAction.actionGroups.find(
    ({ name }) => name === oldGroupName
  )!;
  const newActionGroups = oldAction.actionGroups.filter(
    ({ id }) => id !== oldGroupId
  );
  const newCollapsedActionGroups = oldAction.collapsedGroups.filter(
    (s) => s !== oldGroupId
  );
  const oldActionSubActions = oldAction.actions.filter(
    ({ id }) => !subActionIds.has(id)
  );
  const newSubAction: RunActionSubAction = {
    actionId: newAction.id,
    runImmediately: true,
    id: uuidv4(),
    weight: 0.0,
    type: 4,
    group: null,
    enabled: true,
    index: nextSubActionIndex(oldAction),
  };
  oldActionSubActions.push(newSubAction);
  const oldActionMinusSubActions = {
    ...oldAction,
    actions: oldActionSubActions,
    actionGroups: newActionGroups,
    collapsedGroups: newCollapsedActionGroups,
  };
  const newActionsList = actionConfig.actions.filter(
    ({ id }) => id !== actionId
  );
  newActionsList.push(newAction);
  newActionsList.push(oldActionMinusSubActions);
  return {
    ...actionConfig,
    actions: newActionsList,
  };
}
