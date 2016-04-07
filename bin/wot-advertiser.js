/**
 * Created by lba on 07/04/16.
 */
var os = require('os');
var package = require('../package.json');
var ssdp = require("peer-ssdp");
var SERVER = os.type() + "/" + os.release() + " UPnP/1.1 wot-cli/"+package.version;
var WOT_SSDP_TYPE = "urn:w3c-org:device:Thing:1";
var WOT_MDNS_TYPE = "_wot._tcp";
var ssdpPeer = null;

var timeString = function(){
    return new Date().toTimeString().split(" ")[0];
};

var generateRandomUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

var getSSDPPeer = function (urls, callback) {
    if(ssdpPeer == null){
        ssdpPeer = ssdp.createPeer();
        ssdpPeer.on("ready", function () {
            console.log(timeString(),"*** wot ssdp advertiser is ready");
            callback && callback(ssdpPeer);
        }).on("search", function (headers, address) {
            var ST = headers.ST;
            if(ST != WOT_SSDP_TYPE){
                return;
            }
            var timeout = parseInt((parseInt(headers.MX) || 0)*800*Math.random());
            console.log(timeString(),">>> receive request from a wot client",address.address);
            setTimeout(function(){
                for(var i in urls){
                    var url = urls[i];
                    var uuid = generateRandomUUID();
                    var headers = {
                        LOCATION: "",
                        SERVER: SERVER,
                        ST: WOT_SSDP_TYPE,
                        USN: "uuid:" + uuid + "::"+WOT_SSDP_TYPE,
                        "TD.WOT.W3C.ORG": url
                    };
                    console.log(timeString(),"<<< send TD <"+url+"> to wot client", address.address);
                    ssdpPeer.reply(headers, address);
                }
            },timeout);
        }).on("close", function () {
            console.log(timeString(),"*** wot ssdp advertiser stopped");
        }).start();
    }
    else{
        callback && callback(ssdpPeer);
    }
};

var advertiseSSDP = function (urls) {
    getSSDPPeer(urls,function (ssdpPeer) {
        for(var i in urls){
            var url = urls[i];
            var uuid = generateRandomUUID();
            ssdpPeer.alive({
                NT: WOT_SSDP_TYPE,
                USN: "uuid:" + uuid + "::"+WOT_SSDP_TYPE,
                LOCATION: "",
                SERVER: SERVER,
                "TD.WOT.W3C.ORG": url
            });
        }
    });
};

var advertiseMDNS = function (urls) {
    console.log(timeString(),"*** mdns advertising is not supported yet. please use ssdp instead.");
};

var startAdvertising = function(protocols,urls){
    if(protocols.indexOf("ssdp") != -1){
        advertiseSSDP(urls);
    }
    if(protocols.indexOf("mdns") != -1){
        advertiseMDNS(urls);
    }
};

var stopAdvertising = function (urls, timeout, callback) {
    if(ssdpPeer != null){
        for(var i in urls){
            var url = urls[i];
            var uuid = generateRandomUUID();
            ssdpPeer.byebye({
                NT: WOT_SSDP_TYPE,
                USN: "uuid:" + uuid + "::"+WOT_SSDP_TYPE,
                LOCATION: "",
                SERVER: SERVER,
                "TD.WOT.W3C.ORG": url
            });
        }
        setTimeout(function () {
            ssdpPeer.close();
        },timeout);
        ssdpPeer.on("close", function () {
            callback && callback();
        });
    }
    else{
        callback && callback();
    }
};

module.exports.startAdvertising = startAdvertising;
module.exports.stopAdvertising = stopAdvertising;