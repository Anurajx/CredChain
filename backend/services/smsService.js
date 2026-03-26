const hasTwilioCredentials =
  !!process.env.TWILIO_ACCOUNT_SID &&
  !!process.env.TWILIO_AUTH_TOKEN &&
  !!process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;
let Twilio = null;

if (hasTwilioCredentials) {
  // Twilio import only lives in this helper (never in server.js).
  Twilio = require("twilio");
  twilioClient = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/**
 * Send a single SMS.
 * - Never throws; always resolves with a result object.
 * - If Twilio isn't configured, logs a warning and resolves silently.
 */
async function sendSMS(to, message) {
  const phone = String(to || "").trim();
  if (!phone) {
    return { to: phone, sent: false, reason: "Empty recipient" };
  }

  if (!twilioClient) {
    console.warn(
      "Twilio not configured. Skipping SMS send.",
      `to=${phone}`
    );
    return { to: phone, sent: false, reason: "Twilio not configured" };
  }

  try {
    const from = process.env.TWILIO_PHONE_NUMBER;
    const sms = await twilioClient.messages.create({
      from,
      to: phone,
      body: message,
    });

    console.log("SMS sent successfully", { to: phone, sid: sms.sid });
    return { to: phone, sent: true, sid: sms.sid };
  } catch (err) {
    console.error("SMS send failed", { to: phone, error: err?.message || err });
    return {
      to: phone,
      sent: false,
      reason: err?.message || "SMS send failed",
    };
  }
}

/**
 * Sends SMS to all non-empty contact numbers.
 * emergencyContacts is expected to be an array of 2 objects:
 * [{ name, relationship, phone1, phone2 }, { ... }]
 *
 * Returns an array of results (one per attempted number).
 */
async function sendSMSToAllContacts(emergencyContacts, message) {
  const contacts = Array.isArray(emergencyContacts)
    ? emergencyContacts
    : [{}, {}];

  const c1 = contacts[0] || {};
  const c2 = contacts[1] || {};

  const phones = [c1.phone1, c1.phone2, c2.phone1, c2.phone2]
    .map((p) => (p == null ? "" : String(p).trim()))
    .filter(Boolean);

  // Fire sends sequentially (safe + easier logging).
  const results = [];
  for (const to of phones) {
    // sendSMS never throws.
    // eslint-disable-next-line no-await-in-loop
    const result = await sendSMS(to, message);
    results.push(result);
  }

  return results;
}

module.exports = { sendSMS, sendSMSToAllContacts };

