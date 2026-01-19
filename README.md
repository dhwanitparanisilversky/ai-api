# AI Execution Backend (NestJS)

This repository contains a **NestJS AI execution backend** that demonstrates a **strict and deterministic AI → backend execution flow** using OpenAI function calling.

The system enforces **controlled AI behavior**, **schema-validated outputs**, and **consistent API responses**, making it suitable for production-grade AI execution pipelines.

> ⚠️ **Note:**
> This project is designed for **local execution only**.
> It does **not** use a database or external infrastructure.


---

## 🚀 Tech Stack

- **Node.js**
- **NestJS**
- **OpenAI Node SDK**

**Excluded by design**
- No Database
- No Message queues
- No External infrastructure

---

## 📂 Project Overview

### Key Features

- Single AI execution endpoint
- **Strict AI control** using:
  - System prompt
  - Function / tool calling
  - `temperature = 0`
- **Whitelisted task execution**
  - Only predefined `task_id`s are allowed
- Strict JSON schema validation for AI responses
- Unified API response format using:
  - Global `ResponseInterceptor`
  - Global `AllExceptionsFilter`
- Consistent error handling (including validation & runtime errors)
- Deterministic AI output (no free-form responses)

---

## 📌 API Endpoint

### `POST /ai/execute`

Executes a predefined AI task using controlled function calling.

#### Request Body

```json
{
  "task_id": "string",
  "input_text": "string"
}
```

## 📘 API Examples

Below are examples demonstrating successful execution and error scenarios.

#### ✅ Example 1: Summarization Task
Request
```
{
  "task_id": "TASK_SUMMARIZE_V1",
  "input_text": "what is Cloudflare"
}
```

Response
```
{
  "result": true,
  "statusCode": 200,
  "message": "AI execution successful",
  "messageLBL": "SUCCESS",
  "payload": {
    "task_id": "TASK_SUMMARIZE_V1",
    "summary": "Cloudflare is a web infrastructure and website security company that provides content delivery network (CDN) services, DDoS mitigation, Internet security, and distributed domain name server services. It helps improve website performance and security by acting as a reverse proxy for web traffic.",
    "status": "success"
  }
}
```

#### ✅ Example 2: Classification Task
Request
```
{
  "task_id": "TASK_CLASSIFY_V1",
  "input_text": "what is Cloudflare"
}
```

Response
```
{
  "result": true,
  "statusCode": 200,
  "message": "AI execution successful",
  "messageLBL": "SUCCESS",
  "payload": {
    "task_id": "TASK_CLASSIFY_V1",
    "category": "Technology",
    "status": "success"
  }
}
```

#### ❌ Error Example: Unsupported Task
Request
```
{
  "task_id": "TASK_CLASSIFY_V3",
  "input_text": "what is Cloudflare"
}
```

Response
```
{
  "requestId": "824986ed-1161-4123-8142-61dd5838aeb4",
  "result": false,
  "statusCode": 400,
  "message": "task_id is not supported",
  "payload": null
}
```

## 🧠 Execution Model

- AI cannot execute arbitrary tasks
-    Every task_id must:
  - Be explicitly whitelisted
  - Have a predefined schema
  - Follow deterministic output rules
- Any unsupported task results in a 400 Bad Request

## 🛡️ Error Handling

Handled centrally via global filters and interceptors:
- Validation errors
- Unsupported task IDs
- Runtime execution errors
- Schema mismatch errors