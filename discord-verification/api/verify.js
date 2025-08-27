export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { username, userId } = req.body; // make sure your frontend sends this
    const webhookUrl = process.env.DISCORD_WEBHOOK;

    if (!webhookUrl) {
      throw new Error("Missing DISCORD_WEBHOOK env variable");
    }

    const payload = {
      content: `User <@${userId}> (**${username}**) has verified! Please add role 'Verified' <@&ROLE_ID>`
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Discord error: ${response.status} - ${text}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err); // will show in Vercel logs
    res.status(500).json({ error: err.message });
  }
}
