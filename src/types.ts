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
  group: string;
  enabled: boolean;
};

/*
        {
          "id": "3d7cacb4-2fcb-464e-ab02-4c77c11e6e00",
          "weight": 0.0,
          "name": "it's windy",
          "random": false,
          "index": 89
        },
        */
export type SubActionGroup = {
  id: string;
  index: number;
  name: string;
};

export type Action = BaseAction & {
  actions: SubAction[];
  name: string;
  actionGroups: SubActionGroup[];
};

export type SubAction = BaseAction & {
  index: number;
  type: 30 | 1002 | 4 | 1;
};

export type MediaVisibilitySubAction = SubAction & {
  state: 0 | 1;
  type: 30;
  sceneName: string;
  sourceName: string;
};

export type DelaySubAction = SubAction & {
  value: number;
  type: 1002;
};

export type RunActionSubAction = SubAction & {
  actionId: string;
  type: 4;
};

export type PlaySoundSubAction = SubAction & {
  soundFile: string;
  type: 1;
};
