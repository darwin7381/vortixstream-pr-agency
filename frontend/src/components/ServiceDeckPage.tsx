import CryptoFooter from './crypto/CryptoFooter';

interface ServiceDeckPageProps {
  showFooter?: boolean;
}

// Service Deck 頁面：主內容嵌入 Canva deck
// 原始版本（VortixPR Concept slides）保留在 ConceptPage.tsx 作為備份
export default function ServiceDeckPage({ showFooter = true }: ServiceDeckPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Canva embed - 16:9 響應式容器 */}
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
          style={{ paddingTop: '56.25%' }}
        >
          <iframe
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full border-0"
            src="https://www.canva.com/design/DAG7FUp_2k0/mprI8FO4FBRgMPD9W80fTQ/view?embed"
            allow="fullscreen"
            allowFullScreen
            title="VortixPR Service Deck"
          />
        </div>
      </div>

      {showFooter && <CryptoFooter />}
    </div>
  );
}
