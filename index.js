const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { Card } = require("canvacord");
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

    const card = new Card()
        .setAvatar(avatarURL)
        .setTitle(msg.author.username)
        .setDescription(reviewText)
        .setColor("#2c2f33")
        .setBackground("https://i.imgur.com/8bYQFJH.png");

    const img = await card.build();
    const attachment = new AttachmentBuilder(img, { name: "review.png" });

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
// جميع الحقوق محفوظة لدى Esro Store ❤️ .