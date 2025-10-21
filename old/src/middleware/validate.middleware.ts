import express from "express";
import { ContextRunner } from "express-validator";

export const validate = (validations: ContextRunner[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Run validations
    const errors = await Promise.all(validations.map((validation) => validation.run(req)));

    // If any errors, return 400 with errors
    if (errors.some((error) => !error.isEmpty())) {
      return res.status(400).json({ errors: errors.flatMap((error) => error.array()) });
    }

    next();
  };
};
