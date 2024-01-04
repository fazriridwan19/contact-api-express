import supertest from "supertest";
import { web } from "../src/app/web.js";
import { prismaClient } from "../src/app/database.js";
import { logger } from "../src/app/logging.js";
import bcrypt from "bcrypt";

describe("POST /api/contacts", () => {
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
    await prismaClient.contact.deleteMany({
      where: {
        username: "fazri",
      },
    });
    await prismaClient.user.deleteMany({
      where: {
        username: "fazri",
      },
    });
  });

  it("should can register new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        phone: "123343232",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("123343232");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "test",
        phone: "12334323223333333333333333333333333333333333333333",
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
