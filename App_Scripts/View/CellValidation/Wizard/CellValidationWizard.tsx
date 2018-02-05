import { ICellValidationRule } from '../../../Strategy/Interface/ICellValidationStrategy';
import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Button, Form, Col, Panel, ListGroup, Row, Well } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../../Redux/Store/Interface/IAdaptableStore'
import * as CellValidationRedux from '../../../Redux/ActionsReducers/CellValidationRedux'
import * as PopupRedux from '../../../Redux/ActionsReducers/PopupRedux'
import { IStrategyViewPopupProps } from '../../../Core/Interface/IStrategyView'
import { IColumn } from '../../../Core/Interface/IAdaptableBlotter';
import { Helper } from '../../../Core/Helpers/Helper';
import { ObjectFactory } from '../../../Core/ObjectFactory';
import { AdaptableWizard } from './../../Wizard/AdaptableWizard'
import { CellValidationActionWizard } from './CellValidationActionWizard'
import { CellValidationSelectColumnWizard } from './CellValidationSelectColumnWizard'
import { CellValidationExpressionWizard } from './CellValidationExpressionWizard'
import { CellValidationRulesWizard } from './CellValidationRulesWizard'
import { CellValidationSelectQueryWizard } from './CellValidationSelectQueryWizard'
import { PanelWithButton } from '../../Components/Panels/PanelWithButton';
import { PanelWithRow } from '../../Components/Panels/PanelWithRow';
import { ButtonNew } from '../../Components/Buttons/ButtonNew';
import { StringExtensions } from '../../../Core/Extensions/StringExtensions'
import { DistinctCriteriaPairValue } from '../../../Core/Enums'
import { IRawValueDisplayValuePair } from '../../../Core/Interface/IAdaptableBlotter';
import { IUserFilter } from '../../../Core/Interface/IExpression'
import * as StrategyNames from '../../../Core/Constants/StrategyNames'

export interface CellValidationWizardProps extends React.ClassAttributes<CellValidationWizard> {
    EditedCellValidation: ICellValidationRule
    Columns: Array<IColumn>
    UserFilters: IUserFilter[],
    WizardStartIndex: number
    getColumnValueDisplayValuePairDistinctList: (columnId: string, distinctCriteria: DistinctCriteriaPairValue) => Array<IRawValueDisplayValuePair>
    closeWizard: () => void
    onFinishWizard: () => void
}

export class CellValidationWizard extends React.Component<CellValidationWizardProps, {}> {

    render() {
        let stepNames: string[] = ["Select Column", "Choose Action", "Create Rules", "Add Query", "Build Query"]
        return <AdaptableWizard
            FriendlyName={StrategyNames.CellValidationStrategyName}
            StepNames={stepNames}
            Steps={[
                <CellValidationSelectColumnWizard StepName={stepNames[0]} Columns={this.props.Columns} />,
                <CellValidationActionWizard StepName={stepNames[1]} Columns={this.props.Columns} />,
                <CellValidationRulesWizard StepName={stepNames[2]} Columns={this.props.Columns} />,
                <CellValidationSelectQueryWizard StepName={stepNames[3]} Columns={this.props.Columns} />,
                <CellValidationExpressionWizard StepName={stepNames[4]} ColumnList={this.props.Columns}
                    UserFilters={this.props.UserFilters}
                    SelectedColumnId={null}
                    getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList} />,
            ]}
            Data={this.props.EditedCellValidation}
            StepStartIndex={this.props.WizardStartIndex}
            onHide={() => this.props.closeWizard()}
            onFinish={() => this.props.onFinishWizard()} ></AdaptableWizard>
    }

}

