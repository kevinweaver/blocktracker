"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
/**
 * @class Explorer
 * A basic blockchain explorer, given a block start number
 * and an optional end number, it provide several analytics.
 */
var Explorer = /** @class */ (function () {
    function Explorer(options) {
        this.start = options.start;
        this.end = options.end === undefined ? 0 : options.end;
    }
    Explorer.prototype.getStart = function () {
        return this.start;
    };
    return Explorer;
}());
exports.Explorer = Explorer;
//# sourceMappingURL=Explorer.js.map