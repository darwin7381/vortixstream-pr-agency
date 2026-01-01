"""
邀請郵件發送服務
"""
import resend
from app.config import settings

resend.api_key = settings.RESEND_API_KEY


async def send_invitation_email(
    to_email: str,
    inviter_name: str,
    invitation_url: str,
    role: str
):
    """
    發送用戶邀請郵件
    
    參數：
    - to_email: 被邀請人 email
    - inviter_name: 邀請人名稱
    - invitation_url: 邀請連結（含 token）
    - role: 被邀請的角色
    """
    
    role_labels = {
        'user': '一般用戶',
        'publisher': '出版商',
        'admin': '管理員',
        'super_admin': '超級管理員'
    }
    
    role_label = role_labels.get(role, role)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                background: linear-gradient(102deg, #FF7400 0%, #1D3557 100%);
                color: white;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px;
                border: 1px solid #e0e0e0;
            }}
            .button {{
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(102deg, #FF7400 0%, #1D3557 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #e0e0e0;
            }}
            .role-badge {{
                display: inline-block;
                padding: 4px 12px;
                background: #FF7400;
                color: white;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>VortixPR</h1>
            <p>您已被邀請加入 VortixPR</p>
        </div>
        
        <div class="content">
            <h2>Hi 👋</h2>
            
            <p><strong>{inviter_name}</strong> 邀請您加入 <strong>VortixPR</strong>。</p>
            
            <p>您將以 <span class="role-badge">{role_label}</span> 的身份加入我們的團隊。</p>
            
            <p>點擊下方按鈕接受邀請並完成註冊：</p>
            
            <div style="text-align: center;">
                <a href="{invitation_url}" class="button">
                    接受邀請並註冊
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                ⏰ 此邀請將在 7 天後過期。
            </p>
            
            <p style="color: #666; font-size: 14px;">
                如果按鈕無法點擊，請複製以下連結到瀏覽器：<br>
                <code style="background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 12px;">{invitation_url}</code>
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 VortixPR. All rights reserved.</p>
            <p>如果您沒有預期收到此郵件，請忽略它。</p>
        </div>
    </body>
    </html>
    """
    
    try:
        resend.Emails.send({
            "from": "VortixPR <noreply@mail.vortixpr.com>",
            "to": to_email,
            "subject": f"您已被邀請加入 VortixPR（{role_label}）",
            "html": html_content
        })
    except Exception as e:
        print(f"Resend email error: {e}")
        raise Exception(f"發送郵件失敗: {str(e)}")


