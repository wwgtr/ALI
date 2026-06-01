import { Saying, IslamicTheme, AspectRatioType } from '../types';

export const triggerImageDownload = (
  saying: Saying,
  theme: IslamicTheme,
  ratio: AspectRatioType,
  includeExplanation: boolean
) => {
  let baseWidth = 1080;
  let baseHeight = 1080;

  if (ratio === '4:5') {
    baseHeight = 1350;
  } else if (ratio === '9:16') {
    baseHeight = 1920;
  }

  const canvas = document.createElement('canvas');
  const dpr = 2.5; // دقة فائقة للتصدير
  canvas.width = baseWidth * dpr;
  canvas.height = baseHeight * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);

  // ١. خلفية متدرجة انسيابية مطابقة للثيم المختار
  let bgGrad = ctx.createLinearGradient(0, 0, 0, baseHeight);
  if (theme.id === 'parchment') {
    bgGrad.addColorStop(0, '#FDFBF7');
    bgGrad.addColorStop(0.5, '#F8F4EA');
    bgGrad.addColorStop(1, '#F3EDE0');
  } else if (theme.id === 'emerald') {
    bgGrad.addColorStop(0, '#022B19');
    bgGrad.addColorStop(0.5, '#043E26');
    bgGrad.addColorStop(1, '#011A0F');
  } else if (theme.id === 'turquoise') {
    bgGrad.addColorStop(0, '#052C30');
    bgGrad.addColorStop(0.5, '#074D54');
    bgGrad.addColorStop(1, '#031D21');
  } else if (theme.id === 'sapphire') {
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.5, '#121F42');
    bgGrad.addColorStop(1, '#050A18');
  } else if (theme.id === 'houseofwisdom') {
    bgGrad.addColorStop(0, '#200A2B');
    bgGrad.addColorStop(0.5, '#16051E');
    bgGrad.addColorStop(1, '#0A0210');
  } else if (theme.id === 'sage') {
    bgGrad.addColorStop(0, '#F3F6F2');
    bgGrad.addColorStop(0.5, '#E6EBE5');
    bgGrad.addColorStop(1, '#DCE2DB');
  } else if (theme.id === 'obsidian') {
    bgGrad.addColorStop(0, '#020202');
    bgGrad.addColorStop(0.5, '#0D0D11');
    bgGrad.addColorStop(1, '#020202');
  } else { // desert صحراء كربلاء
    bgGrad.addColorStop(0, '#2a160c');
    bgGrad.addColorStop(0.5, '#452210');
    bgGrad.addColorStop(1, '#150904');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // ٢. رسم النقشة الإسلامية الخلفية الخفيفة دقة متناهية
  ctx.save();
  ctx.strokeStyle = theme.ornamentColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.05;
  const gridSize = 80;
  for (let x = 0; x < baseWidth; x += gridSize) {
    for (let y = 0; y < baseHeight; y += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
      ctx.beginPath();
      ctx.arc(x + gridSize / 2, y + gridSize / 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = theme.ornamentColor;
      ctx.fill();
    }
  }
  ctx.restore();

  // ٣. رسم الإطار القرآني المطرز المزدوج
  const margin = 45;
  ctx.strokeStyle = theme.ornamentColor;
  ctx.lineWidth = 3.5;
  ctx.globalAlpha = 0.85;
  ctx.strokeRect(margin, margin, baseWidth - margin * 2, baseHeight - margin * 2);

  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.strokeRect(margin + 8, margin + 8, baseWidth - (margin + 8) * 2, baseHeight - (margin + 8) * 2);

  // ٤. رسم النجوم الإسلامية الثمانية في الأركان الأربعة
  const drawCornerStar = (cx: number, cy: number, size: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = theme.ornamentColor;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = theme.ornamentColor;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.rect(-size / 2, -size / 2, size, size);
    }
    ctx.fillStyle = theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
    ctx.fill();
    ctx.stroke();

    // نقطة ذهبية مركزية داخله
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = theme.ornamentColor;
    ctx.fill();
    ctx.restore();
  };

  drawCornerStar(margin + 8, margin + 8, 26);
  drawCornerStar(baseWidth - (margin + 8), margin + 8, 26);
  drawCornerStar(margin + 8, baseHeight - (margin + 8), 26);
  drawCornerStar(baseWidth - (margin + 8), baseHeight - (margin + 8), 26);

  // ٥. رسم الفواصل الهندسية لتزيين المخطوطة
  const drawArtisticDivider = (cx: number, cy: number, width: number) => {
    ctx.save();
    ctx.strokeStyle = theme.ornamentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(cx - width / 2, cy);
    ctx.lineTo(cx - 25, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 25, cy);
    ctx.lineTo(cx + width / 2, cy);
    ctx.stroke();

    ctx.translate(cx, cy);
    ctx.fillStyle = theme.ornamentColor;
    ctx.globalAlpha = 0.9;
    
    // شكل معين وسطي
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 6);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();

    // نقطتين جانبيتين
    ctx.beginPath();
    ctx.arc(-13, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(13, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  ctx.textAlign = 'center';

  // معالجة ذكية لرسم النصوص المتعددة والالتفاف التلقائي متناسباً مع اللغة العربية
  const wrapArabicText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number, fontStyle: string, color: string): number => {
    ctx.save();
    ctx.font = fontStyle;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    const words = text.split(' ');
    let line = '';
    let currentY = startY;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    ctx.restore();
    return currentY + lineHeight;
  };

  let contentY = baseHeight * 0.14;

  // أ. البسملة الشريفة بلغة المخطوطات الأصيلة
  ctx.fillStyle = theme.ornamentColor;
  ctx.font = 'bold 26px "Amiri", "Georgia", serif';
  ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', baseWidth / 2, contentY);
  contentY += 45;

  ctx.fillStyle = theme.isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  ctx.font = 'normal bold 14px "Amiri", sans-serif';
  ctx.fillText('مِنْ حِكَمِ وَمَوَاعِظِ أَمِيرِ الْمُؤْمِنِينَ عَلِيِّ بْنِ أَبِي طَالِبٍ (ع)', baseWidth / 2, contentY);
  contentY += baseHeight * 0.08;

  // ب. رسم نص الحكمة محاطاً بالقوسين الإسلاميين المزخرفين
  ctx.save();
  ctx.font = 'bold 36px "Amiri", "Georgia", serif';
  ctx.fillStyle = theme.isDark ? '#FFF9F2' : '#1D120B';
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 12;

  // إضافة الأقواس الإسلامية المميزة للإمام علي (ع)
  const fullyDetailedSaying = `﴿ ${saying.arabic} ﴾`;
  contentY = wrapArabicText(
    fullyDetailedSaying,
    baseWidth / 2,
    contentY,
    baseWidth - margin * 3.5,
    58,
    'bold 36px "Amiri", serif',
    theme.isDark ? '#FFEFCF' : '#2D1B0F'
  );
  ctx.restore();
  contentY += 25;

  // فاصل وسطي تزييني
  drawArtisticDivider(baseWidth / 2, contentY, 280);
  contentY += 35;

  // ج. نسبة المقولة للإمام المصدر
  ctx.fillStyle = theme.ornamentColor;
  ctx.font = 'bold 16px "Amiri", Georgia, serif';
  ctx.fillText('— أَمِيرُ الْمُؤْمِنِينَ عَلِيُّ بْنُ أَبِي طَالِبٍ (ع)', baseWidth / 2, contentY);
  contentY += 28;

  // د. تخطيط مصدر الحكمة
  ctx.fillStyle = theme.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  ctx.font = 'italic 13px "Amiri", sans-serif';
  ctx.fillText(saying.source, baseWidth / 2, contentY);
  contentY += baseHeight * 0.06;

  // هـ. الشرح والتعليق الأخلاقي والبيان التوضيحي (اختياري)
  if (includeExplanation) {
    drawArtisticDivider(baseWidth / 2, contentY, 150);
    contentY += 40;

    ctx.fillStyle = theme.ornamentColor;
    ctx.font = 'bold 15px "Amiri", Georgia, serif';
    ctx.fillText('الْبَيَانُ وَالشَّرْحُ الْأَخْلَاقِيُّ', baseWidth / 2, contentY);
    contentY += 30;

    contentY = wrapArabicText(
      saying.generalExplanation,
      baseWidth / 2,
      contentY,
      baseWidth - margin * 4.5,
      28,
      'bold 15px "Amiri", sans-serif',
      theme.isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)'
    );
  }

  // و. إمضاء المخطوطة السفلي الأنيق لتوثيق المصدر
  const footerY = baseHeight - margin - 30;
  ctx.fillStyle = theme.ornamentColor;
  ctx.font = '10px "Amiri", serif';
  ctx.globalAlpha = 0.5;
  ctx.fillText('حِكَمُ أَمِيرِ الْمُؤْمِنِينَ (ع) — مَكْتَبَةُ كَلَامِ الْعَدْلِ وَالْبَلَاغَةِ', baseWidth / 2, footerY);

  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  // اسم مميز للملف المصدر باللغة العربية
  link.download = `حكمة_الإمام_علي_رقم_${saying.id}_${ratio.replace(':', '_')}.png`;
  link.href = dataURL;
  link.click();
};
