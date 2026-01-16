# AI Execution Backend (NestJS)

This repository contains a **NestJS backend** that demonstrates a **strict AI → backend execution flow** using OpenAI function calling, along with **standardized API responses**, **global interceptors**, and **exception handling**.

The project is designed for **local execution only** and follows a controlled, deterministic AI execution pattern.

---

## 🚀 Tech Stack

- **Node.js**
- **NestJS**
- **OpenAI Node SDK**
- **AJV (JSON Schema Validation)**
- **Express**
- No database
- No external infrastructure

---

## 📂 Project Overview

### Key Features

- Single AI execution endpoint
- Locked AI behavior using:
  - System prompt
  - Function / tool calling
  - Temperature = 0
- Strict JSON schema validation for AI responses
- Unified API response format using:
  - Global `ResponseInterceptor`
  - Global `AllExceptionsFilter`
- Consistent error handling (including validation & runtime errors)

---

## 📌 API Endpoint

### `POST /api/ai/execute`

#### Request Body

```json
{
  "task_id": "string",
  "input_text": "string"
}
```

## 📘 API Example

This section demonstrates how the AI execution API behaves for both **successful** and **error** scenarios.

---

### ✅ Successful Request

#### Request Body

#### Request Body

```json
{
  "task_id": "1",
  "input_text": "what exception is throw by java if we provide '0/0'"
}
```

#### Response Body

```
{
  "result": true,
  "statusCode": 200,
  "message": "AI execution successful",
  "messageLBL": "SUCCESS",
  "payload": {
    "task_id": "1",
    "summary": "In Java, providing '0/0' as an integer division throws an ArithmeticException due to division by zero.",
    "status": "success"
  }
}
```

#### Error Response (Invalid Request)

```
{
  "requestId": "3d84d0e4-3e2a-43b7-b5b9-6562fc65a1c7",
  "result": false,
  "statusCode": 400,
  "message": "Invalid request body",
  "payload": null
}
```
