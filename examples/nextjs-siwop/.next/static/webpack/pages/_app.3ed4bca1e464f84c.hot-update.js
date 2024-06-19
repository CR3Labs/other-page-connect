"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "../../packages/opconnect-next-siwop/build/index.es.js":
/*!*************************************************************!*\
  !*** ../../packages/opconnect-next-siwop/build/index.es.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"configureClientSIWOP\": function() { return /* binding */ configureClientSIWOP; },\n/* harmony export */   \"configureServerSideSIWOP\": function() { return /* binding */ configureServerSideSIWOP; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"../../node_modules/react/jsx-runtime.js\");\n/* harmony import */ var opconnect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opconnect */ \"../../packages/opconnect/build/index.es.js\");\n/* harmony import */ var iron_session__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! iron-session */ \"../../node_modules/iron-session/dist/index.mjs\");\n/* harmony import */ var viem_siwe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! viem/siwe */ \"../../packages/opconnect-next-siwop/node_modules/viem/_esm/siwe/index.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! crypto */ \"./node_modules/next/dist/compiled/crypto-browserify/index.js\");\n/* provided dependency */ var process = __webpack_require__(/*! process */ \"../../node_modules/process/browser.js\");\n\n\n\n\n\n\nclass InvalidTokenError extends Error {\n}\nInvalidTokenError.prototype.name = \"InvalidTokenError\";\n/**\n * Base64 decode unicode\n * @param str\n * @returns\n */\nfunction base64DecodeUnicode(str) {\n    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {\n        let code = p.charCodeAt(0).toString(16).toUpperCase();\n        if (code.length < 2) {\n            code = \"0\" + code;\n        }\n        return \"%\" + code;\n    }));\n}\n/**\n * Base64 URL decode\n * @param str\n * @returns\n */\nfunction base64UrlDecode(str) {\n    let output = str.replace(/-/g, \"+\").replace(/_/g, \"/\");\n    switch (output.length % 4) {\n        case 0:\n            break;\n        case 2:\n            output += \"==\";\n            break;\n        case 3:\n            output += \"=\";\n            break;\n        default:\n            throw new Error(\"base64 string is not of the correct length\");\n    }\n    try {\n        return base64DecodeUnicode(output);\n    }\n    catch (err) {\n        return atob(output);\n    }\n}\nfunction jwtDecode(token, options) {\n    if (typeof token !== \"string\") {\n        throw new InvalidTokenError(\"Invalid token specified: must be a string\");\n    }\n    options || (options = {});\n    const pos = options.header === true ? 0 : 1;\n    const part = token.split(\".\")[pos];\n    if (typeof part !== \"string\") {\n        throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);\n    }\n    let decoded;\n    try {\n        decoded = base64UrlDecode(part);\n    }\n    catch (e) {\n        throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);\n    }\n    try {\n        return JSON.parse(decoded);\n    }\n    catch (e) {\n        throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);\n    }\n}\n/**\n * create a\n * @returns\n */\nfunction generateCodeVerifier() {\n    return (0,crypto__WEBPACK_IMPORTED_MODULE_3__.randomBytes)(32).toString('base64url');\n}\n/**\n * Generate a code challenge from the code verifier\n * @param codeVerifier\n * @returns\n */\nfunction generateCodeChallenge(codeVerifier) {\n    return (0,crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256')\n        .update(codeVerifier)\n        .digest('base64url');\n}\nfunction generatePKCE() {\n    const codeVerifier = generateCodeVerifier();\n    const codeChallenge = generateCodeChallenge(codeVerifier);\n    return { codeVerifier, codeChallenge };\n}\n\nconst APP_URL = 'https://alpha.other.page';\nconst API_URL = 'https://alpha-api.other.page/v1';\nconst getSession = async (req, res, // ServerResponse<IncomingMessage>,\nsessionConfig) => {\n    const session = (await (0,iron_session__WEBPACK_IMPORTED_MODULE_2__.getIronSession)(req, res, sessionConfig));\n    return session;\n};\nconst logoutRoute = async (req, res, sessionConfig, afterCallback) => {\n    switch (req.method) {\n        case 'GET':\n            const session = await getSession(req, res, sessionConfig);\n            session.destroy();\n            if (afterCallback) {\n                await afterCallback(req, res);\n            }\n            res.status(200).end();\n            break;\n        default:\n            res.setHeader('Allow', ['GET']);\n            res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\nconst nonceRoute = async (req, res, sessionConfig, afterCallback) => {\n    switch (req.method) {\n        case 'GET':\n            const session = await getSession(req, res, sessionConfig);\n            if (!session.nonce) {\n                session.nonce = (0,viem_siwe__WEBPACK_IMPORTED_MODULE_4__.generateSiweNonce)();\n                await session.save();\n            }\n            if (afterCallback) {\n                await afterCallback(req, res, session);\n            }\n            res.send(session.nonce);\n            break;\n        default:\n            res.setHeader('Allow', ['GET']);\n            res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\nconst pkceRoute = async (req, res, sessionConfig, afterCallback) => {\n    switch (req.method) {\n        case 'GET':\n            const session = await getSession(req, res, sessionConfig);\n            if (!session.codeVerifier) {\n                const { codeChallenge, codeVerifier } = await generatePKCE();\n                session.codeVerifier = codeVerifier;\n                session.codeChallenge = codeChallenge;\n                console.log(session);\n                await session.save();\n            }\n            if (afterCallback) {\n                await afterCallback(req, res, session);\n            }\n            res.send({ codeChallenge: session.codeChallenge });\n            break;\n        default:\n            res.setHeader('Allow', ['GET']);\n            res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\nconst sessionRoute = async (req, res, sessionConfig, afterCallback) => {\n    switch (req.method) {\n        case 'GET':\n            const session = await getSession(req, res, sessionConfig);\n            if (afterCallback) {\n                await afterCallback(req, res, session);\n            }\n            res.send(session);\n            break;\n        default:\n            res.setHeader('Allow', ['GET']);\n            res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\nconst verifyCodeRoute = async (req, res, sessionConfig, config, afterCallback) => {\n    switch (req.method) {\n        case 'POST':\n            try {\n                // fetch current session\n                const session = await getSession(req, res, sessionConfig);\n                // fetch access token\n                const response = await fetch(`${config === null || config === void 0 ? void 0 : config.authApiUrl}/connect/oauth2-token`, {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json',\n                    },\n                    body: JSON.stringify({\n                        grant_type: 'authorization_code',\n                        code: req.body.code,\n                        code_verifier: session.codeVerifier,\n                        aud: config === null || config === void 0 ? void 0 : config.audience,\n                        client_id: config === null || config === void 0 ? void 0 : config.clientId,\n                        client_secret: config === null || config === void 0 ? void 0 : config.clientSecret,\n                        redirect_uri: config === null || config === void 0 ? void 0 : config.redirectUri,\n                    }),\n                });\n                if (!response.ok) {\n                    throw new Error('Failed to retrieve access token');\n                }\n                const data = await response.json();\n                if (!data.access_token) {\n                    return res.status(422).end('Unable to fetch access token.');\n                }\n                // persist session data\n                const decoded = jwtDecode(data.access_token);\n                session.address = decoded.wallet;\n                session.uid = decoded.sub;\n                await session.save();\n                if (afterCallback) {\n                    await afterCallback(req, res, session, {\n                        ...data,\n                        decoded_access_token: decoded,\n                    });\n                }\n                res.status(200).end();\n            }\n            catch (error) {\n                res.status(400).end(String(error));\n            }\n            break;\n        default:\n            res.setHeader('Allow', ['POST']);\n            res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\nconst envVar = (name) => {\n    const value = process.env[name];\n    if (!value) {\n        throw new Error(`Missing environment variable: ${name}`);\n    }\n    return value;\n};\nconst configureServerSideSIWOP = ({ config, session: { cookieName, password, cookieOptions, ...otherSessionOptions } = {}, options: { afterNonce, afterToken, afterSession, afterLogout } = {}, }) => {\n    config.authApiUrl = config.authApiUrl || API_URL;\n    const sessionConfig = {\n        cookieName: cookieName !== null && cookieName !== void 0 ? cookieName : 'opconnect-next-siwop',\n        password: password !== null && password !== void 0 ? password : envVar('SESSION_SECRET'),\n        cookieOptions: {\n            secure: \"development\" === 'production',\n            ...(cookieOptions !== null && cookieOptions !== void 0 ? cookieOptions : {}),\n        },\n        ...otherSessionOptions,\n    };\n    const apiRouteHandler = async (req, res) => {\n        if (!(req.query.route instanceof Array)) {\n            throw new Error('Catch-all query param `route` not found. SIWOP API page should be named `[...route].ts` and within your `pages/api` directory.');\n        }\n        const route = req.query.route.join('/');\n        switch (route) {\n            case 'nonce':\n                return await nonceRoute(req, res, sessionConfig, afterNonce);\n            case 'pkce':\n                return await pkceRoute(req, res, sessionConfig, afterNonce);\n            case 'verify':\n                return await verifyCodeRoute(req, res, sessionConfig, config, afterToken);\n            case 'session':\n                return await sessionRoute(req, res, sessionConfig, afterSession);\n            case 'logout':\n                return await logoutRoute(req, res, sessionConfig, afterLogout);\n            default:\n                return res.status(404).end();\n        }\n    };\n    return {\n        apiRouteHandler,\n        getSession: async (req, res) => await getSession(req, res, sessionConfig),\n    };\n};\nconst configureClientSIWOP = ({ appUrl, apiRoutePrefix, clientId, redirectUri, scope, }) => {\n    const NextSIWOPProvider = (props) => {\n        const URL = appUrl || APP_URL;\n        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(opconnect__WEBPACK_IMPORTED_MODULE_1__.SIWOPProvider, { clientId: clientId, redirectUri: redirectUri, scope: scope, getNonce: async () => {\n                const res = await fetch(`${apiRoutePrefix}/nonce`);\n                if (!res.ok) {\n                    throw new Error('Failed to fetch SIWOP nonce');\n                }\n                const nonce = await res.text();\n                return nonce;\n            }, generatePKCE: async () => {\n                const res = await fetch(`${apiRoutePrefix}/pkce`, {\n                    method: 'GET',\n                    headers: {\n                        'Content-Type': 'application/json',\n                    },\n                });\n                if (!res.ok) {\n                    throw new Error('Failed to generate PKCE');\n                }\n                return res.json();\n            }, createAuthorizationUrl: ({ nonce, address, code_challenge }) => `${URL}/connect?client_id=${clientId}&scope=${scope.replace(' ', '+')}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}&wallet=${address}&code_challenge=${code_challenge}&code_challenge_method=S256`, verifyCode: ({ code }) => fetch(`${apiRoutePrefix}/verify`, {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json',\n                },\n                body: JSON.stringify({ code }),\n            }).then((r) => r.ok), getSession: async () => {\n                const res = await fetch(`${apiRoutePrefix}/session`);\n                if (!res.ok) {\n                    throw new Error('Failed to fetch SIWOP session');\n                }\n                const { address, nonce, uid, chainId } = await res.json();\n                return address ? { address, nonce, uid, chainId } : null;\n            }, signOut: () => fetch(`${apiRoutePrefix}/logout`).then((res) => res.ok), ...props }));\n    };\n    return {\n        Provider: NextSIWOPProvider,\n    };\n};\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vcGFja2FnZXMvb3Bjb25uZWN0LW5leHQtc2l3b3AvYnVpbGQvaW5kZXguZXMuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBd0M7QUFDRTtBQUNJO0FBQ0E7QUFDRzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSxRQUFRO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RixTQUFTLEdBQUcsVUFBVTtBQUMvRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUZBQXVGLFNBQVMsR0FBRyxVQUFVO0FBQzdHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxtREFBVztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsa0RBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDREQUFjO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw0REFBaUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFlBQVk7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsOEJBQThCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0NBQXNDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxZQUFZO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFlBQVk7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELGtFQUFrRTtBQUNsSDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFlBQVk7QUFDdEQ7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLE9BQU87QUFDekI7QUFDQSx5REFBeUQsS0FBSztBQUM5RDtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsbUJBQW1CLDhEQUE4RCxJQUFJLGFBQWEsb0RBQW9ELElBQUksR0FBRztBQUNqTTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGFBQW9CO0FBQ3hDLHVGQUF1RjtBQUN2RixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHVEQUF1RDtBQUN2RjtBQUNBO0FBQ0EsZ0JBQWdCLHNEQUFHLENBQUMsb0RBQWEsSUFBSTtBQUNyQywyQ0FBMkMsZUFBZTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDJDQUEyQyxlQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QixnQ0FBZ0MsUUFBUSxJQUFJLHFCQUFxQixTQUFTLFNBQVMsd0JBQXdCLG1DQUFtQyxnQ0FBZ0MsU0FBUyxNQUFNLFVBQVUsUUFBUSxrQkFBa0IsZUFBZSw2Q0FBNkMsTUFBTSxjQUFjLGVBQWU7QUFDMVc7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLHVDQUF1QyxNQUFNO0FBQzdDLGFBQWE7QUFDYiwyQ0FBMkMsZUFBZTtBQUMxRDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsK0JBQStCO0FBQ3ZELG1DQUFtQywrQkFBK0I7QUFDbEUsYUFBYSwwQkFBMEIsZUFBZSwyQ0FBMkM7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFMEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4uLy4uL3BhY2thZ2VzL29wY29ubmVjdC1uZXh0LXNpd29wL2J1aWxkL2luZGV4LmVzLmpzPzMwOWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsganN4IH0gZnJvbSAncmVhY3QvanN4LXJ1bnRpbWUnO1xuaW1wb3J0IHsgU0lXT1BQcm92aWRlciB9IGZyb20gJ29wY29ubmVjdCc7XG5pbXBvcnQgeyBnZXRJcm9uU2Vzc2lvbiB9IGZyb20gJ2lyb24tc2Vzc2lvbic7XG5pbXBvcnQgeyBnZW5lcmF0ZVNpd2VOb25jZSB9IGZyb20gJ3ZpZW0vc2l3ZSc7XG5pbXBvcnQgeyByYW5kb21CeXRlcywgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5cbmNsYXNzIEludmFsaWRUb2tlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuSW52YWxpZFRva2VuRXJyb3IucHJvdG90eXBlLm5hbWUgPSBcIkludmFsaWRUb2tlbkVycm9yXCI7XG4vKipcbiAqIEJhc2U2NCBkZWNvZGUgdW5pY29kZVxuICogQHBhcmFtIHN0clxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gYmFzZTY0RGVjb2RlVW5pY29kZShzdHIpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGF0b2Ioc3RyKS5yZXBsYWNlKC8oLikvZywgKG0sIHApID0+IHtcbiAgICAgICAgbGV0IGNvZGUgPSBwLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGlmIChjb2RlLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvZGUgPSBcIjBcIiArIGNvZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiJVwiICsgY29kZTtcbiAgICB9KSk7XG59XG4vKipcbiAqIEJhc2U2NCBVUkwgZGVjb2RlXG4gKiBAcGFyYW0gc3RyXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBiYXNlNjRVcmxEZWNvZGUoc3RyKSB7XG4gICAgbGV0IG91dHB1dCA9IHN0ci5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcbiAgICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBvdXRwdXQgKz0gXCI9PVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmFzZTY0IHN0cmluZyBpcyBub3Qgb2YgdGhlIGNvcnJlY3QgbGVuZ3RoXCIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmFzZTY0RGVjb2RlVW5pY29kZShvdXRwdXQpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBhdG9iKG91dHB1dCk7XG4gICAgfVxufVxuZnVuY3Rpb24gand0RGVjb2RlKHRva2VuLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFRva2VuRXJyb3IoXCJJbnZhbGlkIHRva2VuIHNwZWNpZmllZDogbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICB9XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICBjb25zdCBwb3MgPSBvcHRpb25zLmhlYWRlciA9PT0gdHJ1ZSA/IDAgOiAxO1xuICAgIGNvbnN0IHBhcnQgPSB0b2tlbi5zcGxpdChcIi5cIilbcG9zXTtcbiAgICBpZiAodHlwZW9mIHBhcnQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRUb2tlbkVycm9yKGBJbnZhbGlkIHRva2VuIHNwZWNpZmllZDogbWlzc2luZyBwYXJ0ICMke3BvcyArIDF9YCk7XG4gICAgfVxuICAgIGxldCBkZWNvZGVkO1xuICAgIHRyeSB7XG4gICAgICAgIGRlY29kZWQgPSBiYXNlNjRVcmxEZWNvZGUocGFydCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkVG9rZW5FcnJvcihgSW52YWxpZCB0b2tlbiBzcGVjaWZpZWQ6IGludmFsaWQgYmFzZTY0IGZvciBwYXJ0ICMke3BvcyArIDF9ICgke2UubWVzc2FnZX0pYCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29kZWQpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFRva2VuRXJyb3IoYEludmFsaWQgdG9rZW4gc3BlY2lmaWVkOiBpbnZhbGlkIGpzb24gZm9yIHBhcnQgIyR7cG9zICsgMX0gKCR7ZS5tZXNzYWdlfSlgKTtcbiAgICB9XG59XG4vKipcbiAqIGNyZWF0ZSBhXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGVWZXJpZmllcigpIHtcbiAgICByZXR1cm4gcmFuZG9tQnl0ZXMoMzIpLnRvU3RyaW5nKCdiYXNlNjR1cmwnKTtcbn1cbi8qKlxuICogR2VuZXJhdGUgYSBjb2RlIGNoYWxsZW5nZSBmcm9tIHRoZSBjb2RlIHZlcmlmaWVyXG4gKiBAcGFyYW0gY29kZVZlcmlmaWVyXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhhc2goJ3NoYTI1NicpXG4gICAgICAgIC51cGRhdGUoY29kZVZlcmlmaWVyKVxuICAgICAgICAuZGlnZXN0KCdiYXNlNjR1cmwnKTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlUEtDRSgpIHtcbiAgICBjb25zdCBjb2RlVmVyaWZpZXIgPSBnZW5lcmF0ZUNvZGVWZXJpZmllcigpO1xuICAgIGNvbnN0IGNvZGVDaGFsbGVuZ2UgPSBnZW5lcmF0ZUNvZGVDaGFsbGVuZ2UoY29kZVZlcmlmaWVyKTtcbiAgICByZXR1cm4geyBjb2RlVmVyaWZpZXIsIGNvZGVDaGFsbGVuZ2UgfTtcbn1cblxuY29uc3QgQVBQX1VSTCA9ICdodHRwczovL2FscGhhLm90aGVyLnBhZ2UnO1xuY29uc3QgQVBJX1VSTCA9ICdodHRwczovL2FscGhhLWFwaS5vdGhlci5wYWdlL3YxJztcbmNvbnN0IGdldFNlc3Npb24gPSBhc3luYyAocmVxLCByZXMsIC8vIFNlcnZlclJlc3BvbnNlPEluY29taW5nTWVzc2FnZT4sXG5zZXNzaW9uQ29uZmlnKSA9PiB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IChhd2FpdCBnZXRJcm9uU2Vzc2lvbihyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZykpO1xuICAgIHJldHVybiBzZXNzaW9uO1xufTtcbmNvbnN0IGxvZ291dFJvdXRlID0gYXN5bmMgKHJlcSwgcmVzLCBzZXNzaW9uQ29uZmlnLCBhZnRlckNhbGxiYWNrKSA9PiB7XG4gICAgc3dpdGNoIChyZXEubWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ0dFVCc6XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbihyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZyk7XG4gICAgICAgICAgICBzZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGlmIChhZnRlckNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgYWZ0ZXJDYWxsYmFjayhyZXEsIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydHRVQnXSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn07XG5jb25zdCBub25jZVJvdXRlID0gYXN5bmMgKHJlcSwgcmVzLCBzZXNzaW9uQ29uZmlnLCBhZnRlckNhbGxiYWNrKSA9PiB7XG4gICAgc3dpdGNoIChyZXEubWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ0dFVCc6XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbihyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoIXNlc3Npb24ubm9uY2UpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLm5vbmNlID0gZ2VuZXJhdGVTaXdlTm9uY2UoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBzZXNzaW9uLnNhdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhZnRlckNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgYWZ0ZXJDYWxsYmFjayhyZXEsIHJlcywgc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMuc2VuZChzZXNzaW9uLm5vbmNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ0dFVCddKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gICAgfVxufTtcbmNvbnN0IHBrY2VSb3V0ZSA9IGFzeW5jIChyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZywgYWZ0ZXJDYWxsYmFjaykgPT4ge1xuICAgIHN3aXRjaCAocmVxLm1ldGhvZCkge1xuICAgICAgICBjYXNlICdHRVQnOlxuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24ocmVxLCByZXMsIHNlc3Npb25Db25maWcpO1xuICAgICAgICAgICAgaWYgKCFzZXNzaW9uLmNvZGVWZXJpZmllcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY29kZUNoYWxsZW5nZSwgY29kZVZlcmlmaWVyIH0gPSBhd2FpdCBnZW5lcmF0ZVBLQ0UoKTtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmNvZGVWZXJpZmllciA9IGNvZGVWZXJpZmllcjtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmNvZGVDaGFsbGVuZ2UgPSBjb2RlQ2hhbGxlbmdlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHNlc3Npb24uc2F2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFmdGVyQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBhZnRlckNhbGxiYWNrKHJlcSwgcmVzLCBzZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcy5zZW5kKHsgY29kZUNoYWxsZW5nZTogc2Vzc2lvbi5jb2RlQ2hhbGxlbmdlIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgICB9XG59O1xuY29uc3Qgc2Vzc2lvblJvdXRlID0gYXN5bmMgKHJlcSwgcmVzLCBzZXNzaW9uQ29uZmlnLCBhZnRlckNhbGxiYWNrKSA9PiB7XG4gICAgc3dpdGNoIChyZXEubWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ0dFVCc6XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbihyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGFmdGVyQ2FsbGJhY2socmVxLCByZXMsIHNlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzLnNlbmQoc2Vzc2lvbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydHRVQnXSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICAgIH1cbn07XG5jb25zdCB2ZXJpZnlDb2RlUm91dGUgPSBhc3luYyAocmVxLCByZXMsIHNlc3Npb25Db25maWcsIGNvbmZpZywgYWZ0ZXJDYWxsYmFjaykgPT4ge1xuICAgIHN3aXRjaCAocmVxLm1ldGhvZCkge1xuICAgICAgICBjYXNlICdQT1NUJzpcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gZmV0Y2ggY3VycmVudCBzZXNzaW9uXG4gICAgICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24ocmVxLCByZXMsIHNlc3Npb25Db25maWcpO1xuICAgICAgICAgICAgICAgIC8vIGZldGNoIGFjY2VzcyB0b2tlblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7Y29uZmlnID09PSBudWxsIHx8IGNvbmZpZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29uZmlnLmF1dGhBcGlVcmx9L2Nvbm5lY3Qvb2F1dGgyLXRva2VuYCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2F1dGhvcml6YXRpb25fY29kZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiByZXEuYm9keS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZV92ZXJpZmllcjogc2Vzc2lvbi5jb2RlVmVyaWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdWQ6IGNvbmZpZyA9PT0gbnVsbCB8fCBjb25maWcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbmZpZy5hdWRpZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudF9pZDogY29uZmlnID09PSBudWxsIHx8IGNvbmZpZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29uZmlnLmNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50X3NlY3JldDogY29uZmlnID09PSBudWxsIHx8IGNvbmZpZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29uZmlnLmNsaWVudFNlY3JldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0X3VyaTogY29uZmlnID09PSBudWxsIHx8IGNvbmZpZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29uZmlnLnJlZGlyZWN0VXJpLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGFjY2VzcyB0b2tlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5hY2Nlc3NfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5lbmQoJ1VuYWJsZSB0byBmZXRjaCBhY2Nlc3MgdG9rZW4uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHBlcnNpc3Qgc2Vzc2lvbiBkYXRhXG4gICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IGp3dERlY29kZShkYXRhLmFjY2Vzc190b2tlbik7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5hZGRyZXNzID0gZGVjb2RlZC53YWxsZXQ7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbi51aWQgPSBkZWNvZGVkLnN1YjtcbiAgICAgICAgICAgICAgICBhd2FpdCBzZXNzaW9uLnNhdmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoYWZ0ZXJDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBhZnRlckNhbGxiYWNrKHJlcSwgcmVzLCBzZXNzaW9uLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVjb2RlZF9hY2Nlc3NfdG9rZW46IGRlY29kZWQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKFN0cmluZyhlcnJvcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gICAgfVxufTtcbmNvbnN0IGVudlZhciA9IChuYW1lKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm9jZXNzLmVudltuYW1lXTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbnZpcm9ubWVudCB2YXJpYWJsZTogJHtuYW1lfWApO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuY29uc3QgY29uZmlndXJlU2VydmVyU2lkZVNJV09QID0gKHsgY29uZmlnLCBzZXNzaW9uOiB7IGNvb2tpZU5hbWUsIHBhc3N3b3JkLCBjb29raWVPcHRpb25zLCAuLi5vdGhlclNlc3Npb25PcHRpb25zIH0gPSB7fSwgb3B0aW9uczogeyBhZnRlck5vbmNlLCBhZnRlclRva2VuLCBhZnRlclNlc3Npb24sIGFmdGVyTG9nb3V0IH0gPSB7fSwgfSkgPT4ge1xuICAgIGNvbmZpZy5hdXRoQXBpVXJsID0gY29uZmlnLmF1dGhBcGlVcmwgfHwgQVBJX1VSTDtcbiAgICBjb25zdCBzZXNzaW9uQ29uZmlnID0ge1xuICAgICAgICBjb29raWVOYW1lOiBjb29raWVOYW1lICE9PSBudWxsICYmIGNvb2tpZU5hbWUgIT09IHZvaWQgMCA/IGNvb2tpZU5hbWUgOiAnb3Bjb25uZWN0LW5leHQtc2l3b3AnLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQgIT09IG51bGwgJiYgcGFzc3dvcmQgIT09IHZvaWQgMCA/IHBhc3N3b3JkIDogZW52VmFyKCdTRVNTSU9OX1NFQ1JFVCcpLFxuICAgICAgICBjb29raWVPcHRpb25zOiB7XG4gICAgICAgICAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgICAgICAgICAuLi4oY29va2llT3B0aW9ucyAhPT0gbnVsbCAmJiBjb29raWVPcHRpb25zICE9PSB2b2lkIDAgPyBjb29raWVPcHRpb25zIDoge30pLFxuICAgICAgICB9LFxuICAgICAgICAuLi5vdGhlclNlc3Npb25PcHRpb25zLFxuICAgIH07XG4gICAgY29uc3QgYXBpUm91dGVIYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGlmICghKHJlcS5xdWVyeS5yb3V0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYXRjaC1hbGwgcXVlcnkgcGFyYW0gYHJvdXRlYCBub3QgZm91bmQuIFNJV09QIEFQSSBwYWdlIHNob3VsZCBiZSBuYW1lZCBgWy4uLnJvdXRlXS50c2AgYW5kIHdpdGhpbiB5b3VyIGBwYWdlcy9hcGlgIGRpcmVjdG9yeS4nKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZSA9IHJlcS5xdWVyeS5yb3V0ZS5qb2luKCcvJyk7XG4gICAgICAgIHN3aXRjaCAocm91dGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ25vbmNlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgbm9uY2VSb3V0ZShyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZywgYWZ0ZXJOb25jZSk7XG4gICAgICAgICAgICBjYXNlICdwa2NlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcGtjZVJvdXRlKHJlcSwgcmVzLCBzZXNzaW9uQ29uZmlnLCBhZnRlck5vbmNlKTtcbiAgICAgICAgICAgIGNhc2UgJ3ZlcmlmeSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHZlcmlmeUNvZGVSb3V0ZShyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZywgY29uZmlnLCBhZnRlclRva2VuKTtcbiAgICAgICAgICAgIGNhc2UgJ3Nlc3Npb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBzZXNzaW9uUm91dGUocmVxLCByZXMsIHNlc3Npb25Db25maWcsIGFmdGVyU2Vzc2lvbik7XG4gICAgICAgICAgICBjYXNlICdsb2dvdXQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBsb2dvdXRSb3V0ZShyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZywgYWZ0ZXJMb2dvdXQpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmVuZCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBhcGlSb3V0ZUhhbmRsZXIsXG4gICAgICAgIGdldFNlc3Npb246IGFzeW5jIChyZXEsIHJlcykgPT4gYXdhaXQgZ2V0U2Vzc2lvbihyZXEsIHJlcywgc2Vzc2lvbkNvbmZpZyksXG4gICAgfTtcbn07XG5jb25zdCBjb25maWd1cmVDbGllbnRTSVdPUCA9ICh7IGFwcFVybCwgYXBpUm91dGVQcmVmaXgsIGNsaWVudElkLCByZWRpcmVjdFVyaSwgc2NvcGUsIH0pID0+IHtcbiAgICBjb25zdCBOZXh0U0lXT1BQcm92aWRlciA9IChwcm9wcykgPT4ge1xuICAgICAgICBjb25zdCBVUkwgPSBhcHBVcmwgfHwgQVBQX1VSTDtcbiAgICAgICAgcmV0dXJuIChqc3goU0lXT1BQcm92aWRlciwgeyBjbGllbnRJZDogY2xpZW50SWQsIHJlZGlyZWN0VXJpOiByZWRpcmVjdFVyaSwgc2NvcGU6IHNjb3BlLCBnZXROb25jZTogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2FwaVJvdXRlUHJlZml4fS9ub25jZWApO1xuICAgICAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIFNJV09QIG5vbmNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG5vbmNlID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9uY2U7XG4gICAgICAgICAgICB9LCBnZW5lcmF0ZVBLQ0U6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHthcGlSb3V0ZVByZWZpeH0vcGtjZWAsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBnZW5lcmF0ZSBQS0NFJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgfSwgY3JlYXRlQXV0aG9yaXphdGlvblVybDogKHsgbm9uY2UsIGFkZHJlc3MsIGNvZGVfY2hhbGxlbmdlIH0pID0+IGAke1VSTH0vY29ubmVjdD9jbGllbnRfaWQ9JHtjbGllbnRJZH0mc2NvcGU9JHtzY29wZS5yZXBsYWNlKCcgJywgJysnKX0mcmVzcG9uc2VfdHlwZT1jb2RlJnJlZGlyZWN0X3VyaT0ke2VuY29kZVVSSUNvbXBvbmVudChyZWRpcmVjdFVyaSl9JnN0YXRlPSR7bm9uY2V9JndhbGxldD0ke2FkZHJlc3N9JmNvZGVfY2hhbGxlbmdlPSR7Y29kZV9jaGFsbGVuZ2V9JmNvZGVfY2hhbGxlbmdlX21ldGhvZD1TMjU2YCwgdmVyaWZ5Q29kZTogKHsgY29kZSB9KSA9PiBmZXRjaChgJHthcGlSb3V0ZVByZWZpeH0vdmVyaWZ5YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY29kZSB9KSxcbiAgICAgICAgICAgIH0pLnRoZW4oKHIpID0+IHIub2spLCBnZXRTZXNzaW9uOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7YXBpUm91dGVQcmVmaXh9L3Nlc3Npb25gKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBTSVdPUCBzZXNzaW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgYWRkcmVzcywgbm9uY2UsIHVpZCwgY2hhaW5JZCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRkcmVzcyA/IHsgYWRkcmVzcywgbm9uY2UsIHVpZCwgY2hhaW5JZCB9IDogbnVsbDtcbiAgICAgICAgICAgIH0sIHNpZ25PdXQ6ICgpID0+IGZldGNoKGAke2FwaVJvdXRlUHJlZml4fS9sb2dvdXRgKS50aGVuKChyZXMpID0+IHJlcy5vayksIC4uLnByb3BzIH0pKTtcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIFByb3ZpZGVyOiBOZXh0U0lXT1BQcm92aWRlcixcbiAgICB9O1xufTtcblxuZXhwb3J0IHsgY29uZmlndXJlQ2xpZW50U0lXT1AsIGNvbmZpZ3VyZVNlcnZlclNpZGVTSVdPUCB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../packages/opconnect-next-siwop/build/index.es.js\n"));

/***/ })

});