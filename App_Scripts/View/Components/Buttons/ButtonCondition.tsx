import * as React from "react";
import { ButtonBase, ButtonProps } from './ButtonBase'

export class ButtonCondition extends React.Component<ButtonProps, {}> {
    render() {
        return <ButtonBase ToolTipAndText="Add Column Condition"
            bsStyle='info'
            bsSize={this.props.size}
            ConfigEntity={this.props.ConfigEntity}
            glyph="plus"
            onClick={() => this.props.onClick()}
            overrideDisableButton={this.props.overrideDisableButton}
            overrideTooltip={this.props.overrideTooltip}
            style={this.props.style}
            DisplayMode={this.props.DisplayMode}
            overrideText={this.props.overrideText}
        />;
    }
}