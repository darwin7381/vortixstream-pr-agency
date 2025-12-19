/**
 * 處理 Contact 按鈕的導航邏輯
 * - 桌面版：滾動到首頁的 contact-section（如果在首頁）或導向首頁的 contact-section
 * - 手機版：導向 /contact 專門頁面
 */
export const handleContactClick = (
  navigate: (path: string) => void,
  currentPath: string
) => {
  const isMobile = window.innerWidth < 1024; // lg breakpoint

  if (isMobile) {
    // 手機版：跳轉到 Contact 專門頁面
    navigate('/contact');
  } else {
    // 桌面版：滾動到首頁的 contact-section
    if (currentPath === '/') {
      // 已在首頁，直接滾動
      const section = document.getElementById('contact-section');
      if (section) {
        const navbarHeight = 72;
        const targetPosition = section.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // 不在首頁，先跳轉到首頁並滾動
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('contact-section');
        if (section) {
          const navbarHeight = 72;
          const targetPosition = section.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
};

/**
 * 處理 Get Started 按鈕的導航邏輯（與 Contact 相同）
 */
export const handleGetStartedClick = handleContactClick;

