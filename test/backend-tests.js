/*
* Copyright © 2020 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

'use strict'

const { expect } = require('chai')
const index = require('../index')
let isNextCalled = false

describe('Backend function tests', () => {
  beforeEach(() => {
    isNextCalled = false
  })

  afterEach(() => {
    expect(isNextCalled).to.eql(true)
  })

  it('should read x-connector-base-url header', async () => {
    const mockReq = {
      headers: {
        'x-connector-base-url': 'https://salesforce.com',
        'x-connector-authorization': 'Bearer salesforce-oauth-token'
      }
    }
    const mockRes = {
      locals: {}
    }

    index.readBackendBaseUrl(mockReq, mockRes, mockNext)
    expect(mockRes.locals.baseUrl).to.eql('https://salesforce.com')
  })

  it('should read all x-connector headers', async () => {
    const mockReq = {
      headers: {
        'x-connector-base-url': 'https://salesforce.com',
        'x-connector-authorization': 'Bearer salesforce-oauth-token'
      }
    }
    const mockRes = {
      locals: {}
    }

    index.readBackendHeaders(mockReq, mockRes, mockNext)
    expect(mockRes.locals.backendBaseUrl).to.eql('https://salesforce.com')
    expect(mockRes.locals.backendAuthorization).to.eql('Bearer salesforce-oauth-token')
  })

  it('should not error if backend base url is missing.', async () => {
    const mockReq = {
      headers: {
        'x-connector-authorization': 'Bearer salesforce-oauth-token'
      }
    }
    const mockRes = {
      locals: {}
    }

    index.readBackendHeaders(mockReq, mockRes, mockNext)
  })

  it('should not error if backend authorization is missing.', async () => {
    const mockReq = {
      headers: {
        'x-connector-base-url': 'https://salesforce.com'
      }
    }
    const mockRes = {
      locals: {}
    }

    index.readBackendHeaders(mockReq, mockRes, mockNext)
  })
})

const mockNext = () => {
  isNextCalled = true
}
