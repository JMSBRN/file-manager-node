import { readdirSync } from 'fs';
import { chdir } from 'process';

export const navUp = () => {
    chdir('..');
};
export const navChDir = (arg) => {
    chdir(arg);
};
export const navlistFolder = async (workDir) => {
    const content = readdirSync(workDir, { withFileTypes: true }).map((el) => {
      return {
        name: `${el.name}`,
        type: el.isFile() ? "file" : "directory",
      };
    });
    console.table(content);
  };