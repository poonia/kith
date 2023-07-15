import { defineConfig } from "tinacms";
import data from './tags.json'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

const allTags = data.tags?.map((tag) => ({
  label: tag.label,
  value: tag.name,
}));

export default defineConfig({
  branch,
  clientId: "8ea28892-5a30-4d03-a39c-c646719ef226", // Get this from tina.io
  token: "fa0e0286aeb75e3f0509460fa0e5604ed8c60e8d", // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            isTitle: true,
          },
          {
            label: "Tags",
            name: "tags",
            options: allTags,
            type: "string",
            list: true
          },
          {
            label: "Date",
            name: "pubDate",
            type: "datetime",
            isTitle: true,
          },
        ],
      },
      {
        name: 'snippet',
        label: 'Snippets',
        path: 'src/content/snippets',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'string',
            name: 'source',
            label: 'Source',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true
          }
        ],
      },
    ],
  },
});
