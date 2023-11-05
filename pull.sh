#!/bin/bash

USER_PROFILE_PATH="$USERPROFILE"

WORLDS_LOCAL_PATH="$USER_PROFILE_PATH/AppData/LocalLow/IronGate/Valheim/worlds_local"

REPO_URL="https://github.com/yzhura/valheim-sync"

# Выполните команду для загрузки последних изменений из Git-репозитория
git pull $REPO_URL

# Перейдите в папку с миром
cd $WORLD_FOLDER
cp -r * $WORLD_FOLDER
