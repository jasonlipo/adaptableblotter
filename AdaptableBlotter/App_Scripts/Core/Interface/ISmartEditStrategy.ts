import {IStrategyActionReturn,IStrategy} from './IStrategy';
import {SmartEditOperation} from '../Enums';

export interface ISmartEditPreview{
    ColumnId: string,
    InitialValueLabel :string,
    ComputedValueLabel: string,
    Values: ISmartEditValueTuple[]
}

export interface ISmartEditValueTuple{
    Id: any, InitialValue: number, ComputedValue:number
}

export interface ISmartEditStrategy extends IStrategy {
    BuildPreviewValues(smartEditValue: number, smartEditOperation: SmartEditOperation): ISmartEditPreviewReturn;
    ApplySmartEdit(smartEditValue: number, smartEditOperation: SmartEditOperation) : void;
}

export interface ISmartEditPreviewReturn extends IStrategyActionReturn<ISmartEditPreview> {

}