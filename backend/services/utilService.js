function isEmptyObj(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function calcDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = _toRad(lat2 - lat1);
  var dLon = _toRad(lon2 - lon1);
  var lat1 = _toRad(lat1);
  var lat2 = _toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;

  function _toRad(Value) {
    return Value * Math.PI / 180;
  }
}

module.exports = {
  isEmptyObj,
  calcDistance
};