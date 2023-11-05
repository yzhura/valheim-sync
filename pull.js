import { readdirSync, copyFileSync } from "fs";
import { promisify } from "util";
const exec = promisify(require("child_process").exec);

const REPO_URL = "https://github.com/yzhura/valheim-sync";
const USER_PROFILE_PATH = process.env.USERPROFILE;
const WORLDS_LOCAL_PATH = `${USER_PROFILE_PATH}/AppData/LocalLow/IronGate/Valheim/worlds_local`;
const WORLD_FOLDER = "/путь/к/вашей/папке/мира/Valheim";

async function updateWorld() {
  try {
    // Выполните команду для загрузки последних изменений из Git-репозитория
    await exec(`git pull ${REPO_URL}`);

    // Перейдите в папку с миром
    process.chdir(WORLD_FOLDER);

    // Скопируйте все файлы из текущей папки в папку мира
    const files = readdirSync(".");
    for (const file of files) {
      copyFileSync(file, `${WORLDS_LOCAL_PATH}/${file}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

updateWorld();
