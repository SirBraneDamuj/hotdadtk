import { useCallback, useContext, useMemo, useState } from "react";
import ActionDetails from "../ActionDetails/ActionDetails";
import ActionConfigContext from "../actionConfigContext";
import type { Action } from "../types";
import { groupBy } from "../util";
import "./FileDisplay.css";

type ActionRowProps = {
  action: Action;
  onActionClick: (actionId: string) => void;
};

function ActionRow({ action, onActionClick }: ActionRowProps) {
  return (
    <div className="actionRow" onClick={() => onActionClick(action.id)}>
      <div>Name: {action.name}</div>
      <div>ID: {action.id}</div>
    </div>
  );
}

type ActionGroupProps = {
  groupName: string;
  actions: Action[];
  onActionClick: (actionId: string) => void;
};

function ActionGroup({ groupName, actions, onActionClick }: ActionGroupProps) {
  const actionRows = actions.map((action) => (
    <ActionRow key={action.id} action={action} onActionClick={onActionClick} />
  ));
  return (
    <div className="actionGroup">
      <div className="groupHeader">Group Name: {groupName}</div>
      <div className="actionGroupActionsList">{actionRows}</div>
    </div>
  );
}
function FileDisplay() {
  const { actionConfig } = useContext(ActionConfigContext);
  const [displayedActionId, setDisplayedActionId] = useState<string | null>(
    null
  );
  const returnToActionList = useCallback(() => {
    setDisplayedActionId(null);
  }, [setDisplayedActionId]);
  const groupedActions = useMemo(() => {
    if (!actionConfig) return {};
    return groupBy(actionConfig.actions, (action) => action.group);
  }, [actionConfig]);
  if (actionConfig) {
    if (!displayedActionId) {
      const actionGroupRows = Object.keys(groupedActions).map((groupName) => (
        <ActionGroup
          key={groupName}
          groupName={groupName}
          actions={groupedActions[groupName]}
          onActionClick={setDisplayedActionId}
        />
      ));
      return <div>{actionGroupRows}</div>;
    } else {
      return (
        <ActionDetails
          actionId={displayedActionId}
          onBackClick={returnToActionList}
        />
      );
    }
  }
}

export default FileDisplay;
