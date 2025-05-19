const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

const codes = {};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const code = crypto.randomInt(100000, 999999).toString();
  codes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };

  const msg = {
    to: email,
    from: 'no-reply@wildermindmanagement.co',
    subject: 'Your AI Marketing Playbook Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>Enter it to unlock the AI Marketing Agency Playbook.</p>`
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
