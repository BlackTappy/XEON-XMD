import axios from 'axios';
import config from '../../config.cjs';

const sessionGen = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const senderName = m.pushName || 'User';

  if (cmd !== 'pair') return;

  if (!text || !/^\+?\d{9,15}$/.test(text)) {
    await sock.sendMessage(m.from, {
      text: `🔴 *Invalid Format!*\n\n🟢 Example: *.pair +254759000340*`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐗ҽσɳ-𝐗ƚҽƈ𝐡",
          newsletterJid: "120363369453603973@newsletter",
        },
      },
    }, { quoted: m });
    return;
  }

  try {
    const response = await axios.get(`https://xeon-xtech-pair-case.onrender.com/pair?number=${encodeURIComponent(text)}`);
    const { code } = response.data;

    if (!code) throw new Error("😕 No code returned");

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/8k0enh.jpg' },
      caption: `🟢 *Pairing Code Generated!*\n\n👤 Number: ${text}\n🔐 Code: *${code}*\n\nUse this on your bot plugins or CLI to connect the number.`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐗ҽσɳ-𝐗ƚҽƈ𝐡",
          newsletterJid: "120363369453603973@newsletter",
        },
      },
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    await sock.sendMessage(m.from, {
      text: `🔴 *Failed to generate pairing code.*\n\nReason: ${err.response?.data?.error || err.message}`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐗ҽσɳ-𝐗ƚҽƈ𝐡",
          newsletterJid: "120363369453603973@newsletter",
        },
      },
    }, { quoted: m });
  }
};

export default sessionGen;
