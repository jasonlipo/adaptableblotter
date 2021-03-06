import { FormatColumnStrategy } from './FormatColumnStrategy';
import { IFormatColumnStrategy } from '../Strategy/Interface/IFormatColumnStrategy';
import { IAdaptableBlotter } from '../Core/Interface/IAdaptableBlotter';
import { AdaptableBlotter } from '../Vendors/Kendo/AdaptableBlotter';
import { StringExtensions } from '../Core/Extensions/StringExtensions';
import { StyleHelper } from '../Core/Helpers/StyleHelper';
import * as StrategyIds from '../Core/Constants/StrategyIds'

export class FormatColumnKendoStrategy extends FormatColumnStrategy implements IFormatColumnStrategy {
    constructor(blotter: IAdaptableBlotter) {
        super(blotter)
    }

    protected InitStyles(): void {
        let theBlotter = this.blotter as AdaptableBlotter
        let columns = theBlotter.AdaptableBlotterStore.TheStore.getState().Grid.Columns;
        // adding this check as things can get mixed up during 'clean user data'
        if (columns.length > 0 && this.FormatColumnState.FormatColumns.length > 0) {

            this.FormatColumnState.FormatColumns.forEach((fc) => {
                let columnIndex: number = columns.findIndex(c => c.ColumnId == fc.ColumnId)

                if (columnIndex > 0) {
                    theBlotter.forAllRecordsDo((row: any) => {
                        let primaryKey = this.blotter.getPrimaryKeyValueFromRecord(row)
                        let styleName: string = (StringExtensions.IsNullOrEmpty(fc.Style.ClassName)) ?
                            StyleHelper.CreateIndexedStyleName(StrategyIds.FormatColumnStrategyId, this.FormatColumnState.FormatColumns.indexOf(fc), this.blotter) :
                            fc.Style.ClassName;

                        theBlotter.addCellStyle(primaryKey, columnIndex, styleName)

                    })
                }
            })
        }
    }
}

