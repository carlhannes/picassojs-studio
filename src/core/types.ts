export type itemType = {
  [key: string]: string | string[] | number | undefined;
  id: string;
  title: string;
  description?: undefined | string;
  code: string;
  language?: undefined | string;
  tags?: undefined | string[];
};

export type ExampleItem = {
  id: string;
  title: string;
  code: string;
  data?: string;
  appId?: string;
  sheetId?: string;
  objectId?: string;
};

export type SettingsType = {
  api: {
    chart: boolean;
    compose: boolean;
  };
  renderer: {
    prio: string[];
  };
  logger: number;
};

