# Workspace ONE Connectors Common Libraries

## Overview
The project is a suite of commonly used utility functions for anyone developing a Mobile Flows connector on Express Node.js. 
Connector developers can use the functions and considerably reduce the overall development time. In addition to that, 
it helps developers to maintain a similar pattern in the connector code and avoid making mistakes. 

It will be available in the public NPM registry soon.

For a detailed, language-neutral, specification for how to develop connectors, 
please see the [Card Connectors Guide](https://github.com/vmware-samples/card-connectors-guide).

## Functions available for development

### validateAuth(mfPublicKeyUrl)
This validates Authorization JWT from Mobile Flows. 
Function takes public key URL of Mobile Flows server. Returns a function to be used as a middleware 
for all protected APIs.
If the validation fails, request is rejected as 401 with a message.
If the validation succeeded, it adds some local variables at `res.locals.mfJwt`.

Example
```$xslt
app.use(['/api/*'], mfCommons.validate('https://prod.hero.vmwservices.com/security/public-key'))
```

### getConnectorBaseUrl(req)
It takes Express request object and returns the connector's base URL. This is the URL to be used by anyone trying to 
access the connector externally. Function respects x-forwarded headers for identifying the original host request by the caller.

Example
```$xslt
const baseUrl = mfCommons.getConnectorBaseUrl(req)
```

### mfRouting.addContextPath(req, res, next)
Use this function as a middleware for all object and actions APIs. 
It reads Mobile Flows routing headers and resolves it to the correct value when the connector is hosted behind a path based proxy. 
If you are uncertain whether it is a required function for you, it is recommended using it always.
Depending on if the request type below properties will be updated.

For object request - `res.locals.mfRoutingPrefix`

For action request - `res.locals.mfRoutingTemplate`

Example
```$xslt
app.use(['/api/*'], mfCommons.mfRouting.addContextPath)
```

### handleXRequestId(req, res, next)
Use this function as a middleware for all connector APIs, to generate better logs.
It helps in debugging about a request. If the caller has an id at the header `x-request-id` function reads it, or if
there isn't any id from caller then function generates one uuid.

It sets the value at the property `res.locals.xRequestId`

Example
```$xslt
app.use('/*', utility.handleXRequestId)
```

### logReq(res, format, ...args)
It can be used to log a message along with some useful properties related to the current request.
If you want to stop all logs from this library, set any value to the property `process.env.SQUELCH_LOGS`.

Example
```$xslt
logReq(res, 'Created ticket: %s', ticketId)

// [req: req-id-1] [t: tenant123] [u: shree] [base: https://backend.com] Created ticket: TKT-5
```

### log(format, ...args)
It can be used to log a message outside the context of a request. If you want to stop all logs from this library, 
set any value to the property `process.env.SQUELCH_LOGS`.


Example
```$xslt
log('Sent samples for analytics.')
```

## Functions available for testing

## mockMfServer
This a dummy server to mimic some of the properties of the Mobile Flows server. It will be useful for unit testing purposes.
Public key is available at `/public-key`

### start(port)
Call the method to start the dummy server to listen at the specified port on the localhost. You can have it running
for a suite of unit tests, instead of starting it once per test.

### stop(function)
Stop the dummy server after your unit tests. It takes a function that will be called by this library.

### getMfTokenFor(username, audienceUrl)
This function returns JWT for the connector authorization. It is similar to the one generated by actual 
Mobile Flows server. You can use this function for specific user and connector URL being tested (audience URL).

Example
```$xslt
const mfToken = mfCommons.getMfTokenFor('shree', `${CONNECTOR_URL}/api/actions/file-ticket`)
```
