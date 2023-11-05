import { readdirSync, copyFileSync } from "fs";
import { execSync } from "child_process";
import { env } from "process";

const REPO_URL = "https://github.com/yzhura/valheim-sync";
const USER_PROFILE_PATH = env.USERPROFILE;
const WORLDS_LOCAL_PATH = `${USER_PROFILE_PATH}/AppData/LocalLow/IronGate/Valheim/worlds_local`;
const CURRENT_FOLDER = process.cwd();

function showNotification(title, message) {
  const psScript = `
    [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")
    [System.Windows.Forms.MessageBox]::Show("${message}", "${title}", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
  `;

  execSync(`powershell -command "${psScript}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
    }
  });
}

function updateWorld() {
  try {
    execSync(`git pull ${REPO_URL}`);

    const files = readdirSync(`${CURRENT_FOLDER}/worlds_local`);
    for (const file of files) {
      copyFileSync(
        `${CURRENT_FOLDER}/worlds_local/${file}`,
        `${WORLDS_LOCAL_PATH}/${file}`
      );
    }
    showNotification("Success", "Files are synced");
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error", error);
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
        showNotification("Success", "Files are pushed");
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error", error);
  }
}

updateWorld();
setTimeout(() => {
  copyAndPushWorld();
}, 30000);
