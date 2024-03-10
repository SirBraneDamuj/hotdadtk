import { useCallback, useContext, useMemo, useState } from "react";
import Modal from "react-modal";
import ActionDetails from "../ActionDetails/ActionDetails";
import CreateActionForm from "../CreateActionForm/CreateActionForm";
import ActionConfigContext from "../actionConfigContext";
import type { Action } from "../types";
import { groupBy } from "../util";
import styles from "./FileDisplay.module.css";

type ActionRowProps = {
  action: Action;
  onActionClick: (actionId: string) => void;
};

function ActionRow({ action, onActionClick }: ActionRowProps) {
  return (
    <div className={styles.actionRow} onClick={() => onActionClick(action.id)}>
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
    <div className={styles.actionGroup}>
      <div className={styles.groupHeader}>Group Name: {groupName}</div>
      <div className={styles.actionGroupActionsList}>{actionRows}</div>
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
    return groupBy(actionConfig.actions, (action) => action.group ?? "N/A");
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

function ExportButton() {
  const { actionConfig } = useContext(ActionConfigContext);
  const saveFile = useCallback(() => {
    const aFileParts = [JSON.stringify(actionConfig)];
    const oMyBlob = new Blob(aFileParts, { type: "application/json" }); // the blob
    window.open(URL.createObjectURL(oMyBlob), "_blank");
  }, [actionConfig]);

  return <button onClick={saveFile}>Export</button>;
}

function HomepageLayout() {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const createNewActionClick = useCallback(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);
  const onCloseForm = useCallback(() => {
    setShowCreateModal(false);
  }, [setShowCreateModal]);
  return (
    <div>
      <div>
        <button onClick={createNewActionClick}>Create New Action</button>
        <ExportButton />
      </div>
      <FileDisplay />
      <Modal isOpen={showCreateModal} onRequestClose={onCloseForm}>
        <CreateActionForm onCloseForm={onCloseForm} />
      </Modal>
    </div>
  );
}

export default HomepageLayout;
