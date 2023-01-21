import { createInterface } from "readline/promises";
import { cwd, chdir, exit } from "process";
import { tryCatchWrapper } from "./utils/utils.js";
import { add, cat, compress, cp, decompress, hash, ls, mv, osCommands, rm, rn } from "./utils/helpers.js";

export class App {
  constructor(startDir) {
    this._curentPath = startDir;
  }

  async start() {
    chdir(this._curentPath);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const inputValues = await rl.question(`You are currently in ${cwd()}\n`);
      const commands = inputValues.split(" ")[0];
      const arg = inputValues.split(" ").splice(1)[0];
      const argTwo = inputValues.split(" ").splice(1)[1];
      switch (commands) {
        case ".exit":
        case ".quit":
        case ".q":
          exit();
        case "up":
          tryCatchWrapper(chdir, '..');
          break;
        case "cd":
          tryCatchWrapper(chdir, arg);
          break;
        case "ls":
          tryCatchWrapper(ls);
          break;
        case "cat":
          tryCatchWrapper(cat, arg);
          break;
        case "add":
          tryCatchWrapper(add, arg, argTwo);
          break;
        case "rn":
          tryCatchWrapper(rn, arg, argTwo);
          break;
        case "cp":
          tryCatchWrapper(cp, arg, argTwo);
          break;
        case "mv":
          tryCatchWrapper(mv, arg, argTwo);
          break;
        case "rm":
          tryCatchWrapper(rm, arg);
          break;
        case "os":
         tryCatchWrapper(osCommands, arg);
            break;
            case "hash":
         tryCatchWrapper(hash, arg);
          break;
          case "compress":
            compress(arg, argTwo);
            break;
            case "decompress":
              decompress(arg, argTwo);
              break;
              default:
                console.log('Invalid input');
          break;
      }
    }
  }
}
