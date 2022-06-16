import IMessage from "./interfaces";

const messages: IMessage = {
  incorrectURL: "Resource that you requested doesn't exist",
  incorrectId:
    "Incorrect request, please enter correct uuid after '/api/users/'",
  userNotExist: "Person with entered uuid doesn't exist",
};

export default messages;
