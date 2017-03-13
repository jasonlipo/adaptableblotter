import { ICellValidationStrategy, ICellValidationRule } from '../Core/Interface/ICellValidationStrategy';
import { MenuItemShowPopup } from '../Core/MenuItem';
import { AdaptableStrategyBase } from '../Core/AdaptableStrategyBase';
import * as StrategyIds from '../Core/StrategyIds'
import { IMenuItem } from '../Core/Interface/IStrategy';
import { MenuType, LeafExpressionOperator } from '../Core/Enums';
import { IAdaptableBlotter, IColumn } from '../Core/Interface/IAdaptableBlotter';
import { CellValidationState } from '../Redux/ActionsReducers/Interface/IState';
import { IRangeExpression } from '../Core/Interface/IExpression';
import { ExpressionHelper } from '../Core/Expression/ExpressionHelper'
import { IUserFilter } from '../Core/Interface/IExpression';

export class CellValidationStrategy extends AdaptableStrategyBase implements ICellValidationStrategy {
    private menuItemConfig: IMenuItem;

    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.CellValidationStrategyId, blotter)
        this.menuItemConfig = new MenuItemShowPopup("Cell Validation", this.Id, 'CellValidationConfig', MenuType.Configuration, "flag");
    }

      getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }

}


