import { ResetUserData } from '../Redux/Store/AdaptableBlotterStore';
import { IUserDataManagementStrategy } from '../Core/Interface/IUserDataManagementStrategy';
import { MenuItem } from '../Core/MenuItem';
import { AdaptableStrategyBase } from '../Core/AdaptableStrategyBase';
import { AdaptableViewFactory } from '../View/AdaptableViewFactory'
import * as StrategyIds from '../Core/StrategyIds'
import { IAdaptableBlotter } from '../Core/Interface/IAdaptableBlotter';
import { IMenuItem } from '../Core/Interface/IStrategy';
import { MenuType } from '../Core/Enums';
import * as LayoutRedux from '../Redux/ActionsReducers/LayoutRedux'


const cleanUserData: string = "CleanUserData"

export class UserDataManagementStrategy extends AdaptableStrategyBase implements IUserDataManagementStrategy {
    private menuItemConfig: IMenuItem;
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.UserDataManagementStrategyId, blotter)
        this.menuItemConfig = new MenuItem("Clean User Data", this.Id, cleanUserData, MenuType.Action, "user");
    }

    getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }

    public onAction(action: string) {
        if (action == cleanUserData) {

            this.blotter.AuditLogService.AddAdaptableBlotterFunctionLog(this.Id, "Clean User Data", "", null)

            // setting the layout as default first because this will then have the columns ready for when they are deleted and re=added
            this.blotter.AdaptableBlotterStore.TheStore.dispatch<LayoutRedux.LoadLayoutAction>(LayoutRedux.LoadLayout("Default"));
            this.blotter.AdaptableBlotterStore.TheStore.dispatch(ResetUserData());
            this.blotter.createDefaultLayout();

        }
    }
}