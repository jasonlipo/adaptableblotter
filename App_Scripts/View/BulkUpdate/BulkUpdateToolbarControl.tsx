﻿import * as React from "react";
import * as Redux from 'redux'
import { connect } from 'react-redux';
import { ButtonToolbar, Col, InputGroup, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead'
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as BulkUpdateRedux from '../../Redux/ActionsReducers/BulkUpdateRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as DashboardRedux from '../../Redux/ActionsReducers/DashboardRedux'
import { ToolbarStrategyViewPopupProps } from '../Components/SharedProps/ToolbarStrategyViewPopupProps'
import { StringExtensions } from '../../Core/Extensions/StringExtensions'
import { Helper } from '../../Core/Helpers/Helper';
import { ButtonApply } from '../Components/Buttons/ButtonApply';
import { ButtonDelete } from '../Components/Buttons/ButtonDelete';
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { PanelDashboard } from '../Components/Panels/PanelDashboard';
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as ScreenPopups from '../../Core/Constants/ScreenPopups'
import { IPreviewInfo } from "../../Core/Interface/IPreviewResult";
import { IColumn } from "../../Core/Interface/IColumn";
import { IUIConfirmation } from "../../Core/Interface/IMessage";
import { PreviewHelper } from "../../Core/Helpers/PreviewHelper";
import { ColumnValueSelector } from "../Components/Selectors/ColumnValueSelector";
import { AdaptableBlotterForm } from "../Components/Forms/AdaptableBlotterForm";
import { IEvent } from "../../Core/Interface/IEvent";
import { IAdaptableBlotter } from "../../Core/Interface/IAdaptableBlotter";
import * as GeneralConstants from '../../Core/Constants/GeneralConstants'
import { IUserFilter } from "../../Core/Api/Interface/AdaptableBlotterObjects";
import { AdaptablePopover } from "../AdaptablePopover";
import { PopoverType, StatusColour } from "../../Core/Enums";
import { PreviewResultsPanel } from "../Components/PreviewResultsPanel";
import { ColumnHelper } from "../../Core/Helpers/ColumnHelper";
import { fail } from "assert";

interface BulkUpdateToolbarControlComponentProps extends ToolbarStrategyViewPopupProps<BulkUpdateToolbarControlComponent> {
    BulkUpdateValue: string;
    IsValidSelection: boolean;
    PreviewInfo: IPreviewInfo;
    onBulkUpdateValueChange: (value: string) => BulkUpdateRedux.BulkUpdateChangeValueAction;
    onBulkUpdateCheckSelectedCells: () => BulkUpdateRedux.BulkUpdateCheckCellSelectionAction;
    onApplyBulkUpdate: () => BulkUpdateRedux.BulkUpdateApplyAction;
    onConfirmWarningCellValidation: (confirmation: IUIConfirmation) => PopupRedux.PopupShowConfirmationAction;
}

interface BulkUpdateToolbarControlComponentState {
    Disabled: boolean
    SubFunc: any
}

class BulkUpdateToolbarControlComponent extends React.Component<BulkUpdateToolbarControlComponentProps, BulkUpdateToolbarControlComponentState> {
    constructor(props: BulkUpdateToolbarControlComponentProps) {
        super(props);
        this.state = {
            Disabled: true,
            SubFunc: (sender: IAdaptableBlotter, event: IAdaptableBlotter) => {
                this.onSelectionChanged()
            }
        }
    }
    public componentDidMount() {
        if (this.props.AdaptableBlotter) {
            this.props.AdaptableBlotter.onSelectedCellsChanged().Subscribe(this.state.SubFunc)
        }
    }

    public componentWillUnmount() {
        if (this.props.AdaptableBlotter) {
            this.props.AdaptableBlotter.onSelectedCellsChanged().Unsubscribe(this.state.SubFunc)
        }
    }


    render() {

        let statusColour: StatusColour = this.getStatusColour()
        // missing datatype validation for time being

        // we dont want to show the panel in the form but will need to appear in a popup....
        let cssClassName: string = this.props.cssClassName + "__bulkupdate";

        let activeButton = this.state.Disabled ?
            <Button style={{ marginRight: "3px" }} onClick={() => this.onDisabledChanged()} bsStyle="default" bsSize="small">Off</Button>
            : <Button style={{ marginRight: "3px" }} onClick={() => this.onDisabledChanged()} bsStyle="primary" bsSize="small">On</Button>

        let selectedColumn = (this.props.PreviewInfo) ?
            ColumnHelper.getColumnFromId(this.props.PreviewInfo.ColumnId, this.props.Columns) :
            null;

        let previewPanel =
            <PreviewResultsPanel
                cssClassName={cssClassName}
                UpdateValue={this.props.BulkUpdateValue}
                PreviewInfo={this.props.PreviewInfo}
                Columns={this.props.Columns}
                UserFilters={this.props.UserFilters}
                SelectedColumn={selectedColumn}
                ShowPanel={true}
                ShowHeader={false}
            />

        let content = <span>
            <div className={this.props.IsReadOnly ? GeneralConstants.READ_ONLY_STYLE : ""}>
                <InputGroup>
                    <InputGroup.Button>
                        {activeButton}
                    </InputGroup.Button>

                    <ColumnValueSelector
                        style={{ width: "120px" }}
                        cssClassName={cssClassName}
                        disabled={!this.props.IsValidSelection}
                        bsSize={"small"}
                        SelectedColumnValue={this.props.BulkUpdateValue}
                        SelectedColumn={selectedColumn}
                        getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                        onColumnValueChange={columns => this.onColumnValueSelectedChanged(columns)}
                    />

                </InputGroup>

                {this.props.IsValidSelection && StringExtensions.IsNotNullOrEmpty(this.props.BulkUpdateValue) &&
                    <ButtonApply cssClassName={cssClassName}
                        style={{ marginLeft: "3px" }}
                        onClick={() => this.onApplyClick()}
                        size={"small"}
                        glyph={"ok"}
                        bsStyle={this.getStyleForApplyButton(statusColour)}
                        overrideTooltip="Apply Bulk Update"
                        overrideDisableButton={StringExtensions.IsNullOrEmpty(this.props.BulkUpdateValue) || (this.props.PreviewInfo != null && this.props.PreviewInfo.PreviewValidationSummary.HasOnlyValidationPrevent)}
                        DisplayMode="Glyph" />
                }

                {this.props.IsValidSelection && StringExtensions.IsNotNullOrEmpty(this.props.BulkUpdateValue) &&
                    <span style={{ marginLeft: "3px" }}>
                        <AdaptablePopover cssClassName={cssClassName} headerText="Preview Results" bodyText={[previewPanel]} popoverType={this.getPopoverType(statusColour)} useButton={true} triggerAction={"click"} />
                    </span>
                }

            </div>
        </span>

        return <PanelDashboard cssClassName={cssClassName} headerText={StrategyNames.BulkUpdateStrategyName} glyphicon={StrategyGlyphs.BulkUpdateGlyph} onClose={() => this.props.onClose(StrategyIds.BulkUpdateStrategyId)} onConfigure={() => this.props.onConfigure(this.props.IsReadOnly)}>
            {content}
        </PanelDashboard>
    }
    private onColumnValueSelectedChanged(selectedColumnValue: any) {
        this.props.onBulkUpdateValueChange(selectedColumnValue);
    }

    private onSelectionChanged(): void {
        if (!this.state.Disabled) {
            this.getSelectedCells();
        }
    }

    private getSelectedCells() {
        this.props.onBulkUpdateValueChange("");
        this.props.onBulkUpdateCheckSelectedCells();
    }

    private getStatusColour(): StatusColour {
        if (StringExtensions.IsNotNullOrEmpty(this.props.BulkUpdateValue) && this.props.PreviewInfo) {
            if (this.props.PreviewInfo.PreviewValidationSummary.HasOnlyValidationPrevent) {
                return StatusColour.Red;
            }
            if (this.props.PreviewInfo.PreviewValidationSummary.HasValidationWarning || this.props.PreviewInfo.PreviewValidationSummary.HasValidationPrevent) {
                return StatusColour.Amber;
            }
        }
        return StatusColour.Green;
    }

    private getStyleForApplyButton(statusColour: StatusColour): string {
        switch (statusColour) {
            case StatusColour.Red:
                return "danger"
            case StatusColour.Amber:
                return "warning";
            case StatusColour.Green:
                return "success";
        }
    }

    private getPopoverType(statusColour: StatusColour): PopoverType {
        switch (statusColour) {
            case StatusColour.Red:
                return PopoverType.Error;
            case StatusColour.Amber:
                return PopoverType.Warning;
            case StatusColour.Green:
                return PopoverType.Info;
        }
    }

    onDisabledChanged() {
        let newDisabledState: boolean = !this.state.Disabled
        if (!newDisabledState) {
            this.props.onBulkUpdateCheckSelectedCells();
        }
        this.setState({ Disabled: newDisabledState });

    }

    private onApplyClick(): void {
        this.props.PreviewInfo.PreviewValidationSummary.HasValidationWarning ?
            this.onConfirmWarningCellValidation() :
            this.onApplyBulkUpdate()
    }

    private onConfirmWarningCellValidation() {
        let confirmation: IUIConfirmation = {
            CancelText: "Cancel Edit",
            ConfirmationTitle: "Cell Validation Failed",
            ConfirmationMsg: "Do you want to continue?",
            ConfirmationText: "Bypass Rule",
            CancelAction: BulkUpdateRedux.BulkUpdateApply(false),
            ConfirmAction: BulkUpdateRedux.BulkUpdateApply(true),
            ShowCommentBox: true
        }
        this.props.onConfirmWarningCellValidation(confirmation)
    }

    onApplyBulkUpdate(): any {
        this.props.onApplyBulkUpdate()
        this.onSelectionChanged()

    }

}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        BulkUpdateValue: state.BulkUpdate.BulkUpdateValue,
        IsValidSelection: state.BulkUpdate.IsValidSelection,
        PreviewInfo: state.BulkUpdate.PreviewInfo,
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onBulkUpdateValueChange: (value: string) => dispatch(BulkUpdateRedux.BulkUpdateChangeValue(value)),
        onBulkUpdateCheckSelectedCells: () => dispatch(BulkUpdateRedux.BulkUpdateCheckCellSelection()),
        onApplyBulkUpdate: () => dispatch(BulkUpdateRedux.BulkUpdateApply(false)),
        onConfirmWarningCellValidation: (confirmation: IUIConfirmation) => dispatch(PopupRedux.PopupShowConfirmation(confirmation)),
        onClose: (dashboardControl: string) => dispatch(DashboardRedux.DashboardSetToolbarVisibility(dashboardControl)),
        onConfigure: (isReadOnly: boolean) => dispatch(PopupRedux.PopupShow(ScreenPopups.BulkUpdatePopup, isReadOnly))
    };
}

export let BulkUpdateToolbarControl = connect(mapStateToProps, mapDispatchToProps)(BulkUpdateToolbarControlComponent);
