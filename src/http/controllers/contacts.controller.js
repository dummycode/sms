var responder = require('../../core/responder')
var contactsManager = require('../../managers/contacts.manager')
var { validationResult } = require('express-validator')

var contactGoggles = require('./goggles/contact.goggles')

var {
  ContactNotFoundError,
  ContactAlreadyExistsError,
} = require('../../core/errors')

const index = (req, res) => {
  contactsManager
    .fetchAllContacts()
    .then((results) => {
      responder.successResponse(res, results.map(contactGoggles))
    })
    .catch((err) => {
      switch (err.constructor) {
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const fetch = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  contactsManager
    .fetchContact(req.params.id)
    .then((results) => {
      const contact = results[0]
      responder.successResponse(res, contactGoggles(contact))
    })
    .catch((err) => {
      switch (err.constructor) {
        case ContactNotFoundError:
          responder.notFoundResponse(res, 'contact not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const create = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'Invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  contactsManager
    .createContact(req.body.name, req.body.phone_number)
    .then((results) => {
      responder.itemCreatedResponse(res, contactGoggles(results[0]), {
        message: 'Contact created',
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case ContactAlreadyExistsError:
          responder.badRequestResponse(
            res,
            'Contact with phone number already exists',
          )
          break
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const remove = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  contactsManager
    .deleteContact(req.params.id)
    .then((results) => {
      const contact = results[0]
      responder.itemDeletedResponse(res, 'successfully deleted contact')
    })
    .catch((err) => {
      switch (err.constructor) {
        case ContactNotFoundError:
          responder.notFoundResponse(res, 'contact not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

module.exports = {
  index,
  fetch,
  create,
  remove,
}
