import * as React from "react";
import { ButtonBase, ButtonProps } from './ButtonBase'
import * as StyleConstants from '../../../Core/Constants/StyleConstants';

export class ButtonUndo extends React.Component<ButtonProps, {}> {
    render() {
        return <ButtonBase ToolTipAndText="Undo"
            bsStyle='success'
            bsSize={this.props.size}
            ConfigEntity={this.props.ConfigEntity}
            glyph="share-alt"
            onClick={() => this.props.onClick()}
            overrideDisableButton={this.props.overrideDisableButton}
            overrideTooltip={this.props.overrideTooltip}
            style={this.props.style}
            DisplayMode={this.props.DisplayMode}
            overrideText={this.props.overrideText}
            transformGlyph={true}
            cssClassName={this.props.cssClassName + StyleConstants.UNDO_BUTTON}
        />;
    }
}