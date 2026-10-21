const env = require('../config/env');

const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN || '8640930770:AAGXKrQJVZbOHls3cbpkI6hrsel1pw86x6g';
let cachedChatId = env.TELEGRAM_CHAT_ID || null;

/**
 * Escapes HTML characters for Telegram HTML parse_mode
 */
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Auto-discover the recipient's chat ID by checking the latest updates
 * sent to the bot if not already configured in environment variables.
 */
const getRecipientChatId = async () => {
  if (cachedChatId) return cachedChatId;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const data = await response.json();

    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      // Find the most recent message or callback query
      for (let i = data.result.length - 1; i >= 0; i--) {
        const update = data.result[i];
        const chat = update.message?.chat || update.channel_post?.chat || update.my_chat_member?.chat;
        if (chat && chat.id) {
          cachedChatId = String(chat.id);
          console.log(`[Telegram Service] Auto-discovered chat ID: ${cachedChatId} (${chat.username || chat.first_name || 'user'})`);
          return cachedChatId;
        }
      }
    }
  } catch (error) {
    console.warn(`[Telegram Service Warning] Failed to fetch updates: ${error.message}`);
  }

  return null;
};

/**
 * Send real-time Telegram notification to the developer when a contact form is submitted.
 * Delivers immediate push notifications with sound on mobile and desktop Telegram apps.
 */
const sendTelegramNotification = async (contactData) => {
  try {
    const chatId = await getRecipientChatId();

    if (!chatId) {
      console.log(
        '[Telegram Service] Chat ID not found yet. The developer must message @Mohammad_041_bot (or click /start) to enable instant mobile alerts.'
      );
      return { sent: false, reason: 'Chat ID not linked yet' };
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const text = [
      `🚀 <b>New Portfolio Message!</b>`,
      ``,
      `👤 <b>Sender:</b> ${escapeHtml(contactData.name)}`,
      `📧 <b>Email:</b> ${escapeHtml(contactData.email)}`,
      `📱 <b>Phone:</b> ${escapeHtml(contactData.phone || 'Not provided')}`,
      `📌 <b>Subject:</b> ${escapeHtml(contactData.subject)}`,
      ``,
      `💬 <b>Message:</b>`,
      `<blockquote>${escapeHtml(contactData.message)}</blockquote>`,
      ``,
      `⏰ <i>Received: ${timestamp}</i>`,
    ].join('\n');

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();
    if (result.ok) {
      console.log(`[Telegram Service] Instant notification delivered to chat ${chatId}`);
      return { sent: true, messageId: result.result?.message_id };
    } else {
      console.warn(`[Telegram Service Warning] Telegram API returned error:`, result.description);
      return { sent: false, error: result.description };
    }
  } catch (error) {
    console.error(`[Telegram Service Error] Failed to send notification: ${error.message}`);
    return { sent: false, error: error.message };
  }
};

module.exports = {
  sendTelegramNotification,
  getRecipientChatId,
};
