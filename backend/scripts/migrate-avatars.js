/**
 * One-off, NON-destructive avatar clean-up for existing users.
 *
 * Finds profilePic values that are either
 *   (a) from the retired avatar.iran.liara.run provider (the source of the 502 on 74.png), or
 *   (b) DiceBear URLs seeded with an e-mail address (which leaks the e-mail to anyone who sees the URL),
 * and replaces them with a DiceBear URL seeded by the user's database id.
 *
 * It only touches the profilePic field. It never deletes a user or any other field.
 *
 *   node scripts/migrate-avatars.js                 -> DRY RUN: prints what would change, writes nothing
 *   node scripts/migrate-avatars.js --apply         -> writes the changes
 *   node scripts/migrate-avatars.js --apply --sync-stream   -> also refreshes the avatar inside Stream
 *
 * Uses MONGO_URI from the environment / .env. Take a database backup before using --apply.
 */
import mongoose from "mongoose";
import { config, getConfigProblems } from "../src/lib/env.js";
import User from "../src/models/User.js";
import { buildDefaultAvatarUrl } from "../src/lib/validation.js";
import { describeStreamError, upsertStreamUser } from "../src/lib/stream.js";

const apply = process.argv.includes("--apply");
const syncStream = process.argv.includes("--sync-stream");

if (!config.mongoUri) {
  console.error("MONGO_URI is not set.");
  process.exit(1);
}
if (syncStream && !apply) {
  console.error("--sync-stream only makes sense together with --apply.");
  process.exit(1);
}
if (syncStream) {
  const streamProblems = getConfigProblems().filter((p) => p.startsWith("STREAM_"));
  if (streamProblems.length) {
    console.error(streamProblems.join("\n"));
    process.exit(1);
  }
}

const seedOf = (url) => {
  try {
    return new URL(url).searchParams.get("seed") || "";
  } catch {
    return "";
  }
};

const needsMigration = (url) => {
  if (typeof url !== "string" || !url) return null;
  if (url.includes("avatar.iran.liara.run")) return "retired avatar provider";
  if (url.includes("api.dicebear.com") && seedOf(url).includes("@")) return "e-mail used as avatar seed";
  return null;
};

await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
console.log(`${apply ? "APPLY" : "DRY RUN"} - connected to database "${mongoose.connection.name}"`);

const candidates = await User.find({ profilePic: { $regex: "iran\\.liara\\.run|dicebear" } }).select("fullName profilePic");
let changed = 0;
let streamFailures = 0;

for (const user of candidates) {
  const reason = needsMigration(user.profilePic);
  if (!reason) continue;

  const next = buildDefaultAvatarUrl(user._id);
  console.log(`- ${user._id} (${reason})`);

  if (!apply) continue;

  await User.updateOne({ _id: user._id }, { $set: { profilePic: next } });
  changed += 1;

  if (syncStream) {
    try {
      await upsertStreamUser({ id: user._id.toString(), name: user.fullName, image: next });
    } catch (error) {
      streamFailures += 1;
      console.error(`  Stream sync failed for ${user._id}: ${describeStreamError(error)}`);
    }
  }
}

const found = candidates.filter((u) => needsMigration(u.profilePic)).length;
console.log(
  apply
    ? `Done. Updated ${changed} of ${found} matching users${syncStream ? `, ${streamFailures} Stream sync failures` : ""}.`
    : `Dry run finished. ${found} user(s) would be updated. Re-run with --apply to write.`
);

await mongoose.disconnect();
