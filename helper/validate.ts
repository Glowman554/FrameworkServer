import { ZodSchema } from "zod";

export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.log(result.error);
    throw new Error("Field validation failed");
  }
  return result.data;
}
