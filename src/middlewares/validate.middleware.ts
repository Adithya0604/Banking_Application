import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

/*Need to validate the upcoming input */
export const validate = (scheme: ZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // await scheme.parseAsync({
      //   body: req.body,
      //   query: req.query,
      //   params: req.params,
      // });
      req.body = await scheme.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        console.log("formattedErrors:-", formattedErrors);
        console.log("Errors inside:-", error);

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "INVALID INPUT PAYLOAD",
            details: formattedErrors,
          },
        });
        return;
      }
      next(error);
    }
  };
};

/* EXPLATION */
/* Simple, User input scheme is created then we declared it has a object. When user will fill that form and click submit or proceed with Onboarding flow. then we have to validate the user input details.
So, we created a simple middleware for that input payload. Input payload comes to backed there are few other components which it loops in. We will check that too like params etc. Just we need TRUE or FALSE.
If input payload will be validated inside middleware then we will send it forward with next function. If not, Just return the error saying worng format.        */
