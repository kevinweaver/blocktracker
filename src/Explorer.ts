interface ExplorerOptions {
  start: number;
  end?: number;
}

/**
 * @class Explorer
 * A basic blockchain explorer, given a block start number
 * and an optional end number, it provide several analytics.
 */
export class Explorer {
  start: number;
  end: number;

  constructor(options: ExplorerOptions) {
    this.start = options.start;
    this.end = options.end === undefined ? 0 : options.end;
  }

  getStart() {
    return this.start;
  }
}
