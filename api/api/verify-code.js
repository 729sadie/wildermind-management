const codes = {};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code required' });
  }

  const stored = codes[email];
  if (!stored || stored.expires < Date.now()) {
    return res.status(400).json({ error: 'Code expired or invalid' });
  }

  if (stored.code === code) {
    delete codes[email];
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
};
