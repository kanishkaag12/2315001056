# Stage 1

## Core Actions

1. Create Notification
2. Get All Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Delete Notification
6. Get Unread Notifications
7. Real-Time Notification Delivery

---

## 1. Create Notification

### Endpoint
POST /api/notifications

### Request Body

```json
{
  "title": "Placement Drive",
  "message": "Microsoft placement drive starts tomorrow.",
  "recipientId": "12345",
  "type": "PLACEMENT"
}
```

### Response (201 Created)

```json
{
  "notificationId": "notif_001",
  "status": "UNREAD",
  "createdAt": "2026-06-10T12:00:00Z"
}
```

---

## 2. Get All Notifications

### Endpoint
GET /api/notifications

### Response (200 OK)

```json
[
  {
    "notificationId": "notif_001",
    "title": "Placement Drive",
    "status": "UNREAD"
  }
]
```

---

## 3. Get Notification By ID

### Endpoint
GET /api/notifications/{notificationId}

### Response (200 OK)

```json
{
  "notificationId": "notif_001",
  "title": "Placement Drive",
  "message": "Microsoft placement drive starts tomorrow.",
  "status": "UNREAD"
}
```

---

## 4. Mark Notification As Read

### Endpoint
PATCH /api/notifications/{notificationId}/read

### Response (200 OK)

```json
{
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

### Endpoint
DELETE /api/notifications/{notificationId}

### Response (200 OK)

```json
{
  "message": "Notification deleted successfully"
}
```

---

## 6. Get Unread Notifications

### Endpoint
GET /api/notifications/unread

### Response (200 OK)

```json
[
  {
    "notificationId": "notif_001",
    "title": "Placement Drive",
    "status": "UNREAD"
  }
]
```

---

## Real-Time Notification Delivery

### Technology

WebSocket

### Client Connection

GET /ws/notifications

### Sample Event

```json
{
  "event": "NEW_NOTIFICATION",
  "notificationId": "notif_001",
  "title": "Placement Drive",
  "message": "Microsoft placement drive starts tomorrow."
}
```

---

## Logging Middleware Integration

Every API endpoint must use the custom logging middleware.

Examples:

```javascript
await Log(
  "backend",
  "info",
  "controller",
  "Notification created successfully"
);

await Log(
  "backend",
  "info",
  "controller",
  "Notification fetched successfully"
);

await Log(
  "backend",
  "error",
  "controller",
  "Notification not found"
);
```







# Stage 2

## Database Choice

I recommend PostgreSQL because:

- ACID compliant
- Reliable and scalable
- Supports indexing
- Supports pagination efficiently
- Suitable for notification systems

---

## Database Schema

### notifications

```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    recipient_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Indexes

```sql
CREATE INDEX idx_recipient
ON notifications(recipient_id);

CREATE INDEX idx_status
ON notifications(status);

CREATE INDEX idx_created_at
ON notifications(created_at);
```

---

## Queries

### Create Notification

```sql
INSERT INTO notifications(
notification_id,
recipient_id,
title,
message,
type
)
VALUES (
gen_random_uuid(),
'12345',
'Placement Drive',
'Microsoft drive starts tomorrow',
'PLACEMENT'
);
```

---

### Get All Notifications

```sql
SELECT *
FROM notifications
ORDER BY created_at DESC;
```

---

### Get Notification By ID

```sql
SELECT *
FROM notifications
WHERE notification_id='notif_001';
```

---

### Mark As Read

```sql
UPDATE notifications
SET status='READ'
WHERE notification_id='notif_001';
```

---

### Delete Notification

```sql
DELETE FROM notifications
WHERE notification_id='notif_001';
```

---

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE status='UNREAD'
ORDER BY created_at DESC;
```

---

## Scaling Challenges

### Problem 1: Slow Queries

As notification count increases, searches become slower.

Solution:

- Create indexes
- Use pagination

---

### Problem 2: Large Table Size

Millions of notifications increase storage and query time.

Solution:

- Partition tables by date
- Archive old notifications

---

### Problem 3: High Read Traffic

Many users fetching notifications simultaneously.

Solution:

- Redis caching
- Read replicas

---

### Pagination Query

```sql
SELECT *
FROM notifications
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

---

## Logging Middleware Usage

```javascript
await Log(
  "backend",
  "info",
  "db",
  "Notification stored successfully"
);

await Log(
  "backend",
  "info",
  "db",
  "Notification fetched successfully"
);

await Log(
  "backend",
  "error",
  "db",
  "Database query failed"
);
```





# Stage 3

## Analysis of Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Correct?

Yes, it correctly fetches unread notifications for a student ordered by creation time.

---

### Why Is It Slow?

Database size:

- 50,000 students
- 5,000,000 notifications

Without indexes, the database performs a full table scan.

Complexity:

```text
O(N)
```

where N = 5,000,000 rows.

Sorting also adds additional cost.

---

## Recommended Improvement

Create a composite index:

```sql
CREATE INDEX idx_student_unread_created
ON notifications(studentID, isRead, createdAt);
```

Optimized query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Expected Cost

Without index:

```text
O(N)
```

With index:

```text
O(log N)
```

plus retrieval cost of matching rows.

---

## Should We Add Indexes On Every Column?

No.

Problems:

- Increased storage usage
- Slower INSERT operations
- Slower UPDATE operations
- More index maintenance overhead

Indexes should only be created on:

- Frequently filtered columns
- JOIN columns
- Sorting columns

---

## Query: Students Who Received Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 DAYS';
```

For MySQL:

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

## Additional Optimization

For very large datasets:

- Table partitioning by date
- Redis caching
- Archiving old notifications
- Read replicas

---

## Logging Middleware Usage

```javascript
await Log(
  "backend",
  "info",
  "db",
  "Optimized notification query executed"
);

await Log(
  "backend",
  "warn",
  "db",
  "Slow query detected"
);
```



# Stage 4

## Problem

Notifications are being fetched from the database on every page load.

Issues:

- High database load
- Increased API latency
- Poor user experience
- Reduced scalability

---

## Proposed Solution

### 1. Redis Caching

Store recent notifications in Redis.

Flow:

1. Check Redis cache
2. Return data if found
3. Otherwise fetch from DB
4. Store result in Redis

Benefits:

- Sub-millisecond reads
- Reduced DB load

Tradeoff:

- Additional infrastructure
- Cache invalidation complexity

---

### 2. Real-Time Push Notifications

Use WebSockets or Server-Sent Events (SSE).

Instead of polling:

- Server pushes notifications instantly
- Users receive updates in real time

Benefits:

- Better user experience
- Fewer API requests

Tradeoff:

- Persistent connections
- More memory consumption

---

### 3. Pagination

Instead of loading all notifications:

```http
GET /api/notifications?page=1&limit=20
```

Benefits:

- Smaller payloads
- Faster queries

Tradeoff:

- Additional client-side handling

---

### 4. Read Replicas

Use read replicas for notification retrieval.

Benefits:

- Distributes read traffic
- Better scalability

Tradeoff:

- Slight replication lag

---

### 5. Background Processing

Use message queues:

- RabbitMQ
- Kafka

Benefits:

- Asynchronous processing
- Better throughput

Tradeoff:

- Additional system complexity

---

## Recommended Architecture

Client
↓
Redis Cache
↓
Read Replica
↓
Primary Database

Real-time updates delivered using WebSockets.

---

## Performance Improvement

Current:

- Every page load hits DB

Proposed:

- Cache first
- Real-time updates
- Paginated retrieval

Result:

- Lower DB load
- Faster response times
- Improved scalability

---

## Logging Middleware Usage

```javascript
await Log(
  "backend",
  "info",
  "cache",
  "Notification served from Redis cache"
);

await Log(
  "backend",
  "info",
  "service",
  "WebSocket notification delivered"
);
```




# Stage 5

## Problems With Current Implementation

Current implementation:

```python
for student_id in student_ids:
    send_email(student_id, message)
    save_to_db(student_id, message)
    push_to_app(student_id, message)
```

Issues:

1. Sequential processing is slow for 50,000 students.
2. Email failure can stop processing.
3. No retry mechanism.
4. No fault tolerance.
5. Database and email operations are tightly coupled.
6. Difficult to recover from partial failures.

---

## What Happens If 200 Emails Fail?

The notification should still exist in the database.

Users should still receive in-app notifications.

Failed emails should be retried automatically.

---

## Recommended Architecture

HR Action
↓
Notification Service
↓
Message Queue (Kafka/RabbitMQ)
↓
Workers

Workers:

- Email Worker
- Database Worker
- Push Notification Worker

Each worker processes tasks independently.

---

## Should DB Save And Email Sending Happen Together?

No.

Reasons:

- Email is an external dependency.
- Email providers may be slow or unavailable.
- Database write should not wait for email delivery.
- Better reliability and scalability.

Database save should happen first.

Email delivery should be asynchronous.

---

## Improved Pseudocode

```python
function notify_all(student_ids, message):

    notification_id = create_notification(message)

    for student_id in student_ids:

        save_to_db(student_id, notification_id)

        queue.publish(
            "notification_jobs",
            {
                "student_id": student_id,
                "notification_id": notification_id
            }
        )
```

Email Worker:

```python
while True:

    job = queue.consume()

    try:
        send_email(job.student_id)
    except:
        retry(job)
```

Push Worker:

```python
while True:

    job = queue.consume()

    push_to_app(job.student_id)
```

---

## Benefits

- High scalability
- Retry support
- Fault tolerance
- Faster execution
- Independent services
- Easier monitoring

---

## Logging Middleware Usage

```javascript
await Log(
  "backend",
  "info",
  "service",
  "Bulk notification job started"
);

await Log(
  "backend",
  "warn",
  "service",
  "Email delivery failed, retry scheduled"
);

await Log(
  "backend",
  "info",
  "service",
  "Bulk notification completed"
);
```



# Stage 6

## Priority Formula

Priority Score = Weight × 100 − AgeInHours

Weights:

- Placement = 3
- Result = 2
- Event = 1

Notifications are ranked by score and the top 10 are displayed.

## Efficient Top-N Maintenance

Use a Min Heap of size N.

Complexities:

- Insert: O(log N)
- Retrieve Top N: O(N)

Advantages:

- Avoids sorting the complete dataset repeatedly.
- Scales efficiently for large notification volumes.

## Error Encountered

The notification retrieval endpoint returned:

```json
{
  "message": "invalid authorization token"
}
```

even when using a freshly generated access token from the authentication API.

The ranking logic was implemented, but the external API could not be queried successfully due to authorization issues.
```

