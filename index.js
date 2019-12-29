"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EDataType;
(function (EDataType) {
    EDataType[EDataType["STRING"] = 0] = "STRING";
    EDataType[EDataType["INTEGER"] = 1] = "INTEGER";
    EDataType[EDataType["FLOAT"] = 2] = "FLOAT";
    EDataType[EDataType["BOOLEAN"] = 3] = "BOOLEAN";
    EDataType[EDataType["FLAG"] = 4] = "FLAG";
})(EDataType || (EDataType = {}));
var PARSERS = [
    function (str) { return str; },
    function (str) { return Number.parseInt(str); },
    function (str) { return Number.parseFloat(str); },
    function (str) {
        if (!str)
            return true;
        if (['T', 'TRUE', 'Y', 'YES', 'S', 'SI'].includes(str.toUpperCase()))
            return true;
        return false;
    }
];
function check_arg(arg) {
    return arg.startsWith('-');
}
function clean_name(arg) {
    return arg.startsWith('--') ? arg.substr(2) : arg.substr(1);
}
function unquoted(str) {
    var c = str[0];
    if (c === '"' || c === "'") {
        str = str.substr(1);
        if (str[str.length - 1] === c)
            str = str.substr(0, str.length - 1);
    }
    return str;
}
function parser_defs(defs) {
    var info = {};
    var val;
    for (var k in defs) {
        val = defs[k];
        if (typeof val === 'number') {
            info[k] = {
                type: val
            };
        }
        else if (typeof val === 'string') {
            if (!info[val])
                throw new Error(k + " no puede ser un alias para un argumento desconocido(" + val + ")");
            info[k] = Object.assign({ alias: val }, info[val]);
        }
        else {
            info[k] = val;
        }
    }
    return info;
}
var commandLine = function (options) {
    var defs = parser_defs(options);
    var l = process.argv.length;
    var out = {
        _node: process.argv[0],
        _entry: process.argv[1]
    };
    var uks;
    var fls;
    var arg;
    var key;
    var def;
    var ac = 0;
    for (var i = 2; i < l; i++) {
        arg = unquoted(process.argv[i]);
        if (check_arg(arg)) {
            if (def) {
                out[key] = '';
                fls = fls || [];
                fls.push(key);
            }
            key = clean_name(arg);
            def = defs[key];
            if (!def) {
                uks = uks || [];
                uks.push(key);
                def = { type: EDataType.STRING };
            }
            else if (def.type === EDataType.FLAG) {
                out[key] = true;
                def = null;
            }
        }
        else if (!def) {
            out[ac++] = arg;
        }
        else {
            if (def.alias)
                key = def.alias;
            out[key] = PARSERS[def.type](arg);
            def = null;
        }
    }
    if (ac)
        out._length = ac;
    if (uks)
        out._unknows = uks;
    if (fls)
        out._faileds = fls;
    for (key in defs) {
        if (defs[key].required && !defs[key].alias && !out.hasOwnProperty(key)) {
            out._missing = out._missing || [];
            out._missing.push(key);
        }
    }
    return out;
};
(function () {
    for (var k in EDataType) {
        Object.defineProperty(commandLine, k, {
            value: EDataType[k],
            enumerable: true,
            writable: false,
            configurable: false
        });
    }
}());
exports.default = commandLine;
//# sourceMappingURL=index.js.map