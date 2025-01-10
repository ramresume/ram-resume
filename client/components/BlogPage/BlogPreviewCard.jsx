import { urlFor } from "@/src/sanity/lib/image";
import Image from "next/image";
import LoadingSpinner from "../ui/LoadingSpinner";
export default function BlogPreview({ title, slug, mainImage }) {
  return (
    <div className="w-96">
      <a href={slug.current}>
        <div className="flex flex-col gap-4 items-center p-4 rounded hover:bg-white/30  hover:text-primary">
          <div className="w-full h-48 overflow-hidden">
            {mainImage && (
              <Image
                loading="lazy"
                priority={true}
                src={urlFor(mainImage).url()}
                alt={mainImage.alt || title}
                fill
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="sm-txt text-center">{title}</p>
        </div>
      </a>
    </div>
  );
}
