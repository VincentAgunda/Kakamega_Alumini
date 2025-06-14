import useFirestore from '../hooks/useFirestore';
import { Link } from 'react-router-dom';

export default function Blog() {
  const { data: posts, loading } = useFirestore('blogPosts');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Alumni Blog
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Stories, insights and news from our alumni community
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary dark:text-primary-dark">
                      {post.category || 'General'}
                    </p>
                    <Link to={`/blog/${post.id}`} className="block mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{post.authorName}</span>
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {post.authorName?.charAt(0) || 'A'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.authorName || 'Alumni Member'}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={post.createdAt?.toDate().toISOString()}>
                          {post.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{Math.ceil(post.content?.length / 1000) || 3} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}