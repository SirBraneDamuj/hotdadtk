import { useCallback, useContext, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  addNewClipToRandomGroup,
  findAllActionGroups,
  findAllRandomBitTriggeredActions,
} from "../actionConfig";
import ActionConfigContext from "../actionConfigContext";
import styles from "./CreateActionForm.module.css";

type CreateActionFormProps = {
  onCloseForm: () => void;
};

function CreateActionForm({ onCloseForm }: CreateActionFormProps) {
  const { register, handleSubmit } = useForm();
  const { actionConfig, setActionConfig } = useContext(ActionConfigContext);
  const actionGroups = useMemo(
    () => findAllActionGroups(actionConfig ?? { actions: [], queues: [] }),
    [actionConfig]
  );
  const actionGroupOptions = actionGroups.map((actionGroup) => (
    <option value={actionGroup} key={actionGroup}>
      {actionGroup}
    </option>
  ));
  const randomGroups = useMemo(
    () =>
      findAllRandomBitTriggeredActions(
        actionConfig ?? { actions: [], queues: [] }
      ),
    [actionConfig]
  );
  const randomGroupOptions = randomGroups.map(({ action, bitsCost }) => (
    <option value={action.id} key={action.id}>
      {action.name} / {bitsCost} bits
    </option>
  ));
  const queueOptions =
    actionConfig?.queues?.map(({ name, id }) => (
      <option value={id} key={id}>
        {name}
      </option>
    )) ?? [];
  const onSubmit = useCallback(
    (data: FieldValues) => {
      if (!actionConfig) {
        console.error("what the hell we doing here");
        return;
      }
      const newActionConfig = addNewClipToRandomGroup(actionConfig, {
        sourceName: data.sourceName,
        name: data.name,
        duration: data.duration,
        queueId: data.queueId === "N/A" ? null : data.queueId,
        groupName: data.groupName === "N/A" ? null : data.groupName,
        randomGroupActionId: data.randomGroupActionId,
      });
      setActionConfig(newActionConfig);
      onCloseForm();
    },
    [actionConfig, setActionConfig, onCloseForm]
  );

  return (
    <div>
      <h3>Add Clip To Random Group</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.createActionForm}>
          <div>
            <label htmlFor="sourceName">OBS Source Name:</label>
            <input
              placeholder="OBS Source Name"
              type="text"
              {...register("sourceName")}
            />
          </div>
          <div>
            <label htmlFor="name">Clip Name:</label>
            <input placeholder="Clip Name" {...register("name")} />
          </div>
          <div>
            <label htmlFor="duration">Duration (ms):</label>
            <input
              type="number"
              placeholder="Duration (ms)"
              {...register("duration")}
            />
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
              {queueOptions}
            </select>
          </div>
          <div>
            <label htmlFor="randomGroupActionId">Random Group:</label>
            <select {...register("randomGroupActionId")}>
              {randomGroupOptions}
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

export default CreateActionForm;
