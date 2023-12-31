import contactService from "../services/contact-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await contactService.create(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const result = await contactService.get(user, id);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const request = req.body;
    request.id = id;

    const result = await contactService.update(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  update,
};
