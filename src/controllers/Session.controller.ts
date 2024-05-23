import { WebAppUser } from '@twa-dev/types'
import { App } from '../app'
import { Errors, throwError } from '../errors'
import { generateUUID } from '../utils/generateUUID';

export class SessionController {
    constructor(app: App) {
        this.appModule = app;
    }

    public init() {
        this.userData = window?.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!this.userData) {
            throwError(Errors.USER_DATA_IS_NOT_PROVIDED);
        }

        this.userId = this.userData.id;
        this.userLocale = this.userData?.language_code;
        this.webAppStartParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
        this.platform = window?.Telegram?.WebApp?.platform;
        this.sessionId = generateUUID(String(this.getUserId()));
    }

    public getSessionId() {
        return this.sessionId;
    }

    public getUserId() {
        return this.userId;
    }

    public getWebAppStartParam() {
        return this.webAppStartParam;
    }

    public getPlatform(){
        return this.platform;
    }

    public getUserLocale() {
        return this.userLocale;
    }

    public getUserData() {
        return this.userData;
    }

    // все эти свойства только читаются - можно сделать их readonly
    // и убрать все методы - меньше кода на клиенте
    private sessionId: string;
    private userId: number;
    private userData: WebAppUser;
    private platform: string;
    private webAppStartParam: string;
    private userLocale: string;

    // судя по всему не используется
    private appModule: App;
}
