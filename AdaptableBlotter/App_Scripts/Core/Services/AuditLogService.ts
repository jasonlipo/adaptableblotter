
import { IAdaptableBlotter } from '../Interface/IAdaptableBlotter';
import { IAuditLogEntry } from '../Interface/IAuditLogEntry';
import { AuditLogTrigger } from '../Enums';
import * as DeepDiff from 'deep-diff'
// import * as SockJS from 'sockjs-client'

export class AuditLogService {
    //need AuditLog Object
    private auditLogQueue: Array<IAuditLogEntry>
    private canSendLog: boolean = true
    private numberOfMissedPing: number = 0
    // private sockJS: any

    constructor(private blotter: IAdaptableBlotter) {
        this.auditLogQueue = []
        // //need to implement HTTPS and create proper server for websocket
        // this.sockJS = new SockJS('http://127.0.0.1:9999/auditlog');
        // this.sockJS.onopen = (e: any) => {
        //     console.log('open');
        // };
        // this.sockJS.onmessage = (e: MessageEvent) => {
        //     console.log('message', e.data);
        // };
        // this.sockJS.onclose = (e: any) => {
        //     console.log('close');
        // };
        this.ping()
        setInterval(() => this.ping(), 60000)
        setInterval(() => this.flushAuditQueue(), 1000)
    }

    public AddEditCellAuditLog(primarykey: string, columnId: string, oldValue: any, newValue: any) {
        if (typeof oldValue == "string" && typeof newValue == "string") {
            this.auditLogQueue.push({
                adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.CellEdit],
                adaptableblotter_client_timestamp: new Date(),
                adaptableblotter_username: "JOJOJOJOJO",
                adaptableblotter_editcell: {
                    primarykey: primarykey,
                    column_id: columnId,
                    old_value_string: oldValue,
                    new_value_string: newValue
                }
            });
        }
        else if (typeof oldValue == "number" && typeof newValue == "number") {
            this.auditLogQueue.push({
                adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.CellEdit],
                adaptableblotter_client_timestamp: new Date(),
                adaptableblotter_username: "JOJOJOJOJO",
                adaptableblotter_editcell: {
                    primarykey: primarykey,
                    column_id: columnId,
                    old_value_string: String(oldValue),
                    new_value_string: String(newValue),
                    old_value_numeric: oldValue,
                    new_value_numeric: newValue
                }
            });
        }
        else if (typeof oldValue == "boolean" && typeof newValue == "boolean") {
            this.auditLogQueue.push({
                adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.CellEdit],
                adaptableblotter_client_timestamp: new Date(),
                adaptableblotter_username: "JOJOJOJOJO",
                adaptableblotter_editcell: {
                    primarykey: primarykey,
                    column_id: columnId,
                    old_value_string: String(oldValue),
                    new_value_string: String(newValue),
                    old_value_boolean: oldValue,
                    new_value_boolean: newValue
                }
            });
        }
        else if (oldValue instanceof Date && newValue instanceof Date) {
            this.auditLogQueue.push({
                adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.CellEdit],
                adaptableblotter_client_timestamp: new Date(),
                adaptableblotter_username: "JOJOJOJOJO",
                adaptableblotter_editcell: {
                    primarykey: primarykey,
                    column_id: columnId,
                    old_value_string: String(oldValue),
                    new_value_string: String(newValue),
                    old_value_date: oldValue,
                    new_value_date: newValue
                }
            });
        }
        else {
            this.auditLogQueue.push({
                adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.CellEdit],
                adaptableblotter_client_timestamp: new Date(),
                adaptableblotter_username: "JOJOJOJOJO",
                adaptableblotter_editcell: {
                    primarykey: primarykey,
                    column_id: columnId,
                    old_value_string: String(oldValue),
                    new_value_string: String(newValue)
                }
            });
        }

    }

    public AddStateChangeAuditLog(stateChanges: deepDiff.IDiff[]) {
        this.auditLogQueue.push({
            adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.StateChange],
            adaptableblotter_client_timestamp: new Date(),
            adaptableblotter_username: "JOJOJOJOJO",
            adaptableblotter_state_change: stateChanges
        });
    }

    public AddAdaptableBlotterFunctionLog(functionName: string, action: string, info: string, data?: any) {
        this.auditLogQueue.push({
            adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.StateChange],
            adaptableblotter_client_timestamp: new Date(),
            adaptableblotter_username: "JOJOJOJOJO",
            adaptableblotter_function: {
                name: functionName,
                action: action,
                info: info,
                //not sure if it's best to leave undefined or null.... I think null is better
                data: data ? data : null
            }
        });
    }

    private ping() {
        let pingMessage: IAuditLogEntry = {
            adaptableblotter_auditlog_trigger: AuditLogTrigger[AuditLogTrigger.Ping],
            adaptableblotter_client_timestamp: new Date(),
            adaptableblotter_username: "JOJOJOJOJO",
            adaptableblotter_number_of_missed_ping: this.numberOfMissedPing
        }
        let xhr = new XMLHttpRequest();
        xhr.onerror = (ev: ErrorEvent) => { console.log("error sending ping: " + ev.message); this.SetCanSendLog(false); }
        xhr.ontimeout = (ev: ProgressEvent) => { console.log("timeout sending ping"); this.SetCanSendLog(false); }
        xhr.onload = (ev: ProgressEvent) => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    this.SetCanSendLog(true);
                } else {
                    console.error("error sending ping: " + xhr.statusText);
                    this.SetCanSendLog(false);
                }

            }
        }
        var url = "/auditlog";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(pingMessage));
    }

    private SetCanSendLog(enable: boolean) {
        if (enable) {
            this.canSendLog = true;
            this.numberOfMissedPing = 0
        }
        else {
            this.canSendLog = false;
            this.numberOfMissedPing++;
        }
    }

    private flushAuditQueue() {
        //if we cannot send logs then we just clear the thing
        if (!this.canSendLog) {
            this.auditLogQueue.length = 0
        }

        let obj = this.auditLogQueue.shift()
        // while (obj && this.sockJS.readyState == SockJS.OPEN) {
        while (obj) {
            let xhr = new XMLHttpRequest();
            xhr.onerror = (ev: ErrorEvent) => console.log("error sending AuditLog: " + ev.message)
            xhr.ontimeout = (ev: ProgressEvent) => console.log("timeout sending AuditLog")
            xhr.onload = (ev: ProgressEvent) => {
                if (xhr.readyState == 4) {
                    if (xhr.status != 200) {
                        console.error("error sending AuditLog: " + xhr.statusText);
                    }
                }
            }
            var url = "/auditlog";
            //we make the request async
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            //we want to loose the type since you cannot have same field name with different types in logstash. So
            xhr.send(JSON.stringify(obj, (key: string, value: any) => this.buildJSON(key, value)));
            obj = this.auditLogQueue.shift()
        }
    }

    private buildJSON(key: string, value: any): any {
        if (key == "adaptableblotter_state_change") {
            return this.convertToText(value);
        }
        return value;
    }

    private convertToText(obj: any): string {
        let string = [];

        if (obj == undefined) {
            return String(obj);
        } else if (Array.isArray(obj)) {
            for (let prop in obj) {
                string.push(this.convertToText(obj[prop]));
            }
            return "[" + string.join(",") + "]";
        }
        if (typeof (obj) == "object") {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop))
                    string.push(prop + ": " + this.convertToText(obj[prop]));
            }
            return "{" + string.join(",") + "}";
            //is function
        } else if (typeof (obj) == "function") {
            string.push(obj.toString())

        } else {
            string.push(String(obj))
        }

        return string.join(",");
    }
}