# killしたいプロセスの名称
# 7ではなく6なのはcertbotは落ちていても問題ないからです
ProcessName="restart.sh 6"

# ProcessNameで定義したファイルのPIDを取得
PID=`ps x | grep "$ProcessName" | grep -v grep | awk '{print $1}'`

# もしPIDがあればプロセスをkillする条件式（なければなにもしない）
if [ -n "$PID" ]; then
  kill $PID
fi
