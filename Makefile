# サーバー上でのバージョン書き換え付き起動方法
start:
	sh deploy_version_rewrite.sh
	docker-compose up -d

stop:
	docker-compose down

# サーバー上での自動リスタート付き起動方法
# 7ではなく6なのはcertbotは落ちていても問題ないからです
develop_start:
	sh deploy_version_rewrite.sh
	sh restart.sh 6 &

develop_stop:
	docker-compose -f docker-compose-develop.yml down
	sh stop_restart.sh
