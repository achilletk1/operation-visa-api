export interface CronInterface {
    cronExpressionPath: any;
    startOnStagingBci: boolean;
    startOnStaging: boolean;
    startOnDev: boolean;
    startOnProd: boolean;
    service: any;

    start(): Promise<void>;

}
