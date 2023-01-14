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
          rl.on('line', (line) => {
           currentFolderMessage(this._curentPath)
           const [complection, lineIn]  = completer(line);
           if (lineIn) {
             switch (lineIn) {
                case '.exit':
                case '.quit':
                case '.q':
                    process.exit();
                    break;
                    case '.help':
                        console.log('HELP');
                default:
                    console.log('Invalid input');
                    break;
             }
           };
          });
          
    }

}