"""
Admin Email Preview API
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from typing import Literal

from app.utils.security import require_admin
from app.models.user import TokenData
from app.services.email_service import email_service
from app.config import settings

router = APIRouter(prefix="/api/admin/email-preview", tags=["Admin - Email Preview"])


# Sample data for each email type
SAMPLE_DATA = {
    'contact': {
        'name': 'John Smith',
        'email': 'john.smith@example.com',
        'company': 'Tech Innovations Inc.',
        'phone': '+1 (555) 123-4567',
        'message': 'Hi, I am interested in your PR services for our upcoming product launch. We are looking for comprehensive media coverage and would like to discuss our options.',
        'admin_url': settings.FRONTEND_URL + '/admin'
    },
    'newsletter': {
        'email': 'subscriber@example.com',
        'blog_url': 'https://vortixpr.com/blog',
        'unsubscribe_url': f"{settings.FRONTEND_URL}/newsletter/unsubscribe"
    },
    'template': {
        'template_title': 'Product Launch Pro',
        'template_content': '''FOR IMMEDIATE RELEASE

[Company Name] Launches Revolutionary [Product Name]

[City, State] – [Date] – [Company Name], a leading innovator in [industry], today announced the launch of [Product Name], a groundbreaking solution designed to [primary benefit].

"This represents a major milestone in our mission to [company mission]," said [Name], [Title] at [Company Name]. "We believe [Product Name] will transform how [target audience] approach [problem being solved]."

Key Features:
- [Feature 1]: [Description]
- [Feature 2]: [Description]
- [Feature 3]: [Description]

[Product Name] is now available at [where to get it]. For more information, visit [website].

About [Company Name]
[Company boilerplate text]

Media Contact:
[Name]
[Title]
[Email]
[Phone]''',
        'tracking_id': 'sample-tracking-id-12345',
        'templates_url': f"{settings.FRONTEND_URL}/templates",
        'blog_url': f"{settings.FRONTEND_URL}/blog",
        'contact_url': f"{settings.FRONTEND_URL}/contact",
        'frontend_url': settings.FRONTEND_URL
    },
    'invitation': {
        'inviter_name': 'Sarah Chen',
        'invitation_url': f"{settings.FRONTEND_URL}/register?invitation=sample-token-abc123",
        'role_label': 'Publisher'
    }
}


@router.get("/list")
async def list_email_templates(
    current_user: TokenData = Depends(require_admin)
):
    """
    Get list of all available email templates
    """
    return {
        "templates": [
            {
                "id": "contact",
                "name": "Contact Form Notification",
                "description": "Sent to admin when someone submits the contact form",
                "recipient": "Admin"
            },
            {
                "id": "newsletter",
                "name": "Newsletter Welcome",
                "description": "Sent to users when they subscribe to the newsletter",
                "recipient": "Subscriber"
            },
            {
                "id": "template",
                "name": "PR Template Email",
                "description": "Sent to users when they request a PR template via email",
                "recipient": "User"
            },
            {
                "id": "invitation",
                "name": "User Invitation",
                "description": "Sent when admin invites a new user to the platform",
                "recipient": "Invitee"
            }
        ]
    }


@router.get("/{template_type}", response_class=HTMLResponse)
async def preview_email_template(
    template_type: Literal['contact', 'newsletter', 'template', 'invitation'],
    show_variables: bool = False,
    current_user: TokenData = Depends(require_admin)
):
    """
    Preview an email template with sample data or show variable names
    
    Available template types:
    - contact: Contact form notification
    - newsletter: Newsletter welcome email
    - template: PR template email
    - invitation: User invitation email
    
    Query params:
    - show_variables: If true, shows Jinja2 variable names instead of sample data
    """
    try:
        if show_variables:
            # Return raw template with variable names visible
            from pathlib import Path
            
            template_map = {
                'contact': 'contact/notification.html',
                'newsletter': 'newsletter/welcome.html',
                'template': 'template/send.html',
                'invitation': 'invitation/invite.html'
            }
            
            template_name = template_map.get(template_type)
            if not template_name:
                raise HTTPException(status_code=404, detail="Template not found")
            
            # Read raw template file and render it with placeholder values
            # Create a special rendering that shows variable names
            placeholder_data = {}
            if template_type == 'contact':
                placeholder_data = {
                    'name': '{{ name }}',
                    'email': '{{ email }}',
                    'company': '{{ company }}',
                    'phone': '{{ phone }}',
                    'message': '{{ message }}',
                    'admin_url': '{{ admin_url }}'
                }
            elif template_type == 'newsletter':
                placeholder_data = {
                    'email': '{{ email }}',
                    'blog_url': '{{ blog_url }}',
                    'unsubscribe_url': '{{ unsubscribe_url }}'
                }
            elif template_type == 'template':
                placeholder_data = {
                    'template_title': '{{ template_title }}',
                    'template_content': '{{ template_content }}',
                    'tracking_id': '{{ tracking_id }}',
                    'templates_url': '{{ templates_url }}',
                    'blog_url': '{{ blog_url }}',
                    'contact_url': '{{ contact_url }}',
                    'frontend_url': '{{ frontend_url }}'
                }
            elif template_type == 'invitation':
                placeholder_data = {
                    'inviter_name': '{{ inviter_name }}',
                    'invitation_url': '{{ invitation_url }}',
                    'role_label': '{{ role_label }}'
                }
            
            html = email_service.preview_email(template_type, placeholder_data)
            return HTMLResponse(content=html)
        else:
            # Return template with sample data
            sample_data = SAMPLE_DATA.get(template_type)
            if not sample_data:
                raise HTTPException(status_code=404, detail="Template not found")
            
            html = email_service.preview_email(template_type, sample_data)
            return HTMLResponse(content=html)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to preview email: {str(e)}")

