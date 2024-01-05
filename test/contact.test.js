import supertest from "supertest";
import { web } from "../src/app/web.js";
import { prismaClient } from "../src/app/database.js";
import { logger } from "../src/app/logging.js";
import bcrypt from "bcrypt";

// describe("POST /api/contacts", () => {
//   beforeEach(async () => {
//     await prismaClient.user.create({
//       data: {
//         username: "fazri",
//         password: await bcrypt.hash("fazri", 10),
//         name: "Fazri Ridwan",
//         token: "test",
//       },
//     });
//   });
//   afterEach(async () => {
//     await prismaClient.contact.deleteMany({
//       where: {
//         username: "fazri",
//       },
//     });
//     await prismaClient.user.deleteMany({
//       where: {
//         username: "fazri",
//       },
//     });
//   });

//   it("should can register new contact", async () => {
//     const result = await supertest(web)
//       .post("/api/contacts")
//       .set("Authorization", "test")
//       .send({
//         first_name: "test",
//         last_name: "test",
//         email: "test@gmail.com",
//         phone: "123343232",
//       });
//     expect(result.status).toBe(200);
//     expect(result.body.data.id).toBeDefined();
//     expect(result.body.data.first_name).toBe("test");
//     expect(result.body.data.last_name).toBe("test");
//     expect(result.body.data.email).toBe("test@gmail.com");
//     expect(result.body.data.phone).toBe("123343232");
//   });

//   it("should reject if request is invalid", async () => {
//     const result = await supertest(web)
//       .post("/api/contacts")
//       .set("Authorization", "test")
//       .send({
//         first_name: "",
//         last_name: "test",
//         email: "test",
//         phone: "12334323223333333333333333333333333333333333333333",
//       });
//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });
// });

// describe("GET /api/contacts/:id", () => {
//   beforeEach(async () => {
//     await prismaClient.user.create({
//       data: {
//         username: "fazri",
//         password: await bcrypt.hash("fazri", 10),
//         name: "Fazri Ridwan",
//         token: "test",
//       },
//     });
//     await prismaClient.contact.create({
//       data: {
//         username: "fazri",
//         first_name: "test",
//         last_name: "test",
//         email: "test@gmail.com",
//         phone: "080101010101",
//       },
//     });
//   });
//   afterEach(async () => {
//     await prismaClient.contact.deleteMany({
//       where: {
//         username: "fazri",
//       },
//     });
//     await prismaClient.user.deleteMany({
//       where: {
//         username: "fazri",
//       },
//     });
//   });

//   it("should can get contact by id", async () => {
//     const contact = await prismaClient.contact.findFirst({
//       where: {
//         username: "fazri",
//       },
//     });
//     const result = await supertest(web)
//       .get(`/api/contacts/${contact.id}`)
//       .set("Authorization", "test");

//     expect(result.status).toBe(200);
//     expect(result.body.data.id).toBeDefined();
//     expect(result.body.data.first_name).toBe("test");
//     expect(result.body.data.last_name).toBe("test");
//     expect(result.body.data.email).toBe("test@gmail.com");
//     expect(result.body.data.phone).toBe("080101010101");
//   });

//   it("should reject if id is not found", async () => {
//     const result = await supertest(web)
//       .get(`/api/contacts/${100}`)
//       .set("Authorization", "test");

//     expect(result.status).toBe(404);
//     expect(result.body.errors).toBeDefined();
//   });

//   it("should reject if id is invalid", async () => {
//     const result = await supertest(web)
//       .get(`/api/contacts/${-100}`)
//       .set("Authorization", "test");

//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });
// });

describe("PUT /api/contacts/:id", () => {
  beforeEach(async () => {
    await prismaClient.user.create({
      data: {
        username: "fazri",
        password: await bcrypt.hash("fazri", 10),
        name: "Fazri Ridwan",
        token: "test",
      },
    });
    await prismaClient.contact.create({
      data: {
        username: "fazri",
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        phone: "080101010101",
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

  it("should can update contact by id", async () => {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: "fazri",
      },
    });
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set("Authorization", "test")
      .send({
        first_name: "test2",
        last_name: "test2",
        email: "test2@gmail.com",
        phone: "123123123",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test2");
    expect(result.body.data.last_name).toBe("test2");
    expect(result.body.data.email).toBe("test2@gmail.com");
    expect(result.body.data.phone).toBe("123123123");
  });

  it("should reject if id is not found", async () => {
    const result = await supertest(web)
      .put(`/api/contacts/${100}`)
      .set("Authorization", "test")
      .send({
        first_name: "test2",
        last_name: "test2",
        email: "test2@gmail.com",
        phone: "123123123",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is invalid", async () => {
    const result = await supertest(web)
      .put(`/api/contacts/${-100}`)
      .set("Authorization", "test")
      .send({
        last_name: "test2",
        email: "test2@gmail.com",
        phone: "123123123",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
