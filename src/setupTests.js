import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "./mocks/server";

const DEBUG_SERVER = true;

if (DEBUG_SERVER) {
  // server.events.on('request:start', (req) => {
  //   console.log(req.method, req.url.href);
  // });
  // server.events.on('request:match', (req) => {
  //   console.log('%s %s has a handler!', req.method, req.url.href);
  // });
  server.events.on("request:unhandled", (req) => {
    console.log("%s %s has no handler", req.method, req.url.href);
  });
  // server.events.on('request:end', (req) => {
  //   console.log('%s %s ended', req.method, req.url.href);
  // });
}
// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
