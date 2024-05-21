import { FieldValues, useForm } from "react-hook-form";
import { SubAction } from "../types";

import { useCallback, useContext, useMemo } from "react";
import {
  extractSubActionGroupToNewAction,
  findAllActionGroups,
} from "../actionConfig";
import ActionConfigContext from "../actionConfigContext";
import { queueOptions } from "../formUtils";
import styles from "./ExtractActionForm.module.css";
import SubActionRows from "./SubActionRows";

type ExtractActionFormProps = {
  actionId: string;
  groupName: string;
  subActions: SubAction[];
  onCloseForm: () => void;
};

function ExtractActionForm({
  actionId,
  groupName,
  subActions,
  onCloseForm,
}: ExtractActionFormProps) {
  const { register, handleSubmit } = useForm();
  const { actionConfig, setActionConfig } = useContext(ActionConfigContext);
  const actionGroups = useMemo(
    () => findAllActionGroups(actionConfig),
    [actionConfig]
  );

  const actionGroupOptions = actionGroups.map((actionGroup) => (
    <option value={actionGroup} key={actionGroup}>
      {actionGroup}
    </option>
  ));

  const onSubmit = useCallback(
    (data: FieldValues) => {
      const newActionConfig = extractSubActionGroupToNewAction(
        actionConfig,
        actionId,
        groupName,
        {
          subActions,
          actionName: data.actionName,
          queueId: data.queueId,
          groupName: data.groupName,
        }
      );
      setActionConfig(newActionConfig);
      onCloseForm();
    },
    [
      actionConfig,
      actionId,
      groupName,
      onCloseForm,
      setActionConfig,
      subActions,
    ]
  );
  return (
    <div>
      <h2>Extract SubAction Group To Action</h2>
      <h3>Group Name: {groupName}</h3>
      <SubActionRows subActions={subActions} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.createActionForm}>
          <div>
            <label htmlFor="actionName">Action Name:</label>
            <input type="text" {...register("actionName")} />
          </div>
          <div>
            <label htmlFor="groupName">Action Group:</label>
            <select defaultValue={"N/A"} {...register("groupName")}>
              <option value={"N/A"}>N/A</option>
              {actionGroupOptions}
            </select>
          </div>
          <div>
            <label htmlFor="queueId">Queue:</label>
            <select defaultValue={"N/A"} {...register("queueId")}>
              <option value={"N/A"}>N/A</option>
              {queueOptions(actionConfig)}
            </select>
          </div>
          <div>
            <button type="submit">Submit</button>
            <button onClick={onCloseForm}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExtractActionForm;
