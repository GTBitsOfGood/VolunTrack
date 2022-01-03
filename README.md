# nextjs-starter

Refactor list:

- route to correct eventmanager based on auth level
- figure out a way to make helpers consistent
- see if anything bled through when converting App.jsx to _app.jsx
  - make _app.jsx handle less logic.
- break up actions/queries.js into multple files
- readd validation back into server actions using next-connect and express-validator
- I think splash is a weird component to have, just have all of that logic be handled inside of the index page or promote splash to its own screens folder.
- put auth back into this application, the files and api routes exist but nothing is filled in properly.

migration list:

- make the api best practices because it seems pretty all over the place
  - add some type of api documentation/swagger or whatever
- use ssr in place of useeffect (use isomorphic unfetch in this case)

## Stack

- React.js: Front-end
- Next.js: API routes and server-side rendering
- MongoDB: Permanently storing info
- eslint: Automatically identifying and fixing code errors
- prettier: Setting a common code style and fixing any issues. If you would like to adjust any prettier settings like quote style or include semicolons, look in `.prettierrc`
- yarn: Package management. If you do not have yarn, run `npm install -g yarn` to install yarn globally.

## Setup

### Initializing Env Vars

- If you are an EM setting up a project for the first time, read [the Bitwarden guide here](https://gtbitsofgood.notion.site/Secrets-Passwords-Bitwarden-74c4806a1f29485b8fb85ea29f273ab9) before continuing forward.
- Run `yarn secrets` to sync development secrets from Bitwarden and save them to a local `.env` file. Contact a leadership member for the Bitwarden password.
  - **Note**: If you are using Windows, enter `yarn secrets:login` and then `yarn secrets:sync` instead of the above script.

### Updating Env Vars

- For dev, update `.env` and `next.config.js`
- For production, add the env vars to your host, **NEVER** commit `.env` to your version control system.

### MongoDB

A running instance of MongoDB is required this project.

- Decide if you want to run MongoDB locally or remotely
- Locally (Docker (RECOMMENDED))
  1. [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  2. Run `docker run --name mongodb -d -p 27017:27017 mongo` in your terminal
  3. Open Docker Desktop and confirm that your MongoDB image is running. It should exist on port 27017, and can be accessed.
- Locally (Non-Docker)
  1. [Download MongoDB Community Server](https://www.mongodb.com/download-center/community)
  2. Go through the installation instructions.
     - Leave the port at default 27017
- Remotely
  1. Create a MongoDB instance on MongoDB Atlas
  2. In Security → Network Access: add the IP address `0.0.0.0/0` (all IPs)
  3. In Security → Database Access: Add new database user
  4. In Data Storage → Clusters: Find your cluster and click `Connect` → `Connect your application` and copy the connection string, set the username and password, and set this as `MONGO_DB` in `.env`
- Create the `nextjs` database. (or choose another name, but make sure to change it in `.env`)
- It's very helpful to install MongoDB Compass to see your database contents

### Node

1. Clone this project to your computer
2. Navigate to this project in terminal and enter `yarn`
3. Rename `example.env` to `.env` and fill it out with the dev config

## Running

### Development

To understand this code better, read the [Code Tour](/CODETOUR.md).

1. Run `yarn`
2. Run `yarn dev`

### Production

1. Setup your host/vm and the necessary env vars
2. Run `yarn install`
3. Run `yarn start`

## Other Info

### Styling

- By default, this repository uses Next `^9.2.0` for styles, which includes native support for global CSS and CSS modules
- However, this version only allows global css to be in `pages/_app.js`, which can cause issues with external packages
- If you face this error, the solution is installing [`@zeit/next-css` and adding it to `next.config.js`](https://github.com/zeit/next-plugins/tree/master/packages/next-css), however you cannot use css modules and global css together with this package (and it defaults to global).

### Deployment

Follow this guide here: https://www.notion.so/gtbitsofgood/General-Deployment-Pointers-Vercel-763e769ef0074ff8b12c85c3d4809ba9
