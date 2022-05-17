enum ErrorType {
  QueryParamsError,
  FetchError,
  DecryptionError,
  InvalidDocumentError,
}

type ErrorStrings = keyof typeof ErrorType;

export class CodedError extends Error {
  type: ErrorStrings;

  details?: string;

  /**
   * Custom coded error for debugging purposes
   * @param type
   * @param message
   * @param details
   */
  constructor(type: ErrorStrings, message: string, details?: string) {
    super(message);
    this.name = `CodedError`;
    this.type = type;
    this.details = details;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
    };
  }

  toString() {
    return `[${this.name}] ${this.type}: ${JSON.stringify(this.toJSON())}`;
  }
}
