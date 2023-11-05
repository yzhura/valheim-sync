import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

const REPO_URL = "https://github.com/yzhura/valheim-sync";
const USER_PROFILE_PATH = process.env.USERPROFILE;
const WORLDS_LOCAL_PATH = `${USER_PROFILE_PATH}/AppData/LocalLow/IronGate/Valheim/worlds_local`;
const CURRENT_FOLDER = process.cwd();

async function copyAndPushWorld() {
  try {
    while (true) {
      const { stdout: std } = await execAsync("tasklist /fo csv /nh");
      //   console.log("std: ", std);

      const { stdout } = await execAsync(
        'tasklist /fo csv /nh /fi "imagename eq valheim.exe"'
      );

      if (!stdout.includes('valheim.exe"')) {
        const files = fs.readdirSync(WORLDS_LOCAL_PATH);
        for (const file of files) {
          fs.copyFileSync(
            `${WORLDS_LOCAL_PATH}/${file}`,
            `${CURRENT_FOLDER}/${file}`
          );
        }
        process.chdir(CURRENT_FOLDER);
        await execAsync("git add .");
        await execAsync('git commit -m "Сохранение мира Valheim"');
        await execAsync(`git push ${REPO_URL}`);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Waiting");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

copyAndPushWorld();
