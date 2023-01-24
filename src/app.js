import { startModule } from "./modules/index.js";

export class App {
  constructor(startDir) {
    this._curentPath = startDir;
  }
  async start() {
   startModule(this._curentPath);
  }
};
