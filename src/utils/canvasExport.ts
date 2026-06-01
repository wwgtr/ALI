import { Quote, ThemeConfig, ExportDimension } from '../types';

export function downloadQuoteAsImage(quote: Quote, theme: ThemeConfig, dimension: ExportDimension, includeExplanation: boolean, backgroundTexture: 'parchment' | 'solid' | 'marble') {
  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set sizing based on dimension
  let width = 1080;
  let height = 1080;

  if (dimension === 'instagram_story') {
    width = 1080;
    height = 1920;
  } else if (dimension === 'instagram_portrait') {
    width = 1080;
    height = 1350;
  } else if (dimension === 'hd_wallpaper') {
    width = 1920;
    height = 1080;
  }

  canvas.width = width;
  canvas.height = height;

  // Draw background colors
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.bgGradientStart);
  gradient.addColorStop(1, theme.bgGradientEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add Texture Overlays
  if (backgroundTexture === 'parchment' || backgroundTexture === 'marble') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.globalCompositeOperation = 'overlay';
    // Draw artificial parchment speckles/grains
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = Math.random() * (backgroundTexture === 'marble' ? 120 : 6) + 2;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
      ctx.fill();
    }
    // Draw marble vein strokes
    if (backgroundTexture === 'marble') {
      ctx.strokeStyle = 'rgba(255,235,180,0.06)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, 0);
        ctx.bezierCurveTo(
          Math.random() * width, height * 0.3,
          Math.random() * width, height * 0.6,
          Math.random() * width, height
        );
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Draw intricate borders and Islamic Archs
  ctx.strokeStyle = theme.accentColorHex;
  ctx.lineWidth = 4;
  const padding = 50;

  // Drawing double fine lines
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(padding + 8, padding + 8, width - (padding + 8) * 2, height - (padding + 8) * 2);

  // Corner decorations (Arabesque hooks / floral design)
  drawCornerDecorations(ctx, padding, width, height, theme.accentColorHex);

  // Draw traditional Mihrab/Dome top arch for Story and Portrait dimensions
  if (dimension === 'instagram_story' || dimension === 'instagram_portrait') {
    drawMihrabArch(ctx, padding, width, height, theme.accentColorHex);
  }

  // Draw header emblem (Dome / Crescent silhouette placeholder)
  const headerY = height * 0.16;
  drawGlowHeaderEmblem(ctx, width / 2, headerY, theme.accentColorHex);

  // Draw "قول أمير المؤمنين (ع)" Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'normal 500 32px "Reem Kufi", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText('مِنْ حِكَمِ الإِمَامِ عَلِيِّ بْنِ أَبِي طَالِبٍ (ع)', width / 2, headerY + 80);

  // Draw saying text in majestic traditional font (Amiri)
  ctx.fillStyle = theme.accentColorHex; // Usually Gold/Amber and bright white mixed
  ctx.font = 'italic bold 56px "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;

  // Text Wrapping Layout Calculations
  const textX = width / 2;
  const textY = height * 0.38;
  const maxTextWidth = width - 240;

  const quoteLines = getWordsWrappedText(ctx, quote.text, maxTextWidth);
  let currentY = textY;

  // Render Quote lines with beautiful golden shadow
  ctx.fillStyle = '#ffffff';
  quoteLines.forEach((line) => {
    ctx.fillText(line, textX, currentY);
    currentY += 80;
  });

  // Draw ornamental separator (lantern or floral emblem like ۞ or gold diamond)
  currentY += 40;
  drawGoldSeparator(ctx, width / 2, currentY, theme.accentColorHex);
  currentY += 90;

  // Draw standard classic explanation if ticked
  if (includeExplanation && quote.explanation) {
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'normal 400 30px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;

    const explanationText = quote.explanation;
    const explanationLines = getWordsWrappedText(ctx, explanationText, maxTextWidth - 80);
    explanationLines.forEach((line) => {
      ctx.fillText(line, textX, currentY);
      currentY += 50;
    });
  }

  // Draw a premium Gilded Wax Seal at the bottom representing authenticity
  const sealY = height - 190;
  drawGildedWaxSeal(ctx, width / 2, sealY, theme.accentColorHex);

  // Trigger file download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `ImamAli-Saying-${quote.id}-${dimension}.png`;
  link.click();
}

// Corner ornaments drawings
function drawCornerDecorations(ctx: CanvasRenderingContext2D, pad: number, w: number, h: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.fillStyle = color;

  const size = 60;

  // Array of 4 corners configurations
  const corners = [
    { x: pad, y: pad, dx: 1, dy: 1 },
    { x: w - pad, y: pad, dx: -1, dy: 1 },
    { x: pad, y: h - pad, dx: 1, dy: -1 },
    { x: w - pad, y: h - pad, dx: -1, dy: -1 }
  ];

  corners.forEach((c) => {
    // Elegant frame corners
    ctx.beginPath();
    ctx.moveTo(c.x, c.y + size * c.dy);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(c.x + size * c.dx, c.y);
    ctx.stroke();

    // Small interior dot
    ctx.beginPath();
    ctx.arc(c.x + 20 * c.dx, c.y + 20 * c.dy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Tradition Mihrab structure drawing inside output image
function drawMihrabArch(ctx: CanvasRenderingContext2D, pad: number, w: number, h: number, color: string) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const leftX = pad + 30;
  const rightX = w - pad - 30;
  const topY = pad + 40;
  const arcHeight = 220;

  ctx.moveTo(leftX, h - pad - 30);
  ctx.lineTo(leftX, topY + arcHeight);

  // Left transition curve
  ctx.quadraticCurveTo(leftX, topY + 80, w / 2 - 120, topY + 40);

  // Pointed dome peak intersection
  ctx.bezierCurveTo(w / 2 - 40, topY + 20, w / 2, topY, w / 2, topY - 10);
  ctx.bezierCurveTo(w / 2, topY, w / 2 + 40, topY + 20, w / 2 + 120, topY + 40);

  // Right transition curve
  ctx.quadraticCurveTo(rightX, topY + 80, rightX, topY + arcHeight);
  ctx.lineTo(rightX, h - pad - 30);
  ctx.stroke();
  ctx.restore();
}

function drawGlowHeaderEmblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  // Drawing glowing lantern / dome icon
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;

  // Dome shape
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 20);
  ctx.quadraticCurveTo(cx - 30, cy - 10, cx, cy - 25);
  ctx.quadraticCurveTo(cx + 30, cy - 10, cx + 30, cy + 20);
  ctx.closePath();
  ctx.fill();

  // Little pinnacle spindle on top of the dome
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx, cy - 40);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Base platform
  ctx.fillRect(cx - 40, cy + 22, 80, 4);
  ctx.restore();
}

function drawGoldSeparator(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Draw horizontal classic line with a diamond in the center
  ctx.beginPath();
  ctx.moveTo(cx - 180, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + 180, cy);
  ctx.stroke();

  // Center arabesque pattern (۞)
  ctx.beginPath();
  ctx.rect(cx - 10, cy - 10, 20, 20);
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.rect(-10, -10, 20, 20);
  ctx.stroke();

  ctx.font = '16px sans-serif';
  ctx.fillText('﷽', 0, 5);
  ctx.restore();
}

function drawGildedWaxSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  // Draw round premium seal
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(217, 119, 6, 0.9)'; // Golden-brown wax color
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.fill();

  // Gold Inner ring
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 46, 0, Math.PI * 2);
  ctx.stroke();

  // Inscribed calligraphic badge "علي"
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'normal bold 36px "Amiri", serif';
  ctx.fillText('عـلـي', cx, cy + 12);
  ctx.restore();
}

function getWordsWrappedText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
}
