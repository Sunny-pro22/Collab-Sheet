/
├── server/            # Backend code

│   ├── app.js         # Entry point for the server

│   ├── .env           # Environment variables (ATLAS_URL and secret key)

│   └── ...            # Other server-related files

│

└── vite-project/      # Frontend code

    ├── src/           # Source files
    
    ├── index.html     # Main HTML file
    
    ├── package.json   # Frontend dependencies and scripts
    
    └── ...            # Other frontend-related files
    
Prerequisites
* Node.js: Ensure you have Node.js installed (preferably the latest LTS version).
* npm: Comes with Node.js.
* setting up the server
* cd server
* Install server dependencies: using npm i
* Create a .env file in the server directory with the following content:
  ATLAS_URL=your_mongodb_atlas_url
  SECRET=your_secret_key
* node app.js



* Setting Up the Frontend
  go to main folder and run npm create vite@latest
  cd vite-latest
  npm i
  npm run dev
  

