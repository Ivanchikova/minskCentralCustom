export interface Configuration {
    readonly mongodbUri: string;
    readonly secretSession: string;
    readonly sendgridApiKey: string;
    readonly baseUrl: string;
    readonly emailFrom: string;
}