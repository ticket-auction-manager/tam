# Ticket Auction Manager

This is Ticket Auction Manager. A project I (Dilan Gilluly) am working on as a hobby project. It's main scope is to manage in person penny socials or benefit auctions.

The remote server (api directory) is written in FastAPI and Python and the client (client directory) is written in Sveltekit.

Features:

- **Forms**: Facilitates the entry of data throughout the platform. The main goal of this is to allow one to manage in-person benefit auctions for non-profit causes.
  - **Ticket Form**: Enter the names and phone numbers of ticket purchasers, as well as their contact preference, which the default is controllable via the Settings screen.
  - **Basket Form**: Optionally, basket/item descriptions can be added as well as who the donor(s) are for each one. The descriptions appear on the reports later on.
  - **Drawing Form**: Use this form to enter the winning ticket numbers. The form automatically looks up if an entry exists when a field is changed and will popluate the information next to it if it does.
- **Reports**: Reports are automatically generated with one click to avoid line shifts or other issues which may arise during compilation.
  - **By Name Report**: This report orders the lines by the last name of each winner, then first name, phone number, and finally basket number.
  - **By Basket Report**: Orders winners by basket number.
  - **Counts Report**: Displays counts of ticket sales by prefix as well as totals.
- **Settings**:
  - **Settings section**: The Admin/settings section can be accessed on the main menu by pressing Alt(option)+A. The combination toggles it so if you want it to go away again, just press Alt(option)+A again.
  - **Settings page**: Allows you to control the base options of the operation. Including remote mode (leave the Remote Server field blank for standalone(offline) mode or put in a remote server to connect to a server), remote port, TLS, default contact preference, and the name of the venue/benefit (appears on main menu as well as reports).
  - **Auth Keys**: Allows you to manage auth keys if it's in remote mode. To do so, you need to know the auth password on the server.
  - **Prefixes**: Allows you to add or change prefixes which are available on the main menu to be able to access the respective forms for each prefix. Note, **you need to add prefixes through this form after first installation of either client or server to be able to access forms and reports.**
- **Remote Mode**: Remote mode, which is configurable in the Settings screen, by putting in a remote server address/hostname, allows data to be synched across multiple computers for large scale operations.

## Cloning the repo

To clone the repo you just need to run the git clone command to clone it to a directory of your choosing. I generally try to push to a few different git providers just so that if one has an outage, it allows you to go with another one for the time being. Replace 'yourrepofolder' at the end with the folder/dir of your choosing.

Gitlab:

`git clone https://www.gitlab.com/Ticket-Auction-Manager/tam yourrepofolder`

Github:

`git clone https://www.github.com/Ticket-Auction-Manager/tam yourrepofolder`

My own git server:

`git clone https://git.dilangilluly.us/Ticket-Auction-Manager/tam yourrepofolder`

## Installing dependencies

Server:

(needs Python installed, and a virtual environment activated depending on OS distro and Python version)

```
cd api
pip install -r app/requirements.txt
```

Client:

(needs pnpm installed)

```
cd client
pnpm install
```

## Running dev instances

Server:

```
cd api
sh start_dev.sh
```

Client:

```
cd client
pnpm dev
```
