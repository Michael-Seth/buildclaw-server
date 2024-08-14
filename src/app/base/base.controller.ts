import { Request, Response } from "express"
import { injectable } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import Joi, { AnySchema } from "joi"
import { AxiosError } from "axios"
import { CustomResponse } from "../../shared/auth"
import { CustomAPIError, ServiceError } from "../../middlewares/errors"

type DtoSchema<T> = {
  [K in keyof T]: AnySchema
}

@injectable()
export default class BaseController {
  public sendSuccessResponse = (res: Response, message?: string, data?: any, status = StatusCodes.OK) => {
    res.status(status).json({
      success: true,
      message,
      data,
    })
  }

  public execute = async (req: Request, res: Response, controllerFunction: () => Promise<void | any>): Promise<void> => {
    controllerFunction()
  }

  public buildclawException = (res: CustomResponse, error: CustomAPIError) => {
    res.customErrorMessage = error.message
    res.errorObject = error

    res.status(500).json({
      success: false,
      status: error.status,
      message: error.message,
    })
  }

  public serviceError = (res: CustomResponse, error: ServiceError) => {
    res.customErrorMessage = error.message
    res.errorObject = error

    res.status(error.code).json({
      success: false,
      status: error.status,
      message: error.message,
    })
  }

  returnInterface<T>(schema: DtoSchema<T>): T {
    const result: Partial<T> = {}
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const property = schema[key] as AnySchema
        const typeString = property.describe().type
        if (typeString) {
          const type = typeString.split(".")[1]
          result[key] = type as unknown as T[Extract<keyof T, string>]
        }
      }
    }
    return result as T
  }

  returnObjInterface<T>(schema: DtoSchema<T>): T {
    const result: Partial<T> = {}

    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const property = schema[key] as AnySchema
        const typeString = property.describe().type

        if (typeString === "object") {
          const nestedSchema = property.describe().keys
          if (nestedSchema) {
            result[key] = this.returnObjInterface(nestedSchema as DtoSchema<T[Extract<keyof T, string>]>) as T[Extract<keyof T, string>]
          }
        } else {
          const type = typeString?.split(".")[1]
          if (type) {
            result[key] = type as unknown as T[Extract<keyof T, string>]
          }
        }
      }
    }

    return result as T
  }
  public axiosError = (res: CustomResponse, error: AxiosError) => {
    res.customErrorMessage = error.message
    res.errorObject = error?.response ? error.response.data : error

    const errorMessage = (error)

    res.status(400).json({
      success: false,
      code: 400,
      message: errorMessage,
    })
  }

//   paginateQueryLogic(responseData: any[], req) {
//     const { page = 1, pageSize = 10 } = req.query

//     try {
//       const totalItems = responseData.length
//       const totalPages = Math.ceil(totalItems / pageSize)

//       const startIndex = (page - 1) * pageSize
//       const endIndex = page * pageSize

//       const paginatedItems = responseData.slice(startIndex, endIndex)

//       const paginationInfo = {
//         totalItems,
//         totalPages,
//         currentPage: page,
//       }

//       return {
//         paginatedItems,
//         meta: paginationInfo,
//       }
//     } catch (error) {
//       throw error
//     }
//   }
}
