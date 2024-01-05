import {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { logger } from "../app/logging.js";

const create = async (user, request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user.username;
  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const get = async (user, id) => {
  id = validate(getContactValidation, id);
  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: id,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
  if (!contact) {
    throw new ResponseError(404, "contact is not found");
  }
  return contact;
};

const update = async (user, request) => {
  const contactRequest = validate(updateContactValidation, request);
  const contactDb = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactRequest.id,
    },
  });
  if (contactDb === 0) {
    throw new ResponseError(404, "contact is not found");
  }
  return prismaClient.contact.update({
    where: {
      id: contactRequest.id,
    },
    data: {
      first_name: contactRequest.first_name,
      last_name: contactRequest.last_name,
      email: contactRequest.email,
      phone: contactRequest.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

export default {
  create,
  get,
  update,
};
