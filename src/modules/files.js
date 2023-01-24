import { cwd } from "process";
import {
  readdirSync,
  createReadStream,
  appendFile,
  existsSync,
  rename,
  createWriteStream,
  unlink,
  statSync,
} from "fs";
import { utils } from '../modules/index.js';
import { checkFileExistExtension } from "./utils.js";

  export const readFile = (arg) => {
    let chunk = "";
    const rs = createReadStream(arg, { flags: "r" })
      .on("readable", () => {
        while (null !== (chunk = rs.read())) {
          console.log(`${chunk}`);
        }
      })
      .on("error", () => {
        utils.opearationFailedMessage();
      });
  };
  export const addFile = async (src, content = "") => {
   if (checkFileExistExtension(src)) {
      if (!existsSync(src)) {
       utils.createNewFolder(src);
        appendFile(src, content, (err) => {
          if (err) utils.opearationFailedMessage();
          console.log(utils.successMesages.created);
        });
      }
    }
  };
  export const renameFile = async (src, dest) => {
    readdirSync(cwd()).map((el) => {
      if (el === src) {
        if (dest) {
          rename(src, dest);
          console.log(utils.successMesages.renamed);
        } else {
          utils.opearationFailedMessage();;
        }
      }
    });
  };
  export const copyFile = async (src, dest) => {
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      utils.opearationFailedMessage();
    });
    if (dest) {
      if (!existsSync(dest)) {
       utils.createNewFolder(dest);
        const ws = createWriteStream(dest).on("finish", () => {
          console.log(utils.successMesages.copyed);
        });
        rs.pipe(ws);
      } else {
        utils.opearationFailedMessage();
      }
    }
  };
  export const moveFile = async (src, dest) => {
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      opearationFailedMessage();
    });
    if (dest) {
      if (!existsSync(dest)) {
        utils.createNewFolder(dest);
        const ws = createWriteStream(dest).on("finish", () => {
          unlink(src);
          console.log(utils.successMesages.moved);
        });
        rs.pipe(ws);
      }
    } else {
      utils.opearationFailedMessage();
    }
  };
  export const deleteFile = async (src) => {
    unlink(src, (err) => {
      if (err) {
        utils.opearationFailedMessage();
      }
      console.log(utils.successMesages.deleted);
    });
  };