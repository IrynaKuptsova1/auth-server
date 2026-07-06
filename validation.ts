// Импортируем именно из пакета мини-версии
import * as z from "zod/mini"; 

export const authValidation = z.strictObject({
  email: z.email(),
  
  password: z.string().check(
    z.minLength(6),
    z.regex(/[A-Z]/),
    z.regex(/[a-z]/), 
    z.regex(/[0-9]/),
    z.regex(/[!@#$%^&*()_+\-=\[\]{};':",.<>\/?]/)
  ),
});

export type AuthInput = z.infer<typeof authValidation>;