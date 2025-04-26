import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const knowledgeBase = `
Qui puoi incollare il contenuto del tuo file Word convertito in testo.
(Esempio: politiche di cancellazione, orari di check-in/out, ecc.)
`;

export default async function handler(req, res) {
  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: "Missing question parameter" });
  }

  // Cerca nella knowledge base
  if (knowledgeBase.toLowerCase().includes(question.toLowerCase())) {
    return res.status(200).json({ answer: "Risposta trovata nella knowledge base!" });
  }

  // Se non trova, usa OpenAI
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: question }],
    });

    const answer = completion.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: "Errore nella richiesta a OpenAI" });
  }
}
