const Redis = require("ioredis");

//=== Redis Connection

const RedisConnector = () => {
  const HOST = process.env.REDIS_HOST;
  const PORT = process.env.REDIS_PORT;
  const CREDENTIAL = process.env.REDIS_CREDENTIAL;

  if (!Boolean(HOST) || !Boolean(PORT) || !Boolean(CREDENTIAL))
    return "Requires some credential";

  const connector = new Redis({
    host: HOST,
    port: PORT,
    password: CREDENTIAL,
  });

  //=== Checking if the connection get unsuccessful
  connector.on("error", (error) => {
    console.error(`Fail to connect to Redis : ${error.message}`);
  });

  //=== Checking if the connection is closed
  connector.on("close", () => {
    console.log("<<<=== Connection to REDIS cache get closed. 😪");
  });
  return connector;
};

//=== Exporting

module.exports = { RedisConnector };
