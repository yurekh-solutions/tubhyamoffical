import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, Loader2, AlertCircle, Calendar, Sparkles, Play, Pause,
  ChevronRight, Zap, Hash, Tag, Send, RefreshCw, Hand, Trash2,
  Clock, CheckCircle, Settings, LayoutGrid, Plus, Search, X, Eye,
  Edit3, Image, ArrowLeft, RotateCcw, Globe, Save, BookOpen, Package
} from 'lucide-react';
import { toast } from 'sonner';
import ainosImg from '@/assets/ainos.jpeg';

// ═══ Simple Bot Icon ═══════════════════════════════════════════════════════
const BotIcon = ({ size = 20, color = '#ffcd94' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="8" width="14" height="11" rx="3" />
    <circle cx="9.5" cy="13.5" r="1.2" fill={color} />
    <circle cx="14.5" cy="13.5" r="1.2" fill={color} />
    <path d="M9 17h6" />
    <path d="M12 2v3" />
    <circle cx="12" cy="2" r="0.8" fill={color} />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
  </svg>
);

// ═══ Types ═══════════════════════════════════════════════════════════════════

interface CampaignPost {
  _id: string; title: string; dayIndex: number; status: string;
  focusKeyword: string; category: string; image: string;
  scheduledPublishDate: string | null; held: boolean;
  generationStatus: string; excerpt?: string; readTime?: number;
  metaTitle?: string; metaDescription?: string; tags?: string[];
  content?: string; slug?: string; errorMessage?: string; author?: string;
}
interface Campaign {
  id: string; keyword: string; posts: CampaignPost[];
  published: number; scheduled: number; planned: number; failed: number; total: number;
}
interface Stats { published: number; scheduled: number; draft: number; planned: number; failed: number; total: number; }
interface BlogSearchResult {
  _id: string; title: string; status: string; focusKeyword?: string;
  category?: string; image?: string; scheduledPublishDate?: string | null;
  held?: boolean; excerpt?: string; slug?: string;
}

// ═══ Constants ══════════════════════════════════════════════════════════════

const ADMIN_SECRET = 'tubhyam_admin_2024';
const API_BASE = `${import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api'}`;
const authHeaders = { 'Authorization': `Bearer ${ADMIN_SECRET}`, 'Content-Type': 'application/json' };
const authOnly = { 'Authorization': `Bearer ${ADMIN_SECRET}` };

// ═══ Tubhyam Warm Theme Colors ════════════════════════════════════════════

const C = {
  bg: '#1A1410', sidebar: '#151010', card: '#2B2220', cardAlt: '#332A26',
  accent: '#FFD3AC', accentHover: '#F5C49C', accentLight: '#FFD3AC20',
  sidebarText: '#F0E6DA', sidebarTextDim: '#B0A090', sidebarActive: '#FFD3AC',
  textDark: '#F0E6DA', textMed: '#C4B5A6', textLight: '#8A7D70',
  border: '#4A3E36', borderLight: '#3D322C',
  green: '#66BB6A', greenBg: '#1B3A1B', greenText: '#81C784',
  blue: '#64B5F6', blueBg: '#1A2D40', blueText: '#90CAF9',
  mint: '#81C784', mintText: '#A5D6A7',
  pink: '#F48FB1', pinkBg: '#3D1A2E', pinkText: '#F48FB1',
  yellowBg: '#3D3520', yellowText: '#FFD54F',
  redBg: '#3D1A1A', redText: '#EF9A9A',
  holdBg: '#4A4036', grayTag: '#555048',
};

// ═══ Component ═══════════════════════════════════════════════════════════════

const AdminSEO = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignPosts, setCampaignPosts] = useState<CampaignPost[]>([]);
  const [campaignMeta, setCampaignMeta] = useState<{ id: string; keyword: string; totalPosts: number } | null>(null);
  const [stats, setStats] = useState<Stats>({ published: 0, scheduled: 0, draft: 0, planned: 0, failed: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogSearchResults, setBlogSearchResults] = useState<BlogSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create form
  const [keyword, setKeyword] = useState('');
  const [days, setDays] = useState(30);
  const [tone, setTone] = useState('Warm, elegant, confident, premium Indian fashion');
  const [wordCount, setWordCount] = useState(1000);
  const [imagesPerPost, setImagesPerPost] = useState(1);
  const [autoPublish, setAutoPublish] = useState(true);
  const [genMode, setGenMode] = useState<'jit' | 'bulk'>('jit');
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Post editor
  const [editPost, setEditPost] = useState<CampaignPost | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editTab, setEditTab] = useState<'preview' | 'markdown'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenTarget, setRegenTarget] = useState<'all' | 'text' | 'images'>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ═══ Fetchers ════════════════════════════════════════════════════════════

  const fetchStats = useCallback(async () => {
    try { const r = await fetch(`${API_BASE}/blogs/admin/stats`, { headers: authOnly }); const d = await r.json(); if (d.success) setStats(d.stats); } catch { /* silent */ }
  }, []);
  const fetchCampaigns = useCallback(async () => {
    try { const r = await fetch(`${API_BASE}/blogs/campaigns`, { headers: authOnly }); const d = await r.json(); if (d.success) setCampaigns(d.campaigns || []); } catch { /* silent */ } finally { setIsLoadingData(false); }
  }, []);
  const fetchCampaign = useCallback(async (id: string) => {
    try { const r = await fetch(`${API_BASE}/blogs/campaigns/${id}`, { headers: authOnly }); const d = await r.json(); if (d.success) { setCampaignMeta(d.campaign); setCampaignPosts(d.posts); } } catch { toast.error('Failed to load campaign'); }
  }, []);

  // Blog post search
  const searchBlogPosts = useCallback(async (q: string) => {
    if (!q.trim()) { setBlogSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    try {
      const r = await fetch(`${API_BASE}/blogs/admin/search?q=${encodeURIComponent(q)}`, { headers: authOnly });
      const d = await r.json();
      if (d.success) setBlogSearchResults(d.blogs || []);
    } catch { /* silent */ } finally { setIsSearching(false); }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => searchBlogPosts(value), 300);
  };

  useEffect(() => {
    // Auto-cleanup orphaned posts with invalid campaignIds
    fetch(`${API_BASE}/blogs/campaigns/cleanup`, { method: 'POST', headers: authOnly }).catch(() => {});
    fetchCampaigns(); fetchStats();
  }, [fetchCampaigns, fetchStats]);
  useEffect(() => { if (selectedCampaignId) { fetchCampaign(selectedCampaignId); setView('detail'); } }, [selectedCampaignId, fetchCampaign]);

  // ═══ Actions ═════════════════════════════════════════════════════════════

  const handleCreateCampaign = async () => {
    if (!keyword.trim()) { toast.error('Please enter a seed keyword'); return; }
    setIsCreating(true);
    try {
      const r = await fetch(`${API_BASE}/blogs/campaigns`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ keyword: keyword.trim(), days, tone, wordCount, imagesPerPost, autoPublish }) });
      const d = await r.json();
      if (d.success) { toast.success(d.message); setSelectedCampaignId(d.campaign.id); setKeyword(''); fetchCampaigns(); fetchStats(); }
      else toast.error(d.message || 'Failed');
    } catch { toast.error('Failed to create campaign'); } finally { setIsCreating(false); }
  };

  const handleGenerate = async (id: string) => {
    if (!confirm('Generate articles + images for all planned posts? This may take several minutes.')) return;
    setIsGenerating(true);
    try {
      const r = await fetch(`${API_BASE}/blogs/campaigns/${id}/generate`, { method: 'POST', headers: authHeaders });
      const d = await r.json();
      if (d.success) { toast.success(d.message); if (d.errors?.length) toast.warning(`${d.errors.length} failed`); fetchCampaign(id); fetchCampaigns(); fetchStats(); }
      else toast.error(d.message);
    } catch { toast.error('Generation failed'); } finally { setIsGenerating(false); }
  };

  const handlePause = async (id: string) => { try { const r = await fetch(`${API_BASE}/blogs/campaigns/${id}/pause`, { method: 'POST', headers: authHeaders }); const d = await r.json(); if (d.success) { toast.success(d.message); fetchCampaign(id); } } catch { /* silent */ } };
  const handleResume = async (id: string) => { try { const r = await fetch(`${API_BASE}/blogs/campaigns/${id}/resume`, { method: 'POST', headers: authHeaders }); const d = await r.json(); if (d.success) { toast.success(d.message); fetchCampaign(id); } } catch { /* silent */ } };

  const openPostEditor = async (postId: string) => {
    try {
      const r = await fetch(`${API_BASE}/blogs/posts/${postId}`, { headers: authOnly }); const d = await r.json();
      if (d.success) {
        setEditPost(d.post); setEditTab('preview');
        setEditForm({ title: d.post.title || '', content: d.post.content || '', excerpt: d.post.excerpt || '', slug: d.post.slug || '', metaTitle: d.post.metaTitle || '', metaDescription: d.post.metaDescription || '', focusKeyword: d.post.focusKeyword || '', tags: (d.post.tags || []).join(', '), held: d.post.held ? 'true' : 'false' });
      }
    } catch { toast.error('Failed to load post'); }
  };

  const handleSavePost = async () => {
    if (!editPost) return; setIsSaving(true);
    try {
      const body = { ...editForm, tags: typeof editForm.tags === 'string' ? editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : editForm.tags, held: editForm.held === 'true' };
      const r = await fetch(`${API_BASE}/blogs/posts/${editPost._id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) { toast.success('Post updated'); setEditPost(null); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); }
      else toast.error(d.message);
    } catch { toast.error('Failed to save'); } finally { setIsSaving(false); }
  };

  const handleRegenPost = async (postId: string) => {
    setIsRegenerating(true);
    try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}/regenerate`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ target: regenTarget }) }); const d = await r.json(); if (d.success) { toast.success('Regenerated'); setEditPost(null); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); fetchStats(); } else toast.error(d.message); } catch { toast.error('Regenerate failed'); } finally { setIsRegenerating(false); }
  };

  const handleHold = async (postId: string) => { try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}/hold`, { method: 'POST', headers: authHeaders }); const d = await r.json(); if (d.success) { toast.success(d.message); if (editPost?._id === postId) { setEditPost({ ...editPost, held: !editPost.held }); setEditForm(p => ({ ...p, held: p.held === 'true' ? 'false' : 'true' })); } if (selectedCampaignId) fetchCampaign(selectedCampaignId); } } catch { /* silent */ } };
  const handlePublish = async (postId: string) => { try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}/publish`, { method: 'POST', headers: authHeaders }); const d = await r.json(); if (d.success) { toast.success('Published!'); setEditPost(null); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); fetchStats(); } } catch { /* silent */ } };
  const handleUnpublish = async (postId: string) => { try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}/unpublish`, { method: 'POST', headers: authHeaders }); const d = await r.json(); if (d.success) { toast.success('Unpublished'); setEditPost(null); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); fetchStats(); } } catch { /* silent */ } };
  const handleDelete = async (postId: string) => { if (!confirm('Delete this post?')) return; try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}`, { method: 'DELETE', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success('Deleted'); setEditPost(null); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); fetchStats(); } } catch { /* silent */ } };
  const handleDeleteCampaign = async (campaignId: string, keyword: string) => { if (!campaignId) { toast.error('Invalid campaign ID'); return; } if (!confirm(`Delete entire "${keyword}" campaign and ALL its posts? This cannot be undone.`)) return; try { const r = await fetch(`${API_BASE}/blogs/campaigns/${campaignId}`, { method: 'DELETE', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success(d.message || 'Campaign deleted'); fetchCampaigns(); fetchStats(); } else { toast.error(d.message || 'Failed to delete'); } } catch { toast.error('Failed to delete campaign'); } };
  const handleDeletePost = async (e: React.MouseEvent, postId: string) => { e.stopPropagation(); if (!confirm('Delete this post?')) return; try { const r = await fetch(`${API_BASE}/blogs/posts/${postId}`, { method: 'DELETE', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success('Post deleted'); if (selectedCampaignId) fetchCampaign(selectedCampaignId); fetchCampaigns(); fetchStats(); } } catch { toast.error('Failed to delete post'); } };
  const handleRefreshAllImages = async () => { if (!confirm('Replace ALL blog images with real Tubhyam product photos? This will update all published posts.')) return; setIsRefreshing(true); try { const r = await fetch(`${API_BASE}/blogs/posts/batch-refresh-images`, { method: 'POST', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success(d.message); fetchCampaigns(); fetchStats(); } else { toast.error(d.message || 'Failed to refresh images'); } } catch { toast.error('Failed to refresh images'); } finally { setIsRefreshing(false); } };
  const handleDeleteAllCampaigns = async () => { if (!confirm('Delete ALL campaigns and their posts? This cannot be undone.')) return; try { const r = await fetch(`${API_BASE}/blogs/campaigns/all`, { method: 'DELETE', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success(d.message); fetchCampaigns(); fetchStats(); } else { toast.error(d.message); } } catch { toast.error('Failed to delete campaigns'); } };

  // ═══ Helpers ═════════════════════════════════════════════════════════════

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
  const fmtShort = (d: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '-';

  const statusPill = (status: string, held?: boolean) => {
    if (held) return <span style={{ background: '#FFF3E0', color: '#E65100', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>On Hold</span>;
    switch (status) {
      case 'planned': return <span style={{ background: C.blueBg, color: C.blueText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Planned</span>;
      case 'generating': return <span style={{ background: C.blueBg, color: C.blue, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={10} className="animate-spin" />Generating...</span>;
      case 'draft': return <span style={{ background: C.yellowBg, color: C.yellowText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Draft</span>;
      case 'scheduled': return <span style={{ background: C.pinkBg, color: C.pinkText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Scheduled</span>;
      case 'published': return <span style={{ background: C.greenBg, color: C.greenText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Published</span>;
      case 'failed': return <span style={{ background: C.redBg, color: C.redText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Failed</span>;
      default: return null;
    }
  };

  const campaignStatus = (c: Campaign) => {
    if (c.published > 0 || c.scheduled > 0) return { label: 'Active', bg: C.greenBg, color: C.greenText };
    return { label: 'Planned', bg: C.blueBg, color: C.blueText };
  };

  const filteredCampaigns = campaigns.filter(c => c.keyword.toLowerCase().includes(searchQuery.toLowerCase()));

  // ═══ Campaign Detail Helpers ════════════════════════════════════════════

  const hasPlanned = campaignPosts.some(p => p.status === 'planned');
  const generatedCount = campaignPosts.filter(p => p.generationStatus === 'ready' || p.status === 'published' || p.status === 'draft' || p.status === 'scheduled').length;

  // ═══ Main Render ════════════════════════════════════════════════════════

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Montserrat', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ width: 240, background: C.sidebar, borderRight: `1px solid ${C.border}` }}>
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#4A4036', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={ainosImg} alt="AINOS" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#ffcd94', letterSpacing: 1.5, display: 'block', lineHeight: 1.2 }}>AINOS</span>
            <span style={{ fontSize: 9, color: '#B0A090', letterSpacing: 0.5, fontWeight: 500 }}>AI Shopping Helper</span>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          <button onClick={() => { setView('list'); setSelectedCampaignId(null); setCampaignMeta(null); setCampaignPosts([]); fetchCampaigns(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: view !== 'create' ? C.accentLight : 'transparent', color: view !== 'create' ? C.accent : C.sidebarTextDim, borderLeft: view !== 'create' ? '3px solid #FFD3AC' : '3px solid transparent' }}>
            <LayoutGrid size={16} /> Campaigns
          </button>
          <button onClick={() => { setView('create'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: view === 'create' ? C.accentLight : 'transparent', color: view === 'create' ? C.accent : C.sidebarTextDim, borderLeft: view === 'create' ? '3px solid #FFD3AC' : '3px solid transparent' }}>
            <Settings size={16} /> New Campaign
          </button>
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-5">
          <a href="/inventory" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded-lg" style={{ color: '#FFD3AC', background: 'rgba(255,211,172,0.08)' }}>
            <Package size={14} /> Inventory App
          </a>
          <a href="/" className="flex items-center gap-2 text-sm" style={{ color: C.sidebarTextDim }}>
            <ArrowLeft size={14} /> Back to Site
          </a>
          <p style={{ fontSize: 8, color: '#5A5048', marginTop: 8, letterSpacing: 0.5 }}>PRODUCT BY YUREKH</p>
        </div>
      </aside>

      <div style={{ marginLeft: 0 }} className="lg:ml-[240px]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${C.border}`, background: C.card }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textDark, padding: 4 }}>
            <LayoutGrid size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#4A4036', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={ainosImg} alt="AINOS" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.textDark, letterSpacing: 1.5 }}>AINOS</span>
          </div>
          <div style={{ width: 28 }} />
        </div>
        <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>

          {/* ═══ LIST VIEW ════════════════════════════════════════════════════════ */}
          {view === 'list' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textDark, margin: 0 }}>Content Campaigns</h1>
                  <p style={{ color: C.textMed, fontSize: 14, marginTop: 4 }}>Manage your automated SEO editorial calendar.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDeleteAllCampaigns} style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #FFCDD2', cursor: 'pointer' }}>
                    <Trash2 size={14} /> Delete All
                  </button>
                  <button onClick={handleRefreshAllImages} disabled={isRefreshing} style={{ background: isRefreshing ? C.textLight : '#E8F5E9', color: '#2E7D32', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #C8E6C9', cursor: isRefreshing ? 'wait' : 'pointer' }}>
                    {isRefreshing ? <><Loader2 size={14} className="animate-spin" /> Refreshing...</> : <><RefreshCw size={14} /> Refresh Images</>}
                  </button>
                  <button onClick={() => setView('create')} style={{ background: C.accent, color: '#1A1410', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}>
                    <Plus size={16} /> New Campaign
                  </button>
                </div>
              </div>

              <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Search size={16} style={{ color: C.textLight }} />
                <input type="text" value={searchQuery} onChange={e => handleSearchChange(e.target.value)} placeholder="Search blog posts by keyword, title, tags..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, color: C.textDark, background: 'transparent' }} />
                {searchQuery && <button onClick={() => { setSearchQuery(''); setBlogSearchResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight }}><X size={14} /></button>}
              </div>

              {isLoadingData && !searchQuery ? (
                <div className="text-center py-16"><Loader2 size={32} className="animate-spin mx-auto" style={{ color: C.textLight }} /></div>
              ) : searchQuery ? (
                isSearching ? (
                  <div className="text-center py-16"><Loader2 size={32} className="animate-spin mx-auto" style={{ color: C.textLight }} /></div>
                ) : blogSearchResults.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto mb-4 opacity-30" style={{ width: 64, height: 64, borderRadius: 12, background: '#4A4036', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Search size={28} />
                    </div>
                    <p style={{ color: C.textLight, fontSize: 14 }}>No blog posts found for &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: C.textMed, fontSize: 13, marginBottom: 16 }}>{blogSearchResults.length} result{blogSearchResults.length !== 1 ? 's' : ''} found</p>
                    <div className="space-y-3">
                      {blogSearchResults.map((blog) => (
                        <div key={blog._id} onClick={() => openPostEditor(blog._id)} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, cursor: 'pointer', transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
                          <div className="flex items-start gap-3">
                            {blog.image && <img src={blog.image} alt="" style={{ width: 80, height: 60, objectFit: 'cover', objectPosition: 'center', borderRadius: 6, flexShrink: 0 }} />}
                            <div className="flex-1 min-w-0">
                              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: C.textDark, margin: '0 0 6px', lineHeight: 1.3 }}>{blog.title || 'Untitled'}</h3>
                              <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: 12, color: C.textMed }}>
                                {statusPill(blog.status, blog.held)}
                                {blog.focusKeyword && <span className="flex items-center gap-1"><Hash size={11} /> {blog.focusKeyword}</span>}
                                {blog.category && <span className="flex items-center gap-1"><Tag size={11} /> {blog.category}</span>}
                                {blog.scheduledPublishDate && <span className="flex items-center gap-1"><Calendar size={11} /> {fmtDate(blog.scheduledPublishDate)}</span>}
                              </div>
                              {blog.excerpt && <p style={{ fontSize: 12, color: C.textLight, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.excerpt.replace(/<[^>]*>/g, '')}</p>}
                            </div>
                            <ChevronRight size={16} style={{ color: C.textLight, flexShrink: 0 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 opacity-30" style={{ width: 64, height: 64, borderRadius: 12, background: '#4A4036', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BotIcon size={32} />
                  </div>
                  <p style={{ color: C.textLight, fontSize: 14 }}>No campaigns yet. Create your first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCampaigns.map(c => {
                    const s = campaignStatus(c);
                    return (
                      <div key={c.id} onClick={() => setSelectedCampaignId(c.id)} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 20, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'box-shadow 0.2s', position: 'relative' }} className="hover:shadow-md">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(c.id, c.keyword); }} title="Delete campaign" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#E53935'; e.currentTarget.style.background = '#FFEBEE'; }} onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'none'; }}><Trash2 size={14} /></button>
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>{s.label}</span>
                          <span style={{ background: C.grayTag, color: C.textMed, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>{genMode === 'jit' ? 'JIT Gen' : 'Bulk Gen'}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.textDark, margin: '0 0 12px', lineHeight: 1.3 }}>{c.keyword}</h3>
                        <div className="flex items-center gap-4" style={{ fontSize: 12, color: C.textMed }}>
                          <span className="flex items-center gap-1"><Calendar size={12} /> Starts {fmtDate(c.posts[0]?.scheduledPublishDate || null)}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {c.total} days &bull; 1 post/day</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.borderLight}`, fontSize: 11, color: C.textLight }}>
                          {c.published > 0 && <span style={{ color: C.greenText }}>{c.published} published</span>}
                          {c.planned > 0 && <span style={{ color: C.blueText }}>{c.planned} planned</span>}
                          {c.failed > 0 && <span style={{ color: C.redText }}>{c.failed} failed</span>}
                          <ChevronRight size={14} className="ml-auto" style={{ color: C.textLight }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ CREATE CAMPAIGN VIEW ══════════════════════════════════════════════ */}
          {view === 'create' && (
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textDark, margin: 0 }}>Plan New Campaign</h1>
              <p style={{ color: C.textMed, fontSize: 14, marginTop: 4, marginBottom: 8 }}>Define your topic and let AINOS generate a full editorial calendar.</p>
              <div style={{ height: 4, background: C.borderLight, borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: keyword.trim() ? '100%' : '10%', background: C.accent, borderRadius: 2, transition: 'width 0.3s' }} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  <div style={{ background: C.cardAlt, borderRadius: 12, padding: 24, border: `1px solid ${C.border}` }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.accent, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={16} /> Core Topic</h3>
                    <p style={{ color: C.textMed, fontSize: 13, marginBottom: 16 }}>The main focus for this content cluster.</p>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6 }}>Seed Keyword</label>
                    <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. Plus Size Kurti Styling"
                      style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }}
                      disabled={isCreating} onKeyDown={e => e.key === 'Enter' && handleCreateCampaign()} />
                    <p style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>This keyword drives the AI topic planning of the entire campaign.</p>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6, marginTop: 16 }}>Brand Voice & Tone</label>
                    <input type="text" value={tone} onChange={e => setTone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }}
                      disabled={isCreating} />
                    <p style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>Describe how the articles should sound.</p>
                  </div>

                  <div style={{ background: C.cardAlt, borderRadius: 12, padding: 24, border: `1px solid ${C.border}` }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.accent, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} /> Schedule</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6 }}>Duration (Days)</label>
                        <input type="number" value={days} onChange={e => setDays(Math.min(30, Math.max(1, parseInt(e.target.value) || 30)))} min={1} max={30}
                          style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} disabled={isCreating} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6 }}>Posts per Day</label>
                        <input type="number" value={1} readOnly style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textMed, background: C.cardAlt, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ background: C.cardAlt, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, height: 'fit-content' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.accent, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Content Settings</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6 }}>Target Word Count</label>
                      <input type="number" value={wordCount} onChange={e => setWordCount(parseInt(e.target.value) || 1000)}
                        style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} disabled={isCreating} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 6 }}>Images per Post</label>
                      <input type="number" value={imagesPerPost} onChange={e => setImagesPerPost(parseInt(e.target.value) || 1)} min={1} max={3}
                        style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} disabled={isCreating} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.textDark, display: 'block', marginBottom: 8 }}>Generation Mode</label>
                      {([['jit', 'Just-in-Time (Recommended)', 'Generate posts 2 days before publishing.'], ['bulk', 'Generate All Now', 'Generate all posts immediately.']] as const).map(([mode, label, desc]) => (
                        <label key={mode} className="flex items-start gap-3 mb-3 cursor-pointer" style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${genMode === mode ? C.accent : C.border}`, background: genMode === mode ? C.accentLight + '30' : C.card }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${genMode === mode ? C.accent : C.border}`, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {genMode === mode && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: C.textDark, margin: 0 }}>{label}</p>
                            <p style={{ fontSize: 11, color: C.textMed, margin: 0 }}>{desc}</p>
                          </div>
                          <input type="radio" name="genMode" checked={genMode === mode} onChange={() => setGenMode(mode)} className="sr-only" />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Auto-Publish */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: 0 }}>Auto-Publish Automation</p>
                        <p style={{ fontSize: 11, color: C.textMed, margin: '2px 0 0' }}>Automatically publish posts on scheduled dates.</p>
                      </div>
                      <button onClick={() => setAutoPublish(!autoPublish)} style={{ width: 48, height: 26, borderRadius: 13, background: autoPublish ? C.accent : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: autoPublish ? 25 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 mt-8">
                <button onClick={() => setView('list')} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: C.card, border: `1px solid ${C.border}`, color: C.textMed, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCreateCampaign} disabled={isCreating || !keyword.trim()} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: isCreating ? C.textLight : C.accent, border: 'none', color: '#1A1410', cursor: isCreating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isCreating ? <><Loader2 size={16} className="animate-spin" /> Planning...</> : <><CheckCircle size={16} /> Create Campaign & Plan</>}
                </button>
              </div>
            </div>
          )}

          {/* ═══ CAMPAIGN DETAIL VIEW ═════════════════════════════════════════════ */}
          {view === 'detail' && (
            campaignMeta ? (
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4" style={{ fontSize: 12, color: C.textLight }}>
                  <button onClick={() => { setView('list'); setSelectedCampaignId(null); setCampaignMeta(null); setCampaignPosts([]); fetchCampaigns(); }} style={{ background: 'none', border: 'none', color: C.textLight, cursor: 'pointer', padding: 0, fontSize: 12 }}>Campaigns</button>
                  <ChevronRight size={12} />
                  <span style={{ color: C.textMed }}>{campaignMeta.keyword}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {hasPlanned ? statusPill('planned') : <span style={{ background: C.greenBg, color: C.greenText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Active</span>}
                      {autoPublish && <span style={{ background: C.pinkBg, color: C.pinkText, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Auto-Publish ON</span>}
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textDark, margin: 0 }}>{campaignMeta.keyword}</h1>
                    <p style={{ fontSize: 14, color: C.textMed, marginTop: 4 }}>{campaignMeta.totalPosts} days &bull; {campaignPosts.filter(p => p.status === 'planned').length} planned posts &bull; Starts {fmtDate(campaignPosts[0]?.scheduledPublishDate || null)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasPlanned && (
                      <button onClick={() => handleGenerate(campaignMeta.id)} disabled={isGenerating} style={{ background: C.accent, color: '#1A1410', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: isGenerating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Start Generation</>}
                      </button>
                    )}
                    <button onClick={() => handlePause(campaignMeta.id)} style={{ background: C.card, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 8, fontSize: 12, color: C.textMed, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Pause size={14} /> Pause
                    </button>
                    <button onClick={() => handleResume(campaignMeta.id)} style={{ background: C.card, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 8, fontSize: 12, color: C.textMed, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Play size={14} /> Resume
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 mt-6">
                  {[
                    { icon: <FileText size={18} style={{ color: C.textMed }} />, label: 'Total Posts', value: campaignMeta.totalPosts },
                    { icon: <Sparkles size={18} style={{ color: C.accent }} />, label: 'Generated', value: generatedCount },
                    { icon: <CheckCircle size={18} style={{ color: C.green }} />, label: 'Published', value: campaignPosts.filter(p => p.status === 'published').length },
                    { icon: <Clock size={18} style={{ color: C.blue }} />, label: 'Mode', value: genMode === 'jit' ? 'Just In Time' : 'Bulk All' },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div className="flex items-center gap-3">
                        {m.icon}
                        <div>
                          <p style={{ fontSize: 22, fontWeight: 700, color: C.textDark, margin: 0 }}>{m.value}</p>
                          <p style={{ fontSize: 11, color: C.textMed, margin: 0 }}>{m.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content Calendar */}
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: C.textDark, marginBottom: 16 }}>Content Calendar</h2>
                <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  {campaignPosts.map((post, idx) => (
                    <div key={post._id} style={{ padding: '16px 20px', borderBottom: idx < campaignPosts.length - 1 ? `1px solid ${C.borderLight}` : 'none', display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.15s' }}
                      className="hover:bg-[#332A26]" onClick={() => openPostEditor(post._id)}>
                      <div style={{ minWidth: 80, flexShrink: 0 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: C.textLight, letterSpacing: 1, margin: 0 }}>DAY {post.dayIndex}</p>
                        <p style={{ fontSize: 11, color: C.textMed, margin: '2px 0 0' }}>{fmtShort(post.scheduledPublishDate)}</p>
                      </div>
                      <div style={{ minWidth: 90, flexShrink: 0, paddingTop: 2 }}>{statusPill(post.status, post.held)}</div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.textDark, margin: 0, lineHeight: 1.4 }}>{post.title}</p>
                        {post.excerpt && <p style={{ fontSize: 12, color: C.textMed, margin: '4px 0 0', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</p>}
                      </div>
                      {post.image && (
                        <div style={{ width: 56, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, border: `1px solid ${C.borderLight}` }}>
                          <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} loading="lazy" />
                        </div>
                      )}
                      <button onClick={(e) => handleDeletePost(e, post._id)} title="Delete post" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#E53935'; e.currentTarget.style.background = '#FFEBEE'; }} onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'none'; }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-center py-16"><Loader2 size={32} className="animate-spin mx-auto" style={{ color: C.textLight }} /></div>
          )}

        </div>
      </div>

      {/* ═══ POST EDITOR MODAL ═══════════════════════════════════════════════ */}
      {editPost && (
        <div className="fixed inset-0 z-50 flex" style={{ background: C.bg }}>
          {/* Sidebar inside modal */}
          <div className="hidden lg:block" style={{ width: 240, background: C.sidebar, borderRight: `1px solid ${C.border}`, flexShrink: 0, overflowY: 'auto', padding: 20 }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: C.accent, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={14} /> Meta Data</h3>
            <div className="space-y-3">
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Topic Angle</label>
                <div style={{ background: C.cardAlt, padding: '8px 10px', borderRadius: 6, fontSize: 12, color: C.textMed, lineHeight: 1.4 }}>{editPost.excerpt || '-'}</div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Title</label>
                <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Slug</label>
                <input type="text" value={editForm.slug || ''} onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textMed, background: C.card, outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Excerpt</label>
                <textarea value={editForm.excerpt || ''} onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.textDark, background: C.card, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>SEO Focus</label>
                <div style={{ background: C.cardAlt, padding: '8px 10px', borderRadius: 6, fontSize: 12, color: C.textDark }}>{editForm.focusKeyword || '-'}</div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Tags</label>
                <div className="flex flex-wrap gap-1">
                  {(editPost.tags || []).map((tag, i) => (
                    <span key={i} style={{ background: '#D7CCC8', color: '#5D4037', fontSize: 10, padding: '2px 8px', borderRadius: 12 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Meta Title</label>
                <input type="text" value={editForm.metaTitle || ''} onChange={e => setEditForm({ ...editForm, metaTitle: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Meta Description</label>
                <textarea value={editForm.metaDescription || ''} onChange={e => setEditForm({ ...editForm, metaDescription: e.target.value })} rows={2}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.textDark, background: C.card, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Main editor area */}
          <div className="flex-1 overflow-y-auto">
            {/* Top bar */}
            <div style={{ borderBottom: `1px solid ${C.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.card, position: 'sticky', top: 0, zIndex: 10 }}>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditPost(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMed, display: 'flex', alignItems: 'center', padding: 0 }}><ArrowLeft size={18} /></button>
                {statusPill(editPost.status, editPost.held)}
                <span style={{ fontSize: 12, color: C.textMed }}>Day {editPost.dayIndex}</span>
                <span style={{ fontSize: 12, color: C.textLight }}>Scheduled: {fmtDate(editPost.scheduledPublishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSavePost} disabled={isSaving} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.card, border: `1px solid ${C.border}`, color: C.textMed, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Draft
                </button>
                <button onClick={() => handleRegenPost(editPost._id)} disabled={isRegenerating} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.card, border: `1px solid ${C.border}`, color: C.textMed, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isRegenerating ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Regenerate
                </button>
                {editPost.status !== 'published' ? (
                  <button onClick={() => handlePublish(editPost._id)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.green, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Globe size={12} /> Publish Now
                  </button>
                ) : (
                  <button onClick={() => handleUnpublish(editPost._id)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.yellowBg, border: `1px solid #FFF9C4`, color: C.yellowText, cursor: 'pointer' }}>
                    Unpublish
                  </button>
                )}
                <button onClick={() => handleHold(editPost._id)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.holdBg, border: 'none', color: C.textMed, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Pause size={12} /> Hold
                </button>
              </div>
            </div>

            {/* Preview/Edit tabs */}
            <div style={{ borderBottom: `1px solid ${C.border}`, padding: '8px 20px', display: 'flex', gap: 8, background: C.card }}>
              <button onClick={() => setEditTab('preview')} style={{ padding: '4px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: editTab === 'preview' ? C.accent : 'transparent', color: editTab === 'preview' ? '#1A1410' : C.textMed, border: 'none', cursor: 'pointer' }}>
                <Eye size={12} className="inline mr-1" /> Preview
              </button>
              <button onClick={() => setEditTab('markdown')} style={{ padding: '4px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: editTab === 'markdown' ? C.accent : 'transparent', color: editTab === 'markdown' ? '#1A1410' : C.textMed, border: 'none', cursor: 'pointer' }}>
                <Edit3 size={12} className="inline mr-1" /> Edit Content
              </button>
              <div className="ml-auto flex items-center gap-1">
                {(['all', 'text', 'images'] as const).map(t => (
                  <button key={t} onClick={() => setRegenTarget(t)} style={{ padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: regenTarget === t ? C.accent : C.cardAlt, color: regenTarget === t ? '#1A1410' : C.textMed, border: `1px solid ${regenTarget === t ? C.accent : C.border}`, cursor: 'pointer' }}>
                    {t === 'all' ? 'All' : t === 'text' ? 'Text' : 'Images'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div style={{ padding: '24px 32px', maxWidth: 800 }}>
              {editTab === 'preview' ? (
                <div>
                  {editPost.image && (
                    <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 24, border: `1px solid ${C.border}`, position: 'relative' }}>
                      <img src={editPost.image} alt={editPost.title} style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                      <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>HERO</span>
                    </div>
                  )}
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textDark, lineHeight: 1.3, margin: '0 0 8px' }}>{editPost.title}</h1>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: C.textMed, lineHeight: 1.4, margin: '0 0 24px' }}>{editPost.metaTitle || editPost.title}</p>
                  {editPost.content ? (
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#333' }} className="prose-content"
                      dangerouslySetInnerHTML={{ __html: editPost.content }} />
                  ) : (
                    <p style={{ color: C.textLight, fontStyle: 'italic' }}>Content pending generation.</p>
                  )}

                  <div style={{ marginTop: 32, padding: 16, background: C.cardAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.textLight, letterSpacing: 1, margin: '0 0 8px' }}>GOOGLE PREVIEW</p>
                    <p style={{ fontSize: 14, color: '#1a0dab', margin: 0, fontWeight: 500 }}>{editForm.metaTitle || editPost.title}</p>
                    <p style={{ fontSize: 12, color: '#006621', margin: '2px 0' }}>tubhyam.in/blog/{editForm.slug || '...'}</p>
                    <p style={{ fontSize: 12, color: C.textMed, margin: 0 }}>{editForm.metaDescription || editPost.excerpt}</p>
                  </div>

                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={async () => { if (!confirm('Replace images with real product photos?')) return; try { const r = await fetch(`${API_BASE}/blogs/posts/${editPost._id}/refresh-images`, { method: 'POST', headers: authOnly }); const d = await r.json(); if (d.success) { toast.success(d.message); openPostEditor(editPost._id); if (selectedCampaignId) fetchCampaign(selectedCampaignId); } else { toast.error(d.message); } } catch { toast.error('Failed'); } }} style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={12} /> Refresh Images
                    </button>
                    <button onClick={() => handleDelete(editPost._id)} style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: C.redBg, border: `1px solid #FFCDD2`, color: C.redText, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Trash2 size={12} /> Delete Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Title</label>
                    <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Content (HTML)</label>
                    <textarea value={editForm.content || ''} onChange={e => setEditForm({ ...editForm, content: e.target.value })} rows={20}
                      style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.textDark, background: C.card, outline: 'none', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Slug</label>
                      <input type="text" value={editForm.slug || ''} onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.textDark, background: C.card, outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.textMed, display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
                      <input type="text" value={editForm.tags || ''} onChange={e => setEditForm({ ...editForm, tags: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.textDark, background: C.card, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <button onClick={handleSavePost} disabled={isSaving} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: C.accent, border: 'none', color: '#1A1410', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSEO;
