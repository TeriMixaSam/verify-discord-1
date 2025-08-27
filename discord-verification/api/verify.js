export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK; // secret in Vercel

  const payload = {
    content: `User **${username}** has verified! Please add role 'Verified' @Admin`,
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  res.status(200).json({ success: true });
}
