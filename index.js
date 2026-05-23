const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const REVIEW_CHANNEL = "1499842400678314205";

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (msg.channel.id !== REVIEW_CHANNEL) return;

    const reviewText = msg.content;
    const avatarURL = msg.author.displayAvatarURL({ extension: "png" });

    try { await msg.delete(); } catch {}

    // API ثابت ويدعم العربي
    const url = `https://api.popcat.xyz/quote?image=${encodeURIComponent(avatarURL)}&text=${encodeURIComponent(reviewText)}&name=${encodeURIComponent(msg.author.username)}`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    const attachment = new AttachmentBuilder(Buffer.from(response.data), {
        name: "review.png"
    });

    await msg.channel.send({
        content: `⭐ **تقييم جديد من ${msg.author}**`,
        files: [attachment]
    });
});

client.login(process.env.TOKEN);
// =====================================================
// ====================== النهاية ========================
// =====================================================

// تم بناء هذا النظام بالكامل بواسطة:
// Sword Customers — Discord Bot
// جميع الحقوق محفوظة لدى Esro Store ❤️ 