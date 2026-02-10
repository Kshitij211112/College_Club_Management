const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

// Register Fonts Dynamically
const fontDir = path.join(__dirname, "../fonts");
if (fs.existsSync(fontDir)) {
  const files = fs.readdirSync(fontDir);
  files.forEach(file => {
    const filePath = path.join(fontDir, file);
    if (fs.statSync(filePath).size > 1000 && file.endsWith(".ttf")) { // Check if valid
      const [name, weightStr] = file.replace(".ttf", "").split("-");
      const family = name; // e.g. Poppins
      const weight = weightStr === "Bold" ? "700" : "400";
      
      try {
        registerFont(filePath, { family, weight });
        console.log(`Registered font: ${family} ${weight} (${file})`);
      } catch (e) {
        console.error(`Failed to register font ${file}:`, e.message);
      }
    }
  });
}

async function generateCertificate(participant, settings, template) {

  console.log("Internal Gen Settings:", JSON.stringify(settings));

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(template, 0, 0);

  const naturalWidth = template.width;
  const naturalHeight = template.height;

  // Convert saved percent back to center point
  const textCenterX = settings.xPercent * naturalWidth;
  const textCenterY = settings.yPercent * naturalHeight;

  const scaledFontSize = settings.fontSize;
  const fontFamily = settings.fontFamily || "Arial";
  const fontWeight = settings.fontWeight || 400;
  const fontStyle = settings.fontStyle || "normal";

  ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px "${fontFamily}", Arial`;
  ctx.fillStyle = settings.color || "#000000";

  // ALWAYS center-based anchor because position is center-based
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // DRAW NAME
  ctx.fillText(participant.name, textCenterX, textCenterY);

  // underline manually
  if (settings.textDecoration === "underline") {
    const metrics = ctx.measureText(participant.name);
    const textWidth = metrics.width;
    const underlineY = textCenterY + scaledFontSize * 0.1;

    ctx.beginPath();
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = Math.max(1, scaledFontSize * 0.05);
    ctx.moveTo(textCenterX - textWidth / 2, underlineY);
    ctx.lineTo(textCenterX + textWidth / 2, underlineY);
    ctx.stroke();
  }

  // save file
  const outDir = path.join(__dirname, "..", "generated");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const fileName = `${participant._id}.png`;
  fs.writeFileSync(path.join(outDir, fileName), canvas.toBuffer("image/png"));

  return `generated/${fileName}`;
}

module.exports = generateCertificate;
