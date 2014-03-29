var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

var hash = crypto.createHash('SHA1'),
    sign = crypto.createSign('RSA-SHA1');
    
var outputFile = path.join(path.resolve('./build/releases/YouDown/'), 'YouDown.nw');
var privateKeyFile = path.join(process.env.HOME, '.ssh', 'rsa.pem');

var privateKey = fs.readFileSync(privateKeyFile);
    
fs.createReadStream(outputFile)
  .on('data', function(chunk) {
    hash.update(chunk);
    sign.update(chunk);
  })
  .on('end', function() {
    var checksum = hash.digest('hex');
    var signature = sign.sign(privateKey, 'base64');
    
    console.log("Checksum: " + checksum);
    console.log("Signature: " + signature);
  });