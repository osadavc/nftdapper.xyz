const getETHError = (error: { message: string }) =>
  error.message
    ? error.message
        ?.split("execution reverted")[1]
        ?.split(",")[0]
        ?.substring(2)
        ?.split(`"`)[0]
    : "Error Occurred";

export default getETHError;
