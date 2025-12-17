import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, Globe, DollarSign, Users, Zap, Shield, Target, Award, Waves, Eye, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import VortixLogoWhite from '../assets/VortixLogo White_Horizontal.png';

export default function ConceptPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'cover',
      title: 'VortixPR',
      subtitle: 'Joint Venture Partnership Opportunity',
      description: 'Strategic Alliance for Turkey Market Expansion',
      content: (
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <img
              src={VortixLogoWhite}
              alt="VortixPR Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <div className="space-y-6">
            <div className="text-white/70 text-lg">
              Partnership Proposal
            </div>
            <div className="text-[#FF7400] text-xl font-medium">
              January 2025
            </div>
            <div className="text-white/60 text-base max-w-2xl mx-auto">
              Combining cutting-edge streaming technology with local market expertise
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'market-size',
      title: 'Market Opportunity',
      subtitle: '$184B+ Global Live Streaming Market',
      description: 'Exponential growth across all verticals',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="h-8 w-8 text-[#FF7400]" />
                  <div>
                    <div className="text-4xl font-bold text-white">$184B</div>
                    <div className="text-white/70">Market Size 2024</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Globe className="h-8 w-8 text-[#FF7400]" />
                  <div>
                    <div className="text-4xl font-bold text-white">28%</div>
                    <div className="text-white/70">Annual Growth Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="h-8 w-8 text-[#FF7400]" />
                  <div>
                    <div className="text-4xl font-bold text-white">4.8B</div>
                    <div className="text-white/70">Global Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Key Growth Drivers</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#FF7400] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Enterprise Adoption</div>
                  <div className="text-white/70 text-sm">Remote work and virtual events driving B2B growth</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#FF7400] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Social Commerce</div>
                  <div className="text-white/70 text-sm">Live shopping and influencer marketing boom</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#FF7400] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">5G & Edge Computing</div>
                  <div className="text-white/70 text-sm">Infrastructure enabling ultra-low latency streaming</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#FF7400] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-medium">Emerging Markets</div>
                  <div className="text-white/70 text-sm">Turkey, MENA, and SEA represent massive untapped potential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'why-vortixstream',
      title: 'Why VortixPR',
      subtitle: 'The Current That Carries Tech\'s Biggest Stories',
      description: 'Streaming visionary ideas into the mainstream with clarity and impact',
      content: (
        <div className="space-y-12">
          {/* Brand Mission Section */}
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-[#FF7400]/20 via-[#1D3557]/20 to-[#FF7400]/20 border border-[#FF7400]/30 rounded-3xl p-12">
              <h3 className="text-3xl font-bold text-white mb-6">Brand Mission</h3>
              <p className="text-2xl text-[#FF7400] mb-8 italic">
                "To stream visionary ideas into the mainstream with clarity and impact."
              </p>
              <div className="flex justify-center">
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FF7400] to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Brand Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF7400] to-[#FF7400]/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Waves className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Flow</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                We seamlessly navigate the tech landscape, ensuring smooth delivery of streaming solutions that adapt to any challenge or opportunity.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF7400] to-[#FF7400]/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Clarity</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Every solution we deliver brings crystal-clear understanding and transparency, eliminating complexity in streaming infrastructure.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF7400] to-[#FF7400]/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Innovation</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                We pioneer groundbreaking streaming technologies that reshape how the world experiences live content and digital narratives.
              </p>
            </div>
          </div>

          {/* Brand Promise & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Brand Promise</h3>
              <div className="space-y-4">
                <p className="text-lg text-[#FF7400] font-medium italic">
                  "We stream your vision into the global spotlight."
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Every partnership with VortixPR means your content, your message, and your innovation reaches audiences worldwide with unprecedented quality and reliability.
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Brand Vision</h3>
              <div className="space-y-4">
                <p className="text-lg text-[#FF7400] font-medium italic">
                  "To be the current that carries tech's biggest stories to the world."
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  We envision a future where every breakthrough, every innovation, every compelling narrative flows seamlessly through our infrastructure to inspire global audiences.
                </p>
              </div>
            </div>
          </div>

          {/* Brand Voice Characteristics */}
          <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How We Communicate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF7400] mb-2">Fluid</div>
                <div className="text-white/70 text-sm">Adaptable and responsive to every conversation and context</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF7400] mb-2">Compelling</div>
                <div className="text-white/70 text-sm">Engaging narratives that capture attention and drive action</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF7400] mb-2">Visionary</div>
                <div className="text-white/70 text-sm">Forward-thinking perspectives that inspire possibility</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'solution',
      title: 'Our Solution',
      subtitle: 'Fluid Narratives for Groundbreaking Projects',
      description: 'Delivering streaming excellence with clarity and innovation',
      content: (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-6 text-center">
              <Zap className="h-12 w-12 text-[#FF7400] mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Ultra-Low Latency</h4>
              <p className="text-white/70 text-sm">Sub-100ms global streaming</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-6 text-center">
              <Shield className="h-12 w-12 text-[#FF7400] mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Enterprise Security</h4>
              <p className="text-white/70 text-sm">Bank-grade encryption & compliance</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-6 text-center">
              <Globe className="h-12 w-12 text-[#FF7400] mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Global Scale</h4>
              <p className="text-white/70 text-sm">200+ edge locations worldwide</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 border border-[#FF7400]/30 rounded-2xl p-6 text-center">
              <Target className="h-12 w-12 text-[#FF7400] mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Smart Analytics</h4>
              <p className="text-white/70 text-sm">AI-powered insights & optimization</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">The VortixPR Advantage</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Waves className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Seamless Flow Technology</div>
                    <div className="text-white/70 text-sm">Patent-pending algorithms that ensure uninterrupted streaming experiences</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Eye className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Crystal-Clear Delivery</div>
                    <div className="text-white/70 text-sm">Transparent infrastructure with real-time insights and analytics</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Visionary Innovation</div>
                    <div className="text-white/70 text-sm">Pioneering solutions that anticipate tomorrow's streaming needs</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ArrowRight className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Global Spotlight Reach</div>
                    <div className="text-white/70 text-sm">Carrying your stories to worldwide audiences with impact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'partnership-model',
      title: 'Partnership Structure',
      subtitle: 'Joint Venture Framework',
      description: 'Shared success through complementary strengths',
      content: (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">VortixPR Brings</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Zap className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Cutting-Edge Technology</div>
                      <div className="text-white/70 text-sm">Patent-pending streaming infrastructure</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Globe className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Global Platform</div>
                      <div className="text-white/70 text-sm">200+ edge locations worldwide</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Enterprise Solutions</div>
                      <div className="text-white/70 text-sm">Bank-grade security & compliance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Target className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">AI Analytics</div>
                      <div className="text-white/70 text-sm">Smart optimization & insights</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#1D3557]/30 to-[#FF7400]/20 border border-[#FF7400]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Your Agency Brings</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Users className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Local Market Knowledge</div>
                      <div className="text-white/70 text-sm">20+ years Turkish market expertise</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Established Relationships</div>
                      <div className="text-white/70 text-sm">Media, enterprise & government contacts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <TrendingUp className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Business Development</div>
                      <div className="text-white/70 text-sm">Client acquisition & account management</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DollarSign className="h-6 w-6 text-[#FF7400] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Cultural Navigation</div>
                      <div className="text-white/70 text-sm">Language, customs & business practices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Revenue Sharing Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">60/40</div>
                <div className="text-white font-medium mb-2">Revenue Split</div>
                <div className="text-white/70 text-sm">60% VortixPR / 40% Partner<br/>for all Turkey market deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">Joint</div>
                <div className="text-white font-medium mb-2">Brand Recognition</div>
                <div className="text-white/70 text-sm">Co-branded solutions<br/>and marketing materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">Exclusive</div>
                <div className="text-white font-medium mb-2">Territory Rights</div>
                <div className="text-white/70 text-sm">Sole partner for<br/>Turkish market entry</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'turkey-opportunity',
      title: 'Turkey Market Focus',
      subtitle: 'Streaming Innovation into the Turkish Mainstream',
      description: 'Flowing seamlessly into a high-growth market with compelling opportunities',
      content: (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Market Size & Growth</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Turkish Digital Market</span>
                    <span className="text-[#FF7400] font-bold">$8.2B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Live Streaming Segment</span>
                    <span className="text-[#FF7400] font-bold">$420M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Annual Growth Rate</span>
                    <span className="text-[#FF7400] font-bold">32%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Mobile Penetration</span>
                    <span className="text-[#FF7400] font-bold">98%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Competitive Landscape</h3>
                <div className="space-y-3">
                  <div className="text-white/70 text-sm">
                    • Limited local infrastructure providers
                  </div>
                  <div className="text-white/70 text-sm">
                    • High latency from global CDNs
                  </div>
                  <div className="text-white/70 text-sm">
                    • Growing demand for Turkish-language content
                  </div>
                  <div className="text-white/70 text-sm">
                    • Strong government support for tech sector
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Partnership Opportunities</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#FF7400]/20 to-transparent border border-[#FF7400]/30 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">Media & Entertainment</div>
                  <div className="text-white/70 text-sm">TRT, Show TV, Acun Medya partnerships for content delivery optimization</div>
                </div>
                
                <div className="bg-gradient-to-r from-[#FF7400]/20 to-transparent border border-[#FF7400]/30 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">E-commerce Giants</div>
                  <div className="text-white/70 text-sm">Trendyol, Hepsiburada live shopping infrastructure</div>
                </div>
                
                <div className="bg-gradient-to-r from-[#FF7400]/20 to-transparent border border-[#FF7400]/30 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">Gaming & Sports</div>
                  <div className="text-white/70 text-sm">Esports tournaments and live sports broadcasting</div>
                </div>
                
                <div className="bg-gradient-to-r from-[#FF7400]/20 to-transparent border border-[#FF7400]/30 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">Government & Education</div>
                  <div className="text-white/70 text-sm">Digital transformation initiatives and remote learning</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Turkey: Where Vision Meets Opportunity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">84M</div>
                <div className="text-white/70">Digital natives ready for streaming innovation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">Gateway</div>
                <div className="text-white/70">The current connecting three continents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7400] mb-2">Innovation Hub</div>
                <div className="text-white/70">Where groundbreaking projects take flight</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'implementation',
      title: 'Implementation Strategy',
      subtitle: 'Fluid Execution for Compelling Results',
      description: 'A visionary approach to streaming your vision into Turkey\'s spotlight',
      content: (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Phase 1: Foundation (Months 1-3)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Legal Entity Setup</span>
                    <span className="text-[#FF7400] font-medium">✓</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Local Infrastructure</span>
                    <span className="text-[#FF7400] font-medium">✓</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Team Integration</span>
                    <span className="text-[#FF7400] font-medium">✓</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/70">Product Localization</span>
                    <span className="text-[#FF7400] font-medium">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Phase 2: Launch (Months 4-6)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Pilot Customers</span>
                    <span className="text-white font-medium">5 clients</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Marketing Campaign</span>
                    <span className="text-white font-medium">Launch</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">PR & Media</span>
                    <span className="text-white font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/70">Partnership Network</span>
                    <span className="text-white font-medium">Expand</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Target Segments</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <div className="text-white font-medium">Media & Broadcasting</div>
                      <div className="text-white/70 text-sm">TRT, Show TV, Star TV, Fox Turkey</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <div className="text-white font-medium">E-commerce Giants</div>
                      <div className="text-white/70 text-sm">Trendyol, Hepsiburada, GittiGidiyor</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <div className="text-white font-medium">Financial Services</div>
                      <div className="text-white/70 text-sm">İşbank, Garanti BBVA, Akbank</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <div className="text-white font-medium">Government & Education</div>
                      <div className="text-white/70 text-sm">Ministry of Education, Universities</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Success Metrics (Year 1)</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF7400]">15+</div>
                    <div className="text-white/70 text-sm">Enterprise Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF7400]">$2.5M</div>
                    <div className="text-white/70 text-sm">Turkey Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF7400]">25%</div>
                    <div className="text-white/70 text-sm">Market Share</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF7400]">3x</div>
                    <div className="text-white/70 text-sm">ROI Target</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      subtitle: 'Flowing Into Partnership',
      description: 'Creating clarity in our path forward together',
      content: (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold text-white mb-4">Initial Discussion</h3>
              <p className="text-white/70 text-sm mb-4">Align on vision, objectives, and mutual expectations for the partnership</p>
              <div className="text-[#FF7400] font-medium">1 week</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold text-white mb-4">Partnership Agreement</h3>
              <p className="text-white/70 text-sm mb-4">Legal framework, revenue sharing, territorial rights, and operational guidelines</p>
              <div className="text-[#FF7400] font-medium">2-3 weeks</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/30 border border-[#FF7400]/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#FF7400] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold text-white mb-4">Market Entry</h3>
              <p className="text-white/70 text-sm mb-4">Joint operations launch with shared resources and coordinated strategy</p>
              <div className="text-[#FF7400] font-medium">1-2 months</div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Mutual Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FF7400]">Streaming Benefits for Your Agency</h4>
                <div className="space-y-2 text-white/70 text-sm">
                  <div>• Exclusive partnership flowing innovative technology to Turkey</div>
                  <div>• Clear revenue streams from compelling streaming solutions</div>
                  <div>• Visionary service portfolio expansion for clients</div>
                  <div>• Access to global opportunities in the spotlight</div>
                  <div>• Co-marketing with a groundbreaking tech partner</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FF7400]">Clarity for VortixPR</h4>
                <div className="space-y-2 text-white/70 text-sm">
                  <div>• Seamless market entry through local expertise</div>
                  <div>• Fluid access to established client narratives</div>
                  <div>• Cultural intelligence driving innovation</div>
                  <div>• Streamlined operational complexity</div>
                  <div>• Shared vision for impactful market presence</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Contact Our Partnership Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-white font-medium mb-2">Partnership Development</div>
                <div className="text-[#FF7400] text-lg">partnerships@vortixstream.com</div>
                <div className="text-white/70 text-sm mt-1">For strategic alliance discussions</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium mb-2">Turkey Market Lead</div>
                <div className="text-[#FF7400] text-lg">turkey@vortixstream.com</div>
                <div className="text-white/70 text-sm mt-1">For local market insights</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="space-y-4">
              <div className="text-white/70 text-lg">
                Ready to stream your vision into the global spotlight?
              </div>
              <div className="text-[#FF7400] text-base italic mb-4">
                Let VortixPR be the current that carries your story to the world.
              </div>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#FF7400] hover:bg-[#FF7400]/90 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#FF7400]/25"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1D3557] to-black relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#FF7400] rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/6 right-1/4 w-1 h-1 bg-[#FF7400] rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Slide Header */}
        <div className="py-8 px-8 md:px-16 text-center">
          <div className="text-[#FF7400] text-sm mb-2">{currentSlide + 1} / {slides.length}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{currentSlideData.title}</h1>
          <h2 className="text-xl md:text-3xl font-medium text-white/80 mb-2">{currentSlideData.subtitle}</h2>
          <p className="text-white/60 text-base md:text-lg max-w-3xl mx-auto">{currentSlideData.description}</p>
        </div>

        {/* Slide Content */}
        <div className="flex-1 px-8 md:px-16 pb-24">
          <div className="max-w-7xl mx-auto">
            {currentSlideData.content}
          </div>
        </div>

        {/* Navigation Controls with improved spacing */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center z-50">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-black/70 border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {/* Progress Indicators with generous spacing */}
          <div className="flex gap-2 mx-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#FF7400] scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="bg-black/70 border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}