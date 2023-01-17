import { createInterface } from 'readline/promises';
import { cwd, chdir } from 'process';

export class App {
    constructor (startDir) {
        this._curentPath = startDir; 
    }
    async up () {
      try {
        chdir('..');
      } catch (err) {
        console.error(`Operation failed: ${err}`);
      }
    }
    async cd (arg) {
      if (arg) {
        try {
          chdir(arg);
        } catch (err) {
          console.error(`Operation failed ${err}`);
        }
      } else {
        console.log(`Invalid input`); 
      }
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
             const arg = inputValues.split(' ').splice(1)[0];
               switch (commands) {
                  case '.exit':
                  case '.quit':
                  case '.q':
                      process.exit();
                      break;
                      case 'up':
                      await this.up();
                      break;
                      case'cd': 
                       await this.cd(arg);
                      break;
                  default:
                      break;
          }
             }
           
    }

}