🛒 E-commerce API
This is a Node.js REST API for an e-commerce platform. It uses PostgreSQL for data storage via Prisma ORM, and Cloudinary for storing product images.

🚀 Features
User Routes:

Register: /api/user/register
 login: /api/user/login
Admin: /api/user/admin
note: only admin can add product using admin token
default admin login
email:contact@gmail.com
password: kokobilo12
Product Routes:


Create: /api/product/add
 read: /api/product/list
  update: /api/product/update/id
   delete: /api/product/remove/id



🛠️ Tech Stack
Node.js + Express – for building the REST API

PostgreSQL – relational database

Prisma ORM – type-safe database client

Cloudinary – cloud storage for product images

JWT – authentication

bcrypt – password hashing

dotenv – for environment variables


DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
PORT=5000
ADMIN_EMAIL="contact@gmail.com"
ADMIN_PASSWORD="kokobilo12"