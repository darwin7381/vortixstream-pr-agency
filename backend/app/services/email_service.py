"""
Email Service - Using Resend with Jinja2 Templates
"""
import resend
import logging
from typing import Optional
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path

from ..config import settings


logger = logging.getLogger(__name__)


class EmailService:
    """Email sending service with template rendering"""
    
    def __init__(self):
        """Initialize Resend API and Jinja2 environment"""
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
            logger.info("📧 Resend Email Service initialized")
        else:
            logger.warning("⚠️ RESEND_API_KEY not set - email sending disabled")
        
        # Initialize Jinja2
        template_dir = Path(__file__).parent.parent / 'templates' / 'emails'
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(template_dir)),
            autoescape=select_autoescape(['html', 'xml'])
        )
    
    def _render_template(self, template_name: str, **context) -> str:
        """
        Render email template with context
        
        Args:
            template_name: Template file name (e.g., 'contact/notification.html')
            **context: Template variables
            
        Returns:
            Rendered HTML string
        """
        template = self.jinja_env.get_template(template_name)
        return template.render(**context)
    
    async def _send_email(
        self,
        to: str | list[str],
        subject: str,
        html: str,
        from_email: Optional[str] = None
    ) -> bool:
        """
        Internal method to send email via Resend
        
        Args:
            to: Recipient email(s)
            subject: Email subject
            html: HTML content
            from_email: Sender email (defaults to settings.FROM_EMAIL)
            
        Returns:
            bool: Whether the email was sent successfully
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Email sending skipped - RESEND_API_KEY not configured")
            return False
        
        try:
            # Ensure 'to' is a list
            if isinstance(to, str):
                to = [to]
            
            params = {
                "from": from_email or settings.FROM_EMAIL,
                "to": to,
                "subject": subject,
                "html": html,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"✅ Email sent successfully: {subject} -> {to}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send email: {e}")
            return False
    
    # ==================== Contact Form ====================
    
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
            name: Submitter name
            email: Submitter email
            company: Company name (optional)
            phone: Phone number (optional)
            message: Message content
            
        Returns:
            bool: Whether the email was sent successfully
        """
        html = self._render_template(
            'contact/notification.html',
            name=name,
            email=email,
            company=company,
            phone=phone,
            message=message,
            admin_url=settings.FRONTEND_URL + '/admin'
        )
        
        return await self._send_email(
            to=settings.ADMIN_EMAIL,
            subject=f"🔔 New Contact Form: {name}",
            html=html
        )
    
    # ==================== Newsletter ====================
    
    async def send_newsletter_welcome(self, email: str) -> bool:
        """
        Send Newsletter welcome email
        
        Args:
            email: Subscriber email
            
        Returns:
            bool: Whether the email was sent successfully
        """
        html = self._render_template(
            'newsletter/welcome.html',
            email=email,
            blog_url="https://vortixpr.com/blog",
            unsubscribe_url=f"{settings.FRONTEND_URL}/newsletter/unsubscribe"
        )
        
        return await self._send_email(
            to=email,
            subject="🎉 Welcome to VortixPR Newsletter!",
            html=html
        )
    
    # ==================== PR Template ====================
    
    async def send_template_email(
        self,
        to_email: str,
        template_title: str,
        template_content: str,
        tracking_id: str
    ) -> bool:
        """
        Send PR Template to user's email
        
        Args:
            to_email: Recipient email
            template_title: Template title
            template_content: Template content
            tracking_id: Tracking ID
            
        Returns:
            bool: Whether the email was sent successfully
        """
        html = self._render_template(
            'template/send.html',
            template_title=template_title,
            template_content=template_content,
            tracking_id=tracking_id,
            templates_url=f"{settings.FRONTEND_URL}/templates",
            blog_url=f"{settings.FRONTEND_URL}/blog",
            contact_url=f"{settings.FRONTEND_URL}/contact",
            frontend_url=settings.FRONTEND_URL
        )
        
        return await self._send_email(
            to=to_email,
            subject=f"📝 Your PR Template: {template_title}",
            html=html
        )
    
    # ==================== User Invitation ====================
    
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
        role_labels = {
            'user': 'User',
            'publisher': 'Publisher',
            'admin': 'Administrator',
            'super_admin': 'Super Administrator'
        }
        
        role_label = role_labels.get(role, role)
        
        html = self._render_template(
            'invitation/invite.html',
            inviter_name=inviter_name,
            invitation_url=invitation_url,
            role_label=role_label
        )
        
        return await self._send_email(
            to=to_email,
            subject=f"You've Been Invited to VortixPR ({role_label})",
            html=html
        )
    
    # ==================== Preview (For Admin) ====================
    
    def preview_email(self, template_type: str, sample_data: dict) -> str:
        """
        Preview email template with sample data (for admin panel)
        
        Args:
            template_type: Type of template (contact, newsletter, template, invitation)
            sample_data: Sample data for rendering
            
        Returns:
            Rendered HTML string
        """
        template_map = {
            'contact': 'contact/notification.html',
            'newsletter': 'newsletter/welcome.html',
            'template': 'template/send.html',
            'invitation': 'invitation/invite.html'
        }
        
        template_name = template_map.get(template_type)
        if not template_name:
            raise ValueError(f"Unknown template type: {template_type}")
        
        return self._render_template(template_name, **sample_data)


# Global instance
email_service = EmailService()
