import { IColumn } from '../../../Core/Interface/IColumn';
import { AdaptableWizardStep, AdaptableWizardStepProps, ExpressionWizardProps } from './../../Wizard/Interface/IAdaptableWizard'
import { ExpressionBuilderPage } from './../../ExpressionBuilder/ExpressionBuilderPage'
import { DistinctCriteriaPairValue, ReportColumnScope, QueryTab } from '../../../Core/Enums'
import { IRawValueDisplayValuePair } from '../../UIInterfaces';
import { IReport } from '../../../Core/Api/Interface/AdaptableBlotterObjects';

export class ReportExpressionWizard extends ExpressionBuilderPage implements AdaptableWizardStep {
    constructor(private props2: ExpressionWizardProps<IReport>) {
        super(props2)
        this.state = {
            Expression: props2.Data.Expression,
            SelectedColumnId:  "", // what is this????,
            SelectedTab: QueryTab.ColumnValue
        }
    }

    public Next(): void {
        this.props2.Data.Expression = this.state.Expression
    }
    public Back(): void { 
        //todo
    }

    public GetIndexStepDecrement(){
        return (this.props2.Data.ReportColumnScope== ReportColumnScope.BespokeColumns)? 1: 2;
    }
    public StepName = this.props.StepName
}