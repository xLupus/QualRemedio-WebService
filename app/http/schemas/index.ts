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