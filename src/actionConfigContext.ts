import { createContext } from "react";
import { ActionConfig } from "./types";

export type ActionConfigContextType = {
  actionConfig: ActionConfig;
  setActionConfig: (newActionConfig: ActionConfig) => void;
};

const defaultActionConfig: ActionConfig = {
  actions: [],
  queues: [],
};

const ActionConfigContext = createContext<ActionConfigContextType>({
  actionConfig: defaultActionConfig,
  setActionConfig: () => {},
});

export default ActionConfigContext;
