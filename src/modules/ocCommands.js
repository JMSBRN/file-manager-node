import { EOL, cpus, homedir, userInfo, arch  }  from 'os';

export const osCommands = async (arg) => {
    switch (arg) {
      case "--EOL":
        const input = JSON.stringify(EOL);
        console.log(
          "end-of-line marker is :",
          input.substring(1, input.length - 1)
        );
        break;
      case "--cpus":
        const information = [
          {
            cpus: cpus().length,
            model: cpus()[0].model,
          },
        ];
        console.table(information);
        break;
      case "--homedir":
        console.log(homedir());
        break;
      case "--username":
        console.log(userInfo().username);
        break;
      case "--architecture":
        console.log(arch());
        break;
      default:
        console.log("Invalid input");
        break;
    }
  };