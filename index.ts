import http from "http";

import controller from "./src/dataController";

const startServer = async (): Promise<void> => {
  try {
    const PORT: number = 5000;
    const server: http.Server = http.createServer((req, res) => {
      const url: string | undefined = req.url;
      const method: string | undefined = req.method;

      switch (method) {
        case "GET":
          if (url === "/api/users") {
            controller.showAllUsers(res);
          } else if (controller.isUrlHaveUuid(url)) {
            if (controller.isUuidValid(url)) {
              controller.showUser(res, url);
            } else {
              controller.showWrongIdMsg(res);
            }
          } else {
            controller.showWrongUrlMsg(res);
          }

          break;
      }
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    throw err;
  }
};

startServer();
