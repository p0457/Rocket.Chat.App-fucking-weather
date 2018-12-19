import { IHttp, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class FuckingWeatherCommand implements ISlashCommand {
    public command: string = 'fuckingweather';
    public i18nParamsExample: string = 'Slash_Command_Params_Example';
    public i18nDescription: string = 'Slash_Command_Description';
    public providesPreview: boolean = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const icon = await read.getEnvironmentReader().getSettings().getValueById('fuckingweather_icon');
        const username = await read.getEnvironmentReader().getSettings().getValueById('fuckingweather_name');

        let text = `Sorry, couldn't find that location`;

        const location = context.getArguments().slice().join(' ');
        const url = 'http://thefuckingweather.com/Where/' + location;

        const response = await http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); // Plz no blacklist
        if (response) {
          const body = response.content;
          if (body) {
            const tempMatch = body.match(/<span class="temperature jsMainTemp" tempf="\d*">(\d+)/);
            const remarkMatch = body.match(/<p class="remark jsRemark">(.*)</);
            const flavorMatch = body.match(/<p class="flavor">(.*)</);
            if (tempMatch !== null && remarkMatch !== null && flavorMatch !== null) {
              const temp = tempMatch[1];
              const remark = remarkMatch[1];
              const flavor = flavorMatch[1];
              text = '*' + temp + ' degrees in ' + location +  '?!*\n' + remark + '\n' + flavor;
            }
          }
        }

        const builder = modify.getCreator().startMessage()
            .setSender(context.getSender()).setRoom(context.getRoom())
            .setText(text).setUsernameAlias(username).setAvatarUrl(icon);

        // Respond back to user directly
        await modify.getNotifier().notifyUser(context.getSender(), builder.getMessage());

        return;
    }
}
