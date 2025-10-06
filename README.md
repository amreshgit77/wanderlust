🏡 Wanderlust — A Full-Stack Travel Listing Platform

A complete CRUD web app built using Node.js, Express, MongoDB, EJS, and Cloudinary, where users can create, edit, and explore travel listings.
Image uploads are handled using Multer (memory storage) and Cloudinary (v2).

📸 Preview


(Replace this with your own app screenshot once hosted)

🚀 Features

🏔️ Create, edit, and delete travel listings

🧑‍🤝‍🧑 User authentication (Passport.js local strategy)

📷 Upload images directly to Cloudinary

💬 Add and manage reviews on listings

🌍 Responsive EJS views with Bootstrap styling

⚡ Flash messages for success & errors

🔒 Sessions stored securely with connect-mongo

🧩 Tech Stack
Category	Technology
Frontend	EJS, Bootstrap, JavaScript
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
Image Uploads	Multer (MemoryStorage) + Cloudinary v2
Auth	Passport.js (Local Strategy)
Misc	dotenv, connect-flash, method-override, express-session
⚙️ Installation and Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/Wanderlust.git
cd Wanderlust

2️⃣ Install dependencies
npm install

3️⃣ Create .env file

Create a .env file in the project root and add your credentials:

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=thisshouldbeabettersecret

4️⃣ Start the server
nodemon index.js


Visit: 👉 http://localhost:8080

🗂️ Folder Structure
Wanderlust/
├── controllers/
│   ├── listings.js
│   ├── users.js
│   └── reviews.js
├── models/
│   ├── listing.js
│   ├── user.js
│   └── review.js
├── routes/
│   ├── listing.js
│   ├── user.js
│   └── review.js
├── views/
│   ├── listings/
│   ├── users/
│   └── reviews/
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── public/
│   ├── css/
│   └── js/
├── cloudConfig.js
├── index.js
├── package.json
└── .env
