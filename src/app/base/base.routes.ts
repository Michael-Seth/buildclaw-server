import { Router } from "express"
import UserRouter from "../user/user.routes"

const applicationRoutes = Router()

//=============================================
//=============================================
//                  USER
//=============================================
//=============================================

applicationRoutes.use("/user", UserRouter)

export default applicationRoutes
