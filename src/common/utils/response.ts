export const successResponse = (
  res: any,
  message: string,
  data: any = {},
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
