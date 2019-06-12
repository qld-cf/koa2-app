'use strict';

const Stream = require('stream');
const app = require('../app');

const socket = new Stream.Duplex();
const req = Object.assign({headers: {}, socket}, Stream.Readable.prototype);
const res = Object.assign({_headers: {}, socket}, Stream.Writable.prototype);
req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
res.getHeader = k => res._headers[k.toLowerCase()];
res.setHeader = (k, v) => {
  res._headers[k.toLowerCase()] = v;
};
res.removeHeader = (k) => delete res._headers[k.toLowerCase()];

const ctx = app.createContext(req, res);

module.exports = ctx;
