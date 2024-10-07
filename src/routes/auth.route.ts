import express from "express";
import * as authController from "../controllers/auth.controller";
import { body } from "express-validator";
import verifyToken from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

// Validators
const updatePasswordValidator = [
  body("oldPassword").notEmpty().withMessage("Oude wachtwoord mag niet leeg zijn."),
  body("newPassword").notEmpty().withMessage("Nieuw wachtwoord mag niet leeg zijn."),
  body("confirmPassword").notEmpty().withMessage("Nieuw wachtwoord bevestigeing mag niet leeg zijn."),
  body("newPassword")
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage("Wachtwoorden komen niet overeen"),
];

const router = express.Router();

router.post("/login", authController.login);
router.post("/update-password", [verifyToken, validate(updatePasswordValidator)], authController.updatePassword);

export default router;
