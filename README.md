# Animal Rater

Animal Rater is a full-stack web app that lets users upload and rate their favorite animals. What started as a static gallery evolved into a fully dynamic experience — users can now post new animals, upvote or downvote them, and even delete their own uploads. The interface combines a nature-inspired design with smooth live updates to make everything feel alive and interactive.

---

[Link to view project](https://animal-likes-production.up.railway.app/)

![screenshot](/public/animals-screenshot.png)

---

## How It’s Made

**Tech Stack**
- EJS (Templating Engine), CSS, JavaScript (Frontend)
- Node.js, Express (Server)
- MongoDB (Database)
- Multer (Image Upload)

---

## How It Works
- Users fill out a short form with an animal name and image file.  
- Upon submission, Multer stores the image and a new record is created in MongoDB.  
- The name is automatically formatted — first letter capitalized, and any following words treated properly (e.g., “mountain lion” → “Mountain Lion”).  
- Each card displays the animal’s name, image, and live vote count.  
- Users can click thumbs up or thumbs down to adjust the counter in real time.  
- Only user-submitted animals can be deleted.  
- The interface includes subtle animations and a paw-print background trail to give the app a more natural, “forest journal” feel.

---

## Optimizations
- Replaced static seed data with live MongoDB collection reads  
- Added file upload and delete functionality for better user control  
- Simplified database logic to ensure live update accuracy after voting  
- Adjusted styling for better visual hierarchy and responsive design  
- Moved all uploads to `.gitignore` to keep the repo lightweight and clean  

---

## Lessons Learned
- Managing file uploads is simpler once routes and file serving paths are clearly structured  
- A small amount of animation can elevate a minimalist layout  
- Handling case formatting in the backend avoids inconsistent database entries  
- Clean separation between PUT, POST, and DELETE routes makes debugging easier  
- Always double-check `.gitignore` before committing any generated assets or uploads  