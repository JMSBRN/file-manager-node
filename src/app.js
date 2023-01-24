import { startModule } from "./modules/startModule.js";

export class App {
  constructor(startDir) {
    this._curentPath = startDir;
  }

  async start() {
   startModule(this._curentPath);
  }
}
