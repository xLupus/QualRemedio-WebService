import { z } from "zod";

/**
 * 
 */
export const id_parameter_schema = z.preprocess(
  (el) => parseInt(el as string, 10),

  z.number({ invalid_type_error: "O id deve ser do tipo Number" })
    .min(1, 'Campo Obrigatorio')
    .int()
    .positive()
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