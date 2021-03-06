Try our API here : https://prello-api-by-gluon.herokuapp.com/

# Prello (API)

Study project attempting to make a Trello clone. 
This is the **API** of the project, see also the **Client** [here](https://github.com/awi2017-option1group3/Prello-Client).

Read the documentation using the Wiki [here](https://github.com/awi2017-option1group3/Prello-API/wiki) !

## Local installation

### Prerequisites

You need the following tools installed and running:
- Node (version >= 8)
- NPM
- MongoDB
- Redis

It's not required, but you can also install the Client (see [here](https://github.com/awi2017-option1group3/Prello-Client)).

### Installation

You need to clone this repository on your computer:

`https://github.com/awi2017-option1group3/Prello-API`

Go to the API folder using:

`cd Prello-API`

#### Configuring the environment

* Create a `.env` file at the root of the API (same level as `package.json`)
* Fill it with the two tokens retrieved from your gmail account as the following example
```env
SMTP_ID=yourGmailAddress
SMTP_PASSWORD=yourPasswordGmail
```
* Add also the values about your LDAP, we suggest you to use https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/ values as following, but you can set your own values:
```env
LDAP_URL='ldap://ldap.forumsys.com:389'
LDAP_BIND_DN='cn=read-only-admin,dc=example,dc=com'
LDAP_BIND_CREDENTIALS='password'
LDAP_SEARCH_BASE='dc=example,dc=com'
```
* If you want to use forgot Password feature and check registration feature, you need to install the client and add the following content in the `.env` file 
```env
CLIENT_URL=yourClientURL
```

Install the node_modules:

`npm install`

Run the API server :

`npm run dev`

### Usage

The API will be available at `localhost:8000`.

## Production deployment (using Heroku) 

### Deployment

On the Heroku website:

1. Create an Heroku app.
2. Using the panel "Resources", link the add-on 'mLab' to your app.
3. Using the panel "Resources", link the add-on 'Heroku Redis' to your app.
4. Using the panel "Settings", add those config variables:
 * `SMTP_ID`, with the value of `address@gmail`
 * `SMTP_PASSWORD`, with the value of `your_gmail_password`
 * `CLIENT_URL`, with the value of `https://yourClientURL`
 * Values about your LDAP, we suggest you to use https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/ values as following, but you can set your own values:
   * `LDAP_URL`, with the value of `ldap://ldap.forumsys.com:389`
   * `LDAP_BIND_DN`, with the value of `cn=read-only-admin,dc=example,dc=com`
   * `LDAP_BIND_CREDENTIALS`, with the value of `password`
   * `LDAP_SEARCH_BASE`, with the value of `dc=example,dc=com`
5. Using the panel "Deploy", link the github repository to your app (and enable automatic deploys).
6. Using the panel "Deploy", deploy the master branch (at the end of the page). This action can take a while (generally 1 min).
7. Open the app using the "Open app" top-right button.

### Usage

You can request the API using: `https://{app-name}.herokuapp.com/`.
