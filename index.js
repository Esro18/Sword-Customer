const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const REVIEW_CHANNEL = "التقييمات";

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (msg.channel.name !== REVIEW_CHANNEL) return;

    const reviewText = msg.content;
    const avatarURL = msg.author.displayAvatarURL({ extension: "png" });

    // تحميل الخلفية
    const bg = await Canvas.loadImage("./assets/review-bg.png");

    // إنشاء اللوحة
    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // رسم الخلفية
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // رسم صورة العضو داخل الدائرة
    const avatar = await Canvas.loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(120, 120, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 60, 60, 120, 120);
    ctx.restore();

    // اسم العضو داخل المربع الصغير
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#a8cfff";
    ctx.fillText(msg.author.username, 200, 130);

    // نص التقييم داخل المربع الكبير
    ctx.font = "35px Arial";
    ctx.fillStyle = "#ffffff";
    wrapText(ctx, reviewText, 100, 350, 950, 50);

    // تحويل الصورة إلى ملف
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "review.png" });

    // إرسال الصورة داخل الروم
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