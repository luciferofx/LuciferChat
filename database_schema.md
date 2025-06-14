# Database Schema

This document defines the database schema for the centralized communication platform. We will be using PostgreSQL.

## Tables

### 1. Users

Stores user information.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| id          | UUID      | PRIMARY KEY | Unique user identifier                    |
| username    | VARCHAR   | NOT NULL    | User's username                           |
| email       | VARCHAR   | NOT NULL, UNIQUE | User's email address                      |
| password    | VARCHAR   | NOT NULL    | User's password (hashed)                  |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of user creation                |
| updated_at  | TIMESTAMP |             | Timestamp of last user update             |
| avatar_url  | VARCHAR   |             | URL to user's avatar image                |
| is_active   | BOOLEAN   | NOT NULL DEFAULT TRUE | Whether the user account is active      |
| last_login  | TIMESTAMP |             | Timestamp of user's last login            |

### 2. Servers

Stores server information.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| id          | UUID      | PRIMARY KEY | Unique server identifier                    |
| name        | VARCHAR   | NOT NULL    | Server's name                             |
| owner_id    | UUID      | NOT NULL    | ID of the user who owns the server        |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of server creation                |
| updated_at  | TIMESTAMP |             | Timestamp of last server update             |
| description | TEXT      |             | Server description                        |
| icon_url    | VARCHAR   |             | URL to server's icon image                |
| is_public   | BOOLEAN   | NOT NULL DEFAULT FALSE | Whether the server is public or private |

### 3. Channels

Stores channel information.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| id          | UUID      | PRIMARY KEY | Unique channel identifier                   |
| server_id   | UUID      | NOT NULL    | ID of the server the channel belongs to   |
| name        | VARCHAR   | NOT NULL    | Channel's name                            |
| type        | VARCHAR   | NOT NULL    | Channel type (text, voice, media)         |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of channel creation               |
| updated_at  | TIMESTAMP |             | Timestamp of last channel update            |
| description | TEXT      |             | Channel description                       |
| is_private  | BOOLEAN   | NOT NULL DEFAULT FALSE | Whether the channel is private or public |

### 4. Messages

Stores message information.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| id          | UUID      | PRIMARY KEY | Unique message identifier                   |
| channel_id  | UUID      | NOT NULL    | ID of the channel the message belongs to  |
| user_id     | UUID      | NOT NULL    | ID of the user who sent the message       |
| content     | TEXT      | NOT NULL    | Message content                           |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of message creation               |
| updated_at  | TIMESTAMP |             | Timestamp of last message update            |
| is_edited   | BOOLEAN   | NOT NULL DEFAULT FALSE | Whether the message has been edited     |
| is_deleted  | BOOLEAN   | NOT NULL DEFAULT FALSE | Whether the message has been deleted    |

### 5. ServerMembers

Stores the relationship between users and servers.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| user_id     | UUID      | NOT NULL    | ID of the user                              |
| server_id   | UUID      | NOT NULL    | ID of the server                              |
| role_id     | UUID      | NOT NULL    | ID of the user's role in the server         |
| joined_at   | TIMESTAMP | NOT NULL    | Timestamp of when the user joined the server |
| is_banned   | BOOLEAN   | NOT NULL DEFAULT FALSE | Whether the user is banned from the server |
| PRIMARY KEY | (user_id, server_id) |           | Composite primary key                     |

### 6. Invitations

Stores invitation codes and their associated server.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| code        | VARCHAR   | PRIMARY KEY | Unique invitation code                      |
| server_id   | UUID      | NOT NULL    | ID of the server the invitation is for    |
| created_by  | UUID      | NOT NULL    | ID of the user who created the invitation |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of invitation creation            |
| expires_at  | TIMESTAMP | NOT NULL    | Timestamp of invitation expiry              |
| uses_limit  | INTEGER   |             | Maximum number of uses for the invitation |
| uses_count  | INTEGER   | NOT NULL DEFAULT 0 | Number of times the invitation has been used |

### 7. Roles

Stores role information.

| Column      | Data Type | Constraints | Description                               |
| ----------- | --------- | ----------- | ----------------------------------------- |
| id          | UUID      | PRIMARY KEY | Unique role identifier                      |
| server_id   | UUID      | NOT NULL    | ID of the server the role belongs to      |
| name        | VARCHAR   | NOT NULL    | Role's name                               |
| permissions | JSONB     |             | JSON object storing role permissions      |
| created_at  | TIMESTAMP | NOT NULL    | Timestamp of role creation                  |
| updated_at  | TIMESTAMP |             | Timestamp of last role update               |
