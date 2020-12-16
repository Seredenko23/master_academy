function generateError(message, name = '') {
  const err = new Error(message);
  err.name = name;
  return err;
}

module.exports = { generateError };
