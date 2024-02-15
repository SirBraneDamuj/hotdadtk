import { useContext, useMemo } from "react";
import ActionConfigContext from "../actionConfigContext";

export type ActionDetailsProps = {
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
      <div>Action Name: {action.name}</div>
      <div>Action ID: {action.id}</div>
      <div>Sub Actions: {action.actions.length}</div>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
}

export default ActionDetails;
