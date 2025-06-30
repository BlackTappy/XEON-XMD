import _0x3e6f20 from 'axios';
import _0x3fa887 from '../../config.cjs';
const chatbotcommand = async (_0x510964, _0x4ebc10) => {
  const _0x121b1b = await _0x4ebc10.decodeJid(_0x4ebc10.user.id);
  const _0x76dda8 = [_0x121b1b, _0x3fa887.OWNER_NUMBER + "@s.whatsapp.net"].includes(_0x510964.sender);
  const _0x9f8296 = _0x3fa887.PREFIX;
  const _0x1c7b5a = _0x510964.body.startsWith(_0x9f8296) ? _0x510964.body.slice(_0x9f8296.length).split(" ")[0x0].toLowerCase() : '';
  const _0x1afcea = _0x510964.body.slice(_0x9f8296.length + _0x1c7b5a.length).trim();
  if (_0x1c7b5a === 'chatbot') {
    if (!_0x76dda8) {
      return _0x510964.reply("😂 *Access Denied*\n_Only bot owner can toggle this feature._");
    }
    let _0x28323e;
    if (_0x1afcea === 'on') {
      _0x3fa887.CHATBOT = true;
      _0x28323e = "🟢 Chatbot has been *enabled*. I'm now live!";
    } else if (_0x1afcea === 'off') {
      _0x3fa887.CHATBOT = false;
      _0x28323e = "🔴 Chatbot has been *disabled*. I'll turn off 📴.";
    } else {
      _0x28323e = "💡 *Chatbot Usage:*\n\n• " + _0x9f8296 + "chatbot on\n• " + _0x9f8296 + "chatbot off";
    }
    return await _0x4ebc10.sendMessage(_0x510964.from, {
      'text': _0x28323e,
      'contextInfo': {
        'forwardingScore': 0xa,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363369453603973@newsletter",
          'newsletterName': '𝐗ҽσɳ-𝐗ƚҽƈ𝐡'
        }
      }
    }, {
      'quoted': _0x510964
    });
  }
  if (_0x3fa887.CHATBOT) {
    if (!_0x510964.message || _0x510964.key.fromMe) {
      return;
    }
    const _0x2bc069 = _0x510964.key.remoteJid;
    const _0x35ca09 = _0x510964.key.participant || _0x2bc069;
    const _0x27e890 = _0x2bc069.endsWith("@g.us");
    const _0x36e508 = _0x510964.body || '';
    if (_0x27e890) {
      const _0x4302f0 = _0x510964.message?.["extendedTextMessage"]?.["contextInfo"]?.["mentionedJid"]?.["includes"](_0x4ebc10.user.id);
      const _0x2f5d2b = _0x510964.message?.["extendedTextMessage"]?.["contextInfo"]?.['participant'] === _0x4ebc10.user.id;
      const _0x3fbcc9 = _0x510964.message?.["extendedTextMessage"]?.["contextInfo"]?.["stanzaId"] && _0x2f5d2b;
      if (!_0x4302f0 && !_0x2f5d2b && !_0x3fbcc9) {
        return;
      }
    }
    global.userChats = global.userChats || {};
    global.userChats[_0x35ca09] = global.userChats[_0x35ca09] || [];
    global.userChats[_0x35ca09].push("👤 User: " + _0x36e508);
    if (global.userChats[_0x35ca09].length > 0xf) {
      global.userChats[_0x35ca09].shift();
    }
    const _0x11eb4c = global.userChats[_0x35ca09].join("\n");
    const _0x4a2edc = "\nYou are *Xeon-Xtech*, a smart and helpful AI WhatsApp bot created by Black-Tappy. Your job is to provide accurate, conversational, and friendly responses.\n\n🧠 *Chat History:*\n" + _0x11eb4c + "\n    ";
    try {
      const {
        data: _0x8d764a
      } = await _0x3e6f20.post('https://api.groq.com/openai/v1/chat/completions', {
        'model': "llama3-70b-8192",
        'messages': [{
          'role': 'system',
          'content': _0x4a2edc
        }, {
          'role': "user",
          'content': _0x36e508
        }]
      }, {
        'headers': {
          'Authorization': "Bearer " + _0x3fa887.GROQ_API_KEY,
          'Content-Type': "application/json"
        }
      });
      const _0x24953d = _0x8d764a.choices?.[0x0]?.["message"]?.['content'] || "🤖 Sorry, I didn’t get that.";
      global.userChats[_0x35ca09].push("🤖 Bot: " + _0x24953d);
      await _0x4ebc10.sendMessage(_0x2bc069, {
        'text': _0x24953d,
        'contextInfo': {
          'forwardingScore': 0x5,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterJid': "120363369453603973@newsletter",
            'newsletterName': "𝐗ҽσɳ-𝐗ƚҽƈ𝐡"
          }
        }
      }, {
        'quoted': _0x510964
      });
    } catch (_0x398a68) {
      console.error("Groq error:", _0x398a68.response?.["data"] || _0x398a68.message);
      await _0x4ebc10.sendMessage(_0x510964.from, {
        'text': "⚠️ Error getting response from chatbot.",
        'contextInfo': {
          'forwardingScore': 0x1,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterJid': "120363369453603973@newsletter",
            'newsletterName': "𝐗ҽσɳ-𝐗ƚҽƈ𝐡"
          }
        }
      }, {
        'quoted': _0x510964
      });
    }
  }
};
export default chatbotcommand;