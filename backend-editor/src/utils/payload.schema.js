import { z } from "zod"

const exampleSchema = z.object({
    name: z.string(),
    location: z.string()
});

export {
    exampleSchema
}