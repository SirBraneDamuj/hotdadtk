import { useContext, useMemo } from "react";
import ActionConfigContext from "../actionConfigContext";
import type { SubAction } from "../types";
import { groupBy } from "../util";
import SubActionGroup from "./SubActionGroup";

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
