import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import config from "../config/app.config";
import { ServiceError } from "../middlewares/errors";

export interface CustomRequest extends Request {
  profileImage: string;
  email: string;
  fullName: string;
  userTag: string;
  // role: userRole
  userId: string;
  currentIpAddress: string;
  deviceType: string;
  //    user: User
  file: any;
}

export interface CustomResponse extends Response {
    customSuccessMessage?: string
    customErrorMessage?: string
    errorObject?: any
  }

export const authenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let ipAddress: string;

    if (req.headers["x-forwarded-for"]) {
      const forwardedIps = (req.headers["x-forwarded-for"] as string).split(
        ","
      );
      ipAddress = forwardedIps[0].trim();
    } else {
      ipAddress = req.ip || "";
    }

    const token = getTokenFromHeader(req);
    const { userId } = verifyJWT(token);

    if (!userId) {
      throw new ServiceError(
        "Invalid/Expired Token, Please Go Back And Login",
        401
      );
    }
    // req.userId = userId;

    // const userRepository = AppDataSource.getRepository(User);
    // const user = await userRepository.findOne({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   throw new ServiceError("User not registered");
    // }

    // if (!user.isEmailVerified) {
    //   throw new ServiceError(
    //     "Email address not verified, please verify your email address",
    //     403
    //   );
    // }
    // if (!user.isPhoneVerified) {
    //   throw new ServiceError(
    //     "Phone number not verified, please verify your phone number",
    //     403
    //   );
    // }
    // if (user.isSuspended) {
    //   throw new ServiceError(
    //     "Your account has been suspended, please contact support for help and enquries",
    //     403
    //   );
    // }
    // const lastInteractionTime = user.lastInteractionTimestamp as any;
    // const currentTime = new Date().getTime();
    // const sessionTimeout = Number(config.APP_PIN_LOCK) * 60_000;

    // const { originalUrl } = req;
    // const parts = originalUrl.split("/");
    // const desiredPart = parts.slice(0, 5).join("/");

    // // if (currentTime - lastInteractionTime > sessionTimeout && desiredPart !== config.VERIFY_PASSCODE_PATH) {
    // //   throw new ServiceError("App is locked, please enter pin to continue", 403)
    // // }

    // user.lastInteractionTimestamp = new Date();
    // await userRepository.save(user);

    // req.profileImage = user.profileImage;
    // req.fullName = `${user.firstName} ${user.lastName}`;
    // req.email = user.email;
    // req.currentIpAddress = ipAddress;
    // req.deviceType = user.deviceType;
    // // req.role = user.role;
    // req.userTag = user.username;
    // // req.user = user;

    next();
  } catch (error) {
    serviceError(res, error);
  }
};

export const getTokenFromHeader = (req: CustomRequest): string => {
    try {
      const authorizationHeader = req.headers.authorization
  
      if (!authorizationHeader) {
        throw new ServiceError("No access token provided.", 401)
      }
      const tokenParts = authorizationHeader.split(" ")
  
      if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
        throw new ServiceError("Invalid authorization header format.", 401)
      }
  
      const accessToken = tokenParts[1]
  
      if (!accessToken) {
        throw new ServiceError("Invalid access token provided.", 401)
      }
  
      return accessToken
    } catch (error) {
      throw new ServiceError(error.message, 401)
    }
  }

  export const verifyJWT = (token: any): any => {
    try {
      if (!config.JWT_SECRET) {
        throw new ServiceError("JWT_SECRET is not defined in the configuration", 401)
      }
      const decodedToken: any = jwt.verify(token, config.JWT_SECRET)
      return decodedToken
    } catch (error: any) {
      throw new ServiceError("Token Expired", 401)
    }
  }

  const serviceError = (res: Response, error: ServiceError) => {
    res.status(error.code).json({
      success: false,
      status: error.status,
      message: error.message,
    })
  }