module.exports = {
  emailAlreadyExists: {
    statusCode: 409,
    error: "emailAlreadyExists",
    message: "Email Id Already Exists"
  },
  invalidUser: {
    statusCode: 401,
    error: "invalidUser",
    message: "Invalid User"
  },
  UnAuthorized: {
    statusCode: 401,
    error: "Unauthorized",
    message: "UnAuthrozied"
  },
  UnexpectedErrorOccurred: {
    statusCode: 500,
    error: "UnexpectedErrorOccurred",
    message: "An unexpected error occurred , please try again"
  },
  AuthMissing: {
    statusCode: 401,
    error: "AuthorizationMissing",
    message: "Authorization Missing"
  },
  InvalidToken: {
    statusCode: 401,
    error: "InvalidToken",
    message: "Invalid Token"
  }
}
