import { createContext } from "react";
import { ActionConfig } from "./types";

export type ActionConfigContextType = {
  actionConfig: ActionConfig | null;
  setActionConfig: (newActionConfig: ActionConfig) => void;
};

const ActionConfigContext = createContext<ActionConfigContextType>({
  actionConfig: null,
  setActionConfig: () => {},
});

export default ActionConfigContext;
