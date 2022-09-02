FROM lukemathwalker/cargo-chef:latest-rust-1.57.0-bullseye as node-base

# Install node
RUN apt update && apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt update && apt install -y nodejs

FROM node-base as rust-node-base

RUN apt install -y make build-essential pkg-config openssl libssl-dev libreadline-dev libsqlite3-dev clang libgmp-dev

RUN npm i -g neon-cli
RUN npm install -g cargo-cp-artifact

FROM rust-node-base as rust-planner
WORKDIR /dist
RUN mkdir -p native
COPY ./native/Cargo.lock ./native/
COPY ./native/Cargo.toml ./native/
RUN cd native && cargo chef prepare --recipe-path recipe.json

FROM rust-node-base as rust-build
COPY --from=rust-planner /dist/native/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
WORKDIR /dist

COPY ./native native
RUN cargo-cp-artifact -ac mpc ./native/index.node -- cargo build --message-format=json-render-diagnostics --manifest-path=./native/Cargo.toml --release
RUN ls ./native/

FROM node-base as rust-node-final

WORKDIR /dist
RUN mkdir -p native
COPY --from=rust-build /dist/native/index.node ./native/ 

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build-ts

CMD [ "dist/src/startParty2.handler" ]