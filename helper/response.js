export function e(
  errorCode,
  message = "Something went wrong. Try again later.",
  res,
  error
) {
  res.status(errorCode).json({
    success: false,
    message,
    error,
  });
}

export function s(message, data = {}, res) {
  res.status(200).json({
    success: true,
    message,
    ...data,
  });
}
