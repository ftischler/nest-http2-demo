import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpsOptions } from '@nestjs/common/interfaces/https-options.interface';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createServer } from 'http';
import { Application } from 'express';
import { INestApplication, INestExpressApplication } from '@nestjs/common';

import * as express from 'express';
import * as spdy from 'spdy';

async function bootstrap() {
  const httpPort: string | number = process.env.PORT || 3000;
  const httpsPort: string | number = process.env.HTTPS_PORT || 4443;

  const httpsOptions: HttpsOptions = {
    key: readFileSync(join(__dirname, 'cert', 'server.key')),
    cert: readFileSync(join(__dirname, 'cert', 'server.crt'))
  };

  const expressApp: Application = express();

  const app: INestApplication & INestExpressApplication = await NestFactory.create(AppModule, expressApp);
  await app.init();

  createServer(expressApp).listen(httpPort);
  spdy.createServer(httpsOptions, expressApp).listen(httpsPort);
}

bootstrap();
