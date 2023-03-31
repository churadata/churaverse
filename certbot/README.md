# certbot
証明書周りの関連ファイルが入る

# file
- churaverse-cert-renew.service
  - 月1回のTLS証明書の更新のタスクの実行内容部分
  - `/etc/systemd/system/multi-user.target.wants/` に置く
  - 置いた後に `# systemctl daemon-reload` でファイルを読み込ませる
  - 実行ログは `$ systemctl status churaverse-cert-renew.serivce` で確認可能
- churaverse-cert-renew.timer
  - 月1回のTLS証明書の更新のタスクのタイマー部分
  - タイマーの設定は UTC 15時(= JST 翌0時)+60分以内のランダム で動作するように設定してあります
  - `/etc/systemd/system/multi-user.target.wants/` に置く
  - 置いたあとに `# systemctl daemon-reload` でファイルを読み込ませ, `# systemctl start churaverse-cert-renew.timer` でスケジュール開始
  - タイマーは `$ systemctl list-timers` で確認可能
