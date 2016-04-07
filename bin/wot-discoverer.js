/**
 * Created by lba on 07/04/16.
 */
var ssdp = require("peer-ssdp");
var WOT_SSDP_TYPE = "urn:w3c-org:device:Thing:1";
var WOT_MDNS_TYPE = "_wot._tcp";
var ssdpPeer = null;

var timeString = function(){
    return new Date().toTimeString().split(" ")[0];
};

var getSSDPPeer = function (callback) {
    if(ssdpPeer == null){
        ssdpPeer = ssdp.createPeer();
        ssdpPeer.on("ready", function () {
            console.log(timeString(),"*** wot ssdp discoverer is ready");
            callback && callback(ssdpPeer);
        }).on("notify", function (headers, address) {
            var td = headers['TD.WOT.W3C.ORG'];
            if(headers.NT == WOT_SSDP_TYPE && td){
                if(headers.NTS == ssdp.ALIVE){
                    console.log(timeString(),"<<< Thing with TD <"+td+"> appeared ("+address.address+")");
                }
                else if(headers.NTS == ssdp.BYEBYE){
                    console.log(timeString(),"<<< Thing with TD <"+td+"> disappeared ("+address.address+")");
                }
            }
        }).on("found", function (headers, address) {
            var td = headers['TD.WOT.W3C.ORG'];
            if(headers.ST == WOT_SSDP_TYPE && td){
                console.log(timeString(),"<<< Thing with TD <"+td+"> found ("+address.address+")");
            }
        }).on("close", function () {
            console.log(timeString(),"*** wot ssdp discoverer stopped");
        }).start();
    }
    else{
        callback && callback(ssdpPeer);
    }
};

var discoverSSDP = function () {
    getSSDPPeer(function (ssdpPeer) {
        ssdpPeer.search({
            ST: WOT_SSDP_TYPE
        });
    });
};

var discoverMDNS = function (urls) {
    console.log(timeString(),"*** mdns discovery is not supported yet. please use ssdp instead.");
};

var startDiscovery = function(protocols,query){
    if(protocols.indexOf("ssdp") != -1){
        discoverSSDP(query);
    }
    if(protocols.indexOf("mdns") != -1){
        discoverMDNS(query);
    }
};

var stopDiscovery = function (callback) {
    if(ssdpPeer != null){
        ssdpPeer.on("close", function () {
            callback && callback();
        }).close();
    }
};

module.exports.startDiscovery = startDiscovery;
module.exports.stopDiscovery = stopDiscovery;