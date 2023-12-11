import { z } from "zod";

/**
 * 
 */
export const id_parameter_schema = z.preprocess(
  (el) => parseInt(el as string, 10),

  z.number({ invalid_type_error: "O id deve ser do tipo Number" })
    .min(1, 'Campo Obrigatorio')
    .int('O valor deve ser um Numero Inteiro')
    .positive('O valor deve ser maior do que 0')
)


export const email_schema = z.preprocess(
  (el) => el,

   z
  .string({ 
      required_error: 'Este campo deve ser especificado',
      invalid_type_error: 'O campo informado deve ser texto'
  })
  .max(50, { message: 'Este campo excedeu o limite de 50 caracteres' })
  .min(1, { message: 'Preencha este campo' })
  .email({ message: 'O formato de e-mail é inválido' })
  .toLowerCase()
  .superRefine((val, ctx) => {
      const availableEmailProviders: string[] = ['gmail.com', 'outlook.com', 'outlook.com.br'];

      if(!availableEmailProviders.includes(val.split('@')[1])) {
          ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'O provedor informado é inválido'
          });
      }
  })
)
/**
 * 
 */
export const change_password_schema = z.object({
  current_password: z.string({
    required_error: 'Campo Obrigatorio'
  })
    .min(1, 'Campo Obrigatorio'),

  new_password: z.string({
    required_error: 'Campo Obrigatorio',
    invalid_type_error: "O id do usuario deve ser do tipo Number"
  })
    .min(1, { message: 'Campo Obrigatorio' })
    .min(8, { message: 'A senha deve ter no minímo 8 caracteres', })
    .max(24, { message: 'A senha deve ter no máximo 24 caracteres' })
})

/**
 * 
 */
export const paginate_schema = z.object({
  skip: z.preprocess(
    (el) => parseInt(el as string, 10),

    z.number()
      .int()
      .nonnegative()
  ),

  take: z.preprocess(
    (el) => parseInt(el as string, 10),
    
    z.number()
      .int()
      .positive()
  )
})