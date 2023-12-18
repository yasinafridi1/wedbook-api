function SuccessMessages(res, data = null, status = 201) {
  return res.status(status).json({
    success: true,
    data,
  });
}

function ErrorMessages(res, status = 500, error = null) {
  return res.status(status).json({
    success: false,
    message: error ? error : "Internal server error",
  });
}

module.exports = {
  SuccessMessages,
  ErrorMessages,
};
