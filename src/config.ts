export interface applicationOptions {
  enable:boolean
}

export interface ICaradhrasConfig {
  applications: {
    firmwareDispenser: applicationOptions;
    firmwareWebManager: applicationOptions;
  }
}

export const config: ICaradhrasConfig = {
  applications: {
    firmwareDispenser: {
      enable: true,
    },
    firmwareWebManager: {
      enable: true,
    }
  }
};