class AppError extends Error {
  constructor(statusCode, massage) {
    super(massage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
  }
}
export default AppError;
