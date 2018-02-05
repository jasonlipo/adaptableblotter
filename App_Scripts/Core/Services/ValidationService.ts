
import { IDataChangedEvent, IDataChangingEvent, IDataChangedInfo } from './Interface/IAuditService';
import { IValidationService } from './Interface/IValidationService';
import { IEvent } from '../Interface/IEvent';
import { IAdaptableBlotter, IColumn } from '../Interface/IAdaptableBlotter';
import { EventDispatcher } from '../EventDispatcher'
import { DataType, CellValidationMode, LeafExpressionOperator, SortOrder } from '../Enums';
import { CellValidationState } from '../../Redux/ActionsReducers/Interface/IState';
import { IRangeExpression, IRangeEvaluation } from '../Interface/IExpression';
import { ExpressionHelper } from '../Helpers/ExpressionHelper'
import { Helper } from '../Helpers/Helper'
import { ICellValidationRule } from '../../Strategy/Interface/ICellValidationStrategy';
import * as StrategyIds from '../Constants/StrategyIds'
import { StringExtensions } from '../../Core/Extensions/StringExtensions';
import { CellValidationGlyph } from '../Constants/StrategyGlyphs';


export class ValidationService implements IValidationService {

    constructor(private blotter: IAdaptableBlotter) {
    }

    // Not sure where to put this: was in the strategy but might be better here until I can work out a way of having an event with a callback...
    public ValidateCellChanging(dataChangedEvent: IDataChangingEvent): ICellValidationRule[] {
        let editingRules = this.GetCellValidationState().CellValidations.filter(v => v.ColumnId == dataChangedEvent.ColumnId);
        let failedWarningRules: ICellValidationRule[] = [];
        if (editingRules.length > 0) {
            let columns: IColumn[] = this.blotter.AdaptableBlotterStore.TheStore.getState().Grid.Columns;

            // first check the rules which have expressions
            let expressionRules: ICellValidationRule[] = editingRules.filter(r => r.HasExpression);

            if (expressionRules.length > 0) {

                // loop through all rules with an expression (checking the prevent rules first)
                // if the expression is satisfied check if validation rule passes; if it fails then return immediately (if its prevent) or put the rule in return array (if its warning).
                // if expression isnt satisfied then we can ignore the rule but it means that we need subsequently to check all the rules with no expressions
                for (let expressionRule of expressionRules) {
                    let isSatisfiedExpression: boolean = ExpressionHelper.checkForExpression(expressionRule.OtherExpression, dataChangedEvent.IdentifierValue, columns, this.blotter);
                    if (isSatisfiedExpression && this.IsCellValidationRuleBroken(expressionRule, dataChangedEvent, columns)) {
                        // if we fail then get out if its prevent and keep the rule and stop looping if its warning...
                        if (expressionRule.CellValidationMode == CellValidationMode.StopEdit) {
                            this.blotter.AuditLogService.AddAdaptableBlotterFunctionLog(StrategyIds.CellValidationStrategyId,
                                "CheckCellChanging",
                                "Failed",
                                { failedRules: [expressionRule], DataChangingEvent: dataChangedEvent })
                            return [expressionRule];
                        } else {
                            failedWarningRules.push(expressionRule);
                        }
                    }
                }
            }

            // now check the rules without expressions
            let noExpressionRules: ICellValidationRule[] = editingRules.filter(r => !r.HasExpression);
            for (let noExpressionRule of noExpressionRules) {
                if (this.IsCellValidationRuleBroken(noExpressionRule, dataChangedEvent, columns)) {
                    if (noExpressionRule.CellValidationMode == CellValidationMode.StopEdit) {
                        this.blotter.AuditLogService.AddAdaptableBlotterFunctionLog(StrategyIds.CellValidationStrategyId,
                            "CheckCellChanging",
                            "Failed",
                            { failedRules: [noExpressionRule], DataChangingEvent: dataChangedEvent })
                        return [noExpressionRule];
                    } else {
                        failedWarningRules.push(noExpressionRule);
                    }

                }
            }
        }
        if (failedWarningRules.length > 0) {
            this.blotter.AuditLogService.AddAdaptableBlotterFunctionLog(StrategyIds.CellValidationStrategyId,
                "CheckCellChanging",
                "Warning",
                { failedRules: failedWarningRules, DataChangingEvent: dataChangedEvent })
        }
        else {
            this.blotter.AuditLogService.AddAdaptableBlotterFunctionLog(StrategyIds.CellValidationStrategyId,
                "CheckCellChanging",
                "Ok",
                { DataChangingEvent: dataChangedEvent })
        }
        return failedWarningRules;
    }

    // changing this so that it now checks the opposite!
    private IsCellValidationRuleBroken(cellValidationRule: ICellValidationRule, dataChangedEvent: IDataChangingEvent, columns: IColumn[]): boolean {
        // if its none then validation fails immediately
        if (cellValidationRule.RangeExpression.Operator == LeafExpressionOperator.None) {
            return true;
        }
        let rangeEvaluation: IRangeEvaluation = ExpressionHelper.GetRangeEvaluation(cellValidationRule.RangeExpression, dataChangedEvent.NewValue, columns.find(c => c.ColumnId == dataChangedEvent.ColumnId))
        return ExpressionHelper.TestRangeEvaluation(rangeEvaluation, cellValidationRule.RangeExpression.Operator, this.blotter.AuditService.getExistingDataValue(dataChangedEvent))
    }

    private GetCellValidationState(): CellValidationState {
        return this.blotter.AdaptableBlotterStore.TheStore.getState().CellValidation;
    }


}
