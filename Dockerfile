FROM node:slim
WORKDIR /airdrop-checker
COPY src ./src/
COPY public ./public/
COPY .env ./
COPY next.config.ts ./
COPY package.json ./
COPY tsconfig.json ./
COPY *.js ./
RUN yarn
RUN yarn build
EXPOSE 5677
ENTRYPOINT yarn start -p 5677