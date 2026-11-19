ARG NODE_VERSION=22.23.4
FROM public.ecr.aws/docker/library/node:${NODE_VERSION}-alpine AS production
WORKDIR /usr/src/app
RUN npm install -g serve
COPY .deploy/frontend/dist ./dist
COPY apps/frontend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000"]
