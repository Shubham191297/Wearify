class CustomError extends Error {
  constructor(message, description, status) {
    super(message);
    this.description = description;
    this.status = status;
  }
}

export default CustomError;
