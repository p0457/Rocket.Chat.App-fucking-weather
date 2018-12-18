import {
    IConfigurationExtend, IEnvironmentRead, ILogger,
  } from '@rocket.chat/apps-engine/definition/accessors';
  import { App } from '@rocket.chat/apps-engine/definition/App';
  import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
  import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
  
  import { FuckingWeatherCommand } from './commands/FuckingWeatherCommand';
  
  export class FuckingWeatherApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
      super(info, logger);
    }
  
    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
      await configuration.settings.provideSetting({
        id: 'fuckingweather_name',
        type: SettingType.STRING,
        packageValue: 'fuckingweather',
        required: true,
        public: false,
        i18nLabel: 'Customize_Name',
        i18nDescription: 'Customize_Name_Description',
      });
  
      await configuration.settings.provideSetting({
        id: 'fuckingweather_icon',
        type: SettingType.STRING,
        packageValue: 'https://raw.githubusercontent.com/tgardner851/Rocket.Chat.App-fucking-weather/master/icon.jpg',
        required: true,
        public: false,
        i18nLabel: 'Customize_Icon',
        i18nDescription: 'Customize_Icon_Description',
      });
  
      await configuration.slashCommands.provideSlashCommand(new FuckingWeatherCommand());
    }
  }
  