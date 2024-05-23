import { Events } from './constants'
import { AnalyticsController } from './controllers/Analytics.controller'
import { NetworkController } from './controllers/Network.controller'
import { SessionController } from './controllers/Session.controller'

export class App {
    constructor(apiToken: string, appName: string) {
        this.sessionController = new SessionController(this);
        this.networkController = new NetworkController(this);
        this.analyticsController = new AnalyticsController(this);
        this.apiToken = apiToken;
        this.appName = appName;
    }

    public async init() {
        this.networkController.init();
        this.sessionController.init();
        this.analyticsController.init();

        await this.networkController.recordEvent(Events.INIT);
    }

    public getSessionId() {
        return this.sessionController.getSessionId();
    }

    public getUserId() {
        return this.sessionController.getUserId();
    }

    public getWebAppStartParam() {
        return this.sessionController.getWebAppStartParam();
    }

    public getUserLocale() {
        return this.sessionController.getUserLocale();
    }

    public getPlatform(){
        return this.sessionController.getPlatform();
    }

    public recordEvent(
        event_name: string,
        data?: Record<string, string>,
        attributes?: Record<string, string>,
    ) {
        return this.networkController.recordEvent(event_name, data, attributes);
    }

    public getApiToken() {
        return this.apiToken;
    }

    public getAppName() {
        return this.appName;
    }

    public getUserIsPremium() {
        const userData = this.sessionController.getUserData();

        return Boolean(userData?.is_premium);
    }

    // обычно свойства определяют сверху
    private sessionController: SessionController;
    private networkController: NetworkController;
    private analyticsController: AnalyticsController;

    private readonly apiToken: string;
    private readonly appName: string;
}
