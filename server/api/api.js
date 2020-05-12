'use strict';
// Load modules

const Moment = require('moment');
const Promise = require('bluebird');
const Request = require('promise-request-retry');
const UrlUnshort = require('url-unshort')();
const jsftp = require("jsftp");
const fs = require('fs');
const Client = require('ftp');

exports.plugin = {
    name: 'api',
    register: function (server) {

        server.route({
            method: 'POST',
            path: '/ftp',
            handler: async function (request, h) {
                const payload = request.payload;
                const file = await Request({
                    url: payload.file,
                    encoding: null
                });
                await Promise.fromCallback(cb => {
                    const c = new Client();
                    c.on('ready', function() {
                        c.put(file, `${process.env.FTP_BASE_PATH}${payload.filename}`, cb);
                    });                    
                    c.connect({
                        host: '34.199.138.182',
                        port: 21, // defaults to 21
                        user: 'ftpuser', // defaults to "anonymous"
                        password: 'soluntech' // defaults to "@anonymous"
                    });
                });
                return payload;
            }
        });
    }
};
