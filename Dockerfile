FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install --include=dev
RUN apk del --no-cache python3 make g++
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]



#Parameter	What it means	What happens if you skip/miss it?
# FROM node:20-alpine	Downloads a mini Linux operating system with Node.js pre-installed.	Fatal error. Docker won't know what runtime/OS to base your container on.
# WORKDIR /app	Creates and sets /app as the main working directory inside the container.	Your files get dumped into the root directory of the container, creating a messy filesystem collision.
# COPY package*.json ./	Copies package.json and package-lock.json from your laptop into the container.	npm install won't know what packages/dependencies your Express app needs.
# RUN npm install	Runs npm install inside the container to create node_modules.	Your app will crash instantly on launch with Cannot find module 'express'.
# COPY . .	Copies all your remaining project code (app.ts, src/, etc.) into the container.	Your container will have node_modules, but zero application source code to execute.
# EXPOSE 3000	Documents that port 3000 is used by the app inside the container.	Outside traffic/browser requests won't know which port the container is listening on.
# CMD ["npm", "start"]	The default startup command that executes when the container boots up.	The container builds successfully, but instantly exits/stops because it has nothing to run.

# Because we are using argon-2 for passcode hashing which requires python or node-gyp... which are heavy build. while this docker is trying to build with nodejs light weight image. it is throughting error. And also this argon-2 is not that good to use just replace it with sha256