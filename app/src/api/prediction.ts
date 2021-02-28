import { fetchTimeOut } from "../components/util/fetchUtils";
import { ImageResult } from "../components/util/image";

export function postImage(image: string): Promise<ImageResult> {
  const formData = new FormData();
  formData.append("base64_image", image);
  return fetchTimeOut(
    `http://localhost/image`,
    {
      method: "POST",
      body: formData,
    },
    5000
  ).then((res) => res.json().catch((err) => {})) as Promise<ImageResult>;
}
