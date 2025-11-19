export default function sendResponse(res, status, data, error, message){
  res.status(status).json({
    data: data,
    error: error,
    message: message

  })
}