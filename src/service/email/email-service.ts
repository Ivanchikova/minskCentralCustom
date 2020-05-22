export interface EmailService {
    sendRegisterMail(emailTo: string): Promise<void>;
    sendRestorePasswordMail(emailTo: string, restoreUrl: string): Promise<void>;
}