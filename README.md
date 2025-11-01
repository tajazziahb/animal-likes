# 🐾 Animal Likes

A simple Node.js and MongoDB app that lets users like or dislike animals by clicking icons — no text inputs, no message board. Each animal’s total count updates instantly without page reloads.

---

[Link to view project](https://animal-likes-production.up.railway.app/)
![screenshot](/public/animals-screenshot.png)

---

## 🚀 How It’s Made

**Tech Stack**
- HTML, CSS, JavaScript (Frontend)
- Node.js, Express (Server)
- MongoDB (Database)
- EJS (Templating Engine)

**How It Works**
- Fetches a list of animals from the MongoDB `animal` collection  
- Displays animal name, image, and current like count  
- Clicking 👍 or 👎 updates the count in real time  
- Likes and dislikes both adjust the same counter (downvotes subtract, upvotes add)

---

## 🧠 Lessons Learned

Refactoring this app from a message board template taught me how to separate front-end display logic from server-side data updates while maintaining instant visual feedback.  
I learned how to:
- Rework a text-based CRUD flow into an image-based UI
- Handle real-time data updates using `fetch()` without page reloads
- Use `findOneAndUpdate()` correctly with `{ returnOriginal: false }` for accurate responses
- Keep design consistency while removing unnecessary form functionality

---

## ⚡ Optimizations

- Removed unused routes and message form logic to simplify performance  
- Minimized database calls — no upserts, only updates to existing documents  
- Lightweight CSS structure for responsiveness and quick render  
- Replaced full-page reloads with direct DOM updates after fetch responses  
- Clean data flow between client and server for immediate feedback



