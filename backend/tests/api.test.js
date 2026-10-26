/**
 * Integration tests for the Nexora API (real Express app + real MongoDB, Stream mocked off).
 *
 * Run:  TEST_MONGO_URI=mongodb://127.0.0.1:27017/nexora_test npm test
 * Safety: the database name MUST end in "_test" - the suite wipes it when it finishes.
 */
import { before, after, describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const TEST_URI = process.env.TEST_MONGO_URI;
if (!TEST_URI || !/\/[^/?]*_test(\?|$)/.test(TEST_URI)) {
  console.error('Set TEST_MONGO_URI to a database whose name ends in "_test".');
  process.exit(1);
}

const SECRET = crypto.randomBytes(32).toString("hex");
Object.assign(process.env, {
  NODE_ENV: "test",
  MONGO_URI: TEST_URI,
  JWT_SECRET_KEY: SECRET,
  STREAM_API_KEY: "test_key",
  STREAM_API_SECRET: "test_secret_" + "x".repeat(20),
  CLIENT_URL: "https://nexora-example.vercel.app",
});

const mongoose = (await import("mongoose")).default;
const { createApp } = await import("../src/app.js");

let server, base;
const startApp = (opts) =>
  new Promise((resolve) => {
    const s = createApp(opts).listen(0, () => resolve(s));
  });

async function call(method, path, { body, cookie, headers = {}, url = base } = {}) {
  const res = await fetch(url + path, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not json */
  }
  return { status: res.status, json, text, headers: res.headers };
}
const cookieOf = (r) => (r.headers.get("set-cookie") || "").split(";")[0] || null;

const tag = crypto.randomBytes(4).toString("hex");
const A = { email: `alice_${tag}@example.com`, password: "secret123", fullName: "Alice Test" };
const B = { email: `bob_${tag}@example.com`, password: "secret123", fullName: "Bob Test" };
const profile = (name) => ({
  fullName: name,
  role: "Designer",
  interests: ["Music", "Coding"],
  bio: `bio of ${name}`,
  location: "Hyderabad",
});
const state = {};

before(async () => {
  await mongoose.connect(TEST_URI);
  await mongoose.connection.dropDatabase();
  server = await startApp({ loginLimit: 1000, signupLimit: 1000 });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server?.close();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("signup / login / session", () => {
  it("signup returns 201, a cookie, and NO password hash", async () => {
    const r = await call("POST", "/api/auth/signup", { body: A });
    assert.equal(r.status, 201);
    assert.ok(!r.text.includes("$2"), "bcrypt hash leaked");
    assert.equal(r.json.user.password, undefined);
    state.cookieA = cookieOf(r);
    state.idA = r.json.user._id;
    assert.ok(state.cookieA.startsWith("jwt="));
  });

  it("default avatar is seeded with the user id, never the email", async () => {
    const r = await call("GET", "/api/auth/me", { cookie: state.cookieA });
    assert.ok(r.json.user.profilePic.includes(state.idA));
    assert.ok(!decodeURIComponent(r.json.user.profilePic).includes("@"));
  });

  it("login returns no password hash and sets an HttpOnly cookie", async () => {
    const r = await call("POST", "/api/auth/login", { body: { email: A.email, password: A.password } });
    assert.equal(r.status, 200);
    assert.ok(!r.text.includes("$2"));
    assert.match(r.headers.get("set-cookie"), /HttpOnly/i);
  });

  it("wrong password and unknown email both give the same 401", async () => {
    const r1 = await call("POST", "/api/auth/login", { body: { email: A.email, password: "nope-nope" } });
    const r2 = await call("POST", "/api/auth/login", { body: { email: "ghost@example.com", password: "nope-nope" } });
    assert.equal(r1.status, 401);
    assert.deepEqual(r1.json, r2.json);
  });

  it("duplicate email is rejected, case-insensitively", async () => {
    const r = await call("POST", "/api/auth/signup", { body: { ...A, email: A.email.toUpperCase() } });
    assert.equal(r.status, 400);
  });

  it("logout clears the cookie", async () => {
    const r = await call("POST", "/api/auth/logout");
    assert.equal(r.status, 200);
    assert.match(r.headers.get("set-cookie"), /jwt=;/);
  });
});

describe("authentication robustness", () => {
  const bad = (name, token) =>
    it(`${name} -> 401 (not 500)`, async () => {
      const r = await call("GET", "/api/auth/me", { cookie: `jwt=${token}` });
      assert.equal(r.status, 401);
    });
  bad("expired token", () => jwt.sign({ userId: "x" }, SECRET, { expiresIn: -10 }));
  bad("garbage token", "garbage.token.value");
  bad("token signed with another key", jwt.sign({ userId: "x" }, "another-secret-another-secret-123"));

  it("expired token (real user) -> 401", async () => {
    const t = jwt.sign({ userId: state.idA }, SECRET, { expiresIn: -10 });
    assert.equal((await call("GET", "/api/auth/me", { cookie: `jwt=${t}` })).status, 401);
  });

  for (const path of ["/api/auth/me", "/api/users", "/api/users/friends", "/api/chat/token"]) {
    it(`${path} without a cookie -> 401`, async () => {
      assert.equal((await call("GET", path)).status, 401);
    });
  }
});

describe("input validation", () => {
  const cases = [
    ["login with operator objects", "/api/auth/login", { email: { $ne: null }, password: { $ne: null } }],
    ["login with object password", "/api/auth/login", { email: A.email, password: { $ne: "x" } }],
    ["signup with numeric password", "/api/auth/signup", { email: `n_${tag}@example.com`, password: 123456789, fullName: "N" }],
    ["signup with array email", "/api/auth/signup", { email: ["a@b.co"], password: "secret123", fullName: "A" }],
    ["signup with 5000-char name", "/api/auth/signup", { email: `l_${tag}@example.com`, password: "secret123", fullName: "N".repeat(5000) }],
    ["signup with 100-char password", "/api/auth/signup", { email: `p_${tag}@example.com`, password: "p".repeat(100), fullName: "P" }],
    ["signup with bad email", "/api/auth/signup", { email: "not-an-email", password: "secret123", fullName: "P" }],
  ];
  for (const [name, path, body] of cases) {
    it(`${name} -> 400`, async () => {
      assert.equal((await call("POST", path, { body })).status, 400);
    });
  }

  it("malformed JSON -> 400 JSON error without a stack trace", async () => {
    const res = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json",
    });
    assert.equal(res.status, 400);
    assert.ok(!(await res.text()).includes(" at "));
  });

  it("oversized body -> 413", async () => {
    const r = await call("POST", "/api/auth/login", { body: { email: "a@b.co", password: "x".repeat(20000) } });
    assert.equal(r.status, 413);
  });

  it("unknown API path -> JSON 404", async () => {
    const r = await call("GET", "/api/nope");
    assert.equal(r.status, 404);
    assert.ok(r.json?.message);
  });
});

describe("onboarding", () => {
  before(async () => {
    const r = await call("POST", "/api/auth/signup", { body: B });
    state.cookieB = cookieOf(r);
    state.idB = r.json.user._id;
    const login = await call("POST", "/api/auth/login", { body: { email: A.email, password: A.password } });
    state.cookieA = cookieOf(login);
  });

  const badProfile = [
    ["javascript: URL", { profilePic: "javascript:alert(1)" }],
    ["plain http URL", { profilePic: "http://example.com/a.png" }],
    ["data: URL", { profilePic: "data:image/png;base64,AAAA" }],
    ["object fullName", { fullName: { a: 1 } }],
    ["unknown role", { role: "Wizard" }],
    ["unknown interest", { interests: ["Knitting"] }],
    ["interests not an array", { interests: "Music" }],
    ["bio over 250 chars", { bio: "b".repeat(251) }],
  ];
  for (const [name, patch] of badProfile) {
    it(`rejects ${name} (400)`, async () => {
      const r = await call("POST", "/api/auth/onboarding", { cookie: state.cookieA, body: { ...profile("Alice"), ...patch } });
      assert.equal(r.status, 400);
    });
  }

  it("saves role, interests, bio, location and avatar consistently", async () => {
    const pic = "https://api.dicebear.com/10.x/avataaars/svg?seed=custom";
    const r = await call("POST", "/api/auth/onboarding", {
      cookie: state.cookieA,
      body: { ...profile("Alice Test"), profilePic: pic },
    });
    assert.equal(r.status, 200);
    assert.deepEqual(
      { role: r.json.user.role, interests: r.json.user.interests, bio: r.json.user.bio, location: r.json.user.location, profilePic: r.json.user.profilePic, isOnboarded: r.json.user.isOnboarded },
      { role: "Designer", interests: ["Music", "Coding"], bio: "bio of Alice Test", location: "Hyderabad", profilePic: pic, isOnboarded: true }
    );
    assert.equal((await call("POST", "/api/auth/onboarding", { cookie: state.cookieB, body: profile("Bob Test") })).status, 200);
  });

  it("keeps the existing avatar when none is sent", async () => {
    const before = (await call("GET", "/api/auth/me", { cookie: state.cookieB })).json.user.profilePic;
    await call("POST", "/api/auth/onboarding", { cookie: state.cookieB, body: profile("Bob Test") });
    const after = (await call("GET", "/api/auth/me", { cookie: state.cookieB })).json.user.profilePic;
    assert.equal(before, after);
  });
});

describe("discovery and friends", () => {
  it("recommended users expose only public profile fields", async () => {
    const r = await call("GET", "/api/users", { cookie: state.cookieA });
    assert.equal(r.status, 200);
    assert.equal(r.json.length, 1);
    assert.ok(!/\$2|@example\.com/.test(r.text), "email or hash leaked");
    assert.deepEqual(Object.keys(r.json[0]).sort(), ["_id", "bio", "fullName", "interests", "location", "profilePic", "role"]);
  });

  it("friend-request edge cases", async () => {
    const q = (p, c = state.cookieA, m = "POST") => call(m, p, { cookie: c });
    assert.equal((await q(`/api/users/friend-request/${state.idA}`)).status, 400, "self");
    assert.equal((await q("/api/users/friend-request/not-an-id")).status, 400, "malformed id");
    assert.equal((await q("/api/users/friend-request/abcdefghijkl")).status, 400, "12-char junk id");
    assert.equal((await q(`/api/users/friend-request/${"0".repeat(24)}`)).status, 404, "unknown id");
    assert.equal((await q(`/api/users/friend-request/${state.idB}`)).status, 201, "send");
    assert.equal((await q(`/api/users/friend-request/${state.idB}`)).status, 400, "duplicate");
    assert.equal((await q(`/api/users/friend-request/${state.idA}`, state.cookieB)).status, 400, "reverse duplicate");
  });

  it("only the recipient may accept; bad ids are 400", async () => {
    const inc = await call("GET", "/api/users/friend-requests", { cookie: state.cookieB });
    state.reqId = inc.json.incomingReqs[0]._id;
    assert.deepEqual(Object.keys(inc.json.incomingReqs[0].sender).sort(), ["_id", "fullName", "location", "profilePic", "role"]);
    assert.equal((await call("PUT", `/api/users/friend-request/${state.reqId}/accept`, { cookie: state.cookieA })).status, 403);
    assert.equal((await call("PUT", "/api/users/friend-request/garbage/accept", { cookie: state.cookieB })).status, 400);
    assert.equal((await call("PUT", `/api/users/friend-request/${state.reqId}/accept`, { cookie: state.cookieB })).status, 200);
  });

  it("friends list carries role, interests, bio and location for FriendCard", async () => {
    for (const [cookie, other] of [[state.cookieA, "Bob Test"], [state.cookieB, "Alice Test"]]) {
      const r = await call("GET", "/api/users/friends", { cookie });
      assert.equal(r.json.length, 1);
      const f = r.json[0];
      assert.equal(f.fullName, other);
      assert.equal(f.role, "Designer");
      assert.deepEqual(f.interests, ["Music", "Coding"]);
      assert.ok(f.bio && f.location);
      assert.ok(!/\$2|@example\.com/.test(r.text));
    }
  });

  it("friends disappear from discovery after accepting", async () => {
    assert.equal((await call("GET", "/api/users", { cookie: state.cookieA })).json.length, 0);
  });
});

describe("stream token", () => {
  it("is signed for the authenticated user's own id", async () => {
    const r = await call("GET", "/api/chat/token", { cookie: state.cookieA });
    assert.equal(r.status, 200);
    assert.equal(jwt.decode(r.json.token).user_id, state.idA);
    assert.ok(jwt.verify(r.json.token, process.env.STREAM_API_SECRET), "signed with the Stream secret");
  });
});

describe("CORS, CSRF origin check, cookies", () => {
  const acao = async (origin) => (await call("GET", "/api/health", { headers: { Origin: origin } })).headers.get("access-control-allow-origin");

  it("allows the configured production origin and dev origins only", async () => {
    assert.equal(await acao("https://nexora-example.vercel.app"), "https://nexora-example.vercel.app");
    assert.equal(await acao("https://evil.example"), null);
  });

  it("blocks state-changing requests from a foreign Origin (CSRF)", async () => {
    const r = await call("POST", `/api/users/friend-request/${state.idB}`, { cookie: state.cookieA, headers: { Origin: "https://evil.example" } });
    assert.equal(r.status, 403);
  });

  it("allows state-changing requests from the real frontend origin", async () => {
    const r = await call("POST", "/api/auth/logout", { headers: { Origin: "https://nexora-example.vercel.app" } });
    assert.equal(r.status, 200);
  });

  it("health endpoint is public and reveals nothing", async () => {
    const r = await call("GET", "/api/health");
    assert.deepEqual(r.json, { status: "ok" });
    assert.equal(r.headers.get("x-powered-by"), null);
  });
});

describe("brute-force protection", () => {
  it("throttles repeated failed logins with 429 but not successful ones", async () => {
    const s = await startApp({ loginLimit: 5 });
    const url = `http://127.0.0.1:${s.address().port}`;
    try {
      for (let i = 0; i < 8; i++) {
        const ok = await call("POST", "/api/auth/login", { url, body: { email: A.email, password: A.password } });
        assert.equal(ok.status, 200, "successful logins are never throttled");
      }
      const codes = [];
      for (let i = 0; i < 8; i++) codes.push((await call("POST", "/api/auth/login", { url, body: { email: A.email, password: "wrong-" + i } })).status);
      assert.ok(codes.includes(429), `expected a 429 in ${codes}`);
      assert.deepEqual(codes.slice(0, 5), [401, 401, 401, 401, 401]);
    } finally {
      s.close();
    }
  });
});
