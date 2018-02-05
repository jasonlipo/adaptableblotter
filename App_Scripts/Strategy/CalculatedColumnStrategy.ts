import { MenuItemShowPopup } from '../Core/MenuItem';
import { AdaptableStrategyBase } from './AdaptableStrategyBase';
import * as StrategyIds from '../Core/Constants/StrategyIds'
import * as StrategyNames from '../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../Core/Constants/StrategyGlyphs'
import * as ScreenPopups from '../Core/Constants/ScreenPopups'
import { IMenuItem } from '../Core/Interface/IMenu';;
import { IAdaptableBlotter, IColumn } from '../Core/Interface/IAdaptableBlotter';
import * as MenuRedux from '../Redux/ActionsReducers/MenuRedux'
import { ICalculatedColumn } from "../Strategy/Interface/ICalculatedColumnStrategy";

export class CalculatedColumnStrategy extends AdaptableStrategyBase {
    private CalculatedColumns: ICalculatedColumn[]
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.CalculatedColumnStrategyId, blotter)
        this.menuItemConfig = this.createMenuItemShowPopup(
            StrategyNames.CalculatedColumnStrategyName, ScreenPopups.CalculatedColumnPopup, StrategyGlyphs.CalculatedColumnGlyph);
    }

    protected InitState() {
        if (this.CalculatedColumns != this.blotter.AdaptableBlotterStore.TheStore.getState().CalculatedColumn.CalculatedColumns) {
            //All the logic is managed in the redux store middleware
            this.CalculatedColumns = this.blotter.AdaptableBlotterStore.TheStore.getState().CalculatedColumn.CalculatedColumns;
        }
    }

    protected addColumnMenuItems(columnId: string): void {
        let column = this.CalculatedColumns.find(c => c.ColumnId == columnId);
        if (column) {
            this.blotter.AdaptableBlotterStore.TheStore.dispatch(
                MenuRedux.AddItemColumnContextMenu(this.createMenuItemShowPopup(
                    "Edit " + StrategyNames.CalculatedColumnStrategyName,
                    ScreenPopups.CalculatedColumnPopup,
                    StrategyGlyphs.CalculatedColumnGlyph,
                    "Edit|" + columnId)))
        }
    }
}