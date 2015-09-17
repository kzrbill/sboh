var jsonfile = require('jsonfile');
var fs = require('fs');
var NodeRSA = require('node-rsa');

function ConfigLoader()
{   
    this.load = function()
    {   
        // Assumes config json in file 'sec.config.json'
        // and config.sbEncEndpoint has been incrupted with
        // pem of the private key pair
        var config = jsonfile.readFileSync('sec.config.json');

        var pubKey = new NodeRSA(fs.readFileSync(__dirname + '/../certs/key.pub'));
        config.sbEndpoint  = pubKey.decryptPublic(config.sbEncEndpoint, 'utf8');

        return config;
    }
}

module.exports.ConfigLoader = ConfigLoader;