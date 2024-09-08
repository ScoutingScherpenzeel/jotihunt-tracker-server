import express from "express";
import * as adminController from "../controllers/admin.controller";
import verifyToken, { isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/users", [verifyToken, isAdmin], adminController.getUsers);
router.post("/users", [verifyToken, isAdmin], adminController.createUser);
router.delete("/users/:id", [verifyToken, isAdmin], adminController.deleteUser);
router.put("/users/:id", [verifyToken, isAdmin], adminController.updateUser);

export default router;
