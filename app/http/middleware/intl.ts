import i18nextMiddleware from 'i18next-http-middleware';
import { translationV1 } from '../../../config/localization/v1/intl';
import { Handler } from 'express';

export const i18NextInstanceV1: Handler = i18nextMiddleware.handle(translationV1);