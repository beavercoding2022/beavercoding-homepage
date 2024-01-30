import { getValidCategories } from '@/src/backend/posts';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';

export default async function DocIndexPage() {
  const [categories] = await Promise.all([getValidCategories()]);

  return (
    <div className="flex flex-col max-w-screen-md">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="mb-5" />
      {categories.map((category) => (
        <div key={`category_${category.id}`}>
          <CategoryLinkWithIcon {...category} />
          {Object.entries(category.posts)
            .filter(([_, value]) => value > 0)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
        </div>
      ))}
    </div>
  );
}
