import http from "http";

import controller from "./src/dataController";

const startServer = (): void => {
  const PORT: number = 5000;
  const server: http.Server = http.createServer(async (req, res) => {
    try {
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
        case "POST":
          if (url === "/api/users") {
            controller.createUser(req, res);
          } else {
            controller.showWrongUrlMsg(res);
          }

          break;
        case "PUT":
          if (controller.isUrlHaveUuid(url)) {
            if (controller.isUuidValid(url)) {
              controller.updateData(req, res, url);
            } else {
              controller.showWrongIdMsg(res);
            }
          } else {
            controller.showWrongUrlMsg(res);
          }

          break;
        case "DELETE":
          if (controller.isUrlHaveUuid(url)) {
            if (controller.isUuidValid(url)) {
              controller.deleteData(res, url);
            } else {
              controller.showWrongIdMsg(res);
            }
          } else {
            controller.showWrongUrlMsg(res);
          }

          break;
      }
    } catch (err) {
      if (err) {
        controller.showServerErrMsg(res);
      }
    }
  });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
