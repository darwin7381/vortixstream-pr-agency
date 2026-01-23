/**
 * Section IDs 提示框組件
 * 
 * 顯示首頁可用的 Section ID，方便設定 CTA 按鈕的跳轉連結
 */

const SECTION_IDS = [
  '#services-section',
  '#packages-section',
  '#vortix-portal-section',
  '#lyro-section',
  '#clients-section',
  '#publisher-section',
  '#contact-section',
  '#about-section',
];

export default function SectionIdsHint() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
        📍 Available Section IDs on Homepage
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
        {SECTION_IDS.map((id) => (
          <div key={id} className="flex items-start gap-2">
            <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">
              {id}
            </code>
          </div>
        ))}
      </div>
      <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
        💡 Copy any of these IDs above and paste into the Desktop URL or Mobile URL fields.
      </p>
    </div>
  );
}

