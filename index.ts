import http from "http";

import getData from "./utils/getData";
import User from "./src/types";

const startServer = async (): Promise<void> => {
  try {
    const Data = await getData("./src/data.json");
    const PORT: Number = 5000;

    const server: http.Server = http.createServer((req, res) => {});

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    throw err;
  }
};

startServer();
