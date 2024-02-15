import { useContext, useMemo } from "react";
import ActionConfigContext from "../actionConfigContext";
import {
  DelaySubAction,
  MediaVisibilitySubAction,
  PlaySoundSubAction,
  RunActionSubAction,
  SubAction,
} from "../types";
import { groupBy } from "../util";

type SubActionItemProps = {
  subAction: SubAction;
};

function mediaVisibilitySubActionDetails(subAction: SubAction) {
  const { sceneName, sourceName, state } =
    subAction as MediaVisibilitySubAction;
  return `Set ${sourceName} in ${sceneName} visibility to ${state}`;
}

function delaySubActionDetails(subAction: SubAction) {
  const { value } = subAction as DelaySubAction;
  return `Delay ${value} ms`;
}

function runActionSubActionDetails(subAction: SubAction) {
  const { actionId } = subAction as RunActionSubAction;
  return `Run Other Action (id: ${actionId})`;
}

function playSoundSubActionDetails(subAction: SubAction) {
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

  return (
    <tr>
      <td>{index}</td>
      <td>{actionTypeName}</td>
      <td>{detailsFn(subAction)}</td>
    </tr>
  );
}

type SubActionGroupProps = {
  groupName: string;
  subActions: SubAction[];
};

function SubActionGroup({ groupName, subActions }: SubActionGroupProps) {
  const sortedSubActions = useMemo(() => {
    return subActions.sort((a, b) => {
      return a.index - b.index;
    });
  }, [subActions]);
  const subActionRows = sortedSubActions.map((subAction) => (
    <SubActionItem key={subAction.id} subAction={subAction} />
  ));
  return (
    <div>
      <div>Group Name: {groupName}</div>
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
    </div>
  );
}

type SubActionListProps = {
  subActions: SubAction[];
};

const NO_GROUP = "NO GROUP";

function SubActionList({ subActions }: SubActionListProps) {
  const subActionGroups = useMemo(() => {
    return groupBy(subActions, (subAction) => subAction.group || NO_GROUP);
  }, [subActions]);
  const subActionGroupItems = Object.keys(subActionGroups).map((groupName) => (
    <SubActionGroup
      key={groupName}
      groupName={groupName}
      subActions={subActionGroups[groupName]}
    />
  ));
  return <div>{subActionGroupItems}</div>;
}

type ActionDetailsProps = {
  actionId: string;
  onBackClick: () => void;
};

function ActionDetails({ actionId, onBackClick }: ActionDetailsProps) {
  const { actionConfig } = useContext(ActionConfigContext);

  const action = useMemo(() => {
    return actionConfig?.actions.find((a) => a.id === actionId);
  }, [actionConfig, actionId]);

  if (!action) {
    return <div>Action Not Found :(</div>;
  }

  return (
    <div>
      <button onClick={onBackClick}>Back</button>
      <div>Action Name: {action.name}</div>
      <div>Action ID: {action.id}</div>
      <div>Sub Actions: {action.actions.length}</div>
      <SubActionList subActions={action.actions} />
    </div>
  );
}

export default ActionDetails;
