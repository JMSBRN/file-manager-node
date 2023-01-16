import { completer } from "./utils/utils.js";
import { createInterface } from 'readline/promises';
import { cwd, chdir } from 'process';
import os from 'os';



export class App {
    constructor (startDir) {
        this._curentPath = startDir; 
    }
    
  
    start() {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
          });
          process.chdir(this._curentPath);
          rl.on('line', (line) => {
            console.log(`You are currently in ${process.cwd()}\n`);
           const [complection, lineIn]  = completer(line);
           if (lineIn) {
             switch (lineIn) {
                case '.exit':
                case '.quit':
                case '.q':
                    process.exit();
                    break;
                    case 'up':
                        try {
                          chdir('..');
                        } catch (err) {
                          console.error(`chdir: ${err}`);
                        }
                    break;
                default:
                    console.log('Invalid input');
                    break;
             }
           };
          });
          
    }

}