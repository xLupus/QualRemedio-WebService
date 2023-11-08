import i18next from 'i18next';
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

i18next
    .use(FsBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init<FsBackendOptions>({
        fallbackLng: 'en',
        detection: {
            lookupHeader: 'accept-language',
        },
        backend: {
            loadPath: './lang/v1/{{lng}}/translation.json',
        },
        load: 'languageOnly',
        preload: ['en', 'pt']
    });

export { i18next as translationV1 }