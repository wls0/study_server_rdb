FROM node:alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["pnpm", "run", "start:debug"]
