## Note: Cold Start on Render

This demo is hosted on the **free Render tier**, which means the backend server may **sleep when idle**.  

The first request after a period of inactivity may take **10–30 seconds** to respond.

# Prompt Engineering Demo

A simple full-stack demo showcasing prompt evaluation using OpenAI, REST APIs, and a lightweight ORM backend.

Live Demo: [https://prompt-demo.onrender.com](https://prompt-demo.onrender.com)  

---

## What Does It Do?

This demo takes in a form submission of name, email and mock keywords and evaluates:
- A **score** (0–100) for how likely the lead is to convert
- An **intent** classification: `"High"`, `"Medium"`, or `"Low"`

The logic is powered by OpenAI using prompt engineering, and results are stored in a database **IF** the intent is "High".

The prompt can be viewed [here](https://github.com/jeremygan7/prompt-demo/blob/main/backend/src/util/prompt.ts).

---

## Tech Stack

| Layer       | Tech               | Purpose                                  |
|-------------|--------------------|------------------------------------------|
| Frontend    | React + Vite       | UI & Form             |
| Backend     | Express.ts         | REST API for evaluating leads            |
| AI Engine   | OpenAI API         | Prompt-based lead scoring logic          |
| Database    | Prisma + SQLite    | ORM for storing leads                    |

---

## Example API Call

**Request**
```json
POST /evaluate
{
  "name": "demo",
  "email": "demo@example.com",
  "capturedKeywords": ["pricing", "demo"]
}
```
**Response**
```json
{
  "message": "Lead Created",
  "intent": "High",
  "score": 90
}
```


Disclaimer: This demo uses a lightweight SQLite database for simplicity and portability. It can be easily adapted to use PostgreSQL, MySQL, or any other supported database by updating the Prisma configuration.




