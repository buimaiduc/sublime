export class Error {
    errorCode: string;
    errorMessage: string;


    constructor(errorCode: string, errorMessage: string) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    toString(): string {
        return this.errorCode + ' : ' + this.errorMessage;
    }
}
