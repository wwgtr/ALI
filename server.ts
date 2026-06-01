import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

app.post("/api/explain-quote", async (req, res) => {
  const { quote } = req.body;
  if (!quote) {
    return res.status(400).json({ error: "الرجاء تزويد النص" });
  }

  try {
    if (!ai) {
      return res.json({
        explanation: "ملاحظة: مفتاح الذكاء الاصطناعي غير متصل. إليك التفسير النبيل العام: هذا المثل الشريف يشير إلى المواعظ العلوية لتهذيب النفس والسلوك والأدب الإيماني."
      });
    }

    const prompt = `أنت عالم وباحث لاهوتي ومفسر شيعي خبير في نهج البلاغة وغرر الحكم ودرر الكلم.
فسر القول التالي بدقة وبأدق التفاصيل من كلام أمير المؤمنين الإمام علي بن أبي طالب عليه السلام مع بيان أبعاده العقدية والأخلاقية والتربوية:
"${quote}"
اكتب التفسير بلغة عربية فصحى بليغة، واضحة الأسطر دون إطالة مملة، وركز على تهذيب النفس ومحاسن الأخلاق. لا تكتب أي هوامش ترحيبية أو تعليقات برمجية.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي" });
  }
});

app.post("/api/explain-word", async (req, res) => {
  const { word, quote } = req.body;
  if (!word) {
    return res.status(400).json({ error: "الرجاء تحديد الكلمة المراد شرحها" });
  }

  try {
    if (!ai) {
      return res.json({
        explanation: `شرح تفصيلي تقريبي للكلمة "${word}": هي لفظ لغوي في اللغة العربية الفصيحة يعبّر عن سياق العبارة وحكمتها العالية.`
      });
    }

    const prompt = `أنت فيلسوف لغوي ومفسر لمعاجم نهج البلاغة وكلام الإمام علي عليه السلام.
فسر معنى الكلمة التالية بدقة متناهية وبيّن أصلها اللغوي واستخدامها في حكمة البلاغة الإمام علي:
الكلمة: "${word}"
ضمن القول الشريف: "${quote || ''}"
اجعل التفسير في فقرة واحدة جذابة ومكتوبة بلغة بليغة تركز على المعنى الشيعي التربوي، وتجنب أي تعليقات برمجية أو مقدمات ترحيبية.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "حدث خطأ في جلب التفسير الكلمي" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
