# ${1} = 正常時のコンテナ数 + 1
while true
do
  # 正常か異常の判定（立ち上がってるコンテナの数があっているかいないか）
  if [ `docker ps | wc -l` -lt ${1} ]; then
    docker-compose down
    pwd
    echo ContainerRestart
    docker-compose -f docker-compose-develop.yml up > ./logs/`date +%Y-%m-%d-%H:%M`.log &
  fi
  sleep 60
done