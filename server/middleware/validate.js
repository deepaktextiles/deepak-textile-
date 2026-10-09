import { ZodError } from "zod";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: error.errors[0]?.message || "Validation failed",
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};
