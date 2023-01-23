import { parse } from "path";
import { createGzip, createUnzip } from "zlib";
import {
  createReadStream,
  existsSync,
  createWriteStream,
} from "fs";
import { cretateNewFolder, opearationFailedMessage } from "../utils/utils.js";

export const compress = async (src, dest) => {
    const gzip = createGzip();
    const rs = createReadStream(src, { flags: "r" }).on("error", () => {
      opearationFailedMessage();
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
        opearationFailedMessage();
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