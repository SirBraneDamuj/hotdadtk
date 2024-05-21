import { useCallback, useState } from "react";
import Modal from "react-modal";
import { Action, SubAction } from "../types";
import ExtractActionForm from "./ExtractActionForm";
import styles from "./SubActionGroup.module.css";
import SubActionRows from "./SubActionRows";

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
  return (
    <div className={styles.subActionGroup}>
      <div className={styles.header}>Group Name: {groupName}</div>
      <div>
        <button className={styles.actionButton} onClick={openModal}>
          Extract To Action
        </button>
      </div>
      <SubActionRows subActions={subActions} />
      <Modal isOpen={showExtractModal}>
        <ExtractActionForm
          actionId={action.id}
          groupName={groupName}
          subActions={subActions}
          onCloseForm={closeModal}
        />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default SubActionGroup;
