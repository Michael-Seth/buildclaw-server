import { Router } from "express"
import { authenticated, CustomRequest, CustomResponse } from "../../shared/auth"
import { joiValidator } from "../../middlewares/appErrors"
import UserController from "./user.controllers"

const UserRouter = Router()
const userController = new UserController()

//UserRouter.use(authenticated)
UserRouter.post("/login", (req: CustomRequest, res: CustomResponse) => {
    userController.execute(req, res, () => userController.login(req, res))
  })
export default UserRouter
