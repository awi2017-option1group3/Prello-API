import bcrypt from 'bcrypt'
import AuthCode from '../models/AuthCode'
import AccessToken from '../models/AccessToken'
import Client from '../models/Client'
import RefreshToken from '../models/RefreshToken'
import User from '../../api/models/User'

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

const getUser = (email, password, callback) => (
  User.findOne({ email }).exec()
    .catch(error => callback(error, null))
    .then((user) => {
      if (!user) {
        callback(null, null)
      } else if (user.registrationChecked) {
        return bcrypt.compare(password, user.password)
      }
    })
    .then(res => (res ? callback(null, email) : callback(null, null)))
)

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
