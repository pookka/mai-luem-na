const { kv } = require('@vercel/kv');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const email = ((req.body && req.body.email) || '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  try {
    await kv.sadd('subscribers', email);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error', err);
    return res.status(500).json({ error: 'server_error' });
  }
};
