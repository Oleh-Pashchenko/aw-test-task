FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.build.json tsconfig.build.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npm prune --production

EXPOSE 8001

CMD npm run migrate:dev && npm run start:prod