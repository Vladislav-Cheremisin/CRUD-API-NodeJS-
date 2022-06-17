import IMessage from "./interfaces";

const messages: IMessage = {
  incorrectURL: "Resource that you requested doesn't exist",
  incorrectId:
    "Incorrect request, please enter correct uuid after '/api/users/'",
  incorrectReqBody:
    "Incorrect request body. Body should be JSON object with information about person. Please try again with using template from readme.md",
  serverError:
    "We have some problems on server side. Please try again a little bit later",
  userNotExist: "Person with entered uuid doesn't exist",
  notImplemented:
    "This method is not implemented on this server, please use GET, POST, PUT or DELETE methods",
};

export default messages;
