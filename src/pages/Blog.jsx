import useFirestore from '../hooks/useFirestore';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export default function Blog() {
  const { data: posts, loading } = useFirestore('blogPosts');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center">
        {/* Changed border color from gold to yellow */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Alumni Blog</h1>
          {/* Changed text color from gold to yellow */}
          <p className="mt-2 text-md text-yellow-400">
            Stories, insights and news from our alumni community
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg border border-green-200">
                <div className="flex-shrink-0">
                  <div className="h-48 w-full bg-green-50 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0d3b22]">
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2a6e47]">
                      {post.category || 'General'}
                    </p>
                    <Link to={`/blog/${post.id}`} className="block mt-2">
                      <h3 className="text-xl font-bold text-[#0d3b22]">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-700">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{post.authorName}</span>
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                        <span className="text-[#0d3b22] font-bold">
                          {post.authorName?.charAt(0) || 'A'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-bold text-[#0d3b22]">
                        {post.authorName || 'Alumni Member'}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-600">
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
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto border border-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-bold text-[#0d3b22]">No blog posts yet</h3>
                <p className="mt-2 text-green-700">
                  Check back soon for stories from our alumni community.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}