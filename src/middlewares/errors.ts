export class CustomAPIError extends Error {
    message: string
    code: number
    status?: number
  
    constructor(message: string = "Internal server error", code: number = 500, status: number = 500) {
      super(message)
      this.code = code
      this.status = status
    }
  }

export class ServiceError extends CustomAPIError {
    constructor(message: string, code: number = 400, status: number = 400) {
      super(message, code, status)
    }
  }

  