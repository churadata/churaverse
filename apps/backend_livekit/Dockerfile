ARG NODE_VERSION=22.23.4
FROM public.ecr.aws/docker/library/node:${NODE_VERSION}-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY .deploy/backend_livekit ./
CMD ["node", "lib/server.js"]
