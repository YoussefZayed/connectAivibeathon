import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Env } from '../config/env';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<Env, true>) => {
                const logLevel = configService.get('LOG_LEVEL');
                const nodeEnv = configService.get('NODE_ENV');

                return {
                    pinoHttp: {
                        level: logLevel,
                        timestamp: () => `,"time":"${new Date().toISOString()}"`,
                        serializers: {
                            req: (req) => ({
                                id: req.id,
                                method: req.method,
                                url: req.url,
                                userAgent: req.headers['user-agent'],
                            }),
                            res: (res) => ({
                                statusCode: res.statusCode,
                            }),
                        },
                        redact: {
                            paths: ['req.headers.authorization', 'req.headers.cookie'],
                            censor: '**REDACTED**',
                        },
                        customSuccessMessage: (req, res, responseTime) =>
                            `request completed in ${responseTime}ms`,
                        quietReqLogger: true,
                        customSuccessObject: (req, res, log) => {
                            const isHealthCheck = (req.url ?? '').includes('/health');
                            return {
                                ...log,
                                quiet: isHealthCheck && res.statusCode < 400,
                            };
                        },
                        transport:
                            nodeEnv !== 'production'
                                ? {
                                    target: 'pino-pretty',
                                    options: {
                                        singleLine: true,
                                        translateTime: 'SYS:standard',
                                        ignore: 'pid,hostname,context,req.id,req.userAgent',
                                    },
                                }
                                : undefined,
                    },
                };
            },
        }),
    ],
})
export class LoggerModule { } 