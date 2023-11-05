import fs, { readdirSync, copyFileSync } from "fs";
import { execSync } from "child_process";
import { env } from "process";
import notifier from "node-notifier";

const REPO_URL = "https://github.com/yzhura/valheim-sync";
const USER_PROFILE_PATH = env.USERPROFILE;
const WORLDS_LOCAL_PATH = `${USER_PROFILE_PATH}/AppData/LocalLow/IronGate/Valheim/worlds_local`;
const CURRENT_FOLDER = process.cwd();
const SUCCESS_ICON = `${CURRENT_FOLDER}/icons/success.png`;
const ERROR_ICON = `${CURRENT_FOLDER}/icons/error.png`;

function updateWorld() {
  try {
    execSync(`git pull ${REPO_URL}`);
    console.log("pulling");
    if (!fs.existsSync(`${CURRENT_FOLDER}/worlds_local`)) {
      fs.mkdirSync(`${CURRENT_FOLDER}/worlds_local`);
    }
    const files = readdirSync(`${CURRENT_FOLDER}/worlds_local`);
    console.log("files: ", files);
    if (files.length) {
      for (const file of files) {
        copyFileSync(
          `${CURRENT_FOLDER}/worlds_local/${file}`,
          `${WORLDS_LOCAL_PATH}/${file}`
        );
      }
    }
    notifier.notify({
      title: "Успішно",
      message: "Світи обновились",
      icon: SUCCESS_ICON,
    });
  } catch (error) {
    console.error("Error:", error);
    notifier.notify({
      title: "Error",
      message: error,
      icon: ERROR_ICON,
    });
  }
}

async function copyAndPushWorld() {
  try {
    while (true) {
      const { stdout } = await execAsync(
        'tasklist /fo csv /nh /fi "imagename eq valheim.exe"'
      );

      if (!stdout.includes('valheim.exe"')) {
        if (!fs.existsSync(`${CURRENT_FOLDER}/worlds_local`)) {
          fs.mkdirSync(`${CURRENT_FOLDER}/worlds_local`);
        }
        const files = fs.readdirSync(WORLDS_LOCAL_PATH);
        for (const file of files) {
          fs.copyFileSync(
            `${WORLDS_LOCAL_PATH}/${file}`,
            `${CURRENT_FOLDER}/worlds_local/${file}`
          );
        }
        process.chdir(CURRENT_FOLDER);
        await execAsync("git add .");
        await execAsync('git commit -m "Сохранение мира Valheim"');
        await execAsync(`git push ${REPO_URL}`);

        notifier.notify({
          title: "Успішно",
          message: "Світи вже на гітхабі :)",
          icon: SUCCESS_ICON,
        });
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error:", error);
    notifier.notify({
      title: "Error",
      message: error,
      icon: ERROR_ICON,
    });
  }
}

updateWorld();
setTimeout(() => {
  copyAndPushWorld();
}, 30000);
