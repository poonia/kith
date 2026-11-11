import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublished, getPublishedPages } from '@/lib/content';
import { renderOgImage, type OgInput } from '@/lib/og';
import { formatDate } from '@/lib/format';
import { SITE } from '@/consts';

export const getStaticPaths = (async () => {
  const blog = await getPublished('blog');
  const snippets = await getPublished('snippets');
  const pages = await getPublishedPages();

  const paths: { params: { path: string }; props: OgInput }[] = [
    { params: { path: 'default' }, props: { title: SITE.description } },
    ...blog.map((e) => ({
      params: { path: `blog/${e.id}` },
      props: { title: e.data.title, kicker: 'Blog', meta: formatDate(e.data.pubDate), tags: e.data.tags },
    })),
    ...snippets.map((e) => ({
      params: { path: `snippets/${e.id}` },
      props: { title: e.data.title, kicker: 'Snippet', meta: formatDate(e.data.pubDate), tags: e.data.tags },
    })),
    ...pages.map((e) => ({
      params: { path: `pages/${e.id}` },
      props: { title: e.data.title, meta: e.data.description },
    })),
  ];
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgInput);
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
};
