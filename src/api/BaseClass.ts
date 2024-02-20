/* tslint:disable */
/* eslint-disable */


export class BaseClass {
    protected bearerToken: string;

    constructor( bearerToken?:string) {
        this.bearerToken =  bearerToken !== undefined && bearerToken !== null ? bearerToken : "";
    }

    protected transformOptions = async (options: RequestInit): Promise<RequestInit> => {
        options.headers = {
            ...options.headers,
            Authorization: 'Bearer ' + this.bearerToken,
        };
        return Promise.resolve(options);
    };
}