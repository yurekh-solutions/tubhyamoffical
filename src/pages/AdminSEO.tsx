import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Eye, Clock, CheckCircle, Loader2, AlertCircle, BarChart3, Zap, Calendar, Search, Sparkles, ChevronRight, Layers, Play } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  keywords: string[];
  image: string;
  author: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledPublishDate: string | null;
  publishedAt: string | null;
  readTime: number;
  createdAt: string;
  trendKeyword?: string;
  trendSource?: string;
}

interface Trend {
  trendName: string;
  sourcePlatform: string;
  whyTrending: string;
  suggestedTitle: string;
  selected: boolean;
}

interface Stats {
  published: number;
  scheduled: number;
  draft: number;
  total: number;
}

const ADMIN_SECRET = 'tubhyam_admin_2024';
const API_BASE = `${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}`;

const authHeaders = {
  'Authorization': `Bearer ${ADMIN_SECRET}`,
  'Content-Type': 'application/json',
};

const AdminSEO = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [queue, setQueue] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({ published: 0, scheduled: 0, draft: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [publishInterval, setPublishInterval] = useState(24);
  const [generationProgress, setGenerationProgress] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'trends' | 'batch'>('trends');
  const [batchKeywords, setBatchKeywords] = useState('');
  const [batchArticlesPer, setBatchArticlesPer] = useState(2);
  const [batchInterval, setBatchInterval] = useState(20);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState('');

  useEffect(() => {
    fetchQueue();
    fetchStats();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await fetch(`${API_BASE}/blogs/admin/queue`, {
        headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
      });
      const data = await response.json();
      if (data.success) setQueue(data.blogs);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      toast.error('Failed to load queue');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/blogs/admin/stats`, {
        headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
      });
      const data = await response.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleResearchTrends = async () => {
    if (!keyword.trim()) { toast.error('Please enter a keyword'); return; }
    setIsResearching(true);
    setTrends([]);
    setSearchedKeyword('');
    try {
      const response = await fetch(`${API_BASE}/blogs/research-trends`, {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify({ keyword: keyword.trim() })
      });
      const data = await response.json();
      if (data.success && data.trends.length > 0) {
        setTrends(data.trends.map((t: Trend) => ({ ...t, selected: true })));
        setSearchedKeyword(data.keyword);
        toast.success(`Found ${data.trends.length} trends for "${data.keyword}"`);
      } else {
        toast.error(data.message || 'No trends found');
      }
    } catch (error) {
      console.error('Trend research failed:', error);
      toast.error('Failed to research trends');
    } finally {
      setIsResearching(false);
    }
  };

  const handleGenerateFromTrends = async () => {
    const selectedTrends = trends.filter(t => t.selected);
    if (selectedTrends.length === 0) { toast.error('Please select at least one trend'); return; }
    setIsGenerating(true);
    setGenerationProgress(`Generating ${selectedTrends.length} articles with AI... This may take a minute.`);
    try {
      const response = await fetch(`${API_BASE}/blogs/generate-from-trends`, {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify({
          keyword: searchedKeyword,
          trends: selectedTrends.map(({ trendName, sourcePlatform, whyTrending, suggestedTitle }) => ({
            trendName, sourcePlatform, whyTrending, suggestedTitle
          })),
          publishIntervalHours: publishInterval,
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        if (data.errors?.length) toast.warning(`${data.errors.length} articles failed`);
        setTrends([]); setSearchedKeyword(''); setKeyword('');
        fetchQueue(); fetchStats();
      } else {
        toast.error(data.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate articles');
    } finally {
      setIsGenerating(false); setGenerationProgress('');
    }
  };

  const handlePublish = async (blogId: string) => {
    try {
      const response = await fetch(`${API_BASE}/blogs/${blogId}/publish`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
      });
      const data = await response.json();
      if (data.success) { toast.success('Blog published'); fetchQueue(); fetchStats(); }
      else toast.error(data.message || 'Failed to publish');
    } catch (error) { toast.error('Failed to publish blog'); }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const response = await fetch(`${API_BASE}/blogs/${blogId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
      });
      const data = await response.json();
      if (data.success) { toast.success('Blog deleted'); fetchQueue(); fetchStats(); }
      else toast.error(data.message || 'Failed to delete');
    } catch (error) { toast.error('Failed to delete blog'); }
  };

  const toggleTrendSelection = (index: number) => {
    setTrends(prev => prev.map((t, i) => i === index ? { ...t, selected: !t.selected } : t));
  };

  const handleBatchGenerate = async () => {
    const keywords = batchKeywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) { toast.error('Please enter at least one keyword'); return; }
    setIsBatchGenerating(true);
    const total = keywords.length * batchArticlesPer;
    setBatchProgress(`Generating ${total} articles for ${keywords.length} keywords... This may take ${Math.ceil(total * 0.5)} minutes.`);
    try {
      const response = await fetch(`${API_BASE}/blogs/generate-batch`, {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify({ keywords, articlesPerKeyword: batchArticlesPer, publishIntervalHours: batchInterval })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        if (data.errors?.length) toast.warning(`${data.errors.length} articles failed`);
        setBatchKeywords(''); fetchQueue(); fetchStats();
      } else {
        toast.error(data.message || 'Batch generation failed');
      }
    } catch (error) { toast.error('Failed to generate batch'); }
    finally { setIsBatchGenerating(false); setBatchProgress(''); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">Draft</span>;
      case 'scheduled': return <span className="px-2 py-1 text-xs rounded-full bg-blue-900/40 text-blue-300 flex items-center gap-1"><Clock size={12} />Scheduled</span>;
      case 'published': return <span className="px-2 py-1 text-xs rounded-full bg-green-900/40 text-green-300 flex items-center gap-1"><CheckCircle size={12} />Published</span>;
      default: return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getNextPublishDate = () => {
    const scheduled = queue.filter(b => b.status === 'scheduled' && b.scheduledPublishDate).sort((a, b) => new Date(a.scheduledPublishDate!).getTime() - new Date(b.scheduledPublishDate!).getTime());
    return scheduled.length > 0 ? formatDate(scheduled[0].scheduledPublishDate) : null;
  };

  const nextPublish = getNextPublishDate();
  const selectedCount = trends.filter(t => t.selected).length;
  const kwCount = batchKeywords.split(/[\n,]+/).filter(k => k.trim()).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gradient-gold">SEO / Content</h1>
            <p className="text-sm text-foreground/60 mt-1">Trend-driven AI content marketing for your blog</p>
          </div>
          <button onClick={() => navigate('/')} className="px-4 py-2 text-sm font-medium text-foreground/80 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            Back to Site
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { icon: <CheckCircle size={20} className="text-green-400" />, value: stats.published, label: 'Published', bg: 'bg-green-900/20' },
            { icon: <Clock size={20} className="text-blue-400" />, value: stats.scheduled, label: 'Scheduled', bg: 'bg-blue-900/20' },
            { icon: <FileText size={20} className="text-gray-400" />, value: stats.draft, label: 'Drafts', bg: 'bg-gray-900/20' },
            { icon: <BarChart3 size={20} className="text-primary" />, value: stats.total, label: 'Total', bg: 'bg-primary/10' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('trends')} className={`px-4 md:px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${activeTab === 'trends' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-foreground/70 hover:bg-secondary'}`}>
            <Search size={16} /> Trend Research
          </button>
          <button onClick={() => setActiveTab('batch')} className={`px-4 md:px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${activeTab === 'batch' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-foreground/70 hover:bg-secondary'}`}>
            <Layers size={16} /> Batch Generate
          </button>
        </div>

        {/* ─── TREND RESEARCH TAB ─── */}
        {activeTab === 'trends' && (
          <>
            <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search size={20} className="text-primary" /> Step 1: Research Trends
              </h2>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Enter a keyword to discover trending styles</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g., track pants, formal pants, wide leg trousers"
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isResearching || isGenerating} onKeyDown={(e) => e.key === 'Enter' && handleResearchTrends()} />
                <button onClick={handleResearchTrends} disabled={isResearching || isGenerating || !keyword.trim()}
                  className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap">
                  {isResearching ? (<><Loader2 size={18} className="animate-spin" /> Researching...</>) : (<><Sparkles size={18} /> Research Trends</>)}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">AI identifies trends across Myntra, Ajio, Zara, and other platforms.</p>
            </div>

            {trends.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-primary" /> Step 2: Review Trends & Generate
                </h2>
                <p className="text-sm text-foreground/70 mb-4">Found <strong>{trends.length} trends</strong> for "<strong>{searchedKeyword}</strong>"</p>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {trends.map((trend, index) => (
                    <div key={index} onClick={() => toggleTrendSelection(index)}
                      className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-all ${trend.selected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-background/50 opacity-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={trend.selected} onChange={() => toggleTrendSelection(index)} className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
                          <h3 className="font-semibold text-foreground text-sm">{trend.trendName}</h3>
                        </div>
                        <span className="px-2 py-0.5 text-xs bg-blue-900/30 text-blue-300 rounded-full">{trend.sourcePlatform}</span>
                      </div>
                      <p className="text-xs text-foreground/60 mb-2">{trend.whyTrending}</p>
                      <p className="text-xs text-muted-foreground italic flex items-center gap-1"><ChevronRight size={12} />{trend.suggestedTitle}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Hours between articles</label>
                    <input type="number" value={publishInterval} onChange={(e) => setPublishInterval(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={168}
                      className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary" disabled={isGenerating} />
                    <p className="text-xs text-muted-foreground mt-1">Default: 24 hours</p>
                  </div>
                  <button onClick={handleGenerateFromTrends} disabled={isGenerating || selectedCount === 0}
                    className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isGenerating ? (<><Loader2 size={18} className="animate-spin" /> Generating...</>) : (<><Zap size={18} /> Generate {selectedCount} Article{selectedCount !== 1 ? 's' : ''}</>)}
                  </button>
                </div>
                {generationProgress && (
                  <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg mt-4">
                    <Loader2 size={18} className="animate-spin text-blue-400" /><p className="text-sm text-blue-300">{generationProgress}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ─── BATCH GENERATE TAB ─── */}
        {activeTab === 'batch' && (
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Batch Generate: Multiple Keywords
            </h2>
            <p className="text-sm text-foreground/60 mb-4">Enter keywords (one per line or comma-separated). AI generates SEO articles with matching images. Auto-publishes every {batchInterval}h.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Keywords (one per line or comma-separated)</label>
                <textarea value={batchKeywords} onChange={(e) => setBatchKeywords(e.target.value)}
                  placeholder={"western wear\nformal pants\njeans denim\ncasual pants\ntrack pants\nOOTD genz collection\npalazzo pants\ncargo pants"}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary font-mono text-sm"
                  rows={8} disabled={isBatchGenerating} />
                <p className="text-xs text-muted-foreground mt-1">{kwCount} keyword(s) detected</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Articles per keyword</label>
                  <select value={batchArticlesPer} onChange={(e) => setBatchArticlesPer(parseInt(e.target.value))}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary" disabled={isBatchGenerating}>
                    <option value={1}>1 article</option><option value={2}>2 articles</option><option value={3}>3 articles</option><option value={4}>4 articles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Hours between publishes</label>
                  <input type="number" value={batchInterval} onChange={(e) => setBatchInterval(Math.max(6, parseInt(e.target.value) || 20))} min={6} max={168}
                    className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary" disabled={isBatchGenerating} />
                  <p className="text-xs text-muted-foreground mt-1">Default: 20 hours</p>
                </div>
                <div className="flex items-end">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-sm font-medium text-foreground">Total: {kwCount * batchArticlesPer} articles</p>
                    <p className="text-xs text-muted-foreground">Publishes over ~{Math.ceil((kwCount * batchArticlesPer * batchInterval) / 24)} days</p>
                  </div>
                </div>
              </div>

              <button onClick={handleBatchGenerate} disabled={isBatchGenerating || kwCount === 0}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isBatchGenerating ? (<><Loader2 size={18} className="animate-spin" /> Generating Batch...</>) : (<><Play size={18} /> Generate Batch</>)}
              </button>
              {batchProgress && (
                <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <Loader2 size={18} className="animate-spin text-blue-400" /><p className="text-sm text-blue-300">{batchProgress}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── QUEUE ─── */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-4 md:px-6 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Content Queue</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {queue.length} article{queue.length !== 1 ? 's' : ''} in queue
                {nextPublish && <span className="ml-2 text-blue-400"><Calendar size={12} className="inline mr-1" />Next: {nextPublish}</span>}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center"><Loader2 size={32} className="animate-spin mx-auto text-muted-foreground" /><p className="text-sm text-muted-foreground mt-2">Loading queue...</p></div>
          ) : queue.length === 0 ? (
            <div className="p-8 text-center"><FileText size={48} className="mx-auto text-muted-foreground/30" /><p className="text-sm text-muted-foreground mt-2">No articles in queue</p></div>
          ) : (
            <div className="divide-y divide-border">
              {queue.map((blog) => (
                <div key={blog._id} className="p-4 md:p-6 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {blog.image && <img src={blog.image} alt={blog.title} className="w-16 h-12 md:w-20 md:h-16 object-cover object-bottom rounded-lg flex-shrink-0 hidden sm:block border border-border" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm md:text-base font-semibold text-foreground truncate">{blog.title}</h3>
                          {getStatusBadge(blog.status)}
                        </div>
                        <p className="text-xs md:text-sm text-foreground/60 line-clamp-2 mb-2">{blog.excerpt}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {blog.category && <span className="flex items-center gap-1"><FileText size={12} />{blog.category}</span>}
                          <span className="flex items-center gap-1"><Clock size={12} />{blog.readTime} min</span>
                          {blog.trendSource && <span className="px-2 py-0.5 text-xs bg-blue-900/20 text-blue-300 rounded">{blog.trendSource}</span>}
                          {blog.scheduledPublishDate && <span className="flex items-center gap-1 text-blue-400"><Calendar size={12} />{formatDate(blog.scheduledPublishDate)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <button onClick={() => setPreviewBlog(blog)} className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Preview"><Eye size={16} /></button>
                      {blog.status !== 'published' && (
                        <button onClick={() => handlePublish(blog._id)} className="px-2 md:px-3 py-1.5 text-xs font-medium text-white bg-green-700 hover:bg-green-600 rounded-lg transition-colors">Publish</button>
                      )}
                      <button onClick={() => handleDelete(blog._id)} className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground/70">
              <p className="font-medium text-foreground mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground/60">
                <li><strong>Trend Research:</strong> Enter keyword, AI finds trends across Myntra/Ajio/Zara, generate articles</li>
                <li><strong>Batch Generate:</strong> Enter multiple keywords, AI generates articles with matching images</li>
                <li>Articles auto-publish every 18-24 hours via the scheduler</li>
                <li>You can manually publish or delete articles anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setPreviewBlog(null)}>
          <div className="bg-card border border-border rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-foreground">Article Preview</h3>
              <button onClick={() => setPreviewBlog(null)} className="text-muted-foreground hover:text-foreground text-xl">&times;</button>
            </div>
            <div className="p-4 md:p-6">
              {previewBlog.image && <img src={previewBlog.image} alt={previewBlog.title} className="w-full h-40 md:h-48 object-cover object-bottom rounded-lg mb-6 border border-border" />}
              {previewBlog.category && <div className="mb-4"><span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">{previewBlog.category}</span></div>}
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">{previewBlog.title}</h2>
              <p className="text-foreground/60 mb-4 italic">{previewBlog.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                {previewBlog.author && <span>By {previewBlog.author}</span>}
                <span>{previewBlog.readTime} min read</span>
                {previewBlog.trendSource && <span className="px-2 py-0.5 text-xs bg-blue-900/20 text-blue-300 rounded">Trend: {previewBlog.trendSource}</span>}
                {getStatusBadge(previewBlog.status)}
              </div>
              {previewBlog.content ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/70 prose-a:text-primary prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
              ) : (
                <p className="text-muted-foreground italic">No content available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSEO;
