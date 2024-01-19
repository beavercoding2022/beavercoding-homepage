import { getPosts } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function BlogIndexPage() {
  const [posts] = await Promise.all([getPosts()]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <CustomLink href={`/b/${post.slug}`}>{post.title}</CustomLink>
        </div>
      ))}
    </div>
  );
}
