import { toCapitalizeText } from "./utils/utils.js";

const args = process.argv.slice(2);
const arg = args[args.length -1];
const username = arg.replace('--username=', '');
console.log(`Welcome to the File Manager, ${toCapitalizeText(username)} !`);
