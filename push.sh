#!/bin/bash

REPO_URL="https://github.com/yzhura/valheim-sync"
USER_PROFILE_PATH="$USERPROFILE"
WORLDS_LOCAL_PATH="$USER_PROFILE_PATH/AppData/LocalLow/IronGate/Valheim/worlds_local"
CURRENT_FOLDER=$(dirname "$0")

while true; do
  if pgrep -x "valheim.exe" > /dev/null; then
    sleep 1
  else
    cd $CURRENT_FOLDER
    # Копируем файлы из $WORLDS_LOCAL_PATH в текущую папку
    cp -r $WORLDS_LOCAL_PATH/* $CURRENT_FOLDER
    cd $CURRENT_FOLDER
    git add .
    git commit -m "Сохранение мира Valheim"
    git push $REPO_URL
    break
  fi
done
