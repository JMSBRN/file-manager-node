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
import { join, dirname, parse, basename } from "path";
import os from "os";
import { createHash } from "crypto";
import { createGzip, createUnzip } from "zlib";
import { tryCatchWrapper } from "./utils/utils.js";
import { add, cat, ls, rn } from "./utils/helpers.js";

export class App {
  constructor(startDir) {
    this._curentPath = startDir;
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
  async compress(src, dest) {
    const gzip = createGzip();
    readdirSync(cwd()).map((el) => {
      if (el === src) {
        const rs = createReadStream(src, { encoding: "utf-8" }).on(
          "error",
          (err) => {
            console.log("error rs", err);
          }
        );
        if (!existsSync(dest)) {
          !!Object.values(parse(dest))[1] &&
            mkdirSync(dirname(dest), { recursive: true });
          const ws = createWriteStream(`${dest}`)
            .on("error", (err) => console.log("err ws", err))
            .on("finish", () => console.log("compressed successfully"));
          rs.pipe(gzip).pipe(ws);
        }
      }
    });
  }
  async decompress (src, dest) {
    const unZip = createUnzip();
    readdirSync(cwd()).map((el) => {
      if (el === src) {
        if (parse(src).ext === ".gz") {
          const rs = createReadStream(basename(src)).on(
            "error",
            (err) => {
              console.log(err);
            }
          );
          if (!existsSync(dest)) {
            !!Object.values(parse(dest))[1] &&
              mkdirSync(dirname(argTwo), { recursive: true });
            const ws = createWriteStream(`${dest}`)
              .on("error", (err) => console.log("err ws", err))
              .on("finish", () => {
                console.log("unziped succeffully");
              });
            rs.pipe(unZip).pipe(ws);
          }
        }
      }
    });
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
              console.log('Invalid input');
              break;
            }
            break;
            case "hash":
              await this.hash(arg);
          break;
          case "compress":
            await this.compress(arg, argTwo);
            break;
            case "decompress":
              await this.decompress(arg, argTwo);
              break;
              default:
                console.log('Invalid input');
          break;
      }
    }
  }
}
