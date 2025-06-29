import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';
const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');
const statsFilePath = path.join(__dirname, 'deployment_stats.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function updateDeploymentStats() {
    let stats = { total: 0, today_deploys: { date: "", count: 0 } };
    try {
        if (fs.existsSync(statsFilePath)) {
            stats = JSON.parse(fs.readFileSync(statsFilePath));
        }
    } catch (error) {
        console.error("Error reading deployment stats:", error);
    }

    const today = moment().tz(config.TIME_ZONE || "Africa/Nairobi").format("YYYY-MM-DD");

    if (stats.today_deploys.date === today) {
        stats.today_deploys.count += 1;
    } else {
        stats.today_deploys.date = today;
        stats.today_deploys.count = 1;
    }
    stats.total += 1;

    try {
        fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error("Error writing deployment stats:", error);
    }

    return stats;
}


async function downloadSessionData() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("XEON-XTECH~")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("🔄 Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download session data:', error);
        return false;
    }
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 XEON-XTECH using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["XEON-XTECH", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                return { conversation: "xeon xtech whatsapp user bot" };
            }
        });

        Matrix.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    console.log(chalk.yellow("Connection closed. Reconnecting..."));
                    start();
                } else {
                    console.log(chalk.red("Connection logged out. Please re-authenticate."));
                    fs.rmSync(sessionDir, { recursive: true, force: true });
                    process.exit(1);
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("Connected Successfully XEON-XTECH 🤍"));
                    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;

                    // --- Send initial deployment messages ---
                    const stats = await updateDeploymentStats();
                    const deployMessage = `
*🎉 Xeon-Xtech Deployment Successful! 🎉*

*🤖 Bot Name:* ${config.BOT_NAME}
*📱 Bot Number:* ${Matrix.user.id.split(':')[0]}

*📊 Deployment Stats:*
  - *Today:* ${stats.today_deploys.count}
  - *Total:* ${stats.total}

*📆 Date:* ${moment().tz(config.TIME_ZONE || "Africa/Nairobi").format('dddd, MMMM Do YYYY')}
*⏳ Time:* ${moment().tz(config.TIME_ZONE || "Africa/Nairobi").format('h:mm:ss a')}

*🟢 The bot is now online and fully operational. 🟢*
`;
                    await Matrix.sendMessage(ownerJid, { text: deployMessage });

                    await Matrix.sendMessage(Matrix.user.id, {
                        image: { url: "https://files.catbox.moe/8k0enh.jpg" },
                        caption: `*🚀 XEON-XTECH Successfully Deployed!*

⏩ Your bot is now online and ready to go. Here are your details:

- *🤖 Bot Name:* ${config.BOT_NAME}
- *⚒️ Prefix:* ${prefix}
- *📂 Owner:* ${config.OWNER_NAME}

*🔗 Important Links:*
- *WhatsApp Channel:* https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10
- *GitHub Repository:* https://github.com/Black-Tappy/XEON-XMD

Give the repo a ⭐️ to show your support!

> © Powered By Black-Tappy ✨`
                    });
                    
                    // --- VALIDATED: Concurrently follow channel and join group ---
                    await Promise.all([
                        (async () => {
                            // --- Auto follow channel newsletter ---
                            const channelJid = '120363369453603973@newsletter';
                            try {
                                await Matrix.query({
                                    tag: 'iq',
                                    attrs: { to: channelJid, type: 'set', xmlns: 'newsletter' },
                                    content: [{ tag: 'follow', attrs: { mute: 'false' } }]
                                });
                                console.log(chalk.blue(`Successfully sent follow request to channel: ${channelJid}`));
                                await Matrix.sendMessage(ownerJid, { text: `✅ Bot has successfully followed the channel newsletter.` });
                            } catch (error) {
                                console.error(chalk.red(`Failed to follow channel ${channelJid}:`), error);
                                await Matrix.sendMessage(ownerJid, { text: `❌ Bot failed to follow channel newsletter. Error: ${error.message}` });
                            }
                        })(),

                        (async () => {
                            // --- Auto join group link ---
                            const groupLink = 'https://chat.whatsapp.com/FMiFOIfMlWSIkN77Xnc9Ag';
                            const inviteCodeMatch = groupLink.match(/(?:chat\.whatsapp\.com\/)([a-zA-Z0-9-]+)/);
                            if (inviteCodeMatch && inviteCodeMatch[1]) {
                                const inviteCode = inviteCodeMatch[1];
                                try {
                                    await Matrix.groupAcceptInvite(inviteCode);
                                    console.log(chalk.blue(`Successfully joined group with invite code ${inviteCode}.`));
                                    await Matrix.sendMessage(ownerJid, { text: `✅ Bot has successfully joined the group from invite link.` });
                                } catch (error) {
                                    console.error(chalk.red(`Failed to join group ${groupLink}:`), error);
                                    await Matrix.sendMessage(ownerJid, { text: `❌ Bot failed to join group from link. Error: ${error.message}` });
                                }
                            } else {
                                console.error(chalk.red(`Invalid group invite link provided: ${groupLink}`));
                                await Matrix.sendMessage(ownerJid, { text: `❌ Could not extract invite code from group link: ${groupLink}.` });
                            }
                        })()
                    ]);

                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Connection reestablished after restart."));
                }
            }
        });
        
        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        const statusReactEmojis = ['❤️', '😂', '👍', '🎉', '🔥', '🤔', '🙏', '💯', '😮', '😊', '😢', '🚀', '✨', '💀', '🤖', '✅', '😎', '🙌', '👀', '🤯'];

        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek || !mek.message || mek.key.fromMe || mek.message?.protocolMessage) return;

                // Auto-reaction logic for general messages
                if (config.AUTO_REACT && !mek.key.remoteJid.endsWith('@g.us')) {
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await doReact(randomEmoji, mek, Matrix);
                }

                // Auto-status handling logic
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    if (config.AUTO_STATUS_SEEN) {
                        await Matrix.readMessages([mek.key]);
                    }
                    if (config.AUTO_STATUS_REACT === 'true') {
                        const randomEmoji = statusReactEmojis[Math.floor(Math.random() * statusReactEmojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                    if (config.AUTO_STATUS_REPLY) {
                        const customMessage = config.STATUS_READ_MSG || '✅ Auto Status Seen Bot By XEON-XTECH';
                        await Matrix.sendMessage(mek.key.remoteJid, { text: customMessage }, { quoted: mek });
                    }
                }
            } catch (err) {
                console.error('Error in secondary message handler:', err);
            }
        });

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

async function init() {
    if (fs.existsSync(credsPath)) {
        console.log("🔒 Session file found, proceeding without QR code.");
        await start();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("🔒 Session downloaded, starting bot.");
            await start();
        } else {
            console.log("No session found or downloaded, QR code will be printed for authentication.");
            useQR = true;
            await start();
        }
    }
}

init();

app.get('/', (req, res) => {
    res.send('Hello, XEON-XTECH is running!');
});

app.get('/ping', (req, res) => {
    res.status(200).send({ status: 'ok', message: 'Bot is alive!' });
});

app.listen(PORT, () => {
    console.log(lime(`Server is running on port ${PORT}`));
    console.log(orange(`To keep the bot alive, ping this URL: http://localhost:${PORT}/ping`));
});
