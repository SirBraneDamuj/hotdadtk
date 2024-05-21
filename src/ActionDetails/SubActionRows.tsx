import { useContext, useMemo } from "react";
import ActionConfigContext from "../actionConfigContext";
import {
  ActionConfig,
  DelaySubAction,
  MediaVisibilitySubAction,
  PlaySoundSubAction,
  RunActionSubAction,
  SubAction,
} from "../types";

type SubActionItemProps = {
  subAction: SubAction;
};

function mediaVisibilitySubActionDetails(subAction: SubAction) {
  const { sceneName, sourceName, state } =
    subAction as MediaVisibilitySubAction;
  return `Set ${sourceName} in ${sceneName} visibility to ${state}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function delaySubActionDetails(subAction: SubAction, _a: unknown) {
  const { value } = subAction as DelaySubAction;
  return `Delay ${value} ms`;
}

function runActionSubActionDetails(
  subAction: SubAction,
  actionConfig: ActionConfig
) {
  const { actionId } = subAction as RunActionSubAction;
  const { name } = actionConfig.actions.find((a) => a.id === actionId) ?? {
    name: "Unknown Action",
  };
  return `Run Other Action (name: ${name}, id: ${actionId})`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function playSoundSubActionDetails(subAction: SubAction, _a: unknown) {
  const { soundFile } = subAction as PlaySoundSubAction;
  return `Play Sound File: ${soundFile}`;
}

const subActionTypes = {
  4: {
    name: "Run Action",
    detailsFn: runActionSubActionDetails,
  },
  30: {
    name: "Set Media Visibility",
    detailsFn: mediaVisibilitySubActionDetails,
  },
  1002: { name: "Delay", detailsFn: delaySubActionDetails },
  1: {
    name: "Play Sound",
    detailsFn: playSoundSubActionDetails,
  },
};

function SubActionItem({ subAction }: SubActionItemProps) {
  const { index, type } = subAction;
  const { name: actionTypeName, detailsFn } = subActionTypes[type];
  const { actionConfig } = useContext(ActionConfigContext);

  return (
    <tr>
      <td>{index}</td>
      <td>{actionTypeName}</td>
      <td>{detailsFn(subAction, actionConfig)}</td>
    </tr>
  );
}

type SubActionRowsProps = {
  subActions: SubAction[];
};

function SubActionRows({ subActions }: SubActionRowsProps) {
  const sortedSubActions = useMemo(() => {
    return subActions.sort((a, b) => {
      return a.index - b.index;
    });
  }, [subActions]);
  const subActionRows = sortedSubActions.map((subAction) => (
    <SubActionItem key={subAction.id} subAction={subAction} />
  ));
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Action Type</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>{subActionRows}</tbody>
    </table>
  );
}

export default SubActionRows;
