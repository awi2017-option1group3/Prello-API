import bcrypt from 'bcrypt'
import LdapAuth from 'ldapauth-fork'
import AuthCode from '../models/AuthCode'
import AccessToken from '../models/AccessToken'
import Client from '../models/Client'
import RefreshToken from '../models/RefreshToken'
import User from '../../api/models/User'

const env = Object.assign({}, process.env)
const ldapAuth = new LdapAuth({
  url: env.LDAP_URL,
  bindDN: env.LDAP_BIND_DN,
  bindCredentials: env.LDAP_BIND_CREDENTIALS,
  searchBase: env.LDAP_SEARCH_BASE,
  searchFilter: '(uid={{username}})',
  reconnect: true,
})
ldapAuth.on('error', (err) => {
  console.error('LdapAuth: ', err)
})

const authorizedGrants = ['password', 'authorization_code', 'refresh_token']

const getAuthCode = (authCode, callback) => {
  AuthCode.findOne({ authCode }, callback)
}

const saveAuthCode = (authCode, clientId, expires, userId, callback) => {
  const cleanedUserId = userId && userId.id ? userId.id : userId
  const fields = {
    userId: cleanedUserId,
    clientId,
    expires,
  }
  AuthCode.update({ authCode }, fields, { upsert: true }, callback)
}

const getAccessToken = (accessToken, callback) => {
  AccessToken.findOne({ accessToken }, callback)
}

const saveAccessToken = (accessToken, clientId, expires, userId, callback) => {
  const cleanedUserId = userId && userId.id ? userId.id : userId
  const fields = {
    userId: cleanedUserId,
    clientId,
    expires,
  }
  AccessToken.update({ accessToken }, fields, { upsert: true }, callback)
}

const getRefreshToken = (refreshToken, callback) => {
  RefreshToken.findOne({ refreshToken }, callback)
}

const saveRefreshToken = (refreshToken, clientId, expires, userId, callback) => {
  const cleanedUserId = userId && userId.id ? userId.id : userId
  const fields = {
    userId: cleanedUserId,
    clientId,
    refreshToken,
    expires,
  }
  RefreshToken.create(fields, callback)
}

const validateAndGetUserWithLDAP = (email, password) => new Promise((resolve, reject) => {
  const splittedEmail = email.split('@')
  if (splittedEmail.length >= 2) {
    const ldapUsername = splittedEmail[0]
    ldapAuth
      .authenticate(ldapUsername, password, (err, ldapUser) => {
        if (err) {
          reject(err)
        } else {
          const userData = {
            username: ldapUsername,
            email: ldapUser.mail,
            fullName: ldapUser.cn,
            initials: ldapUser.cn.split(' ').map(word => word[0]).join(''),
            registrationChecked: true,
          }
          bcrypt
            .hash(password, 10)
            .catch(err2 => reject(err2))
            .then((passwordHashed) => {
              userData.password = passwordHashed
              const user = new User(userData)
              user.save()
              resolve(user)
            })
        }
      })
  } else {
    reject(new Error('Can not extract the username from email'))
  }
})

const validateUserWithOurDatabase = (localUser, email, password) => new Promise((resolve, reject) => {
  if (localUser.registrationChecked) {
    bcrypt
      .compare(password, localUser.password)
      .catch(err => reject(err))
      .then(result => (result ? resolve(localUser) : reject(new Error('Password does not match'))))
  } else {
    reject(new Error('The user has not validate his registration'))
  }
})

/*
    First, try to get the user from our database
    If user is present, check his password
    If user isn't present, try to get user data from the ldap and create a new local user
 */
const getUser = (email, password, callback) => {
  User.findOne({ email }).exec()
    .catch(error => callback(error, null))
    .then((potentialUser) => {
      if (!potentialUser) {
        return validateAndGetUserWithLDAP(email, password)
      }
      return validateUserWithOurDatabase(potentialUser, email, password)
    })
    .catch(err => callback(err, null))
    .then(user => (user ? callback(null, user.email) : callback(null, null)))
}

const getClient = (clientId, clientSecret, callback) => {
  const fields = {
    clientId,
  }
  if (clientSecret) {
    fields.clientSecret = clientSecret
  }
  Client.findOne(fields, callback)
}

const grantTypeAllowed = (clientId, grantType, callback) => {
  callback(false, authorizedGrants.includes(grantType))
}

export default {
  authorizedGrants, getAuthCode, saveAuthCode, getAccessToken, saveAccessToken, getRefreshToken, saveRefreshToken, getUser, getClient, grantTypeAllowed,
}
