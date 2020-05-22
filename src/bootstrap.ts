import { Container } from 'inversify'
import { Configuration } from './configuration/configuration'
import { TYPES } from './types'
import { EmailService } from './service/email/email-service'
import { EmailServiceImpl } from './service/email/email-service-imp'
import path from 'path';
import os from 'os';
import fs from 'fs';

export const configure = (container: Container) => {
    container.bind<Configuration>(TYPES.Configuration).toDynamicValue(ReadConfigurationFromFile).inSingletonScope();
    container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl).inSingletonScope();
}

function ReadConfigurationFromFile() {
    const pathToConfiguration = path.join(os.homedir(), 'weather_configuration.json')
    const configurationJson = fs.readFileSync(pathToConfiguration, 'utf8')
    return JSON.parse(configurationJson) as Configuration
}