export type ActionConfig = {
  actions: Action[];
};

/*
"id": "004cbd4e-580a-4d76-8412-e1274026810a",
      "queue": "d7f2273b-3e0d-4ac0-9931-cd408d7b29f0",
      "enabled": true,
      "excludeFromHistory": false,
      "name": "92",
      "group": "JKM",
      "alwaysRun": false,
      "randomAction": false,
      "concurrent": false,
      */

export type BaseAction = {
  id: string;
  name: string;
  group: string;
};

export type Action = BaseAction & {
  actions: SubAction[];
};

export type SubAction = BaseAction;
