import { createInterface } from "readline/promises";
import { cwd, chdir, exit } from "process";
import { tryCatchWrapper } from "../utils/utils.js";
import { files, osModule, hash, zipModule } from "../modules/index.js";

export const startModule = async (workDir) => {
    chdir(workDir);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const inputValues = await rl.question(`You are currently in ${cwd()}\n`);
      const commands = inputValues.split(" ")[0];
      const arg = inputValues.split(" ").splice(1)[0];
      const argTwo = inputValues.split(" ").splice(1)[1];
      const { readFile, addFile, copyFile, moveFile, removeFile, renameFile, listFolder } = files;
      const { osCommands } = osModule;
      const { compress, decompress } = zipModule;
      switch (commands) {
        case ".exit":
        case ".quit":
        case ".q":
          exit();
        case "up":
          await tryCatchWrapper(chdir, '..');
          break;
        case "cd":
          await tryCatchWrapper(chdir, arg);
          break;
        case "ls":
         await  tryCatchWrapper(listFolder);
          break;
        case "cat":
         await tryCatchWrapper(readFile, arg);
          break;
        case "add":
         await tryCatchWrapper(addFile, arg, argTwo);
          break;
        case "rn":
         await tryCatchWrapper(renameFile, arg, argTwo);
          break;
        case "cp":
        await tryCatchWrapper(copyFile, arg, argTwo);
          break;
        case "mv":
          await tryCatchWrapper(moveFile, arg, argTwo);
          break;
        case "rm":
          await tryCatchWrapper(removeFile, arg);
          break;
        case "os":
         await tryCatchWrapper(osCommands, arg);
            break;
            case "hash":
        await tryCatchWrapper(hash, arg);
          break;
          case "compress":
          await  compress(arg, argTwo);
            break;
            case "decompress":
            await  decompress(arg, argTwo);
              break;
              default:
                console.log('Invalid input');
          break;
      }
    }
   };