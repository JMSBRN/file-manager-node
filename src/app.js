import { completer, currentFolderMessage } from "./utils/utils.js";
import { createInterface } from 'readline/promises';


export class App {
    constructor (startDir) {
        this._curentPath = startDir; 
    }
    
  
    start() {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
          });
          currentFolderMessage(this._curentPath)
          rl.on('line', (line) => {
           const [complection, lineIn]  = completer(line);
           if (complection.includes(lineIn)) {
             switch (lineIn) {
                case '.exit':
                case '.quit':
                case '.q':
                    process.exit();
                    break;
                    case '.help':
                        console.log('HELP');
                default:
                    break;
             }
           };
          });
          
    }

}