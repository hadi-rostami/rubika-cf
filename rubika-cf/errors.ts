export class RubikaError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "RubikaError";
    Object.setPrototypeOf(this, new.target.prototype);
    if (options?.cause !== undefined)
      (this as { cause?: unknown }).cause = options.cause;
  }
}

export class RubikaApiError extends RubikaError {
  readonly method: string;
  readonly httpStatus: number;
  readonly code?: string;
  readonly description?: string;
  readonly body: unknown;

  constructor(method: string, httpStatus: number, body: unknown) {
    const b = (body ?? {}) as { status?: string; status_det?: string };
    super(
      `Rubika API error in ${method} (HTTP ${httpStatus})` +
        (b.status ? `: ${b.status}` : "") +
        (b.status_det ? ` - ${b.status_det}` : ""),
    );
    this.name = "RubikaApiError";
    this.method = method;
    this.httpStatus = httpStatus;
    this.code = b.status;
    this.description = b.status_det;
    this.body = body;
  }
}

export class RubikaNetworkError extends RubikaError {
  readonly method: string;

  constructor(method: string, cause?: unknown) {
    super(`Network error while calling ${method}`, { cause });
    this.name = "RubikaNetworkError";
    this.method = method;
  }
}

export class RubikaConfigError extends RubikaError {
  constructor(message: string) {
    super(message);
    this.name = "RubikaConfigError";
  }
}
