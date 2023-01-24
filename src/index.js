import { App } from './app.js';
import { utils} from './modules/index.js';
import os from 'os';
const { greeting, goodbye } = utils;
const args = process.argv.slice(2);
const arg = args[args.length -1];
const username = arg && arg.replace('--username=', '');

if(arg && arg.includes('--username=')) {
    if(username) {
        greeting(username);
        process.on('exit', () => goodbye(username));
        const app = new App(os.homedir());
        app.start();
    } else {
        console.log('Please try to command : npm run start -- --username=User');
    }
}
