# Ticket Auction Manager (Client)

The contents of this directory of the Ticket Auction Manager repo pertains to just the client side. Which is a web-based client interface, allowing users to use Ticket Auction Manager.

Due to dev resources already being in the main repo, I have decided to make this dedicated to users instead of developers.

## Running TAM

You have some choice when it comes to running TAM, using Docker or through a portable Node environment (coming soon!).

### Docker

Docker images are available under the dbob16/tam-client repo within Docker Hub. To pull the latest image:

`docker pull dbob16/tam-client:latest`

Then to run it:

`docker run -d --name tam-client --network host --restart unless-stopped -e host=127.0.0.1 -e port=3000 -v tam-data:/data dbob16/tam-client:latest`

It should then be available in a web browser at `http://localhost:3000` on the computer it is being run on. You can bookmark or make shortcuts to it for user convenience.

#### Port Conflict

If there is a conflict with the port when you go to start TAM, you can change the port by changing the number in the `-e port=3000` to another integer. For instance, if you have to change it to port 3001, you can change it to `-e port=3001` and then navigate to `http://localhost:3001` instead.
