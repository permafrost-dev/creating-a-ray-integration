var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = rng;
  var _crypto = _interopRequireDefault(require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var rnds8Pool = new Uint8Array(256);
  var poolPtr = rnds8Pool.length;
  function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
      _crypto.default.randomFillSync(rnds8Pool);
      poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  }
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  exports2.default = _default;
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _regex = _interopRequireDefault(require_regex());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function validate(uuid) {
    return typeof uuid === "string" && _regex.default.test(uuid);
  }
  var _default = validate;
  exports2.default = _default;
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _validate = _interopRequireDefault(require_validate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  function stringify(arr, offset = 0) {
    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var _default = stringify;
  exports2.default = _default;
});

// node_modules/uuid/dist/v1.js
var require_v1 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _rng = _interopRequireDefault(require_rng());
  var _stringify = _interopRequireDefault(require_stringify());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var _nodeId;
  var _clockseq;
  var _lastMSecs = 0;
  var _lastNSecs = 0;
  function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || _rng.default)();
      if (node == null) {
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      }
      if (clockseq == null) {
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
      }
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === void 0) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 122192928e5;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || (0, _stringify.default)(b);
  }
  var _default = v1;
  exports2.default = _default;
});

// node_modules/uuid/dist/parse.js
var require_parse = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _validate = _interopRequireDefault(require_validate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function parse(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  }
  var _default = parse;
  exports2.default = _default;
});

// node_modules/uuid/dist/v35.js
var require_v35 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = _default;
  exports2.URL = exports2.DNS = void 0;
  var _stringify = _interopRequireDefault(require_stringify());
  var _parse = _interopRequireDefault(require_parse());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }
  var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  exports2.DNS = DNS;
  var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  exports2.URL = URL;
  function _default(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (typeof namespace === "string") {
        namespace = (0, _parse.default)(namespace);
      }
      if (namespace.length !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes = new Uint8Array(16 + value.length);
      bytes.set(namespace);
      bytes.set(value, namespace.length);
      bytes = hashfunc(bytes);
      bytes[6] = bytes[6] & 15 | version;
      bytes[8] = bytes[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = bytes[i];
        }
        return buf;
      }
      return (0, _stringify.default)(bytes);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
  }
});

// node_modules/uuid/dist/md5.js
var require_md5 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _crypto = _interopRequireDefault(require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function md5(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return _crypto.default.createHash("md5").update(bytes).digest();
  }
  var _default = md5;
  exports2.default = _default;
});

// node_modules/uuid/dist/v3.js
var require_v3 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _v = _interopRequireDefault(require_v35());
  var _md = _interopRequireDefault(require_md5());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var v3 = (0, _v.default)("v3", 48, _md.default);
  var _default = v3;
  exports2.default = _default;
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _rng = _interopRequireDefault(require_rng());
  var _stringify = _interopRequireDefault(require_stringify());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || _rng.default)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return (0, _stringify.default)(rnds);
  }
  var _default = v4;
  exports2.default = _default;
});

// node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _crypto = _interopRequireDefault(require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function sha1(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return _crypto.default.createHash("sha1").update(bytes).digest();
  }
  var _default = sha1;
  exports2.default = _default;
});

// node_modules/uuid/dist/v5.js
var require_v5 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _v = _interopRequireDefault(require_v35());
  var _sha = _interopRequireDefault(require_sha1());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var v5 = (0, _v.default)("v5", 80, _sha.default);
  var _default = v5;
  exports2.default = _default;
});

// node_modules/uuid/dist/nil.js
var require_nil = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _default = "00000000-0000-0000-0000-000000000000";
  exports2.default = _default;
});

// node_modules/uuid/dist/version.js
var require_version = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _validate = _interopRequireDefault(require_validate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function version(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.substr(14, 1), 16);
  }
  var _default = version;
  exports2.default = _default;
});

// node_modules/uuid/dist/index.js
var require_dist = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  Object.defineProperty(exports2, "v1", {
    enumerable: true,
    get: function() {
      return _v.default;
    }
  });
  Object.defineProperty(exports2, "v3", {
    enumerable: true,
    get: function() {
      return _v2.default;
    }
  });
  Object.defineProperty(exports2, "v4", {
    enumerable: true,
    get: function() {
      return _v3.default;
    }
  });
  Object.defineProperty(exports2, "v5", {
    enumerable: true,
    get: function() {
      return _v4.default;
    }
  });
  Object.defineProperty(exports2, "NIL", {
    enumerable: true,
    get: function() {
      return _nil.default;
    }
  });
  Object.defineProperty(exports2, "version", {
    enumerable: true,
    get: function() {
      return _version.default;
    }
  });
  Object.defineProperty(exports2, "validate", {
    enumerable: true,
    get: function() {
      return _validate.default;
    }
  });
  Object.defineProperty(exports2, "stringify", {
    enumerable: true,
    get: function() {
      return _stringify.default;
    }
  });
  Object.defineProperty(exports2, "parse", {
    enumerable: true,
    get: function() {
      return _parse.default;
    }
  });
  var _v = _interopRequireDefault(require_v1());
  var _v2 = _interopRequireDefault(require_v3());
  var _v3 = _interopRequireDefault(require_v4());
  var _v4 = _interopRequireDefault(require_v5());
  var _nil = _interopRequireDefault(require_nil());
  var _version = _interopRequireDefault(require_version());
  var _validate = _interopRequireDefault(require_validate());
  var _stringify = _interopRequireDefault(require_stringify());
  var _parse = _interopRequireDefault(require_parse());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
});

// src/Ray.ts
__markAsModule(exports);
__export(exports, {
  Ray: () => Ray,
  default: () => Ray_default
});

// src/payloadUtils.ts
var import_uuid = __toModule(require_dist());

// src/Origin.ts
var OriginData = {
  function_name: "my_test_func",
  file: "my-file.js",
  line_number: 16,
  hostname: "my-hostname"
};

// src/payloadUtils.ts
function createSendablePayload(payloads = [], uuid = null) {
  uuid = uuid != null ? uuid : (0, import_uuid.v4)({}).toString();
  return {uuid, payloads, meta: {my_package_version: "1.0.0"}};
}
function createPayload(type, label, content, contentName = "content") {
  let result = {
    type,
    content: {
      [contentName]: content,
      label
    },
    origin: OriginData
  };
  if (result.content.label === void 0) {
    delete result.content["label"];
  }
  return result;
}
function createColorPayload(colorName, uuid = null) {
  const payload = createPayload("color", void 0, colorName, "color");
  return createSendablePayload([payload], uuid);
}
function createHtmlPayload(htmlContent, uuid = null) {
  const payload = createPayload("custom", "HTML", htmlContent);
  return createSendablePayload([payload], uuid);
}
function createLogPayload(text, uuid = null) {
  const payload = createPayload("log", "log", text);
  return createSendablePayload([payload], uuid);
}

// src/Ray.ts
var superagent = require("superagent");
var Ray = class {
  constructor() {
    this.uuid = null;
  }
  color(name) {
    const payload = createColorPayload(name, this.uuid);
    return this.sendRequest(payload);
  }
  html(name) {
    const payload = createHtmlPayload(name, this.uuid);
    return this.sendRequest(payload);
  }
  send(...args) {
    args.forEach((arg) => {
      const payload = createLogPayload("log", null, arg);
      this.sendRequest(payload);
    });
    return this;
  }
  ban() {
    return this.send("\u{1F576}");
  }
  charles() {
    return this.send("\u{1F3B6} \u{1F3B9} \u{1F3B7} \u{1F57A}");
  }
  sendRequest(request) {
    this.uuid = request.uuid;
    superagent.post(`http://localhost:23517/`).send(request).then((resp) => {
    }).catch((err) => {
    });
    return this;
  }
};
var Ray_default = Ray;
