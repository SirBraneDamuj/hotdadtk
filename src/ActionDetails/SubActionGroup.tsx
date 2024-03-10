import { useCallback, useMemo, useState } from "react";
import Modal from "react-modal";
import {
  Action,
  DelaySubAction,
  MediaVisibilitySubAction,
  PlaySoundSubAction,
  RunActionSubAction,
  SubAction,
} from "../types";
import styles from "./SubActionGroup.module.css";

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
  action: Action;
  groupName: string;
  subActions: SubAction[];
};

function SubActionGroup({
  action,
  groupName,
  subActions,
}: SubActionGroupProps) {
  const [showExtractModal, setShowExtractModal] = useState<boolean>(false);
  const openModal = useCallback(() => {
    setShowExtractModal(true);
  }, [setShowExtractModal]);
  const closeModal = useCallback(() => {
    setShowExtractModal(false);
  }, [setShowExtractModal]);
  const sortedSubActions = useMemo(() => {
    return subActions.sort((a, b) => {
      return a.index - b.index;
    });
  }, [subActions]);
  const subActionRows = sortedSubActions.map((subAction) => (
    <SubActionItem key={subAction.id} subAction={subAction} />
  ));
  return (
    <div className={styles.subActionGroup}>
      <div className={styles.header}>Group Name: {groupName}</div>
      <div>
        <button className={styles.actionButton} onClick={openModal}>
          Extract To Action
        </button>
      </div>
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
      <Modal isOpen={showExtractModal}>
        <h2>Extract subaction</h2>
        <span>{action.id}</span>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default SubActionGroup;
