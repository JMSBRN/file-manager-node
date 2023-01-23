import { parse } from "path";
import { cwd } from "process";
import os from "os";
import { createHash } from "crypto";
import { createGzip, createUnzip } from "zlib";
import {
  readdirSync,
  createReadStream,
  appendFile,
  existsSync,
  renameSync,
  createWriteStream,
  unlinkSync,
  unlink,
  readFileSync,
} from "fs";
import { cretateNewFolder, noElementMessage, opearationFailedMessage } from "./utils.js";

export const ls = async () => {
  const content = readdirSync(cwd(), { withFileTypes: true }).map((el) => {
    return {
      name: `${el.name}`,
      type: el.isFile() ? "file" : "directory",
    };
  });
  console.table(content);
};
export const cat = (arg) => {
  let chunk = "";
  const rs = createReadStream(arg, { flags: "r" })
    .on("readable", () => {
      while (null !== (chunk = rs.read())) {
        console.log(`${chunk}`);
      }
    })
    .on("error", () => {
      noElementMessage();
    });
};
export const add = async (src, content = "") => {
  if (!existsSync(src)) {
   cretateNewFolder(src);
    appendFile(src, content, (err) => {
      if (err) throw err;
      console.log("File is created successfully.");
    });
  }
};
export const rn = async (src, dest) => {
  readdirSync(cwd()).map((el) => {
    if (el === src) {
      if (dest) {
        renameSync(src, dest);
        console.log("File Renamed successfully");
      } else {
        opearationFailedMessage();;
      }
    }
  });
};
export const cp = async (src, dest) => {
  const rs = createReadStream(src, { flags: "r" }).on("error", () => {
    noElementMessage();
  });
  if (dest) {
    if (!existsSync(dest)) {
     cretateNewFolder(dest);
      const ws = createWriteStream(dest).on("finish", () => {
        console.log("copied successfully");
      });
      rs.pipe(ws);
    } else {
      opearationFailedMessage();;
    }
  }
};
export const mv = async (src, dest) => {
  const rs = createReadStream(src, { flags: "r" }).on("error", () => {
    noElementMessage();
  });
  if (dest) {
    if (!existsSync(dest)) {
      cretateNewFolder(dest);
      const ws = createWriteStream(dest).on("finish", () => {
        unlinkSync(src);
        console.log("moved successfully");
      });
      rs.pipe(ws);
    }
  } else {
    opearationFailedMessage();;
  }
};
export const rm = async (src) => {
  unlink(src, (err) => {
    if (err) {
      noElementMessage();
    }
    console.log("file deleted successfully");
  });
};
export const osCommands = async (arg) => {
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
      console.log("Invalid input");
      break;
  }
};
export const hash = async (src) => {
  createReadStream(src, { flags: "r" })
    .on("error", () => {
      noElementMessage();
    })
    .once("readable", () => {
      const hashSum = createHash("sha256").update(readFileSync(src));
      console.log(hashSum.digest("hex"));
    });
};
export const compress = async (src, dest) => {
  const gzip = createGzip();
  const rs = createReadStream(src, { flags: "r" }).on("error", () => {
    noElementMessage();
  });
  if (dest) {
    if (!existsSync(dest)) {
      cretateNewFolder(dest);
      const ws = createWriteStream(dest).on("finish", () =>
        console.log("compressed successfully")
      );
      rs.pipe(gzip).pipe(ws);
    }
  } else {
    opearationFailedMessage();
  }
};
export const decompress = async (src, dest) => {
  const unZip = createUnzip();
  if (parse(src).ext === ".gz") {
      const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      noElementMessage();
    });
    if (dest) {
      if (!existsSync(dest)) {
        cretateNewFolder(dest);
        const ws = createWriteStream(`${dest}`).on("finish", () => {
          console.log("unziped succeffully");
        });
        rs.pipe(unZip).pipe(ws);
      }
    } else {
      opearationFailedMessage();
    }
  }
};