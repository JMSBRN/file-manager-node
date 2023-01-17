import { createInterface } from "readline/promises";
import { cwd, chdir, exit } from "process";
import { readdirSync, createReadStream, appendFile, renameSync, access, createWriteStream, mkdirSync, unlinkSync } from "fs";
import { join } from "path";


export class App {
  constructor(startDir) {
    this._curentPath = startDir;
  }
  async up() {
    try {
      chdir("..");
    } catch (err) {
      console.error(`Operation failed: ${err}`);
    }
  }
  async cd(arg) {
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
  async ls() {
    const content = readdirSync(cwd(), { withFileTypes: true }).map((el) => {
      return {
        name: `${el.name}`,
        type: el.isFile() ? "file" : "directory",
      };
    });
    console.table(content);
  }
  async cat(arg) {
    readdirSync(cwd(), { encoding: "utf-8" }).map((el) => {
      if (el === arg) {
        const rr = createReadStream(arg);
        let chunk = "";
        rr.on("readable", () => {
          while (null !== (chunk = rr.read())) {
            console.log(`${chunk}`);
          }
        });
      }
    });
  }
  async add (arg, content= '') {
    if(arg) {
      appendFile( arg, content,  (err) => {
        if (err) throw err;
        console.log('File is created successfully.');
      });
    }
  }
  async rn (oldFilePath, newFilePath) {
    readdirSync(cwd()).map((el) => {
      if (el === oldFilePath) {
       renameSync(oldFilePath, newFilePath);
        console.log('File Renamed.');
      }
    });
  }
   async cp (src, newFolder, dest) {
    const destDir = join(cwd(), newFolder);
    access(destDir, (err) => {
      if(err) {
        mkdirSync(destDir);
      }
      let readStream = createReadStream(join(cwd(), src));
      readStream.once('error', (err) => {
        console.log(err);
      });
      readStream.once('end', () => {
        console.log('copied successfully');
      });
      readStream.pipe(createWriteStream(join(destDir, dest)));
    });
   }
   async mv (src, newFolder, dest) {
    const destDir = join(cwd(), newFolder);
    access(destDir, (err) => {
      if(err) {
        mkdirSync(destDir);
      }
      let readStream = createReadStream(join(cwd(), src));
      readStream.once('error', (err) => {
        console.log(err);
      });
      readStream.on('end', () => {
        console.log('moved successfully');
        unlinkSync(join(cwd(), src));
      });
      readStream.pipe(createWriteStream(join(destDir, dest)));
    });
   }
    async rm (src) {
      unlinkSync(join(cwd(), src));
      console.log('File deleted!');
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
      const argThree = inputValues.split(" ").splice(1)[2];
      switch (commands) {
        case ".exit":
        case ".quit":
        case ".q":
          exit();
          break;
        case "up":
          await this.up();
          break;
        case "cd":
          await this.cd(arg);
          break;
        case "ls":
          await this.ls();
          break;
        case "cat":
          await this.cat(arg);
          break;
        case "add":
         await this.add(arg, argTwo);
          break;
        case "rn":
        await this.rn(arg, argTwo);
          break;
        case "cp":
          await this.cp(arg, argTwo, argThree);
          break;
        case "mv":
          await this.mv(arg, argTwo, argThree);
          break;
        case "rm":
          await this.rm(arg);
          break;
        default:
          break;
      }
    }
  }
}
