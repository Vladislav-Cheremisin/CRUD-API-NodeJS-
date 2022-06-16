import User from "./types";

class DataModel {
  public data: User[];

  constructor() {
    this.data = [
      {
        id: "53afa42b-2c38-453a-a1b3-10c59766cef0",
        username: "Vladislav",
        age: 24,
        hobbies: ["airsoft", "programming"],
      },
    ];
  }

  public getUser = (uuid: string): User | null => {
    let result = null;

    this.data.forEach((user) => {
      if (user.id === uuid) {
        result = user;
      }
    });

    return result;
  };
}

const model = new DataModel();

export default model;
