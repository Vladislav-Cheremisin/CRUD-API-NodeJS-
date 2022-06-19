import request from "supertest";
import * as uuid from "uuid";

import { server } from "../src/server";

let newUserID: number | null = null;

const correctUser: {
  username: string;
  age: number;
  hobbies: string[];
} = {
  username: "Vladislav",
  age: 24,
  hobbies: ["Programming"],
};

const incorrectUser: {
  username: number;
  age: string[];
  hobbies: string;
} = {
  username: 2022,
  age: ["Twenty", "Four"],
  hobbies: "Programming",
};

const updatedUser: {
  idToIgnore: string;
  username: string;
  hobbies: string[];
  infoToIgnore: string;
} = {
  idToIgnore: uuid.v4(),
  username: "Vladislav Cheremisin",
  hobbies: ["Programming", "Airsoft"],
  infoToIgnore: "Junior frontend developer",
};

/* GET requests with empty database */

describe("GET requests with empty database", () => {
  test("First GET request to 'api/users' should return empty array with status code 200", async () => {
    const response = await request(server).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("GET request to user which doesn't exist should return message with status code 404", async () => {
    const response = await request(server).get(`/api/users/${uuid.v4()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Person with entered uuid doesn't exist"
    );
  });

  test("GET request to user with using incorrect uuid should return message with status code 400", async () => {
    const response = await request(server).get("/api/users/notUUID");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Incorrect request, please enter correct uuid after '/api/users/'"
    );
  });
});

/* POST requests */

describe("POST requests", () => {
  test("If body contains correct user data, server should return status code 201 and newly created record", async () => {
    const response = await request(server).post("/api/users").send(correctUser);

    expect(response.statusCode).toBe(201);
    expect(uuid.validate(response.body.id)).toBe(true);
    expect(response.body.username).toBe(correctUser.username);
    expect(response.body.age).toBe(correctUser.age);
    expect(response.body.hobbies).toStrictEqual(correctUser.hobbies);

    newUserID = response.body.id;
  });

  test("If body contains incorrect user data, server should return message with status code 400 ", async () => {
    const response = await request(server)
      .post("/api/users")
      .send(incorrectUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Incorrect request body. Body should be JSON object with information about person. Please try again with using template from readme.md"
    );
  });
});

/* GET requests with some data in database */

describe("GET requests with some data in database", () => {
  test("Get request to 'api/users' should return array with user which was added in previous tests", async () => {
    const response = await request(server).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("GET request to user by uuid, should return this user", async () => {
    const response = await request(server).get(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(200);
    expect(uuid.validate(response.body.id)).toBe(true);
    expect(response.body.username).toBe(correctUser.username);
    expect(response.body.age).toBe(correctUser.age);
    expect(response.body.hobbies).toStrictEqual(correctUser.hobbies);
  });
});

/* PUT requests */

describe("PUT requests", () => {
  test("If body of PUT request contains correct data and user with uuid in path exists, should return status code 200 and updated record", async () => {
    const response = await request(server)
      .put(`/api/users/${newUserID}`)
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(newUserID);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(correctUser.age);
    expect(response.body.hobbies).toStrictEqual(updatedUser.hobbies);
    expect(Object.keys(response.body).length).toBe(4);
  });

  test("PUT request to user which doesn't exist should return message with status code 404", async () => {
    const response = await request(server)
      .put(`/api/users/${uuid.v4()}`)
      .send(updatedUser);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Person with entered uuid doesn't exist"
    );
  });

  test("PUT request to user with using incorrect uuid should return message with status code 400", async () => {
    const response = await request(server)
      .put("/api/users/notUUID")
      .send(updatedUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Incorrect request, please enter correct uuid after '/api/users/'"
    );
  });
});

/* DELETE requests */

describe("DELETE requests", () => {
  test("If user with uuid from path exist should remove this user and return status code 204", async () => {
    const response = await request(server).delete(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(204);
  });

  test("DELETE request to user which doesn't exist should return message with status code 404", async () => {
    const response = await request(server).delete(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Person with entered uuid doesn't exist"
    );
  });

  test("DELETE request to user with using incorrect uuid should return message with status code 400", async () => {
    const response = await request(server).delete("/api/users/notUUID");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Incorrect request, please enter correct uuid after '/api/users/'"
    );
  });
});

/* Request to wrong path */

describe("Request to wrong path", () => {
  test("GET request to wrong path should return message with status code 404", async () => {
    const response = await request(server).get("/api/users/something/");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Resource that you requested doesn't exist"
    );
  });

  test("POST request to wrong path should return message with status code 404", async () => {
    const response = await request(server).post("/api/users/something/");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Resource that you requested doesn't exist"
    );
  });

  test("PUT request to wrong path should return message with status code 404", async () => {
    const response = await request(server).put("/api/users/something/");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Resource that you requested doesn't exist"
    );
  });

  test("DELETE request to wrong path should return message with status code 404", async () => {
    const response = await request(server).delete("/api/users/something/");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Resource that you requested doesn't exist"
    );
  });
});

/* Requests with using wrong method */

describe("Requests with using wrong method", () => {
  test("Request with using not supported PATCH method should return message with status code 501", async () => {
    const response = await request(server).patch("/api/users/something/");

    expect(response.statusCode).toBe(501);
    expect(response.body.message).toBe(
      "This method is not implemented on this server, please use GET, POST, PUT or DELETE methods"
    );
  });
});
