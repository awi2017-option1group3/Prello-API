import express from 'express'

const router = express.Router()

router.post('/token', (req, res, next) => {
  if (req.is('json')) {
    req.headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  req.app.oauth.grant()(req, res, next)
})

router.get('/authorize', (req, res) => {
  res.render('authorize', {
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
  })
})

router.post('/authorize', (req, res, next) => next(), (req, res, next) => {
  req.app.oauth.authCodeGrant((authCodeReq, authCodeNext) => {
    authCodeNext(null, authCodeReq.body.allow === 'yes', authCodeReq.body.client_id, null)
  })(req, res, next)
})

export default router
