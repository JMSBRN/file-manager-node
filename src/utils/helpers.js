import {
  readdirSync,
  createReadStream,
  appendFile,
  existsSync,
  mkdirSync,
  renameSync,
  createWriteStream,
  unlinkSync,
  unlink
} from "fs";
import { dirname, join, parse } from "path";
import { cwd } from "process";

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
      console.log("no element in this folder plese try ls function");
    });
};
export const add = async (arg, content = "") => {
  if (!existsSync(arg)) {
    !!Object.values(parse(arg))[1] &&
      mkdirSync(dirname(arg), { recursive: true });
    appendFile(arg, content, (err) => {
      if (err) throw err;
      console.log("File is created successfully.");
    });
  }
};
export  const rn =  async (oldFilePath, newFilePath) => {
  readdirSync(cwd()).map((el) => {
    if (el === oldFilePath) {
      renameSync(oldFilePath, newFilePath);
      console.log("File Renamed successfully");
    }
  });
};
export const cp = async (src, dest) => {
  const rs = createReadStream(src, { flags: 'r'}).on('error', () => {
    console.log("no element in this folder plese try ls function");
  });
  if(!existsSync(dest)) {
    !!Object.values(parse(dest))[1] && mkdirSync(dirname(dest), { recursive: true }); 
    const ws = createWriteStream(dest).on('finish', () => {
      console.log('copied successfully');
    });
    rs.pipe(ws);     
    
  }
};
export const mv =  async (src, dest) =>  {
  const rs = createReadStream(src, { flags: 'r'}).on('error', () => {
      console.log("no element in this folder plese try ls function");
    });
    if (!existsSync(dest)) {
      !!Object.values(parse(dest))[1] && mkdirSync(dirname(dest), { recursive: true });
      const ws = createWriteStream(dest).on('finish', () => {
        unlinkSync(src);
        console.log('moved successfully');
      });
      rs.pipe(ws);
    }
};
 export const rm = async (src) => {
    unlink(src, (err) => {
      if (err) {
        console.log("no element in this folder plese try ls function");
      }
      console.log('file deleted successfully');
    })    
};
export const hash = async (arg) => {
  readdirSync(cwd()).map((el) => {
    if (el === arg) {
      const hashSum = createHash("sha256").update(readFileSync(el));
      console.log(hashSum.digest("hex"));
    }
  });
};