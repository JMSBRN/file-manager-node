import { currentFolderMessage } from "./utils/utils.js";


export class App {
    constructor (startDir) {
        this._curentPath = startDir; 
    }


    start() {
        currentFolderMessage(this._curentPath);
    }

}