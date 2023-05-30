import * as moduleAlias from 'module-alias';
moduleAlias.addAlias('@src', __dirname);

export * from '@src/middlewares/validateRequest';

