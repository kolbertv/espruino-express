export default cache = (key, value) => {
  if (typeof value == "undefined") {
    return cache[key];
  }
  cache[key] = value;
};
