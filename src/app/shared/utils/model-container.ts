import { Model } from "./model";
import { ModeActionOnModel } from './model-action-on-model';

export class ModelContainer {
    modeAction:ModeActionOnModel;
    modelData:Model|null|undefined;
    especialModeAction:string;

    constructor(modeAction:ModeActionOnModel, modelData?:Model, especialModeAction:string = 'ALL'){
        this.modeAction = modeAction;
        this.modelData = modelData;
        this.especialModeAction = especialModeAction;
    }
}
