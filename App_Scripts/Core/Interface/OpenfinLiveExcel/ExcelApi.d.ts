import { RpcDispatcher } from './RpcDispatcher';
import { ExcelApplication } from './ExcelApplication';
import { ExcelWorkbook } from './ExcelWorkbook';
export declare class ExcelApi extends RpcDispatcher {
    static instance: ExcelApi;
    static legacyApi: any;
    initialized: boolean;
    applications: {
        [connectionUuid: string]: ExcelApplication;
    };
    constructor();
    init(): void;
    processExcelServiceEvent: (data: any) => void;
    processExcelServiceResult: (data: any) => void;
    monitorDisconnect(): void;
    registerAppInstance: () => void;
    private connectLegacyApi(connectedUuid);
    private disconnectLegacyApi(disconnectedUuid);
    processExcelConnectedEvent(data: any): void;
    processExcelDisconnectedEvent(data: any): void;
    processGetExcelInstancesResult(connectionUuids: string[]): void;
    install(callback: Function): void;
    getInstallationStatus(callback?: Function): void;
    getExcelInstances(callback?: Function): void;
    toObject(): any;
    static init(): void;
    static addEventListener(type: string, listener: () => any): void;
    static removeEventListener(type: string, listener: () => any): void;
    static run(callback?: Function): void;
    static install(callback: Function): void;
    static getInstallationStatus(callback: Function): void;
    static getWorkbooks(callback: Function): void;
    static getWorkbookByName(name: string): ExcelWorkbook;
    static addWorkbook(callback: Function): void;
    static openWorkbook(path: string, callback: Function): void;
    static getConnectionStatus(callback: Function): void;
    static getCalculationMode(callback: Function): void;
    static calculateAll(callback: Function): void;
}
declare var _default: ExcelApi;
export default _default;
export { ExcelApi as LegacyApi };
