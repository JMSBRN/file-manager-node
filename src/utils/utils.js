import { mkdirSync} from 'fs';
import { dirname, parse } from 'path';

export const toCapitalizeText = (text) => {
  return text.toLowerCase().charAt(0).toUpperCase()+(text.slice(1).toLowerCase());
};
export const greeting  = (username) => console.log(`Welcome to the File Manager, ${toCapitalizeText(username)} !`);
export const goodbye  = (username) => console.log(`Thank you for using File Manager, ${toCapitalizeText(username)} goodbye!`);
export const noElementMessage = () => console.log("no element in this folder plese try ls function");
export const tryCatchWrapper = async (fn, arg, argTwo=null) => {
      try {
        if (argTwo) {
          return await fn(arg, argTwo);
        }
        return await fn(arg);
      } catch(e) {
        console.log('Operation failed');
    }
};
export const cretateNewFolder = (dest) => {
  !!Object.values(parse(dest))[1] &&
  mkdirSync(dirname(dest), { recursive: true });
};
export const opearationFailedMessage = () => {
  console.log('Operation failed');
};
