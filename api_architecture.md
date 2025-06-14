# API Architecture

This document defines the API architecture for the centralized communication platform. We will be using RESTful principles.

## Endpoints

### 1. Authentication (Firebase)

*   `POST /auth/register`: User registration.
    *   Request body: `{ username, email, password }`
    *   Response: `{ user }`
*   `POST /auth/login`: User login.
    *   Request body: `{ email, password }`
    *   Response: `{ user }`
*   `POST /auth/logout`: User logout.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `204 No Content`

### 2. Users

*   `GET /users/{id}`: Get user information.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `{ id, username, email, avatar_url, is_active, last_login }`
*   `PUT /users/{id}/profile`: Update user profile.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ username, email, avatar_url }`
    *   Response: `{ id, username, email, avatar_url, is_active, last_login }`

### 3. Servers

*   `POST /servers`: Create a new server.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ name, description, icon_url, is_public }`
    *   Response: `{ id, name, owner_id, created_at, updated_at, description, icon_url, is_public }`
*   `GET /servers/{id}`: Get server information.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `{ id, name, owner_id, created_at, updated_at, description, icon_url, is_public }`
*   `PUT /servers/{id}`: Update server information.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ name, description, icon_url, is_public }`
    *   Response: `{ id, name, owner_id, created_at, updated_at, description, icon_url, is_public }`
*   `DELETE /servers/{id}`: Delete server.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `204 No Content`

### 4. Channels

*   `POST /servers/{server_id}/channels`: Create a new channel.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ name, type, description, is_private }`
    *   Response: `{ id, server_id, name, type, created_at, updated_at, description, is_private }`
*   `GET /channels/{id}`: Get channel information.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `{ id, server_id, name, type, created_at, updated_at, description, is_private }`
*   `PUT /channels/{id}`: Update channel information.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ name, type, description, is_private }`
    *   Response: `{ id, server_id, name, type, created_at, updated_at, description, is_private }`
*   `DELETE /channels/{id}`: Delete channel.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `204 No Content`

### 5. Messages

*   `GET /channels/{channel_id}/messages`: Get messages in a channel.
    *   Request header: `Authorization: Bearer <token>`
    *   Query parameters: `{ limit, offset }`
    *   Response: `[{ id, channel_id, user_id, content, created_at, updated_at, is_edited, is_deleted }]`
*   `POST /channels/{channel_id}/messages`: Send a new message.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ content }`
    *   Response: `{ id, channel_id, user_id, content, created_at, updated_at, is_edited, is_deleted }`
*   `GET /messages/{id}`: Get message information.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `{ id, channel_id, user_id, content, created_at, updated_at, is_edited, is_deleted }`
*   `PUT /messages/{id}`: Update message information.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ content }`
    *   Response: `{ id, channel_id, user_id, content, created_at, updated_at, is_edited, is_deleted }`
*   `DELETE /messages/{id}`: Delete message.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `204 No Content`

### 6. Invitations

*   `POST /servers/{server_id}/invitations`: Create a new invitation code.
    *   Request header: `Authorization: Bearer <token>`
    *   Request body: `{ expires_at, uses_limit }`
    *   Response: `{ code, server_id, created_by, created_at, expires_at, uses_limit, uses_count }`
*   `GET /invitations/{code}`: Redeem an invitation code.
    *   Request header: `Authorization: Bearer <token>`
    *   Response: `{ code, server_id, created_by, created_at, expires_at, uses_limit, uses_count }`
