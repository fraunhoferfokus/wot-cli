/**
 * Created by lba on 07/04/16.
 */
var program = require('commander');
var package = require('../package.json');
var advertiser = require("./wot-advertiser");
var discoverer = require("./wot-discoverer");
function list(val) {
    return val.split(',');
};

program
    .version(package.version)
    .allowUnknownOption(false);

program
    .command('search [query]')
    .alias('discover')
    .description('search for thing descriptions. [query] is not used yet is reserved for future use')
    .option("-p, --protocol [protocol]", "discovery protocol. value: ssdp or mdns", /^(mdns|ssdp)$/i,"ssdp")
    .action(function(query, options){
        console.log("start discovery over",options.protocol);
        discoverer.startDiscovery([options.protocol],query);
        process.on('SIGINT', function() {
            console.log("stop discovery. please wait ...");
            discoverer.stopDiscovery(function () {
                process.exit();
            });
        });
    }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ wot search');
    console.log('    $ wot search -p mdns');
    console.log();
});

program
    .command('expose <TDs...>')
    .alias('advertise')
    .description('expose thing descriptions')
    .option("-p, --protocol [protocol]", "discovery protocol. value: ssdp or mdns", /^(mdns|ssdp)$/i,"ssdp")
    .action(function(tds, options){
        console.log("start advertising",tds.toString(),"over",options.protocol);
        advertiser.startAdvertising([options.protocol],tds);
        process.on('SIGINT', function() {
            console.log("stop advertising. please wait ...");
            advertiser.stopAdvertising(tds, 2000, function () {
                process.exit();
            });
        });
    }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ wot expose http://example.org/td1.jsonld http://example.org/td2.jsonld');
    console.log('    $ wot expose -p mdns http://example.org/td.jsonld ');
    console.log();
});

program
    .command('*',"",{noHelp: true})
    .action(function(env){
        program.outputHelp();
    });

program.parse(process.argv);
