import ImageKit from "imagekit";

const createImageKitClient = () => {
  // Check process env
  if (!process.env.IMAGEKIT_PUBLIC_KEY)
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined");
  if (!process.env.IMAGEKIT_PRIVATE_KEY)
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");
  if (!process.env.IMAGEKIT_URL_ENDPOINT)
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined");

  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
};

const globalForImageKit = globalThis as unknown as {
  imageKit: ImageKit | undefined;
};

const imageKit = globalForImageKit.imageKit ?? createImageKitClient();

export default imageKit;
