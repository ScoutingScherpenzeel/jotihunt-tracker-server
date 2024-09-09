import express from "express";
import * as adminController from "../controllers/admin.controller";
import verifyToken, { isAdmin } from "../middleware/auth.middleware";
import { body, check, param } from "express-validator";
import { User } from "../models/user.model";
import { validate } from "../middleware/validate.middleware";

// Validations
const createValidator = [
  body("name").notEmpty().withMessage("Naam mag niet leeg zijn.").trim().escape(),
  body("email").notEmpty().withMessage("E-mailadres mag niet leeg zijn.").isEmail().withMessage("E-mailadres is ongeldig.").trim(),
  body("password").notEmpty().withMessage("Wachtwoord mag niet leeg zijn."),
  body("email").custom((value, {}) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        throw new Error("E-mailadres is al in gebruik.");
      }
    });
  }),
];

const deleteValidator = [
  param("id").custom((value, { req }) => {
    return User.findById(value).then((user) => {
      if (!user) {
        throw new Error("Er is geen gebruiker met dit ID.");
      }
    });
  }),
];

const updateValidator = [
  param("id").custom((value, { req }) => {
    return User.findById(value).then((user) => {
      if (!user) {
        throw new Error("Er is geen gebruiker met dit ID.");
      }
    });
  }),
  body("email").custom((value, { req }) => {
    return User.findOne({ email: value }).then((user) => {
      if (user && user._id.toString() !== req.params?.id) {
        throw new Error("E-mailadres is al in gebruik.");
      }
    });
  }),
  body("name").optional().trim().escape(),
  body("email").optional().isEmail().withMessage("E-mailadres is ongeldig.").trim(),
  body("password").optional(),
  body("admin").optional().isBoolean().withMessage("Admin mag alleen true/false zijn."),
];

// Routes
const router = express.Router();

router.get("/users", [verifyToken, isAdmin], adminController.getUsers);
router.post("/users", [verifyToken, isAdmin, validate(createValidator)], adminController.createUser);
router.delete("/users/:id", [verifyToken, isAdmin, validate(deleteValidator)], adminController.deleteUser);
router.put("/users/:id", [verifyToken, isAdmin, validate(updateValidator)], adminController.updateUser);

export default router;
