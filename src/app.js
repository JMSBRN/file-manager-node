import { createInterface } from "readline/promises";
import { cwd, chdir, exit } from "process";
import {
  readdirSync,
  createReadStream,
  appendFile,
  renameSync,
  access,
  createWriteStream,
  mkdirSync,
  unlinkSync,
  readFileSync,
  existsSync,
} from "fs";
import { basename, extname, join, dirname } from "path";
import os from "os";
import { createHash } from "crypto";
import { createGzip } from "zlib";

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
  async add(arg, content = "") {
    if (arg) {
      appendFile(arg, content, (err) => {
        if (err) throw err;
        console.log("File is created successfully.");
      });
    }
  }
  async rn(oldFilePath, newFilePath) {
    readdirSync(cwd()).map((el) => {
      if (el === oldFilePath) {
        renameSync(oldFilePath, newFilePath);
        console.log("File Renamed.");
      }
    });
  }
  async cp(src, newFolder, dest) {
    const destDir = join(cwd(), newFolder);
    access(destDir, (err) => {
      if (err) {
        mkdirSync(destDir);
      }
      let readStream = createReadStream(join(cwd(), src));
      readStream.once("error", (err) => {
        console.log(err);
      });
      readStream.once("end", () => {
        console.log("copied successfully");
      });
      readStream.pipe(createWriteStream(join(destDir, dest)));
    });
  }
  async mv(src, newFolder, dest) {
    const destDir = join(cwd(), newFolder);
    access(destDir, (err) => {
      if (err) {
        mkdirSync(destDir);
      }
      let readStream = createReadStream(join(cwd(), src));
      readStream.once("error", (err) => {
        console.log(err);
      });
      readStream.on("end", () => {
        console.log("moved successfully");
        unlinkSync(join(cwd(), src));
      });
      readStream.pipe(createWriteStream(join(destDir, dest)));
    });
  }
  async rm(src) {
    unlinkSync(join(cwd(), src));
    console.log("File deleted!");
  }
  async hash(arg) {
    readdirSync(cwd()).map((el) => {
      if (el === arg) {
        const hashSum = createHash("sha256").update(readFileSync(el));
        console.log(hashSum.digest("hex"));
      }
    });
  }
  async compress (src, dest) {
    const gzip = createGzip();
    readdirSync(cwd()).map((el) => {
      if (el === src) {
        const rs = createReadStream(src, {encoding: 'utf-8'}).on('error', (err) => {
          console.log('error rs', err);
        });
        if(!existsSync(dest)){
          mkdirSync(dirname(dest), { recursive: true });
          const ws  = createWriteStream(`${dest}`).on('error', (err) => console.log('err ws', err)).on('finish', () => console.log('compressed successfully'));
          rs.pipe(gzip).pipe(ws)
        }
      }
    })
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
        case "os":
          switch (arg) {
            case "--EOL":
              const input = JSON.stringify(os.EOL);
              console.log(
                "end-of-line marker is :",
                input.substring(1, input.length - 1)
              );
              break;
            case "--cpus":
              const information = [
                {
                  cpus: os.cpus().length,
                  model: os.cpus()[0].model,
                },
              ];
              console.table(information);
              break;
            case "--homedir":
              console.log(os.homedir());
              break;
            case "--username":
              console.log(os.userInfo().username);
              break;
            case "--architecture":
              console.log(os.arch());
              break;
            default:
              break;
          }
          break;
        case "hash":
          await this.hash(arg);
          break;
        case "compress":
         await this.compress(arg, argTwo);
          break;
        default:
          break;
      }
    }
  }
}
