import http from "http";
import * as uuid from "uuid";

import model from "./dataModel";
import messages from "./messages";

class DataController {
  showAllUsers = (res: http.ServerResponse): void => {
    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(model.data));
    res.end();
  };

  showUser = (res: http.ServerResponse, url: string | undefined): void => {
    if (url !== undefined) {
      const uuid = this.getUuidFromUrl(url);
      const user = model.getUser(uuid);

      if (user) {
        res.writeHead(200, { "Content-type": "application/json" });
        res.write(JSON.stringify(user));
        res.end();
      } else {
        res.writeHead(404, { "Content-type": "application/json" });
        res.write(JSON.stringify({ message: messages.userNotExist }));
        res.end();
      }
    }
  };

  showWrongIdMsg = (res: http.ServerResponse): void => {
    res.writeHead(404, { "Content-type": "application/json" });
    res.write(JSON.stringify({ message: messages.incorrectId }));
    res.end();
  };

  showWrongUrlMsg = (res: http.ServerResponse): void => {
    res.writeHead(404, { "Content-type": "application/json" });
    res.write(JSON.stringify({ message: messages.incorrectURL }));
    res.end();
  };

  isUrlHaveUuid = (url: string | undefined): boolean => {
    if (url !== undefined) {
      const splittedUrl = url.split("/");

      if (
        splittedUrl[splittedUrl.length - 3] === "api" &&
        splittedUrl[splittedUrl.length - 2] === "users"
      ) {
        return true;
      }
    }

    return false;
  };

  isUuidValid = (url: string | undefined): boolean => {
    if (url !== undefined) {
      const maybeUuid = this.getUuidFromUrl(url);

      if (uuid.validate(maybeUuid)) {
        return true;
      }
    }

    return false;
  };

  getUuidFromUrl = (url: string): string => {
    const splittedUrl = url.split("/");
    const maybeUuid = splittedUrl[splittedUrl.length - 1];

    return maybeUuid;
  };
}

const controller = new DataController();

export default controller;
