import multer, { MulterError } from "multer";
import { errorMessages, prescription_upload_config as prescription_config } from "../../../config/multer";
import { NextFunction, Request, Response } from "express";
import { JsonMessages } from "../../../app/functions/function"
import exceptions from "../../errors/handler";

export const file_upload = multer(prescription_config)

const prescription_upload_config = file_upload.single('prescription')

export const prescription_upload = (req: Request, res: Response, next: NextFunction) => {
  prescription_upload_config(req, res, (err: any) => {
    if (err instanceof MulterError) {
      return JsonMessages({
        statusCode: 400,
        message: "",
        data: {
          errors: {
            upload: errorMessages[err.code]
          }
        },
        res
      })

    } else if (err) {
      return exceptions({ err, res })
    }

    next()
  })
}
