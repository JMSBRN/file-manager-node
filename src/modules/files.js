import {
    readdirSync,
    createReadStream,
    appendFile,
    existsSync,
    rename,
    createWriteStream,
    unlink,
  } from "fs";
  import { cwd } from "process";
import { cretateNewFolder, opearationFailedMessage } from "../utils/utils.js";

export const listFolder = async () => {
    const content = readdirSync(cwd(), { withFileTypes: true }).map((el) => {
      return {
        name: `${el.name}`,
        type: el.isFile() ? "file" : "directory",
      };
    });
    console.table(content);
  };
  export const readFile = (arg) => {
    let chunk = "";
    const rs = createReadStream(arg, { flags: "r" })
      .on("readable", () => {
        while (null !== (chunk = rs.read())) {
          console.log(`${chunk}`);
        }
      })
      .on("error", () => {
        opearationFailedMessage();
      });
  };
  export const addFile = async (src, content = "") => {
    if (!existsSync(src)) {
     cretateNewFolder(src);
      appendFile(src, content, (err) => {
        if (err) throw err;
        console.log("File is created successfully.");
      });
    }
  };
  export const renameFile = async (src, dest) => {
    readdirSync(cwd()).map((el) => {
      if (el === src) {
        if (dest) {
          rename(src, dest);
          console.log("File Renamed successfully");
        } else {
          opearationFailedMessage();;
        }
      }
    });
  };
  export const copyFile = async (src, dest) => {
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      opearationFailedMessage();
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
  export const moveFile = async (src, dest) => {
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      opearationFailedMessage();
    });
    if (dest) {
      if (!existsSync(dest)) {
        cretateNewFolder(dest);
        const ws = createWriteStream(dest).on("finish", () => {
          unlink(src);
          console.log("moved successfully");
        });
        rs.pipe(ws);
      }
    } else {
      opearationFailedMessage();
    }
  };
  export const removeFile = async (src) => {
    unlink(src, (err) => {
      if (err) {
        opearationFailedMessage();
      }
      console.log("file deleted successfully");
    });
  };