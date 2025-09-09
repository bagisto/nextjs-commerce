import OpenGraphImage from "@/components/opengraph-image";
export default async function Image() {
  const title = "Test SEO details";

  return await OpenGraphImage({ title });
}
