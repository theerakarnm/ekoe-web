import type { BlogPost } from "~/interface/blog.interface";

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Glow Gently, Live Boldly',
    category: 'SKIN CARE',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop',
    slug: 'glow-gently-live-boldly'
  },
  {
    id: '2',
    title: 'Glow Gently, Live Boldly',
    category: 'SKIN CARE',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop',
    slug: 'glow-gently-live-boldly-2'
  },
  {
    id: '3',
    title: 'Glow Gently, Live Boldly',
    category: 'SKIN CARE',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop',
    slug: 'glow-gently-live-boldly-3'
  }
];

export default function BlogSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold font-serif text-gray-900">From the Ekoe Journal</h2>
        <a href="#" className="text-sm text-gray-700 hover:text-gray-900 underline font-serif">
          Explore more
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group cursor-pointer">
            <div className="aspect-4/3 bg-gray-100 mb-4 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-gray-500 mb-1 font-serif">{post.category}</p>
            <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
              {post.title}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
