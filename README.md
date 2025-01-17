### node modules should be reinstalled

It may happen that the node modules get currupted with time so you need to remove and then reinstall them in both main repo and server folder 
command for removing :  
    rm -rf node_modules package-lock.json
command for installing: 
    npm install

It may also happen that permissions are denied for sertain packages by the operating system so you need to grant the system the permissions.
If it is ok with you then try to grant all the permissions with commands : 
    sudo chmod -R 777 /usr/local/lib/node_modules
    sudo chmod -R 777 ~/.npm
These are for Linux

### `npm run dev' to start both the backend and frontend

In the main repo run this command `npm run dev` and start the server and the frontend.
