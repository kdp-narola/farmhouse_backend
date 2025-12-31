const generateSignature = require("./generateSignature");

function verifySignature(payload, signature, type = "nonwebhook") {
  const generatedSignature = generateSignature(payload, type);
  return generatedSignature === signature;
}
module.exports = verifySignature;