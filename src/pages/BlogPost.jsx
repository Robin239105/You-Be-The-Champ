import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';
import { optimizeImage } from '../utils/imageOptimizer';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    api.get(`/blog/${slug}`)
      .then(res => { if (res.data.success) setPost(res.data.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return (
    <div className="bg-black min-h-screen">
      <Header />

       <main className="max-w-4xl mx-auto px-8 pt-52 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 size={40} className="text-gold animate-spin" />
          </div>
        ) : notFound || !post ? (
          <div className="text-center py-40">
            <p className="font-cinzel text-2xl text-ivory/20 uppercase tracking-widest mb-8">Article not found.</p>
            <Link to="/blog" className="text-gold font-cinzel text-xs uppercase tracking-widest border-b border-gold pb-1">← Back to Blog</Link>
          </div>
        ) : (
          <>
            <Breadcrumb items={[{ name: 'The Locker Room', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />

            <header className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                {post.category && <span className="text-gold font-cinzel text-xs font-bold tracking-widest uppercase border border-gold/30 px-3 py-1">{post.category}</span>}
                <span className="text-ivory/40 font-mono text-[10px] uppercase">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white tracking-widest uppercase leading-tight mb-8 drop-shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                {post.title}
              </h1>
              {post.excerpt && <p className="text-ivory/50 font-raleway text-lg leading-relaxed mb-8">{post.excerpt}</p>}
              <div className="flex items-center gap-4 py-8 border-y border-gold/10">
                <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center font-cinzel text-gold text-sm">
                  {post.author?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Authored by</p>
                  <p className="text-xs text-ivory font-bold uppercase">{post.author}</p>
                </div>
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-16 border border-gold/10 overflow-hidden">
                <img 
                  src={optimizeImage(post.coverImage, { w: 1200 })} 
                  alt={post.title} 
                  className="w-full object-cover max-h-[500px]" 
                  fetchpriority="high"
                />
              </div>
            )}

            <article
              className="prose prose-invert max-w-none font-raleway leading-loose
                [&_h1]:font-cinzel [&_h1]:text-gold [&_h1]:text-4xl [&_h1]:uppercase [&_h1]:tracking-widest [&_h1]:mb-6 [&_h1]:mt-10
                [&_h2]:font-cinzel [&_h2]:text-gold [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-gold/10
                [&_h3]:font-cinzel [&_h3]:text-gold/80 [&_h3]:text-xl [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:mb-3 [&_h3]:mt-6
                [&_p]:text-ivory/70 [&_p]:mb-5 [&_p]:text-lg
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:text-ivory/70
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:text-ivory/70
                [&_li]:mb-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-8 [&_blockquote]:py-4 [&_blockquote]:bg-card [&_blockquote]:italic [&_blockquote]:text-white [&_blockquote]:text-2xl [&_blockquote]:font-cinzel [&_blockquote]:my-8
                [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2
                [&_strong]:text-white [&_strong]:font-bold
                [&_code]:bg-white/10 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-gold [&_code]:text-sm
                [&_hr]:border-gold/20 [&_hr]:my-10
                [&_img]:rounded [&_img]:max-w-full [&_img]:my-6 [&_img]:border [&_img]:border-gold/10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <section className="mt-24 pt-16 border-t border-gold/10 flex justify-between items-center">
              <Link to="/blog" className="text-gold font-cinzel text-xs font-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform">← Archive</Link>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
