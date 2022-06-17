import http from "http";
import events from "events";
import * as uuid from "uuid";

import model from "./dataModel";
import messages from "./messages";
import User from "./types";

class DataController {
  showAllUsers = async (res: http.ServerResponse): Promise<void> => {
    try {
      res.writeHead(200, { "Content-type": "application/json" });
      res.write(JSON.stringify(model.data));
      res.end();
    } catch (err) {
      if (err) {
        this.showServerErrMsg(res);
      }
    }
  };

  showUser = async (
    res: http.ServerResponse,
    url: string | undefined
  ): Promise<void> => {
    try {
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
    } catch (err) {
      if (err) {
        this.showServerErrMsg(res);
      }
    }
  };

  createUser = async (
    req: events.EventEmitter,
    res: http.ServerResponse
  ): Promise<void> => {
    try {
      let reqBody: string = "";

      req.on("data", (chunk) => {
        reqBody += chunk.toString();
      });

      req.on("end", async () => {
        const newUser: User | undefined = await this.parseReqBody(res, reqBody);
        const id: string | undefined = newUser?.id;

        if (newUser !== undefined && id !== undefined) {
          model.addNewUser(newUser);

          res.writeHead(201, { "Content-type": "application/json" });
          res.write(JSON.stringify(model.getUser(id)));
          res.end();
        }
      });
    } catch (err) {
      if (err) {
        this.showServerErrMsg(res);
      }
    }
  };

  updateData = async (
    req: events.EventEmitter,
    res: http.ServerResponse,
    url: string | undefined
  ): Promise<void> => {
    try {
      if (url !== undefined) {
        const uuid = this.getUuidFromUrl(url);
        const user = model.getUser(uuid);

        if (user) {
          let reqBody: string = "";

          req.on("data", (chunk) => {
            reqBody += chunk.toString();
          });

          req.on("end", async () => {
            const updatedUser: User | undefined = await this.parseReqBody(
              res,
              reqBody,
              true,
              user
            );
            const id: string | undefined = updatedUser?.id;

            if (updatedUser !== undefined && id !== undefined) {
              model.updateUser(updatedUser);

              res.writeHead(200, { "Content-type": "application/json" });
              res.write(JSON.stringify(model.getUser(id)));
              res.end();
            }
          });
        } else {
          res.writeHead(404, { "Content-type": "application/json" });
          res.write(JSON.stringify({ message: messages.userNotExist }));
          res.end();
        }
      }
    } catch (err) {
      if (err) {
        this.showServerErrMsg(res);
      }
    }
  };

  parseReqBody = async (
    res: http.ServerResponse,
    reqBody: string,
    putMethod: boolean = false,
    user: User | null = null
  ): Promise<User | undefined> => {
    try {
      const parsedJSON: User = JSON.parse(reqBody);
      const objKeys: string[] = Object.keys(parsedJSON);

      if (putMethod) {
        const userToUpdate: User | null = user;

        if (userToUpdate !== null) {
          if (
            objKeys.includes("username") &&
            typeof parsedJSON["username"] === "string"
          ) {
            userToUpdate.username = parsedJSON["username"];
          }

          if (
            objKeys.includes("age") &&
            typeof parsedJSON["age"] === "number"
          ) {
            userToUpdate.age = parsedJSON["age"];
          }

          if (
            objKeys.includes("hobbies") &&
            this.isStringArr(parsedJSON["hobbies"])
          ) {
            userToUpdate.hobbies = parsedJSON["hobbies"];
          }

          return userToUpdate;
        }
      } else {
        if (
          objKeys.includes("username") &&
          typeof parsedJSON["username"] === "string" &&
          objKeys.includes("age") &&
          typeof parsedJSON["age"] === "number" &&
          objKeys.includes("hobbies") &&
          this.isStringArr(parsedJSON["hobbies"])
        ) {
          const newUser: User = {
            id: uuid.v4(),
            username: parsedJSON["username"],
            age: parsedJSON["age"],
            hobbies: parsedJSON["hobbies"],
          };

          return newUser;
        } else {
          throw new Error("Incorrect req body!");
        }
      }
    } catch (err) {
      if (err) {
        res.writeHead(400, { "Content-type": "application/json" });
        res.write(JSON.stringify({ message: messages.incorrectReqBody }));
        res.end();
      }
    }
  };

  isStringArr = (arr: object): boolean => {
    if (Array.isArray(arr)) {
      let result = true;

      arr.forEach((el) => {
        if (typeof el !== "string") {
          result = false;
        }
      });

      return result;
    } else {
      return false;
    }
  };

  showWrongIdMsg = (res: http.ServerResponse): void => {
    res.writeHead(400, { "Content-type": "application/json" });
    res.write(JSON.stringify({ message: messages.incorrectId }));
    res.end();
  };

  showWrongUrlMsg = (res: http.ServerResponse): void => {
    res.writeHead(404, { "Content-type": "application/json" });
    res.write(JSON.stringify({ message: messages.incorrectURL }));
    res.end();
  };

  showServerErrMsg = (res: http.ServerResponse): void => {
    res.writeHead(500, { "Content-type": "application/json" });
    res.write(JSON.stringify({ message: messages.serverError }));
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
