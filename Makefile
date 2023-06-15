local_start:
	sh deploy_version_rewrite.sh
	docker-compose up -d

local_stop:
	docker-compose down

prod_start:
	sh deploy_version_rewrite.sh
	/usr/local/bin/docker-compose -f docker-compose-prod.yml up > ./logs/`date +%Y-%m-%d-%H:%M`.log &

prod_stop:
	/usr/local/bin/docker-compose -f docker-compose-prod.yml down
