import Footer from '../Footer';
import BlogHero from './BlogHero';
import BlogArticlesGrid from './BlogArticlesGrid';
import BlogNewsletter from './BlogNewsletter';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <BlogHero />
      <BlogArticlesGrid />
      <BlogNewsletter />
      <Footer />
    </div>
  );
}
