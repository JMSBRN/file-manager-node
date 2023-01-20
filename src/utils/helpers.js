import { readdirSync, createReadStream, appendFile } from 'fs';
import { cwd } from 'process';

export  const ls = async () => {
    const content = readdirSync(cwd(), { withFileTypes: true }).map((el) => {
      return {
        name: `${el.name}`,
        type: el.isFile() ? "file" : "directory",
      };
    });
    console.table(content);
  };

  export const cat = (arg) => {
   readdirSync(cwd(), { encoding: "utf-8" });
        let chunk = "";
   const rs = createReadStream(arg, { flags: 'rs+' }).on("readable", () => {
          while (null !== (chunk = rs.read())) {
            console.log(`${chunk}`);
          }
        }).on('error', () => {
          console.log('no element in this folder plese try ls function');
        });
    
  }
  export const add = async (arg, content = "") => {
    if (arg) {
      appendFile(arg, content, (err) => {
        if (err) throw err;
        console.log("File is created successfully.");
      });
    }
  }