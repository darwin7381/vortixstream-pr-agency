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
        Send contact form notification to admin
        
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
                    <h1 style="margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">VortixPR Admin Notification</p>
                </div>
                
                <div class="content">
                    <div class="info-row">
                        <div class="label">Name</div>
                        <div class="value">{name}</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="label">Email</div>
                        <div class="value">{email}</div>
                    </div>
                    
                    {f'<div class="info-row"><div class="label">Company</div><div class="value">{company}</div></div>' if company else ''}
                    
                    {f'<div class="info-row"><div class="label">Phone</div><div class="value">{phone}</div></div>' if phone else ''}
                    
                    <div class="info-row">
                        <div class="label">Message</div>
                        <div class="message-box">{message}</div>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="{settings.FRONTEND_URL}/admin/contact" 
                           style="display: inline-block; background: #ea580c; color: white; 
                                  padding: 12px 30px; text-decoration: none; border-radius: 8px;
                                  font-weight: 600;">
                            View in Admin Panel
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This email was automatically sent by VortixPR</p>
                    <p style="margin-top: 5px; font-size: 12px;">
                        Admin Login: <a href="{settings.FRONTEND_URL}/admin">{settings.FRONTEND_URL}/admin</a>
                    </p>
                </div>
            </body>
            </html>
            """
            
            # 發送郵件
            params = {
                "from": settings.FROM_EMAIL,
                "to": [settings.ADMIN_EMAIL],
                "subject": f"🔔 New Contact Form: {name}",
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
        Send Newsletter welcome email
        
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
                    <h1 style="margin: 0; font-size: 32px;">🎉 Welcome to VortixPR!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px;">
                        Thank you for subscribing to our Newsletter
                    </p>
                </div>
                
                <div class="content">
                    <p class="welcome-text">
                        Hello there! 👋
                    </p>
                    
                    <p class="welcome-text">
                        Thank you for subscribing to the VortixPR Newsletter! We're excited to share
                        the latest PR trends, media strategies, and professional insights on brand building with you.
                    </p>
                    
                    <div class="features">
                        <h3 style="margin-top: 0; color: #111827;">What you'll receive:</h3>
                        <div class="feature-item">Latest PR industry trend analysis</div>
                        <div class="feature-item">Professional tips for building media relationships</div>
                        <div class="feature-item">Success stories and best practices</div>
                        <div class="feature-item">Exclusive offers and event information</div>
                        <div class="feature-item">Brand building and crisis management strategies</div>
                    </div>
                    
                    <p class="welcome-text">
                        We promise to only send high-quality content and will never spam you.
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="https://vortixpr.com/blog" class="cta-button">
                            Read Latest Articles
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        If you no longer wish to receive our emails, you can
                        <a href="{settings.FRONTEND_URL}/newsletter/unsubscribe" style="color: #ea580c;">unsubscribe</a> at any time.
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
                "subject": "🎉 Welcome to VortixPR Newsletter!",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Welcome email sent to {email}: {response}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send welcome email to {email}: {e}")
            return False
    
    async def send_template_email(
        self,
        to_email: str,
        template_title: str,
        template_content: str,
        tracking_id: str
    ) -> bool:
        """
        發送 PR Template 到用戶郵箱
        
        Args:
            to_email: 接收者電郵
            template_title: 模板標題
            template_content: 模板內容
            tracking_id: 追蹤 ID
            
        Returns:
            bool: 是否發送成功
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Email sending skipped - RESEND_API_KEY not configured")
            return False
        
        try:
            # 將模板內容轉換為 HTML 安全格式（保留換行）
            safe_content = template_content.replace('\n', '<br>')
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f3f4f6;
                    }}
                    .email-container {{
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{
                        background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }}
                    .header p {{
                        margin: 10px 0 0 0;
                        opacity: 0.95;
                        font-size: 16px;
                    }}
                    .content {{
                        padding: 40px 30px;
                    }}
                    .intro-text {{
                        font-size: 16px;
                        color: #374151;
                        margin-bottom: 30px;
                        line-height: 1.8;
                    }}
                    .template-box {{
                        background: #f9fafb;
                        border: 2px solid #e5e7eb;
                        border-radius: 10px;
                        padding: 30px;
                        margin: 30px 0;
                    }}
                    .template-title {{
                        color: #ea580c;
                        font-size: 20px;
                        font-weight: 700;
                        margin: 0 0 20px 0;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #ea580c;
                    }}
                    .template-content {{
                        color: #1f2937;
                        font-size: 15px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }}
                    .tips-box {{
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 6px;
                    }}
                    .tips-box h3 {{
                        margin: 0 0 10px 0;
                        color: #92400e;
                        font-size: 16px;
                    }}
                    .tips-box ul {{
                        margin: 10px 0;
                        padding-left: 20px;
                        color: #78350f;
                    }}
                    .tips-box li {{
                        margin: 8px 0;
                    }}
                    .cta-section {{
                        text-align: center;
                        margin: 35px 0;
                        padding: 30px 0;
                        border-top: 1px solid #e5e7eb;
                        border-bottom: 1px solid #e5e7eb;
                    }}
                    .cta-button {{
                        display: inline-block;
                        background: #ea580c;
                        color: white;
                        padding: 16px 45px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: background 0.3s;
                    }}
                    .cta-button:hover {{
                        background: #c2410c;
                    }}
                    .footer {{
                        text-align: center;
                        padding: 30px;
                        background: #f9fafb;
                        color: #6b7280;
                        font-size: 14px;
                    }}
                    .footer p {{
                        margin: 8px 0;
                    }}
                    .footer a {{
                        color: #ea580c;
                        text-decoration: none;
                    }}
                    .tracking-info {{
                        font-size: 11px;
                        color: #9ca3af;
                        margin-top: 15px;
                        font-family: monospace;
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>📝 您的 PR Template 已送達！</h1>
                        <p>專業新聞稿模板 - 立即使用</p>
                    </div>
                    
                    <div class="content">
                        <p class="intro-text">
                            您好！👋<br><br>
                            感謝您對 <strong>VortixPR</strong> 的信任。以下是您請求的 PR Template，
                            您可以直接複製使用，或根據您的需求進行客製化調整。
                        </p>
                        
                        <div class="template-box">
                            <h2 class="template-title">📄 {template_title}</h2>
                            <div class="template-content">{safe_content}</div>
                        </div>
                        
                        <div class="tips-box">
                            <h3>💡 使用建議</h3>
                            <ul>
                                <li>根據您的品牌調性調整用詞和語氣</li>
                                <li>加入具體的數據和成果來增強可信度</li>
                                <li>包含引人注目的標題和副標題</li>
                                <li>附上高品質的視覺素材（圖片、影片等）</li>
                                <li>確保聯絡資訊完整且正確</li>
                            </ul>
                        </div>
                        
                        <div class="cta-section">
                            <p style="margin-bottom: 20px; color: #374151; font-size: 16px;">
                                探索更多專業 PR 模板與服務
                            </p>
                            <a href="{settings.FRONTEND_URL}/templates" class="cta-button">
                                瀏覽所有模板
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            <strong>需要專業協助？</strong><br>
                            VortixPR 提供完整的 PR 服務，從新聞稿撰寫到媒體關係建立，
                            我們都能協助您達成品牌傳播目標。
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>VortixPR</strong></p>
                        <p>PR for Growing Worldwide Companies</p>
                        <p style="margin-top: 15px;">
                            <a href="{settings.FRONTEND_URL}">訪問網站</a> · 
                            <a href="{settings.FRONTEND_URL}/blog">閱讀部落格</a> · 
                            <a href="{settings.FRONTEND_URL}/contact">聯絡我們</a>
                        </p>
                        <p style="margin-top: 15px; font-size: 12px;">
                            © 2025 VortixPR. All rights reserved.
                        </p>
                        <p class="tracking-info">
                            Tracking ID: {tracking_id}
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": settings.FROM_EMAIL,
                "to": [to_email],
                "subject": f"📝 您的 PR Template: {template_title}",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Template email sent to {to_email}: {template_title} (ID: {tracking_id})")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send template email to {to_email}: {e}")
            return False
    
    async def send_invitation_email(
        self,
        to_email: str,
        inviter_name: str,
        invitation_url: str,
        role: str
    ) -> bool:
        """
        Send user invitation email
        
        Args:
            to_email: Invitee email address
            inviter_name: Name of the person sending the invitation
            invitation_url: Invitation URL with token
            role: Role being invited to
            
        Returns:
            bool: Whether the email was sent successfully
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Email sending skipped - RESEND_API_KEY not configured")
            return False
        
        try:
            role_labels = {
                'user': 'User',
                'publisher': 'Publisher',
                'admin': 'Administrator',
                'super_admin': 'Super Administrator'
            }
            
            role_label = role_labels.get(role, role)
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
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
                        padding: 40px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }}
                    .content {{
                        background: #ffffff;
                        padding: 40px;
                        border-radius: 0 0 10px 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }}
                    .role-badge {{
                        display: inline-block;
                        padding: 6px 16px;
                        background: #ea580c;
                        color: white;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 600;
                        margin: 0 4px;
                    }}
                    .cta-button {{
                        display: inline-block;
                        background: #ea580c;
                        color: white;
                        padding: 16px 40px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 14px;
                    }}
                    .code-block {{
                        background: #f3f4f6;
                        padding: 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        word-break: break-all;
                        margin: 10px 0;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">VortixPR</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px;">
                        You've Been Invited
                    </p>
                </div>
                
                <div class="content">
                    <h2 style="color: #111827; margin-top: 0;">Hi there! 👋</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.8;">
                        <strong>{inviter_name}</strong> has invited you to join <strong>VortixPR</strong>.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.8;">
                        You will join our team as a <span class="role-badge">{role_label}</span>
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.8;">
                        Click the button below to accept the invitation and complete your registration:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{invitation_url}" class="cta-button">
                            Accept Invitation & Register
                        </a>
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            ⏰ <strong>Important:</strong> This invitation will expire in 7 days.
                        </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <div class="code-block">
                        {invitation_url}
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>VortixPR</strong></p>
                    <p>PR for Growing Worldwide Companies</p>
                    <p style="margin-top: 15px; font-size: 12px;">
                        © 2025 VortixPR. All rights reserved.
                    </p>
                    <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
                        If you didn't expect this email, you can safely ignore it.
                    </p>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": settings.FROM_EMAIL,
                "to": [to_email],
                "subject": f"You've Been Invited to VortixPR ({role_label})",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Invitation email sent to {to_email} (role: {role})")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send invitation email to {to_email}: {e}")
            return False


# 全域實例
email_service = EmailService()

