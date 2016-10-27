
import { IAuditService, IDataChangedEvent, IColumnDataValueList, IDataValue } from './Interface/IAuditService';
import { IEvent } from '../Interface/IEvent';
import { IAdaptableBlotter } from '../Interface/IAdaptableBlotter';
import { EventDispatcher } from '../EventDispatcher'


/*
For now this is a very rough and ready Audit Service which will recieve notifications of changes in data - either via an event fired in the blotter or through other strategies.
This means that we are able to work out old and new values - though for the first pass its a bit brittle as we look at _pristineData via a method in the Blotter...
*/
export class AuditService implements IAuditService {

    constructor(private blotter: IAdaptableBlotter) {

        this._columnDataValueList = [];
    }


    public CreateAuditEvent(identifierValue: any, newValue: any, columnName: string): void {
        var dataChangedEvent: IDataChangedEvent = { OldValue: null, NewValue: newValue, ColumnName: columnName, IdentifierValue: identifierValue };
        this.AddDataValuesToList(dataChangedEvent);
        this._onDataSourceChanged.Dispatch(this, dataChangedEvent);
    }

    private _columnDataValueList: IColumnDataValueList[];

    private AddDataValuesToList(dataChangedEvent: IDataChangedEvent) {
        //   alert("column: " + dataChangedEvent.ColumnName + " new value: " + dataChangedEvent.NewValue + " where primary key: " + dataChangedEvent.IdentifierValue);
        if (this._columnDataValueList.length == 0) {

            let columns = this.blotter.AdaptableBlotterStore.TheStore.getState().Grid.Columns;
            columns.forEach(c => {
                this._columnDataValueList.push({ ColumnName: c.ColumnId, DataValues: [] })
            })
        }

        // ok so this is probably totally shit but we want to add the value to the list if it doesnt yet exist, otherwise update it
        let columnName = dataChangedEvent.ColumnName;
        var myList = this._columnDataValueList.find(c => c.ColumnName == columnName);
        let existingDataValue: IDataValue = myList.DataValues.find(d => d.IdentifierValue == dataChangedEvent.IdentifierValue);
        if (existingDataValue != null) {
            let previousOldValue: any = existingDataValue.NewValue;
            existingDataValue.OldValue = previousOldValue;
            existingDataValue.NewValue = dataChangedEvent.NewValue;
            dataChangedEvent.OldValue = previousOldValue;
        }
        else {
            // this is the first time we have updated this so lets see if we can at least try to get the value...
            dataChangedEvent.OldValue = this.blotter.GetDirtyValueForColumnFromDataSource(dataChangedEvent.ColumnName, dataChangedEvent.IdentifierValue);;
            myList.DataValues.push({ OldValue: dataChangedEvent.OldValue, NewValue: dataChangedEvent.NewValue, IdentifierValue: dataChangedEvent.IdentifierValue })
        }
    }

    private _onDataSourceChanged: EventDispatcher<IAuditService, IDataChangedEvent> = new EventDispatcher<IAuditService, IDataChangedEvent>();

    OnDataSourceChanged(): IEvent<IAuditService, IDataChangedEvent> {
        return this._onDataSourceChanged;
    }



}