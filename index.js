const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ID روم التقييمات
const REVIEW_CHANNEL = "1499842400678314205";

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;

    // Debug للتأكد إن البوت يقرأ الروم
    console.log(`📩 رسالة في: ${msg.channel.id}`);

    if (msg.channel.id !== REVIEW_CHANNEL) return;

    const reviewText = msg.content;
    const avatarURL = msg.author.displayAvatarURL({ extension: "png" });

    // حذف رسالة العضو
    try { await msg.delete(); } catch (e) {}

    // تحميل الخلفية
    const bg = await loadImage("./assets/review-bg.png");

    // إنشاء اللوحة
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // رسم الخلفية
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // رسم صورة العضو داخل دائرة
    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(120, 120, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 60, 60, 120, 120);
    ctx.restore();

    // اسم العضو
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#a8cfff";
    ctx.fillText(msg.author.username, 200, 130);

    // نص التقييم
    ctx.font = "35px Arial";
    ctx.fillStyle = "#ffffff";
    wrapText(ctx, reviewText, 100, 350, 950, 50);

    // تحويل الصورة إلى ملف
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "review.png" });

    // إرسال الصورة
    await msg.channel.send({
        content: `⭐ **تقييم جديد من ${msg.author}**`,
        files: [attachment]
    });
});

// دالة التفاف النص
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

client.login(process.env.TOKEN);
// =====================================================
// ====================== النهاية ========================
// =====================================================

// تم بناء هذا النظام بالكامل بواسطة:
// Sword Customers — Discord Bot
// جميع الحقوق محفوظة لدى Esro Store ❤️