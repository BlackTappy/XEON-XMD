import config from '../../config.cjs';

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    // --- NEW: Array of random fancy "loading" messages ---
    const fancyMessages = [
        `> "Initializing connection...🌐",\n> "Establishing Bot commands...📂",\n> "Verifying commands credentials...😂",\n> "Connecting to WhatsApp API..🗝️.",\n> "Preparing menu 🆔..."\n> "Redirecting to menu commands...📜\n>Loading menu commands now...🟢`,
        `> "Connecting to servers... 🛰️",\n> "Fetching command list... 📝",\n> "Authenticating user... 👤",\n> "Compiling menu... ⚙️",\n> "Almost there... ⏳"\n> "Displaying menu now... ✅`,
        `> "Waking up the bot... 😴",\n> "Brewing some coffee... ☕",\n> "Checking for updates... 🔄",\n> "Loading all modules... 📦",\n> "Unleashing the menu... 💥"`,
        `> "Accessing mainframe... 💻",\n> "Decrypting command protocols... 🛡️",\n> "Calibrating response time... ⚡",\n> "Generating menu interface... 🎨",\n> "Welcome, user... 👋"`
    ];

    // --- NEW: Select one random message from the array ---
    const randomFancyMessage = fancyMessages[Math.floor(Math.random() * fancyMessages.length)];

    const start = new Date().getTime();
    await m.React('✨');
    const end = new Date().getTime();
    const responseTime = ((end - start) / 1000).toFixed(2);

    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const uptime = `${hours}h ${minutes}m ${seconds}s`;

    let profilePictureUrl = 'https://i.ibb.co/7yzjwvJ/default.jpg';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500); 
      const pp = await sock.profilePictureUrl(m.sender, 'image', { signal: controller.signal });
      clearTimeout(timeout);
      if (pp) profilePictureUrl = pp;
    } catch (error) {
      console.log('🔴 Profile pic fetch timed out or failed.');
    }

    const menuText = `
╭───────────────⭓
│ 🤖 ʙᴏᴛ : *xᴇᴏɴ-xᴛᴇᴄʜ 😂*
│ ⏱️ ʀᴜɴᴛɪᴍᴇ : ${uptime}
│ ⚡ sᴘᴇᴇᴅ : ${responseTime}s
│ 🌐 ᴍᴏᴅᴇ : ${config.MODE}
│ 🧩 ᴘʀᴇғɪx : ${prefix}
│ 👑 ᴏᴡɴᴇʀ : ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ
│ 🛠️ ᴅᴇᴠ : *ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ*
│ 🧬 ᴠᴇʀꜱɪᴏɴ : *4.1.0*
╰───────────────⭓
════════════════════
${randomFancyMessage}
════════════════════
> *✨Explore the commands below to harness the bot's full power!✨*
════════════════════
> 🌍  *𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗘𝗡𝗨* 🌍
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}menu
│ ⬡ ${prefix}alive
│ ⬡ ${prefix}sudo
│ ⬡ ${prefix}dev
│ ⬡ ${prefix}ping
│ ⬡ ${prefix}owner
│ ⬡ ${prefix}allvar
│ ⬡ ${prefix}bugmenu
│ ⬡ ${prefix}addpremium
╰──────────────────⭓
════════════════════
> 👑  *𝗢𝗪𝗡𝗘𝗥 𝗣𝗔𝗚𝗘* 👑
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}vv
│ ⬡ ${prefix}vv2
│ ⬡ ${prefix}vv3
│ ⬡ ${prefix}join
│ ⬡ ${prefix}pair
│ ⬡ ${prefix}repo
│ ⬡ ${prefix}leave
│ ⬡ ${prefix}profile
│ ⬡ ${prefix}restart
│ ⬡ ${prefix}block
│ ⬡ ${prefix}unblock
│ ⬡ ${prefix}anticall
│ ⬡ ${prefix}upload
│ ⬡ ${prefix}allcmds
│ ⬡ ${prefix}calculater 
│ ⬡ ${prefix}delete
│ ⬡ ${prefix}antidelete
│ ⬡ ${prefix}antisticker
│ ⬡ ${prefix}autobio
│ ⬡ ${prefix}autoread
│ ⬡ ${prefix}autoreact
│ ⬡ ${prefix}autostatusview
│ ⬡ ${prefix}autotyping
│ ⬡ ${prefix}autoblock
│ ⬡ ${prefix}autorecording
│ ⬡ ${prefix}autosticker
│ ⬡ ${prefix}setprefix
│ ⬡ ${prefix}alwaysonline
│ ⬡ ${prefix}blockunknown
│ ⬡ ${prefix}setownername
│ ⬡ ${prefix}setstatusmsg
╰──────────────────⭓
════════════════════
> 🤖  *𝗚𝗣𝗧 𝗠𝗘𝗡𝗨* 🤖
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}ai
│ ⬡ ${prefix}bug
│ ⬡ ${prefix}gpt
│ ⬡ ${prefix}xeon
│ ⬡ ${prefix}report
│ ⬡ ${prefix}gemini
│ ⬡ ${prefix}chatbot
╰──────────────────⭓
════════════════════
> 📦 *𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 𝗣𝗔𝗚𝗘* 📦
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}mp3
│ ⬡ ${prefix}ss
│ ⬡ ${prefix}url
│ ⬡ ${prefix}tomp3
│ ⬡ ${prefix}toqr
│ ⬡ ${prefix}trt
│ ⬡ ${prefix}mp3
│ ⬡ ${prefix}readqr
│ ⬡ ${prefix}removebg
│ ⬡ ${prefix}givetext
│ ⬡ ${prefix}extract
│ ⬡ ${prefix}geturl
│ ⬡ ${prefix}attp
│ ⬡ ${prefix}fancy
│ ⬡ ${prefix}image
│ ⬡ ${prefix}gimage
│ ⬡ ${prefix}shorten
│ ⬡ ${prefix}sticker
│ ⬡ ${prefix}take
╰──────────────────⭓
════════════════════
> 🔍  *𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨* 🔍
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}apk 
│ ⬡ ${prefix}bing
│ ⬡ ${prefix}ipstalk
│ ⬡ ${prefix}movie
│ ⬡ ${prefix}google
│ ⬡ ${prefix}yts
│ ⬡ ${prefix}bible
│ ⬡ ${prefix}play
│ ⬡ ${prefix}play2
│ ⬡ ${prefix}mediafire
│ ⬡ ${prefix}quranvid
│ ⬡ ${prefix}quraimage
│ ⬡ ${prefix}surahurdu
│ ⬡ ${prefix}surahaudio
│ ⬡ ${prefix}asmaulhusna
│ ⬡ ${prefix}prophetname
│ ⬡ ${prefix}facebook
│ ⬡ ${prefix}fb
│ ⬡ ${prefix}fbdl
│ ⬡ ${prefix}ig
│ ⬡ ${prefix}insta
│ ⬡ ${prefix}instagram
│ ⬡ ${prefix}tiktok
│ ⬡ ${prefix}lyrics
│ ⬡ ${prefix}pinterest
│ ⬡ ${prefix}githubstalk
│ ⬡ ${prefix}image
│ ⬡ ${prefix}ringtone
│ ⬡ ${prefix}playstore
│ ⬡ ${prefix}shazam
╰──────────────────⭓
════════════════════
> 😂  *𝗙𝗨𝗡 𝗠𝗘𝗡𝗨* 😂
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}getpp
│ ⬡ ${prefix}avatar
│ ⬡ ${prefix}wcg
│ ⬡ ${prefix}joke
│ ⬡ ${prefix}tts
│ ⬡ ${prefix}connect4
│ ⬡ ${prefix}tictactoe
│ ⬡ ${prefix}rank
│ ⬡ ${prefix}quiz
│ ⬡ ${prefix}movie
│ ⬡ ${prefix}givetext
│ ⬡ ${prefix}roast
│ ⬡ ${prefix}anime
│ ⬡ ${prefix}profile
│ ⬡ ${prefix}ebinar
│ ⬡ ${prefix}fancy
│ ⬡ ${prefix}fetch
│ ⬡ ${prefix}qc
│ ⬡ ${prefix}couple
│ ⬡ ${prefix}poll
│ ⬡ ${prefix}location 
│ ⬡ ${prefix}mylocation
│ ⬡ ${prefix}emojimix
│ ⬡ ${prefix}score
│ ⬡ ${prefix}toqr
│ ⬡ ${prefix}tempmail
╰──────────────────⭓
════════════════════
> 👤 *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* 👤
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}kickall
│ ⬡ ${prefix}remove
│ ⬡ ${prefix}tagall
│ ⬡ ${prefix}hidetag
│ ⬡ ${prefix}forward
│ ⬡ ${prefix}getall
│ ⬡ ${prefix}group close
│ ⬡ ${prefix}group open
│ ⬡ ${prefix}add
│ ⬡ ${prefix}vcf
│ ⬡ ${prefix}jid
│ ⬡ ${prefix}left
│ ⬡ ${prefix}join
│ ⬡ ${prefix}welcome
│ ⬡ ${prefix}promote 
│ ⬡ ${prefix}demote
│ ⬡ ${prefix}promoteall
│ ⬡ ${prefix}demoteall
│ ⬡ ${prefix}setgroupname
│ ⬡ ${prefix}setdescription
│ ⬡ ${prefix}linkgc
│ ⬡ ${prefix}antilink
│ ⬡ ${prefix}antibot
│ ⬡ ${prefix}antibugs
│ ⬡ ${prefix}antisticker
│ ⬡ ${prefix}antispam
│ ⬡ ${prefix}create
│ ⬡ ${prefix}setname
│ ⬡ ${prefix}ginfo
│ ⬡ ${prefix}groupinfo
│ ⬡ ${prefix}balance
╰──────────────────⭓
════════════════════
> 🔞 *𝗡𝗦𝗙𝗪 𝗣𝗔𝗚𝗘* 🔞
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}hneko
│ ⬡ ${prefix}trap
│ ⬡ ${prefix}hwaifu
│ ⬡ ${prefix}hentai
│ ⬡ ${prefix}hentavid 
│ ⬡ ${prefix}xxxvideo
╰──────────────────⭓
════════════════════
> 🎧 *𝗔𝗨𝗗𝗜𝗢 𝗘𝗙𝗙𝗘𝗖𝗧𝗦* 🎧
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}earrape
│ ⬡ ${prefix}deep
│ ⬡ ${prefix}blown
│ ⬡ ${prefix}bass
│ ⬡ ${prefix}nightcore
│ ⬡ ${prefix}fat
│ ⬡ ${prefix}fast
│ ⬡ ${prefix}robot
│ ⬡ ${prefix}tupai
│ ⬡ ${prefix}smooth
│ ⬡ ${prefix}slow
│ ⬡ ${prefix}reverse
╰──────────────────⭓
════════════════════
> 😜 *𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡 𝗣𝗔𝗚𝗘* 😜
════════════════════
╭───────────────⭓
│ ⬡ ${prefix}bonk
│ ⬡ ${prefix}bully
│ ⬡ ${prefix}yeet
│ ⬡ ${prefix}slap
│ ⬡ ${prefix}nom
│ ⬡ ${prefix}poke
│ ⬡ ${prefix}awoo
│ ⬡ ${prefix}wave
│ ⬡ ${prefix}smile
│ ⬡ ${prefix}dance
│ ⬡ ${prefix}smug
│ ⬡ ${prefix}blush
│ ⬡ ${prefix}cringe
│ ⬡ ${prefix}sad
│ ⬡ ${prefix}happy
│ ⬡ ${prefix}shinobu
│ ⬡ ${prefix}cuddle
│ ⬡ ${prefix}glomp
│ ⬡ ${prefix}handhold
│ ⬡ ${prefix}highfive
│ ⬡ ${prefix}yeet
│ ⬡ ${prefix}kick
│ ⬡ ${prefix}kill
│ ⬡ ${prefix}kiss
│ ⬡ ${prefix}cry
│ ⬡ ${prefix}bite
│ ⬡ ${prefix}lick
│ ⬡ ${prefix}pat
│ ⬡ ${prefix}hug
╰──────────────────⭓
════════════════════
🔧 *Wᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴇɴᴜ!*
*ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs...*
════════════════════
> 📢 *ᴅᴇᴠ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ*
    `.trim();

    const newsletterContext = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "𝐗ҽσɳ-𝐗ƚҽƈ𝐡",
        newsletterJid: "120363369453603973@newsletter"
      }
    };

    // menu image message
    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText,
      contextInfo: newsletterContext
    }, { quoted: m });

    // 🎵 blacktappy  random songs
    const songUrls = [
      'https://files.catbox.moe/k41qij.mp3',
      'https://files.catbox.moe/mexjrq.mp3',
      'https://files.catbox.moe/ddmjyy.mp3',
      'https://files.catbox.moe/4yqp5m.mp3'  
    ];
    const random = songUrls[Math.floor(Math.random() * songUrls.length)];

    await sock.sendMessage(m.from, {
      audio: { url: random },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: newsletterContext
    }, { quoted: m });
  }
};

export default menu;
