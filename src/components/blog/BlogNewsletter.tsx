import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { newsletterContent } from '../../constants/blogData';

export default function BlogNewsletter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Subscribing email:', email);
      setEmail('');
      
      // Show success message
      const button = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Subscribed!';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 py-section-medium">
      <div className="container-global">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#FF7400] rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 space-y-6 lg:space-y-8">
            {/* Newsletter Title */}
            <h2 
              className="text-white text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.2] tracking-[-0.24px] md:tracking-[-0.32px] lg:tracking-[-0.4px]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {newsletterContent.title}
            </h2>

            {/* Newsletter Description */}
            <p className="text-white/80 text-[12px] md:text-[16px] lg:text-[18px] leading-[1.6] max-w-2xl mx-auto">
              {newsletterContent.description}
            </p>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterContent.placeholder}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#FF7400] focus:ring-1 focus:ring-[#FF7400] h-12 text-[14px] md:text-[16px]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#1D3557] to-[#FF7400] hover:from-[#FF7400] hover:to-[#1D3557] text-white px-8 py-3 h-12 text-[14px] md:text-[16px] font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.3)]"
              >
                {newsletterContent.buttonText}
              </Button>
            </form>

            {/* Additional Info */}
            <p className="text-white/50 text-[10px] md:text-[12px]">
              Join 2,500+ PR professionals who trust our insights • No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
