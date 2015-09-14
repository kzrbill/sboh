
var ursa = require('ursa');
var jsonfile = require('jsonfile');
var fs = require('fs');

function ConfigLoader()
{   
    this.load = function()
    {   
        // Assumes config json in file 'sec.config.json'
        // and config.sbEncEndpoint has been incrupted with
        // pem of the private key pair
        var config = jsonfile.readFileSync('sec.config.json');

        var crt = ursa.createPublicKey(fs.readFileSync('./certs/key.pub'));
        config.sbEndpoint = crt.publicDecrypt(config.sbEncEndpoint, 'base64', 'utf8');

        return config;
    }
}

module.exports.ConfigLoader = ConfigLoader;