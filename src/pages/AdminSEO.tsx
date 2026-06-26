import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Eye, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/config/api';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  keywords: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledPublishDate: string | null;
  publishedAt: string | null;
  readTime: number;
  createdAt: string;
}

const ADMIN_SECRET = 'tubhyam_admin_2024'; // Same as server

const AdminSEO = () => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [queue, setQueue] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}/blogs/admin/queue`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_SECRET}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setQueue(data.blogs);
      } else {
        toast.error('Failed to load queue');
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      toast.error('Failed to load queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords');
      return;
    }

    setIsGenerating(true);
    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}/blogs/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`
        },
        body: JSON.stringify({ keywords: keywordArray })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Article generated: "${data.blog.title}"`);
        setKeywords('');
        fetchQueue(); // Refresh queue
      } else {
        toast.error(data.message || 'Failed to generate article');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate article');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (blogId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}/blogs/${blogId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_SECRET}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Blog published successfully');
        fetchQueue();
      } else {
        toast.error(data.message || 'Failed to publish');
      }
    } catch (error) {
      console.error('Publish failed:', error);
      toast.error('Failed to publish blog');
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_SECRET}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Blog deleted');
        fetchQueue();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete blog');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Draft</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"><Clock size={12} />Scheduled</span>;
      case 'published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={12} />Published</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Content Manager</h1>
              <p className="text-sm text-gray-600 mt-1">Generate and schedule blog articles with AI</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Generate Article Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} />
            Generate New Article
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keywords (comma-separated)
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., formal pants, office wear, women's trousers"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 2-5 keywords to guide the AI article generation
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !keywords.trim()}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generate Article
                </>
              )}
            </button>
          </div>
        </div>

        {/* Queue Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Content Queue</h2>
            <p className="text-sm text-gray-600 mt-1">
              {queue.length} article{queue.length !== 1 ? 's' : ''} in queue
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading queue...</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-300" />
              <p className="text-sm text-gray-500 mt-2">No articles in queue</p>
              <p className="text-xs text-gray-400 mt-1">Generate your first article above</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {queue.map((blog) => (
                <div key={blog._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {blog.title}
                        </h3>
                        {getStatusBadge(blog.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {blog.readTime} min read
                        </span>
                        {blog.scheduledPublishDate && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Clock size={12} />
                            Publishes: {formatDate(blog.scheduledPublishDate)}
                          </span>
                        )}
                      </div>

                      {blog.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {blog.keywords.map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setPreviewBlog(blog)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {blog.status !== 'published' && (
                        <button
                          onClick={() => handlePublish(blog._id)}
                          className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          Publish Now
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Articles are generated using AI and saved as drafts</li>
                <li>Each article is automatically scheduled to publish in 18-24 hours</li>
                <li>You can manually publish or delete articles anytime</li>
                <li>Published articles appear on the public blog page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Article Preview</h3>
              <button
                onClick={() => setPreviewBlog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {previewBlog.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {previewBlog.title}
              </h2>
              
              <p className="text-gray-600 mb-4 italic">
                {previewBlog.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                <span>By {previewBlog.author}</span>
                <span>{previewBlog.readTime} min read</span>
                {getStatusBadge(previewBlog.status)}
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  [Full content preview would render here with HTML formatting]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSEO;
