
#!/bin/bash

echo "Installing dependencies for Domain Management Application..."

echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd client
npm install

echo "Installing backend dependencies..."
cd ../server
npm install

echo "Installation complete!"
echo "To run the application:"
echo "  npm run dev (runs both frontend and backend)"
echo "  npm run dev:client (frontend only on port 3000)"
echo "  npm run dev:server (backend only on port 5000)"

cd ..
