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
export const PublicSearchParamsSchema = z.object({
  q: z.string().nullable().optional(),
  i: z.string().nullable().optional(),
  // Sorting order, case-insensitive, defaults to 'ASC'
  sort: z
    .enum(["ASC", "DESC", "asc", "desc"])
    .nullable()
    .optional()
    .transform((data) => data?.toLowerCase() || "asc"),
  page: z
    .string()
    .nullable()
    .optional()
    .refine(
      (data) => {
        const parsed = parseInt(data || "1", 10);
        return !isNaN(parsed) && parsed > 0;
      },
      {
        message: "Page must be a number greater than 0.",
        path: ["page"],
      },
    )
    .transform((data) => parseInt(data || "1", 10)),
  limit: z
    .string()
    .nullable()
    .optional()
    .refine(
      (data) => {
        const parsed = parseInt(data || "10", 10);
        return !isNaN(parsed) && parsed >= 4 && parsed <= 12;
      },
      {
        message: "Limit must be a number between 4 and 12.",
        path: ["limit"],
      },
    )
    .transform((data) => parseInt(data || "10", 10)),
});
export type TPublicSearchParams = z.infer<typeof PublicSearchParamsSchema>;
export const validatePublicSearchParams = async (
  searchParams: URLSearchParams,
): Promise<TPublicSearchParams> => {
  return await PublicSearchParamsSchema.parseAsync({
    q: searchParams.get("q"),
    i: searchParams.get("i"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
};
