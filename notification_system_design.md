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