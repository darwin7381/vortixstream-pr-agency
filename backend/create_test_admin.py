import asyncio
import asyncpg
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/vortixpr')

async def create_test_admin():
    conn = await asyncpg.connect(DATABASE_URL)
    
    # test123 的 bcrypt hash
    test_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TcxZ0Q3WBcpl2L3cRl.dF9C2xGQm'
    
    await conn.execute("""
        INSERT INTO users (email, hashed_password, name, role, account_status, is_active, is_verified, provider)
        VALUES ($1, $2, $3, 'super_admin', 'active', TRUE, TRUE, 'email')
        ON CONFLICT (email) DO UPDATE 
        SET role = 'super_admin', hashed_password = $2, account_status = 'active'
    """, 'test@vortixpr.com', test_hash, 'Test Admin')
    
    print("✅ Test admin created: test@vortixpr.com / test123")
    
    await conn.close()

asyncio.run(create_test_admin())
