import { completer } from "./utils/utils.js";
import { createInterface } from 'readline/promises';
import { cwd, chdir } from 'process';

export class App {
    constructor (startDir) {
        this._curentPath = startDir; 
    }

   async start() {
        chdir(this._curentPath);
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
          });

          while (true) {
            const inputValues = await rl.question(`You are currently in ${cwd()}\n`);
             const commands = inputValues.split(' ')[0];
               switch (commands) {
                  case '.exit':
                  case '.quit':
                  case '.q':
                      process.exit();
                      break;
                      case 'up':
                          try {
                            chdir('..');
                          } catch (err) {
                            console.error(`Operation failed: ${err}`);
                          }
                      break;
                  default:
                      break;
          }
             }
           
        
          
    }

}