import supertest from "supertest";
import { web } from "../src/app/web.js";
import { prismaClient } from "../src/app/database.js";
import { logger } from "../src/app/logging.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "fazri",
      },
    });
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "fazri",
      password: "fazri",
      name: "Fazri Ridwan",
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Ridwan");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });
    logger.error(result.body.errors);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already exist", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "fazri",
      password: "fazri",
      name: "Fazri Ridwan",
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Ridwan");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "fazri",
      password: "fazri",
      name: "Fazri Ridwan",
    });

    logger.error(result.body.errors);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await prismaClient.user.create({
      data: {
        username: "fazri",
        password: await bcrypt.hash("fazri", 10),
        name: "Fazri Ridwan",
        token: "test",
      },
    });
  });
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "fazri",
      },
    });
  });
  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "fazri",
      password: "fazri",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });
  it("should reject login if request invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if password incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "fazri",
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if username incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "fazri",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await prismaClient.user.create({
      data: {
        username: "fazri",
        password: await bcrypt.hash("fazri", 10),
        name: "Fazri Ridwan",
        token: "test",
      },
    });
  });
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "fazri",
      },
    });
  });
  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Ridwan");
  });
  it("should reject if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await prismaClient.user.create({
      data: {
        username: "fazri",
        password: await bcrypt.hash("fazri", 10),
        name: "Fazri Ridwan",
        token: "test",
      },
    });
  });
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "fazri",
      },
    });
  });
  it("should can update current user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "Fazri Updated",
        password: "fazri123",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Updated");

    const user = await prismaClient.user.findUnique({
      where: {
        username: "fazri",
      },
    });
    logger.info(user);
    expect(await bcrypt.compare("fazri123", user.password)).toBe(true);
  });
  it("should can update current user name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "Fazri Updated",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Updated");
  });
  it("should can update current user password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        password: "fazri123",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fazri");
    expect(result.body.data.name).toBe("Fazri Ridwan");

    const user = await prismaClient.user.findUnique({
      where: {
        username: "fazri",
      },
    });
    expect(await bcrypt.compare("fazri123", user.password)).toBe(true);
  });
});
