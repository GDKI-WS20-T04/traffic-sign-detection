import { ImageResult } from "../components/util/image";

export function postImage(image: string): Promise<ImageResult> {
  const formData = new FormData();
  formData.append("base64_image", image);
  console.log(`http://localhost/image`);
  return fetch(`http://localhost/image`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json().catch((err) => {})) as Promise<ImageResult>;
}
