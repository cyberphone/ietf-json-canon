// Date serializer fixes the problem
Date.prototype.toJSON = function () {
  let date = this.toISOString();
  // In this particular case we selected a UTC notation
  // yyyy-mm-ddThh:mm:ssZ
  return date.substring(0, date.indexOf('.')) + 'Z';
};
