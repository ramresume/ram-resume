import { useRouter } from "next/router";
import { client } from "@/src/sanity/lib/client";
import BlogDetailPage from "@/components/BlogPage/BlogDetailPage";
import { IconArrowLeft } from "@tabler/icons-react";
import Head from "next/head";

export default function BlogPost({ blog, relatedPosts }) {
  const router = useRouter();
  const description = blog.body ? `${blog.body.substring(0, 155)}...` : "";

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{`${blog.title} | RAMResume Blog`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${blog.title} | RAMResume Blog`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {blog.mainImage && <meta property="og:image" content={urlFor(blog.mainImage).url()} />}
      </Head>
      <div className="min-h-screen flex flex-col w-full py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <button
            onClick={() => router.push("/blog")}
            className="group flex items-center gap-2 text-fordham-light-gray/60 hover:text-fordham-white transition-colors mb-8"
          >
            <IconArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to blogs
          </button>

          <BlogDetailPage blog={blog} relatedPosts={relatedPosts} />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const paths = await client.fetch('*[_type == "blog" && defined(slug.current)].slug.current');

    return {
      paths: paths.map((slug) => ({ params: { slug: slug.split("/").pop() } })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    const blog = await client.fetch(
      `*[_type == "blog" && slug.current == $slug][0]{
          title,
          body,
          mainImage,
          "author": author->{name, image, bio},
          publishedAt,
          slug
        }`,
      { slug: `/blog/${slug}` }
    );

    if (!blog) {
      return { notFound: true };
    }

    // Fetch related posts
    const relatedPosts = await client.fetch(
      `*[_type == "blog" && slug.current != $slug] | order(publishedAt desc)[0...3]{
          _id,
          title,
          body,
          slug,
          mainImage
        }`,
      { slug: `/blog/${slug}` }
    );

    return {
      props: {
        blog,
        relatedPosts,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}
