import { createHash } from "crypto";

export const hash = async (src) => {
    createReadStream(src, { flags: "r" })
      .on("error", () => {
        opearationFailedMessage();
      })
      .once("readable", () => {
        const hashSum = createHash("sha256").update(readFileSync(src));
        console.log(hashSum.digest("hex"));
      });
  };