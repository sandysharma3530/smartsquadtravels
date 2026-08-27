import { revalidatePath, revalidateTag } from "next/cache";

export const CMS_PUBLIC_TAG = "cms-public";

/** Invalidate cached public CMS content and regenerated pages after a publish. */
export function revalidatePublicContent() {
  revalidateTag(CMS_PUBLIC_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/icon");
  revalidatePath("/apple-icon");
  revalidatePath("/manifest.webmanifest");
}
