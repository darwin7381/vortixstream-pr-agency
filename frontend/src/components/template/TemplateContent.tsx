import { FileText, Download, Rocket, TrendingUp, Award, Megaphone } from 'lucide-react';
import { Button } from '../ui/button';

const templates = [
  {
    icon: Rocket,
    title: 'Product Launch',
    description: 'Perfect for announcing new products, features, or services to the market.',
    category: 'Launch',
    color: '#FF7400'
  },
  {
    icon: TrendingUp,
    title: 'Funding Announcement',
    description: 'Communicate your latest funding round or investment news professionally.',
    category: 'Finance',
    color: '#1D3557'
  },
  {
    icon: Award,
    title: 'Achievement & Awards',
    description: 'Showcase your company achievements, milestones, and industry recognition.',
    category: 'Recognition',
    color: '#FF7400'
  },
  {
    icon: Megaphone,
    title: 'Event Announcement',
    description: 'Promote upcoming events, conferences, or company milestones.',
    category: 'Event',
    color: '#1D3557'
  },
  {
    icon: FileText,
    title: 'Partnership News',
    description: 'Announce strategic partnerships and collaborations effectively.',
    category: 'Partnership',
    color: '#FF7400'
  },
  {
    icon: TrendingUp,
    title: 'Company Update',
    description: 'Share important company news, updates, and strategic changes.',
    category: 'Update',
    color: '#1D3557'
  }
];

export default function TemplateContent() {
  return (
    <section className="bg-black py-section-medium">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto">
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-[#FF7400]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,116,0,0.15)] group"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${template.color}20`, border: `1px solid ${template.color}40` }}
                >
                  <Icon size={28} style={{ color: template.color }} />
                </div>

                {/* Category Badge */}
                <div className="inline-block mb-4">
                  <span className="text-[12px] font-sans font-semibold font-semibold text-[#FF7400] bg-[#FF7400]/10 px-3 py-1 rounded-full border border-[#FF7400]/20">
                    {template.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white text-[22px] font-sans font-bold font-bold mb-3">
                  {template.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-[14px] font-sans leading-relaxed mb-6">
                  {template.description}
                </p>

                {/* Download Button */}
                <Button
                  className="w-full bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-[#FF7400]/50 transition-all duration-300 group-hover:text-[#FF7400]"
                >
                  <Download size={16} className="mr-2" />
                  Download Template
                </Button>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/20 rounded-2xl p-10">
            <h3 className="text-white text-[28px] md:text-[32px] font-sans font-bold font-bold mb-4">
              Need Custom Templates?
            </h3>
            <p className="text-white/80 text-[16px] font-sans leading-relaxed mb-6">
              Our team can create customized PR templates tailored to your brand voice and specific communication needs.
            </p>
            <Button
              className="bg-gradient-to-r from-[#FF7400] to-[#1D3557] text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all duration-300"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


