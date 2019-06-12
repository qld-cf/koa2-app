/*
 * @Description: redis封装
 * @Author: your name
 * @Date: 2019-05-13 14:21:08
 * @LastEditTime: 2019-06-12 16:21:30
 * @LastEditor: Please set LastEditors
 */


'use strict';

const IoRedis = require('ioredis');
const EventEmitter = require('events').EventEmitter;
const config = require('../config');
const log = require('./log');

class Redis extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.namespace = options.namespace || 'app-starter-koa:';
    this.ttl = options.ttl || 3600;
    if (options.cluster) {
      this.client = new IoRedis.Cluster(options.cluster, options.options);
    } else if (options.sentinel) {
      this.client = new IoRedis(options.sentinel);
    } else {
      let standalone = options.standalone || {host: 'localhost', port: 6379};
      this.client = new IoRedis(standalone);
    }
    this.client.on('error', err => {
      log.error('redis error', err.message);
      // this.emit('error', err)
    });
    this.client.on('connect', () => {
      log.info('redisClient connect');
      this.emit('connect');
    });
    this.on('reconnecting', () => {
      log.info('redisClient reconnecting');
      this.emit('reconnecting');
    });
  }
  /**
   * 获取缓存的key
   * @param cacheKey
   */
  getKey(cacheKey) {
    return this.namespace + cacheKey;
  }
  keys(prefix) {
    return this.client.keys(this.getKey(prefix));
  }
  get(cacheKey) {
    return this.client.get(this.getKey(cacheKey)).then(reply => {
      let ret;
      try {
        ret = JSON.parse(reply);
      } catch (e) {
        return Promise.reject(e);
      }
      return ret;
    });
  }
  set(cacheKey, value, ttl) {
    const theTTL = ttl || this.ttl;
    if (typeof value === 'undefined') {
      // eslint-disable-next-line
      value = value + '';
    }
    return this.client.setex(this.getKey(cacheKey), theTTL, JSON.stringify(value));
  }
  nativeGet(cacheKey) {
    return this.client.get(this.getKey(cacheKey));
  }
  nativeSet(cacheKey, value) {
    return this.client.set(this.getKey(cacheKey), value);
  }
  setex(cacheKey, value, ttl) {
    const theTTL = ttl || this.ttl;
    return this.client.setex(this.getKey(cacheKey), theTTL, value);
  }
  del(cacheKey) {
    return this.client.del(this.getKey(cacheKey));
  }
  expire(cacheKey, ttl) {
    return this.client.expire(this.getKey(cacheKey), ttl);
  }
  ttl(cacheKey) {
    return this.client.ttl(this.getKey(cacheKey));
  }
  incr(cacheKey) {
    return this.client.incr(this.getKey(cacheKey));
  }
  incrby(cacheKey, step = 1) {
    return this.client.incrby(this.getKey(cacheKey), step);
  }
  decr(cacheKey) {
    return this.client.decr(this.getKey(cacheKey));
  }
  decrby(cacheKey, step = 1) {
    return this.client.decrby(this.getKey(cacheKey), step);
  }
  hset(cacheKey, key, value) {
    return this.client.hset(this.getKey(cacheKey), key, value);
  }
  hmset(cacheKey, obj) {
    return this.client.hmset(this.getKey(cacheKey), obj);
  }
  hget(cacheKey, key) {
    return this.client.hget(this.getKey(cacheKey), key);
  }
  hdel(cacheKey, key) {
    return this.client.hdel(this.getKey(cacheKey), key);
  }
  hgetall(cacheKey) {
    return this.client.hgetall(this.getKey(cacheKey));
  }
  hincrby(cacheKey, key, increment = 1) {
    return this.client.hincrby(this.getKey(cacheKey), key, increment);
  }
}

module.exports = new Redis(config.redis);
