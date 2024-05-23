import { App } from '../app'
import { BACKEND_URL } from '../constants'
import { Errors, throwError } from '../errors'

export class NetworkController {
    constructor(app: App) {
        this.appModule = app;
    }

    public init() {
    }

    public async recordEvent(
        event_name: string,
        data?: Record<string, string>,
        attributes?: Record<string, string>,
    ) {
        // можно один раз в конструкторе проверить
        if (!this.appModule.getApiToken()) {
            throwError(Errors.TOKEN_IS_NOT_PROVIDED);
        }

        // в теории, если будет много всего трекаться, то можно
        // коллектить и отправлять в батчах, например по 10 событий
        await fetch(this.BACKEND_URL+'events',{
            method: 'POST',
            headers: {
                "TGA-Auth-Token": this.appModule.getApiToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                event_name: event_name,
                custom_data: attributes,
                session_id: this.appModule.getSessionId(),
                user_id: this.appModule.getUserId(),
                app_name: this.appModule.getAppName(),
                is_premium: this.appModule.getUserIsPremium(),
                platform: this.appModule.getPlatform(),
                locale: this.appModule.getUserLocale(),
                start_param: this.appModule.getWebAppStartParam(),
                client_timestamp: String(Date.now()),
            }),
            keepalive: true,
        })
    }

    private BACKEND_URL: string = BACKEND_URL;

    private appModule: App;
}
