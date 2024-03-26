/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 *
 * To see the difference, delete this file, then navigate to `private/nested`
 * from the homepage link while logged out. You will be able to access the page
 * because it isn't dynamic, and `hooks.server.ts` is never triggered.
 */
