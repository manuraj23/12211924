module.exports = function validateUrl(url) {
  const regex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm;
  return regex.test(url);
};