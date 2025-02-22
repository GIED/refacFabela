import { Model } from "./model";
import { ModeActionOnModel } from "./model-action-on-model";

export class ModelContainerData2 {
    modeAction: ModeActionOnModel;
    modelData1: Model | null | undefined;
    modelData2: Model | null | undefined;
    especialModeAction: string;

    constructor(modeAction: ModeActionOnModel, modelData1?: Model, modelData2?: Model, especialModeAction: string = 'ALL') {
        this.modeAction = modeAction;
        this.modelData1 = modelData1;
        this.modelData2 = modelData2;
        this.especialModeAction = especialModeAction;
    }
}