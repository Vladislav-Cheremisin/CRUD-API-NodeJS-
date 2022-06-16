import fs from "fs/promises";

const getData = async (path: String): Promise<String | undefined> => {
  try {
    if (typeof path === "string") {
      const data = await fs.readFile(path, { encoding: "utf-8" });

      return data;
    } else {
      throw new Error("You entered wrong path");
    }
  } catch (err) {
    if (err) {
      throw err;
    }
  }
};

export default getData;
