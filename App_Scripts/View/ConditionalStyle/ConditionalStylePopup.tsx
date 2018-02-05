import { IConditionalStyleCondition } from '../../Strategy/Interface/IConditionalStyleStrategy';
import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as ConditionalStyleRedux from '../../Redux/ActionsReducers/ConditionalStyleRedux'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { IColumn, IConfigEntity, IEntityRowInfo } from '../../Core/Interface/IAdaptableBlotter';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as TeamSharingRedux from '../../Redux/ActionsReducers/TeamSharingRedux'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import { Button, Form, Col, Panel, Row, Well } from 'react-bootstrap';
import { ConditionalStyleScope, FontWeight, FontStyle, FontSize } from '../../Core/Enums'
import { ConditionalStyleEntityRow } from './ConditionalStyleEntityRow'
import { AdaptableWizard } from './..//Wizard/AdaptableWizard'
import { ConditionalStyleWizard } from './Wizard/ConditionalStyleWizard'
import { Helper } from '../../Core/Helpers/Helper';
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import { ObjectFactory } from '../../Core/ObjectFactory';
import { PanelWithRow } from '../Components/Panels/PanelWithRow';
import { IUserFilter } from '../../Core/Interface/IExpression'
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { StringExtensions } from '../../Core/Extensions/StringExtensions'
import { EntityItemList } from '../Components/EntityItemList';
import { EditableConfigEntityInternalState } from '../Components/SharedProps/EditableConfigEntityPopupProps';

interface ConditionalStyleConfigProps extends IStrategyViewPopupProps<ConditionalStyleConfigComponent> {
    ConditionalStyles: Array<IConditionalStyleCondition>,
    Columns: IColumn[],
    UserFilters: IUserFilter[],
    PredefinedColorChoices: string[],
    onAddUpdateConditionalStyle: (index: number, condiditionalStyleCondition: IConditionalStyleCondition) => ConditionalStyleRedux.ConditionalStyleAddUpdateAction
    onShare: (entity: IConfigEntity) => TeamSharingRedux.TeamSharingShareAction
}


class ConditionalStyleConfigComponent extends React.Component<ConditionalStyleConfigProps, EditableConfigEntityInternalState> {

    constructor() {
        super();
        this.state = { EditedConfigEntity: null, WizardStartIndex: 0, EditedIndexConfigEntity: -1 }
    }

    componentDidMount() {
        if (StringExtensions.IsNotNullOrEmpty(this.props.PopupParams)) {
            let arrayParams = this.props.PopupParams.split("|")
            if (arrayParams.length == 2 && arrayParams[0] == "New") {
                let _editedConditionalStyle: IConditionalStyleCondition = ObjectFactory.CreateEmptyConditionalStyle();
                _editedConditionalStyle.ColumnId = arrayParams[1]
                _editedConditionalStyle.ConditionalStyleScope = ConditionalStyleScope.Column
                this.setState({ EditedConfigEntity: _editedConditionalStyle, WizardStartIndex: 1 });
            }
        }
    }

    render() {

        let infoBody: any[] = ["Conditional Styles enable columns and rows to be given distinct styles according to user rules.", <br />, <br />,
            "Styles include selection of fore and back colours, and font properties."]

        let entityRowInfo: IEntityRowInfo[] = [
            { Caption: "Where Applied", Width: 3 },
            { Caption: "Style", Width: 2 },
            { Caption: "Description", Width: 4 },
            { Caption: "", Width: 3 },
        ]
        let conditionalStyleConditions = this.props.ConditionalStyles.map((conditionalStyleCondition: IConditionalStyleCondition, index) => {
            return <ConditionalStyleEntityRow
                ConfigEntity={conditionalStyleCondition}
                EntityRowInfo={entityRowInfo}
                key={"CS" + index}
                Index={index}
                onShare={() => this.props.onShare(conditionalStyleCondition)}
                TeamSharingActivated={this.props.TeamSharingActivated}
                UserFilters={this.props.UserFilters}
                Columns={this.props.Columns}
                onEdit={(index, conditionalStyleCondition) => this.onEdit(index, conditionalStyleCondition as IConditionalStyleCondition)}
                onDeleteConfirm={ConditionalStyleRedux.ConditionalStyleDelete(index, conditionalStyleCondition)} />
        });

        let newButton = <ButtonNew onClick={() => this.onNew()}
            overrideTooltip="Create Conditional Style"
            DisplayMode="Glyph+Text"
            size={"small"} />

        return <PanelWithButton headerText={StrategyNames.ConditionalStyleStrategyName} button={newButton} bsStyle="primary" style={panelStyle} glyphicon={StrategyGlyphs.ConditionalStyleGlyph} infoBody={infoBody}>

            {this.props.ConditionalStyles.length == 0 &&
                <Well bsSize="small">Click 'New' to create a new conditional style to be applied at row or column level.</Well>
            }

            {conditionalStyleConditions.length > 0 &&
                <EntityItemList entityRowInfo={entityRowInfo} items={conditionalStyleConditions} />
            }

            {this.state.EditedConfigEntity != null &&
                <ConditionalStyleWizard
                    EditedConditionalStyleCondition={this.state.EditedConfigEntity as IConditionalStyleCondition}
                    PredefinedColorChoices={this.props.PredefinedColorChoices}
                    Columns={this.props.Columns}
                    UserFilters={this.props.UserFilters}
                    getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                    WizardStartIndex={this.state.WizardStartIndex}
                    closeWizard={() => this.onCloseWizard()}
                    onFinishWizard={() => this.onFinishWizard()}
                />
            }
        </PanelWithButton>
    }

    onNew() {
        this.setState({ EditedConfigEntity: ObjectFactory.CreateEmptyConditionalStyle(), WizardStartIndex: 0, EditedIndexConfigEntity: -1 });
    }

    onEdit(index: number, condition: IConditionalStyleCondition) {
        let clonedObject: IConditionalStyleCondition = Helper.cloneObject(condition);
        this.setState({ EditedConfigEntity: clonedObject, WizardStartIndex: 0, EditedIndexConfigEntity: index });
    }

    onCloseWizard() {
        this.props.onClearPopupParams()
        this.setState({ EditedConfigEntity: null, WizardStartIndex: 0, EditedIndexConfigEntity: -1 });
    }

    onFinishWizard() {
        this.props.onAddUpdateConditionalStyle(this.state.EditedIndexConfigEntity, this.state.EditedConfigEntity as IConditionalStyleCondition);
        this.setState({ EditedConfigEntity: null, WizardStartIndex: 0, EditedIndexConfigEntity: -1 });
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        ConditionalStyles: state.ConditionalStyle.ConditionalStyleConditions,
        Columns: state.Grid.Columns,
        UserFilters: state.UserFilter.UserFilters,
        PredefinedColorChoices: state.UIControlConfig.PredefinedColorChoices
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddUpdateConditionalStyle: (index: number, conditionalStyleCondition: IConditionalStyleCondition) => dispatch(ConditionalStyleRedux.ConditionalStyleAddUpdate(index, conditionalStyleCondition)),
        onShare: (entity: IConfigEntity) => dispatch(TeamSharingRedux.TeamSharingShare(entity, StrategyIds.ConditionalStyleStrategyId))
    };
}

export let ConditionalStylePopup = connect(mapStateToProps, mapDispatchToProps)(ConditionalStyleConfigComponent);

let panelStyle = {
    width: '800px'
}

let divStyle: React.CSSProperties = {
    'overflowY': 'auto',
    'maxHeight': '300px'
}