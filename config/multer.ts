import multer, { Options } from 'multer'
import { Request } from 'express'
import path from 'node:path'
import mime from 'mime-types'
import { JsonMessages } from '../app/functions/function'

export const errorMessages = {
  LIMIT_PART_COUNT: 'Muitas peças',
  LIMIT_FILE_SIZE: 'Arquivo muito grande',
  LIMIT_FILE_COUNT: 'Muitos arquivos',
  LIMIT_FIELD_KEY: 'Nome do campo muito longo',
  LIMIT_FIELD_VALUE: 'Valor do campo muito longo',
  LIMIT_FIELD_COUNT: 'Muitos campos',
  LIMIT_UNEXPECTED_FILE: 'Campo inesperado',
  MISSING_FIELD_NAME: 'Nome do campo faltando'
}

export const prescription_upload_config: Options = {
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.join(__dirname, '../', 'storage', 'temp', 'prescriptions'))
    },

    filename(req, file, callback) {
      const type = mime.extension(file.mimetype)

      callback(null, `${file.fieldname}-${Date.now()}.${type}`)
    },
  }),

  fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback): void => {
    if(file) {
      const accepted_types = ['pdf', 'jpeg', 'png']
      const type = mime.extension(file.mimetype)

      if (accepted_types.includes(`${type}`))
        callback(null, true)

      else 
        callback(new Error('Extensão de arquivo não permitido'))
    }

    callback(null, true)
  },
}