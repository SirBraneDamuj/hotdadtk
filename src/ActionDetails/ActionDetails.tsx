import { useContext, useMemo } from "react";
import ActionConfigContext from "../actionConfigContext";
import type { Action } from "../types";
import { groupBy } from "../util";
import SubActionGroup from "./SubActionGroup";

type SubActionListProps = {
  action: Action;
};

const NO_GROUP = "NO GROUP";

function SubActionList({ action }: SubActionListProps) {
  const { actions: subActions } = action;
  const subActionGroups = useMemo(() => {
    return groupBy(subActions, (subAction) => subAction.group || NO_GROUP);
  }, [subActions]);
  const subActionGroupItems = Object.keys(subActionGroups).map((groupName) => (
    <SubActionGroup
      key={groupName}
      groupName={groupName}
      action={action}
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
  console.log(action);

  return (
    <div>
      <button onClick={onBackClick}>Back</button>
      <div>Action Name: {action.name}</div>
      <div>Action ID: {action.id}</div>
      <div>Sub Actions: {action.actions.length}</div>
      <div>Random Action?: {action.randomAction ? "✅" : "❌"}</div>
      <SubActionList action={action} />
    </div>
  );
}

export default ActionDetails;
