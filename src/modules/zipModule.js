import { parse } from "path";
import { createGzip, createUnzip } from "zlib";
import {
  createReadStream,
  existsSync,
  createWriteStream,
} from "fs";
import { utils } from "../modules/index.js";

export const compress = async (src, dest) => {
    const gzip = createGzip();
    const errorMsg = utils.opearationFailedMessage();
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      errorMsg();
    });
    if (dest) {
      if (!existsSync(dest)) {
        utils.createNewFolder(dest);
        const ws = createWriteStream(dest).on("finish", () =>
          console.log("compressed successfully")
        );
        rs.pipe(gzip).pipe(ws);
      }
    } else {
      errorMsg();
    }
  };
  export const decompress = async (src, dest) => {
    const unZip = createUnzip();
    const errorMsg = utils.opearationFailedMessage();
    if (parse(src).ext === ".gz") {
        const rs = createReadStream(src, { flags: "r" }).on("error", () => {
        errorMsg();
      });
      if (dest) {
        if (!existsSync(dest)) {
          createNewFolder(dest);
          const ws = createWriteStream(dest).on("finish", () => {
            console.log("unziped succeffully");
          });
          rs.pipe(unZip).pipe(ws);
        }
      } else {
        errorMsg();
      }
    }
  };