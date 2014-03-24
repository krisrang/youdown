YouDown.Utilities = {
  normalizeHash: function(hash, hashTypes) {
    for (var prop in hash) {
      if (hashTypes[prop] === 'ID') {
        hash[prop + 'Binding'] = hash[prop];
        delete hash[prop];
      }
    }
  },
  
  round: function(num, n) {
    var fl = parseFloat(num);
    var dec = Math.pow(10, n);
    return Math.round(fl * dec + 0.1) / dec;
  }
};