import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html'; 
import MarkdownIt from 'markdown-it';     

const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection('blog');
  blog.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Lasuac的博客',
    description: '技术、生活、游戏、思考……',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`, 
      // 增加 content 字段：将 Markdown 渲染为 HTML 并清理
      content: sanitizeHtml(parser.render(post.body), {
        // 确保 sanitize-html 不会把正文中的图片标签过滤掉
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']) 
      }),
    })),
    customData: `<language>zh-cn</language>`,
  });
}
