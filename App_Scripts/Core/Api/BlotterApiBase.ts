import { IAdaptableBlotter } from "../Interface/IAdaptableBlotter";
import { IEvent } from "../Interface/IEvent";
import { IBlotterApi } from "./Interface/IBlotterApi";
import { ISearchChangedEventArgs } from "./Interface/ServerSearch";
import * as LayoutRedux from '../../Redux/ActionsReducers/LayoutRedux'
import * as QuickSearchRedux from '../../Redux/ActionsReducers/QuickSearchRedux'
import * as DataSourceRedux from '../../Redux/ActionsReducers/DataSourceRedux'
import * as AdvancedSearchRedux from '../../Redux/ActionsReducers/AdvancedSearchRedux'
import * as EntitlementsRedux from '../../Redux/ActionsReducers/EntitlementsRedux'
import * as UserInterfaceRedux from '../../Redux/ActionsReducers/UserInterfaceRedux'
import * as DashboardRedux from '../../Redux/ActionsReducers/DashboardRedux'
import * as SmartEditRedux from '../../Redux/ActionsReducers/SmartEditRedux'
import * as ShortcutRedux from '../../Redux/ActionsReducers/ShortcutRedux'
import * as CellValidationRedux from '../../Redux/ActionsReducers/CellValidationRedux'
import * as CalculatedColumnRedux from '../../Redux/ActionsReducers/CalculatedColumnRedux'
import * as CalendarRedux from '../../Redux/ActionsReducers/CalendarRedux'
import * as ThemeRedux from '../../Redux/ActionsReducers/ThemeRedux'
import * as CustomSortRedux from '../../Redux/ActionsReducers/CustomSortRedux'
import * as FilterRedux from '../../Redux/ActionsReducers/FilterRedux'
import * as GridRedux from '../../Redux/ActionsReducers/GridRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as FormatColumnRedux from '../../Redux/ActionsReducers/FormatColumnRedux'
import { ILayout, IAdvancedSearch, IStyle, ICustomSort, IColumnFilter, IUserFilter, IConditionalStyle, IUserTheme, IShortcut, ICalculatedColumn, ICellValidationRule, IFormatColumn } from "./Interface/AdaptableBlotterObjects";
import { DEFAULT_LAYOUT } from "../Constants/GeneralConstants";
import * as StrategyNames from '../Constants/StrategyNames'
import { IEntitlement, ISystemStatus } from "../Interface/Interfaces";
import { LeafExpressionOperator, DisplayAction, Visibility, MathOperation, AlertType, StatusColour } from "../Enums";
import { ResetUserData } from '../../Redux/Store/AdaptableBlotterStore';
import { AdaptableBlotterLogger } from "../Helpers/AdaptableBlotterLogger";
import { IUIInfo, IUIWarning, IUIError } from "../Interface/IMessage";
import { AdaptableBlotterState } from "../../Redux/Store/Interface/IAdaptableStore";
import { Action } from "redux";

export abstract class BlotterApiBase implements IBlotterApi {

    constructor(protected blotter: IAdaptableBlotter) {
    }

    public setGridData(dataSource: any): void {      // no implementation     
    }

    // Layout api methods
    public layoutSet(layoutName: string): void {
        let layout: ILayout = this.blotter.AdaptableBlotterStore.TheStore.getState().Layout.Layouts.find(l => l.Name == layoutName);
        if (this.checkItemExists(layout, layoutName, StrategyNames.LayoutStrategyName)) {
            this.dispatchAction(LayoutRedux.LayoutSelect(layoutName))
        }
    }

    public layoutClear(): void {
        this.dispatchAction(LayoutRedux.LayoutSelect(DEFAULT_LAYOUT))
    }

    public layoutGetCurrent(): ILayout {
        let layoutName = this.blotter.AdaptableBlotterStore.TheStore.getState().Layout.CurrentLayout;
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Layout.Layouts.find(l => l.Name == layoutName);
    }

    // Dashboard api methods
    public dashboardSetAvailableToolbars(availableToolbars: string[]): void {
        this.dispatchAction(DashboardRedux.DashboardSetAvailableToolbars(availableToolbars))
    }

    public dashboardSetVisibleToolbars(visibleToolbars: string[]): void {
        visibleToolbars.forEach(vt => {
            this.dashboardShowToolbar(vt)
        })
    }

    public dashboardShowToolbar(visibleToolbar: string): void {
        this.dispatchAction(DashboardRedux.DashboardSetToolbarVisibility(visibleToolbar))
    }

    public dashboardHideToolbar(visibleToolbar: string): void {
        this.dispatchAction(DashboardRedux.DashboardSetToolbarVisibility(visibleToolbar))
    }

    public dashboardSetVisibleButtons(functionButtons: string[]): void {
        this.dispatchAction(DashboardRedux.DashboardSetFunctionButtons(functionButtons))
    }

    public dashboardSetZoom(zoom: Number): void {
        this.dispatchAction(DashboardRedux.DashboardSetZoom(zoom))
    }

    public dashboardSetVisibility(dashboardVisibility: 'Minimised' | 'Visible' | 'Hidden'): void {
        this.dispatchAction(DashboardRedux.DashboardSetVisibility(dashboardVisibility as Visibility))
    }

    // Quick Search api methods
    public quickSearchRun(quickSearchText: string): void {
        this.dispatchAction(QuickSearchRedux.QuickSearchApply(quickSearchText))
    }

    public quickSearchClear(): void {
        this.dispatchAction(QuickSearchRedux.QuickSearchApply(""))
    }

    public quickSearchGetValue(): string {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().QuickSearch.QuickSearchText;
    }

    public quickSearchSetOperator(operator: 'Contains' | 'StartsWith'): void {
        this.dispatchAction(QuickSearchRedux.QuickSearchSetOperator(operator as LeafExpressionOperator))
    }

    public quickSearchSetDisplayAction(displayAction: 'HighlightCell' | 'ShowRow' | 'ShowRowAndHighlightCell'): void {
        this.dispatchAction(QuickSearchRedux.QuickSearchSetDisplay(displayAction as DisplayAction))
    }

    public quickSearchSetStyle(style: IStyle): void {
        this.dispatchAction(QuickSearchRedux.QuickSearchSetStyle(style))
    }

    // Calendar State
    public calendarSetCurrent(calendar: string): void {
        this.dispatchAction(CalendarRedux.CalendarSelect(calendar))
    }

    public calendarGetCurrent(): string {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Calendar.CurrentCalendar;
    }


    // Theme State
    public themeSetCurrent(theme: string): void {
        this.dispatchAction(ThemeRedux.ThemeSelect(theme))
    }

    public themeGetCurrent(): string {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Theme.CurrentTheme;
    }

    public themeSetSystemThemes(systemThemes: string[]): void {
        this.dispatchAction(ThemeRedux.ThemeSetSystemThemes(systemThemes))
    }

    public themeSetUserThemes(userThemes: string[]): void {
        this.dispatchAction(ThemeRedux.ThemeSetUserThemes(userThemes))
    }

    public themeSystemThemeGetAll(): string[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Theme.SystemThemes;
    }

    public themeUserThemeGetAll(): IUserTheme[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Theme.UserThemes;
    }

    // Shortuct State
    public shortcutGetAll(): IShortcut[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Shortcut.Shortcuts;
    }

    public shortcutAdd(shortcut: IShortcut): void {
        this.dispatchAction(ShortcutRedux.ShortcutAdd(shortcut))
    }

    public shortcutDelete(shortcut: IShortcut): void {
        this.dispatchAction(ShortcutRedux.ShortcutDelete(shortcut))
    }


    // SmartEdit api methods
    public smartEditSetMathOperation(mathOperation: 'Add' | 'Subtract' | 'Multiply' | 'Divide' | 'Replace'): void {
        this.dispatchAction(SmartEditRedux.SmartEditChangeOperation(mathOperation as MathOperation))
    }

    public smartEditGetMathOperation(): string {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().SmartEdit.MathOperation;
    }

    public smartEditSetValue(smartEditValue: number): void {
        this.dispatchAction(SmartEditRedux.SmartEditChangeValue(smartEditValue))
    }

    public smartEditGetValue(): number {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().SmartEdit.SmartEditValue;
    }


    // user interface api methods
    public uiSetColorPalette(colorPalette: string[]): void {
        this.dispatchAction(UserInterfaceRedux.ColorPaletteSet(colorPalette))
    }

    public uiAddColorsToPalette(colorPalette: string[]): void {
        this.dispatchAction(UserInterfaceRedux.ColorPaletteAdd(colorPalette))
    }

    public uiAddStyleClassNames(styleClassNames: string[]): void {
        this.dispatchAction(UserInterfaceRedux.StyleClassNamesAdd(styleClassNames))
    }


    // filter api methods
    public filterSetColumnFilters(columnFilters: IColumnFilter[]): void {
        columnFilters.forEach(cf => {
            this.dispatchAction(FilterRedux.ColumnFilterAddUpdate(cf))
        })
    }

    public filterSetUserFilters(userFilters: IUserFilter[]): void {
        userFilters.forEach(uf => {
            this.dispatchAction(FilterRedux.UserFilterAddUpdate(-1, uf))
        })
    }

    public filterSetSystemFilters(systemFilters: string[]): void {
        this.dispatchAction(FilterRedux.SystemFilterSet(systemFilters));
    }


    // Data Source api methods
    public dataSourceSet(dataSourceName: string): void {
        let dataSource: string = this.blotter.AdaptableBlotterStore.TheStore.getState().DataSource.DataSources.find(a => a == dataSourceName);
        if (this.checkItemExists(dataSource, dataSourceName, StrategyNames.DataSourceStrategyName)) {
            this.dispatchAction(DataSourceRedux.DataSourceSelect(dataSource))
        }
    }

    public dataSourceClear(): void {
        this.dispatchAction(DataSourceRedux.DataSourceSelect(""))
    }


    // Advanced Search api methods
    public advancedSearchSet(advancedSearchName: string): void {
        let advancedSearch: IAdvancedSearch = this.blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.AdvancedSearches.find(a => a.Name == advancedSearchName);
        if (this.checkItemExists(advancedSearch, advancedSearchName, StrategyNames.AdvancedSearchStrategyName)) {
            this.dispatchAction(AdvancedSearchRedux.AdvancedSearchSelect(advancedSearchName))
        }
    }

    public advancedSearchClear(): void {
        this.dispatchAction(AdvancedSearchRedux.AdvancedSearchSelect(""))
    }

    public advancedSearchAdd(advancedSearch: IAdvancedSearch): void {
        this.dispatchAction(AdvancedSearchRedux.AdvancedSearchAddUpdate(-1, advancedSearch))
    }

    public advancedSearchEdit(advancedSearchName: string, advancedSearch: IAdvancedSearch): void {
        let searchIndex: number = this.blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.AdvancedSearches.findIndex(a => a.Name == advancedSearchName);
        this.dispatchAction(AdvancedSearchRedux.AdvancedSearchAddUpdate(searchIndex, advancedSearch))
    }

    public advancedSearchDelete(advancedSearchName: string): void {
        let searchToDelete = this.advancedSearchGetByName(advancedSearchName)
        this.dispatchAction(AdvancedSearchRedux.AdvancedSearchDelete(searchToDelete))
    }

    public advancedSearchSelectCurrent(): IAdvancedSearch {
        let currentAdvancedSearchName: string = this.blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.CurrentAdvancedSearch
        return this.advancedSearchGetByName(currentAdvancedSearchName)
    }

    public advancedSearchGetByName(advancedSearchName: string): IAdvancedSearch {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.AdvancedSearches.find(a => a.Name == advancedSearchName);
    }

    public advancedSearchGetAll(): IAdvancedSearch[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.AdvancedSearches;
    }

    // Entitlement Methods
    public entitlementGetAll(): IEntitlement[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Entitlements.FunctionEntitlements;
    }

    public entitlementGetByFunction(functionName: string): IEntitlement {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Entitlements.FunctionEntitlements.find(f => f.FunctionName == functionName);
    }

    public entitlementGetAccessLevelForFunction(functionName: string): string {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().Entitlements.FunctionEntitlements.find(f => f.FunctionName == functionName).AccessLevel;
    }

    public entitlementAddOrUpdate(functionName: string, accessLevel: "ReadOnly" | "Hidden" | "Default"): void {
        let entitlement: IEntitlement = { FunctionName: functionName, AccessLevel: accessLevel }
        this.dispatchAction(EntitlementsRedux.EntitlementAddUpdate(-1, entitlement))
    }

    public entitlementDelete(functionName: string): void {
        this.dispatchAction(EntitlementsRedux.EntitlementDelete(functionName))
    }

    // Custom Sort Methods
    public customSortGetAll(): ICustomSort[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().CustomSort.CustomSorts;
    }

    public customSortGetByColumn(columnn: string): ICustomSort {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().CustomSort.CustomSorts.find(cs => cs.ColumnId == columnn);
    }

    public customSortAdd(column: string, values: string[]): void {
        let customSort: ICustomSort = { ColumnId: column, SortedValues: values, IsReadOnly: false }
        this.dispatchAction(CustomSortRedux.CustomSortAdd(customSort))
    }

    public customSortEdit(column: string, values: string[]): void {
        let customSort: ICustomSort = { ColumnId: column, SortedValues: values, IsReadOnly: false }
        this.dispatchAction(CustomSortRedux.CustomSortEdit(customSort))
    }

    public customSortDelete(column: string): void {
        let customSort: ICustomSort = this.customSortGetByColumn(column);
        this.dispatchAction(CustomSortRedux.CustomSortDelete(customSort))
    }


    // Calculated Column State
    public calculatedColumnGetAll(): ICalculatedColumn[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().CalculatedColumn.CalculatedColumns;
    }

    public calculatedColumnAdd(calculatedColumn: ICalculatedColumn): void {
        this.dispatchAction(CalculatedColumnRedux.CalculatedColumnAdd(calculatedColumn))
    }

    public calculatedColumnEditExpression(column: string, columnExpression: string): void {
        let calcColumn: ICalculatedColumn = this.calculatedColumnGetAll().find(cc => cc.ColumnId == column);
        let calcColumnIndex: number = this.calculatedColumnGetAll().findIndex(cc => cc.ColumnId == column);
        calcColumn.ColumnExpression = columnExpression;
        this.dispatchAction(CalculatedColumnRedux.CalculatedColumnEdit(calcColumnIndex, calcColumn))
    }

    public calculatedColumnDelete(column: string): void {
        let calcColumnIndex: number = this.calculatedColumnGetAll().findIndex(cc => cc.ColumnId == column);
        this.dispatchAction(CalculatedColumnRedux.CalculatedColumnDelete(calcColumnIndex))
    }

    // CellValidation State
    public cellValidationGetAll(): ICellValidationRule[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().CellValidation.CellValidations;
    }

    public cellValidationAdd(cellValidationRule: ICellValidationRule): void {
        this.dispatchAction(CellValidationRedux.CellValidationAddUpdate(-1, cellValidationRule))
    }

    public cellValidationDelete(cellValidationRule: ICellValidationRule): void {
        let index: number = this.cellValidationGetAll().findIndex(cv => cv == cellValidationRule)
        this.dispatchAction(CellValidationRedux.CellValidationDelete(index))
    }

    // Format Column State
    public formatColumnGetAll(): IFormatColumn[] {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().FormatColumn.FormatColumns;
    }

    public formatColumnnAdd(column: string, style: IStyle): void {
        let formatColumn: IFormatColumn = { ColumnId: column, Style: style, IsReadOnly: false }
        this.dispatchAction(FormatColumnRedux.FormatColumnAdd(formatColumn))
    }

    public formatColumnnUpdate(column: string, style: IStyle): void {
        let formatColumn: IFormatColumn = { ColumnId: column, Style: style, IsReadOnly: false }
        this.dispatchAction(FormatColumnRedux.FormatColumnEdit(formatColumn))
    }

    public formatColumnDelete(formatColumn: IFormatColumn): void {
        this.dispatchAction(FormatColumnRedux.FormatColumnDelete(formatColumn))
    }


    // General Config
    public configClear(): void {
        // let test = window.localStorage.getItem(this.blotter.BlotterOptions.blotterId);
        // let more = JSON.parse(test);
        //let state = this.blotter.AdaptableBlotterStore.TheStore.getState()
        this.dispatchAction(ResetUserData())
    }

    public configGet(): AdaptableBlotterState {

        let test = window.localStorage.getItem(this.blotter.BlotterOptions.blotterId);
        let more = JSON.parse(test);
        let state = this.blotter.AdaptableBlotterStore.TheStore.getState()
        return state;
    }


    // System Status 
    public systemStatusSet(statusMessage: string, statusColour: "Red" | "Amber" | "Green"): void {
        let systemStatus: ISystemStatus = { StatusMessage: statusMessage, StatusColour: statusColour }
        this.dispatchAction(GridRedux.GridSetSystemStatus(systemStatus))
    }
    public systemStatusSetRed(statusMessage: string): void {
        let systemStatus: ISystemStatus = { StatusMessage: statusMessage, StatusColour: StatusColour.Red }
        this.dispatchAction(GridRedux.GridSetSystemStatus(systemStatus))
    }
    public systemStatusSetAmber(statusMessage: string): void {
        let systemStatus: ISystemStatus = { StatusMessage: statusMessage, StatusColour: StatusColour.Amber }
        this.dispatchAction(GridRedux.GridSetSystemStatus(systemStatus))
    }
    public systemStatusSetGreen(statusMessage: string): void {
        let systemStatus: ISystemStatus = { StatusMessage: statusMessage, StatusColour: StatusColour.Green }
        this.dispatchAction(GridRedux.GridSetSystemStatus(systemStatus))
    }

    public systemStatusClear(): void {
        this.dispatchAction(GridRedux.GridClearSystemStatus())
    }

    // Alerts
    public alertShow(alertHeader: string, alertMessage: string, alertType: "Info" | "Warning" | "Error"): void {
        switch (alertType as AlertType) {
            case AlertType.Info:
                let info: IUIInfo = {
                    InfoHeader: alertHeader,
                    InfoMsg: alertMessage
                }
                this.dispatchAction(PopupRedux.PopupShowInfo(info))
                AdaptableBlotterLogger.LogMessage(alertHeader + ": " + alertMessage)
                return;
            case AlertType.Warning:
                let warning: IUIWarning = {
                    WarningHeader: alertHeader,
                    WarningMsg: alertMessage
                }
                AdaptableBlotterLogger.LogWarning(alertHeader + ": " + alertMessage)
                this.dispatchAction(PopupRedux.PopupShowWarning(warning))
                return;
            case AlertType.Error:
                let error: IUIError = {
                    ErrorHeader: alertHeader,
                    ErrorMsg: alertMessage
                }
                AdaptableBlotterLogger.LogError(alertHeader + ": " + alertMessage)
                this.dispatchAction(PopupRedux.PopupShowError(error))
                return;
        }
    }

    public alertShowMessage(alertHeader: string, alertMessage: string): void {
        this.alertShow(alertHeader, alertMessage, "Info")
    }

    public alertShowWarning(alertHeader: string, alertMessage: string): void {
        this.alertShow(alertHeader, alertMessage, "Warning")
    }

    public alertShowError(alertHeader: string, alertMessage: string): void {
        this.alertShow(alertHeader, alertMessage, "Error")
    }

    // Events
    public onSearchedChanged(): IEvent<IAdaptableBlotter, ISearchChangedEventArgs> {
        return this.blotter.SearchedChanged;
    }

    // Helper Methods
    private dispatchAction(action: Action): void {
        this.blotter.AdaptableBlotterStore.TheStore.dispatch(action)

    }

    private checkItemExists(item: any, name: string, type: string): boolean {
        if (!item) {
            AdaptableBlotterLogger.LogError("No " + type + " found with the name: " + name)
            return false;
        }
        return true;
    }
}

