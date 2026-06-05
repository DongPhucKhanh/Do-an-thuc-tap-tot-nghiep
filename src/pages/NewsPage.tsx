import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Newspaper, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// ─── Kiểu dữ liệu bài viết suy ra từ LatestNewsSection & NewsDetail ──────────
interface Post {
    id: string | number;
    title: string;
    content: string;
    image: string;
    createdAt: string;
}

// ─── Helper: resolve ảnh giống hệt LatestNewsSection & NewsDetail ─────────────
function resolveImage(image: string): string {
    if (!image) return 'https://placehold.co/600x400/e2e8f0/94a3b8?text=ThienNguyen+News';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
}

// ─── Helper: rút gọn nội dung tối đa N ký tự ────────────────────────────────
function truncate(text: string, maxLength = 140): string {
    if (!text) return 'Không có mô tả tóm tắt...';
    return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text;
}

// ─── Skeleton Card khi đang loading ──────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="news-card">
            <div className="news-card__image-wrap skeleton-shimmer" style={{ aspectRatio: '16/10' }} />
            <div className="news-card__body">
                <div className="skeleton-line" style={{ width: '45%', height: '10px', marginBottom: '10px' }} />
                <div className="skeleton-line" style={{ width: '90%', height: '16px', marginBottom: '6px' }} />
                <div className="skeleton-line" style={{ width: '75%', height: '16px', marginBottom: '12px' }} />
                <div className="skeleton-line" style={{ width: '100%', height: '11px', marginBottom: '4px' }} />
                <div className="skeleton-line" style={{ width: '80%', height: '11px', marginBottom: '4px' }} />
                <div className="skeleton-line" style={{ width: '60%', height: '11px', marginBottom: '16px' }} />
                <div className="skeleton-line" style={{ width: '30%', height: '12px' }} />
            </div>
        </div>
    );
}

// ─── Component chính NewsPage ─────────────────────────────────────────────────
export default function NewsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                // Lấy toàn bộ bài viết — dùng đúng endpoint /posts như LatestNewsSection
                const response = await api.get('/posts');
                const data: Post[] = response.data.data || response.data;
                setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi khi tải danh sách bài viết:', err);
                setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    return (
        <>
            {/* ─── Inline styles đồng bộ với LatestNewsSection ──────────────── */}
            <style>{`
                /* ── Layout & Background ── */
                .news-page {
                    min-height: 100vh;
                    background: #f8fafc;
                    padding-bottom: 80px;
                }

                /* ── Hero banner header ── */
                .news-page__hero {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
                    padding: 56px 16px 48px;
                    position: relative;
                    overflow: hidden;
                }
                .news-page__hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 60% 50% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 80% at 10% 80%, rgba(99,179,237,0.1) 0%, transparent 60%);
                }
                .news-page__hero-inner {
                    max-width: 1152px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }
                .news-page__badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 9999px;
                    padding: 4px 14px;
                    font-size: 11px;
                    font-weight: 800;
                    color: #bfdbfe;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 16px;
                }
                .news-page__hero-title {
                    font-size: clamp(1.6rem, 4vw, 2.6rem);
                    font-weight: 900;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                    margin: 0 0 10px;
                }
                .news-page__hero-sub {
                    font-size: 14px;
                    color: #bfdbfe;
                    font-weight: 500;
                    margin: 0;
                }
                .news-page__hero-count {
                    margin-top: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 12px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #e0f2fe;
                }

                /* ── Main content wrapper ── */
                .news-page__main {
                    max-width: 1152px;
                    margin: 0 auto;
                    padding: 40px 16px 0;
                }

                /* ── Section divider ── */
                .news-page__divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 28px;
                }
                .news-page__divider-line {
                    flex: 1;
                    height: 1px;
                    background: #e2e8f0;
                }
                .news-page__divider-label {
                    font-size: 10px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                }

                /* ── Grid bài viết ── */
                .news-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 24px;
                }
                @media (min-width: 640px) {
                    .news-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (min-width: 1024px) {
                    .news-grid { grid-template-columns: repeat(3, 1fr); }
                }

                /* ── Card bài viết ── */
                .news-card {
                    background: #ffffff;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04);
                    display: flex;
                    flex-direction: column;
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    cursor: pointer;
                }
                .news-card:hover {
                    box-shadow: 0 8px 24px rgba(30,58,138,0.10), 0 2px 8px rgba(0,0,0,0.06);
                    transform: translateY(-3px);
                }

                /* ── Vùng ảnh card ── */
                .news-card__image-wrap {
                    position: relative;
                    aspect-ratio: 16/10;
                    overflow: hidden;
                    background: #f1f5f9;
                    flex-shrink: 0;
                }
                .news-card__image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .news-card:hover .news-card__image {
                    transform: scale(1.05);
                }

                /* ── Body card ── */
                .news-card__body {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 12px;
                }
                .news-card__meta {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .news-card__title {
                    font-size: 15px;
                    font-weight: 900;
                    color: #1e293b;
                    line-height: 1.4;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.2s ease;
                }
                .news-card:hover .news-card__title {
                    color: #1d4ed8;
                }
                .news-card__excerpt {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.7;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-weight: 400;
                }
                .news-card__footer {
                    border-top: 1px solid #f8fafc;
                    padding-top: 12px;
                    margin-top: 4px;
                }
                .news-card__read-more {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 800;
                    color: #2563eb;
                    text-decoration: none;
                    transition: gap 0.2s ease, color 0.2s ease;
                }
                .news-card__read-more:hover {
                    color: #1d4ed8;
                    gap: 8px;
                }

                /* ── Loading skeleton ── */
                .skeleton-shimmer {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 12px;
                }
                .skeleton-line {
                    border-radius: 6px;
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Empty state ── */
                .news-empty {
                    text-align: center;
                    padding: 80px 24px;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                }
                .news-empty__icon {
                    width: 64px;
                    height: 64px;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                .news-empty__title {
                    font-size: 18px;
                    font-weight: 900;
                    color: #1e293b;
                    margin: 0 0 8px;
                }
                .news-empty__sub {
                    font-size: 13px;
                    color: #94a3b8;
                    margin: 0;
                    font-weight: 500;
                }

                /* ── Error state ── */
                .news-error {
                    text-align: center;
                    padding: 80px 24px;
                    background: #fff7f7;
                    border-radius: 20px;
                    border: 1px solid #fee2e2;
                    box-shadow: 0 1px 4px rgba(239,68,68,0.06);
                }
                .news-error__icon {
                    width: 64px;
                    height: 64px;
                    background: #fee2e2;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                .news-error__title {
                    font-size: 17px;
                    font-weight: 900;
                    color: #991b1b;
                    margin: 0 0 8px;
                }
                .news-error__message {
                    font-size: 13px;
                    color: #b91c1c;
                    margin: 0 0 20px;
                    font-weight: 500;
                }
                .news-error__btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 800;
                    color: #ffffff;
                    background: #dc2626;
                    border: none;
                    border-radius: 12px;
                    padding: 10px 22px;
                    cursor: pointer;
                    transition: background 0.2s ease, transform 0.15s ease;
                }
                .news-error__btn:hover {
                    background: #b91c1c;
                    transform: translateY(-1px);
                }

                /* ── Loading spinner center ── */
                .news-loading-spinner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 60px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                }
            `}</style>

            <div className="news-page">

                {/* ─── Hero Banner ──────────────────────────────────────────────── */}
                <div className="news-page__hero">
                    <div className="news-page__hero-inner">
                        <div className="news-page__badge">
                            <Newspaper size={11} />
                            Nhật ký hành trình
                        </div>
                        <h1 className="news-page__hero-title">
                            Tin tức &amp; Câu chuyện<br />Tình nguyện
                        </h1>
                        <p className="news-page__hero-sub">
                            Những khoảnh khắc nhân văn và cập nhật nóng hổi từ các chiến dịch mùa hè xanh
                        </p>
                        {!loading && !error && posts.length > 0 && (
                            <div className="news-page__hero-count">
                                <BookOpen size={13} />
                                {posts.length} bài viết
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Nội dung chính ───────────────────────────────────────────── */}
                <div className="news-page__main">

                    {/* Divider tiêu đề section */}
                    <div className="news-page__divider">
                        <div className="news-page__divider-line" />
                        <span className="news-page__divider-label">Tất cả bài viết</span>
                        <div className="news-page__divider-line" />
                    </div>

                    {/* ─── State: Loading ────────────────────────────────────────── */}
                    {loading && (
                        <div className="news-grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {/* ─── State: Error ──────────────────────────────────────────── */}
                    {!loading && error && (
                        <div className="news-error">
                            <div className="news-error__icon">
                                <AlertCircle size={30} color="#dc2626" />
                            </div>
                            <h2 className="news-error__title">Đã xảy ra lỗi!</h2>
                            <p className="news-error__message">{error}</p>
                            <button
                                className="news-error__btn"
                                onClick={() => window.location.reload()}
                            >
                                <Loader2 size={13} />
                                Thử lại
                            </button>
                        </div>
                    )}

                    {/* ─── State: Empty ──────────────────────────────────────────── */}
                    {!loading && !error && posts.length === 0 && (
                        <div className="news-empty">
                            <div className="news-empty__icon">
                                <BookOpen size={28} color="#94a3b8" />
                            </div>
                            <h2 className="news-empty__title">Chưa có bài viết nào</h2>
                            <p className="news-empty__sub">
                                Hãy quay lại sau — Ban truyền thông đang chuẩn bị nội dung mới nhất!
                            </p>
                        </div>
                    )}

                    {/* ─── State: Có dữ liệu — Lưới bài viết ────────────────────── */}
                    {!loading && !error && posts.length > 0 && (
                        <div className="news-grid">
                            {posts.map((post) => (
                                <article key={post.id} className="news-card">

                                    {/* Vùng ảnh bìa */}
                                    <div className="news-card__image-wrap">
                                        <img
                                            src={resolveImage(post.image)}
                                            alt={post.title}
                                            className="news-card__image"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://placehold.co/600x400/e2e8f0/94a3b8?text=ThienNguyen+News';
                                            }}
                                        />
                                    </div>

                                    {/* Body card */}
                                    <div className="news-card__body">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                                            {/* Ngày đăng */}
                                            <div className="news-card__meta">
                                                <Calendar size={11} />
                                                <span>
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>

                                            {/* Tiêu đề */}
                                            <h2 className="news-card__title">
                                                {post.title}
                                            </h2>

                                            {/* Nội dung rút gọn */}
                                            <p className="news-card__excerpt">
                                                {truncate(post.content)}
                                            </p>
                                        </div>

                                        {/* Nút Đọc tiếp */}
                                        <div className="news-card__footer">
                                            <Link
                                                to={`/news/${post.id}`}
                                                className="news-card__read-more"
                                            >
                                                <span>Đọc tiếp</span>
                                                <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>

                                </article>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
