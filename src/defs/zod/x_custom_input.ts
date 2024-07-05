import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const PatchBodyFormData = z.object({
  file: z
    .custom<File>((data) => {
      // ? Dirty Trick to validate File by checking typeof File properties
      return (
        typeof (data as File)?.name === "string" &&
        typeof (data as File)?.size === "number" &&
        typeof (data as File)?.lastModified === "number" &&
        typeof (data as File)?.type === "string" &&
        typeof (data as File)?.arrayBuffer === "function"

        // (data as File).name !== undefined &&
        // (data as File).size !== undefined &&
        // (data as File).lastModified !== undefined &&
        // (data as File).type !== undefined &&
        // (data as File).arrayBuffer !== undefined
      );
    })
    // .object({
    //   name: z.string(),
    //   size: z.number(),
    //   lastModified: z.number(),
    //   type: z.string(),
    //   arrayBuffer: z.function(),
    // })
    .refine((data) => {
      return data?.size <= MAX_FILE_SIZE;
    }, `Max image size is 2MB.`)
    .refine((data) => {
      return ACCEPTED_IMAGE_TYPES.includes(data?.type);
    }, "Only .jpg, .jpeg, .png, .svg and .webp formats are supported."),
});

// Search Params (req.query) validator for public /GET
export const PublicGlobalSearchParams = z.object({
  q: z.string().nullable().optional(),
  i: z.string().nullable().optional(),
  sort: z.enum(["ASC", "DESC", "asc", "desc"]).nullable().optional(),
  page: z
    .string()
    .refine((data) => parseInt(data) > 0, "page must be greater than 0.")
    .nullable()
    .optional(),
  limit: z
    .string()
    .refine(
      (data) => parseInt(data) >= 4 && parseInt(data) <= 12,
      "limit must be between 4 to 12",
    )
    .nullable()
    .optional(),
});
