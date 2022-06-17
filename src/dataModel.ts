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

  public updateUser = (updatedUser: User): void => {
    console.log(updatedUser);

    this.data.forEach((user) => {
      if (user.id === updatedUser.id) {
        user = updatedUser;
      }
    });
  };
}

const model = new DataModel();

export default model;
