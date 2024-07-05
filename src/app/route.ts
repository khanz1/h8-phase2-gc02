import { NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json({
    statusCode: 200,
    message: "Pong !",
  });
};
