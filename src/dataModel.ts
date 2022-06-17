import User from "./types";

class DataModel {
  public data: User[];

  constructor() {
    this.data = [];
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

  public addNewUser = (user: User | undefined): void => {
    if (user !== undefined) {
      this.data.push(user);
    }
  };
}

const model = new DataModel();

export default model;
