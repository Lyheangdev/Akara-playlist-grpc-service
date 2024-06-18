#=== Using linux pre-installed node version-18+
FROM node:18.16.1-alpine

#=== Opting runner working directory
WORKDIR /usr/src/app

#=== Copying configuration project to be located in runner working directory
COPY package*.json ./

#=== Installing all dependencies or requred modules using Yarn
RUN npm install

#=== Copying all project files to runner working directory 
COPY . .

#=== Exposing external port to outside world access
EXPOSE 6000

#=== Executing API application
CMD ["node", "index.js"]