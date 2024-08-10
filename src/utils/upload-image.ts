import imageKit from "@/utils/imagekit";

export const uploadImage = async (file: File, tag: string) => {
  const base64 = await file.arrayBuffer();
  const base64String = Buffer.from(base64).toString("base64");

  // We will force upload to imagekit here
  return await imageKit.upload({
    file: base64String,
    fileName: file.name,
    folder: "phase2/challenge/all-in-one",
    tags: [tag],
  });
};
