import * as React from "react";
import { ControlLabel, FormGroup, FormControl, Button, Form, Col, Panel, ListGroup, Row, ButtonGroup, Jumbotron, ListGroupItem, Checkbox, Radio, HelpBlock } from 'react-bootstrap';
import { IColumn } from '../../../Core/Interface/IAdaptableBlotter';
import { AdaptableWizardStep, AdaptableWizardStepProps } from '../../Wizard/Interface/IAdaptableWizard'
import { IConditionalStyleCondition } from '../../../Strategy/Interface/IConditionalStyleStrategy';
import { IStyle } from '../../../Core/Interface/IStyle';
import { ConditionalStyleScope, FontWeight, FontStyle, FontSize, PopoverType } from '../../../Core/Enums';
import { EnumExtensions } from '../../../Core/Extensions/EnumExtensions';
import { Expression } from '../../../Core/Expression';
import { ExpressionHelper } from '../../../Core/Helpers/ExpressionHelper';
import { ColorPicker } from '../../ColorPicker';
import { Helper } from '../../../Core/Helpers/Helper'
import { AdaptableBlotterForm } from '../../AdaptableBlotterForm'
import { AdaptablePopover } from '../../AdaptablePopover';
import { StyleComponent } from '../../Components/StyleComponent';


export interface ConditionalStyleSettingsWizardProps extends AdaptableWizardStepProps<IConditionalStyleCondition> {
    PredefinedColorChoices: string[]
}

export interface ConditionalStyleSettingsWizardState {
    BackColor: string,
    ForeColor: string,
    FontWeight: FontWeight,
    FontStyle: FontStyle,
    FontSize: FontSize,
}

export class ConditionalStyleSettingsWizard extends React.Component<ConditionalStyleSettingsWizardProps, ConditionalStyleSettingsWizardState> implements AdaptableWizardStep {

    constructor(props: ConditionalStyleSettingsWizardProps) {
        super(props)
        this.mapStyle(this.props.Data.Style)
    }

    render() {
        return <div>
             <StyleComponent
                 PredefinedColorChoices={this.props.PredefinedColorChoices}
                 Style={this.props.Data.Style}
                 UpdateStyle={(style: IStyle) => this.onUpdateStyle(style)}
             />
         </div>
     
    }
    private onUpdateStyle(style: IStyle) {
        this.mapStyle(style);
        this.props.UpdateGoBackState();
    }

    private mapStyle(style: IStyle): void {
        this.state = {
            BackColor: style.BackColor,
            ForeColor: style.ForeColor,
            FontWeight: style.FontWeight,
            FontStyle: style.FontStyle,
            FontSize: style.FontSize,
        }
    }
    public canNext(): boolean {
        return this.state.BackColor != null || this.state.ForeColor != null || this.state.FontWeight != FontWeight.Normal || this.state.FontStyle != FontStyle.Normal || this.state.FontSize != null;
    }
    public canBack(): boolean { return true; }
    public Next(): void {
        this.props.Data.Style.BackColor = this.state.BackColor;
        this.props.Data.Style.ForeColor = this.state.ForeColor;
        this.props.Data.Style.FontWeight = this.state.FontWeight;
        this.props.Data.Style.FontStyle = this.state.FontStyle;
        this.props.Data.Style.FontSize = this.state.FontSize;
    }
    public Back(): void { }
    public StepName = this.props.StepName
}


