FROM amazonlinux:2 as node-base

# Install node
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash - && \
  yum install -y nodejs && yum clean all

FROM node-base as rust-node-base
# Install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain stable && \
  PATH="/root/.cargo/bin:$PATH" rustup install 1.57.0
ENV PATH $PATH:/root/.cargo/bin

RUN yum install -y make gcc gcc-c++ libgcc openssl-devel readline-devel sqlite-devel clang gmp gmp-devel&& yum clean all

RUN npm i -g neon-cli
RUN npm install -g cargo-cp-artifact

FROM rust-node-base as rust-build
WORKDIR /dist

RUN mkdir -p native
COPY ./native/Cargo.lock ./native/
COPY ./native/Cargo.toml ./native/
# RUN mkdir .cargo
# RUN cargo vendor --manifest-path=./native/Cargo.toml > ~/.cargo/config

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

CMD [ "npm", "run", "start-party1"]