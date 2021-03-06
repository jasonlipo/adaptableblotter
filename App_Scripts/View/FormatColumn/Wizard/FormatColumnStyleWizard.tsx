import * as React from "react";
import { AdaptableWizardStep, AdaptableWizardStepProps } from './../../Wizard/Interface/IAdaptableWizard'
import { FontWeight, FontStyle, FontSize } from '../../../Core/Enums';
import { StyleComponent } from '../../Components/StyleComponent';
import { StringExtensions } from "../../../Core/Extensions/StringExtensions";
import { UIHelper } from "../../UIHelper";
import { IFormatColumn, IStyle } from "../../../Core/Api/Interface/AdaptableBlotterObjects";

export interface FormatColumnStyleWizardProps extends AdaptableWizardStepProps<IFormatColumn> {
    ColorPalette: string[]
    StyleClassNames: string[]
}

export interface FormatColumnStyleWizardState {
    Style: IStyle,
}

export class FormatColumnStyleWizard extends React.Component<FormatColumnStyleWizardProps, FormatColumnStyleWizardState> implements AdaptableWizardStep {

    constructor(props: FormatColumnStyleWizardProps) {
        super(props)
        this.state = { Style: this.props.Data.Style }
    }

    render() {

        let canUseClassName = true; // get from somewhere...
        let cssClassName: string = this.props.cssClassName + "-style"
       
        return <div className={cssClassName}>
        <StyleComponent
              cssClassName={cssClassName}
                ColorPalette={this.props.ColorPalette}
                StyleClassNames={this.props.StyleClassNames}
                Style={this.props.Data.Style}
                UpdateStyle={(style: IStyle) => this.onUpdateStyle(style)}
                CanUseClassName={canUseClassName}
            />
        </div>
    }


    public canNext(): boolean {
        return UIHelper.IsNotEmptyStyle(this.state.Style);
    }
    public canBack(): boolean { return true; }
    public Next(): void {
        this.props.Data.Style = this.state.Style;
    }
    public Back(): void { 
        // todo
    }

    public GetIndexStepIncrement(){
        return 1;
    }
    public GetIndexStepDecrement(){
        return 1;
    }

    private onUpdateStyle(style: IStyle) {
        this.setState({ Style: style } as FormatColumnStyleWizardState, () => this.props.UpdateGoBackState())
    }



    public StepName = this.props.StepName

}


