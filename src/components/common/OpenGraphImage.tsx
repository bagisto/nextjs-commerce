import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import LogoIcon from "./icons/logo";


export type Props = {
  title?: string;
};

export default async function OpenGraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME,
    },
    ...props,
  };
  const file = await readFile(join(process.cwd(), "./fonts/Inter-Bold.ttf"));
  const font = Uint8Array.from(file).buffer;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex h-[160px] w-[160px] flex-none items-center justify-center rounded-3xl border border-neutral-700">
          <LogoIcon fill="white" height="58" width="64" />
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
