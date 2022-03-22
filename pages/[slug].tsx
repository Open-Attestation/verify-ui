import type { GetStaticPaths, InferGetStaticPropsType, GetStaticPropsContext } from "next";
import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { NextSeo } from "next-seo";

import Layout from "@components/layout/Layout";

const MDXPages = ({ mdxSource }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const title = mdxSource.frontmatter?.title;

  return (
    <Layout className="container py-12">
      <NextSeo title={title} />
      <MDXRemote {...mdxSource} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join("pages"));

  const paths = files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""))
    .map((f) => ({ params: { slug: f } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const source = fs.readFileSync(path.join("pages", slug + ".mdx"), "utf-8");
  const mdxSource = await serialize(source, { parseFrontmatter: true });

  return {
    props: {
      slug,
      mdxSource,
    },
  };
};

export default MDXPages;
