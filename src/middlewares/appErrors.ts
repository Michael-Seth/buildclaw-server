import { Request, Response, NextFunction, RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import Joi, { AnySchema } from "joi"


export const clientBadRequestError = async (err: any, _: Request, res: Response, __: NextFunction) => {
  if (err) {
    return res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    })
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "⚠️ Oops! It looks like something went wrong on your end. Please double-check your client-side code and try again! 💻🔍",
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    })
  }
}

export const clientPatheNotFoundError: RequestHandler = (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({
      statusCode: 404,
      message: "This path exists by only by faith",
      data: null,
    })
  }

  export function createSchemaFromDto(dto: Record<string, Joi.Schema>): Joi.Schema {
    return Joi.object(dto)
  }

 export function joiValidator(dto: Record<string, Joi.Schema>) {
    const schema = createSchemaFromDto(dto)
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: error.details[0].message,
        })
      }
      next()
    }
  }
