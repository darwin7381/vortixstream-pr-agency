"""
Email 服務 - 使用 Resend
"""
import resend
import logging
from typing import Optional

from ..config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """郵件發送服務（使用 Resend）"""
    
    def __init__(self):
        """初始化 Resend API"""
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
            logger.info("📧 Resend Email Service initialized")
        else:
            logger.warning("⚠️ RESEND_API_KEY not set - email sending disabled")
    
    async def send_contact_notification(
        self,
        name: str,
        email: str,
        company: Optional[str],
        phone: Optional[str],
        message: str
    ) -> bool:
        """
        發送聯絡表單通知給管理員
        
        Args:
            name: 提交者姓名
            email: 提交者電郵
            company: 公司名稱
            phone: 電話
            message: 訊息內容
            
        Returns:
            bool: 是否發送成功
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Email sending skipped - RESEND_API_KEY not configured")
            return False
        
        try:
            # 構建 HTML 郵件內容
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }}
                    .content {{
                        background: #f9fafb;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }}
                    .info-row {{
                        margin: 15px 0;
                        padding: 15px;
                        background: white;
                        border-radius: 8px;
                        border-left: 4px solid #ea580c;
                    }}
                    .label {{
                        font-weight: 600;
                        color: #6b7280;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }}
                    .value {{
                        color: #111827;
                        margin-top: 5px;
                        font-size: 16px;
                    }}
                    .message-box {{
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e5e7eb;
                        margin-top: 15px;
                        white-space: pre-wrap;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 14px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">🔔 新的聯絡表單提交</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">VortixPR 管理後台通知</p>
                </div>
                
                <div class="content">
                    <div class="info-row">
                        <div class="label">姓名</div>
                        <div class="value">{name}</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="label">電郵</div>
                        <div class="value">{email}</div>
                    </div>
                    
                    {f'<div class="info-row"><div class="label">公司</div><div class="value">{company}</div></div>' if company else ''}
                    
                    {f'<div class="info-row"><div class="label">電話</div><div class="value">{phone}</div></div>' if phone else ''}
                    
                    <div class="info-row">
                        <div class="label">訊息內容</div>
                        <div class="message-box">{message}</div>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="{settings.FRONTEND_URL}/admin/contact" 
                           style="display: inline-block; background: #ea580c; color: white; 
                                  padding: 12px 30px; text-decoration: none; border-radius: 8px;
                                  font-weight: 600;">
                            前往管理後台查看
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>此郵件由 VortixPR 系統自動發送</p>
                    <p style="margin-top: 5px; font-size: 12px;">
                        登入管理後台：<a href="{settings.FRONTEND_URL}/admin">{settings.FRONTEND_URL}/admin</a>
                    </p>
                </div>
            </body>
            </html>
            """
            
            # 發送郵件
            params = {
                "from": settings.FROM_EMAIL,
                "to": [settings.ADMIN_EMAIL],
                "subject": f"🔔 新的聯絡表單：{name}",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Contact notification email sent: {response}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send contact notification: {e}")
            return False
    
    async def send_newsletter_welcome(self, email: str) -> bool:
        """
        發送 Newsletter 歡迎郵件
        
        Args:
            email: 訂閱者電郵
            
        Returns:
            bool: 是否發送成功
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Email sending skipped - RESEND_API_KEY not configured")
            return False
        
        try:
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
                        color: white;
                        padding: 40px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #ffffff;
                        padding: 40px;
                        border-radius: 0 0 10px 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .welcome-text {
                        font-size: 18px;
                        color: #111827;
                        margin: 20px 0;
                    }
                    .features {
                        background: #f9fafb;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .feature-item {
                        margin: 12px 0;
                        padding-left: 25px;
                        position: relative;
                    }
                    .feature-item:before {
                        content: "✓";
                        position: absolute;
                        left: 0;
                        color: #ea580c;
                        font-weight: bold;
                    }
                    .cta-button {
                        display: inline-block;
                        background: #ea580c;
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 style="margin: 0; font-size: 32px;">🎉 歡迎加入 VortixPR！</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px;">
                        感謝您訂閱我們的 Newsletter
                    </p>
                </div>
                
                <div class="content">
                    <p class="welcome-text">
                        您好！👋
                    </p>
                    
                    <p class="welcome-text">
                        感謝您訂閱 VortixPR Newsletter！我們很高興能與您分享最新的 PR 趨勢、
                        媒體策略和品牌建設的專業見解。
                    </p>
                    
                    <div class="features">
                        <h3 style="margin-top: 0; color: #111827;">您將收到：</h3>
                        <div class="feature-item">最新的 PR 產業趨勢分析</div>
                        <div class="feature-item">媒體關係建立的專業技巧</div>
                        <div class="feature-item">成功案例和最佳實踐分享</div>
                        <div class="feature-item">獨家優惠和活動資訊</div>
                        <div class="feature-item">品牌建設和危機管理策略</div>
                    </div>
                    
                    <p class="welcome-text">
                        我們承諾只發送高質量的內容，絕不會濫發郵件。
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="https://vortixpr.com/blog" class="cta-button">
                            立即閱讀最新文章
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        如果您不想再收到我們的郵件，可以隨時
                        <a href="{settings.FRONTEND_URL}/newsletter/unsubscribe" style="color: #ea580c;">取消訂閱</a>。
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>VortixPR</strong></p>
                    <p>PR for Growing Worldwide Companies</p>
                    <p style="margin-top: 10px; font-size: 12px;">
                        © 2025 VortixPR. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": settings.FROM_EMAIL,
                "to": [email],
                "subject": "🎉 歡迎訂閱 VortixPR Newsletter！",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Welcome email sent to {email}: {response}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send welcome email to {email}: {e}")
            return False


# 全域實例
email_service = EmailService()

