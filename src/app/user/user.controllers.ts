import { ServiceError } from "../../middlewares/errors"
import { CustomRequest, CustomResponse } from "../../shared/auth"
import BaseController from "../base/base.controller"
import UserService from "./user.service"

export default class UserController extends BaseController {
    private readonly userService: UserService
  
    constructor() {
      super()
      this.userService = new UserService()
    }
  
    // @processServerLog
    async login(req: CustomRequest, res: CustomResponse): Promise<any> {
      try {
  
        const data = await this.userService.login()
  
        this.sendSuccessResponse(res, "Successful", data)
      } catch (error: any) {
        console.log("Exception error ====>>>>", error)
        if (error instanceof ServiceError) {
          this.serviceError(res, error)
        } else {
          this.buildclawException(res, error)
        }
      }
    }

}