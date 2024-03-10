export type Queue = {
  id: string;
  name: string;
  blocking: boolean;
};

export type ActionConfig = {
  actions: Action[];
  queues: Queue[];
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
  group: string | null;
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

/*
        {
          "min": -1,
          "max": 1,
          "id": "6c6f1d10-9dda-41a9-8fec-3ff61cc340d5",
          "type": 102,
          "enabled": true,
          "alwaysRun": false
        }
*/
export type Trigger = {
  id: string;
  min: number;
  max: number;
  type: number;
  enabled: boolean;
  alwaysRun: boolean;
};

export type Action = BaseAction & {
  actions: SubAction[];
  name: string;
  actionGroups: SubActionGroup[];
  collapsedGroups: string[];
  randomAction: boolean;
  triggers: Trigger[] | null;
  queue: string | null;
  excludeFromHistory: boolean;
  concurrent: boolean;
};

export type SubAction = BaseAction & {
  index: number;
  type: 30 | 1002 | 4 | 1;
  weight: number;
};

export type MediaVisibilitySubAction = SubAction & {
  state: 0 | 1;
  type: 30;
  sceneName: string;
  sourceName: string;
  connectionId: string;
};

export type DelaySubAction = SubAction & {
  value: number;
  type: 1002;
  maxValue: number;
  random: boolean;
};

export type RunActionSubAction = SubAction & {
  actionId: string;
  type: 4;
  runImmediately: boolean;
};

export type PlaySoundSubAction = SubAction & {
  soundFile: string;
  type: 1;
};
