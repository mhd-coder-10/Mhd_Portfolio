/**
 * Centralized Social and Contact Configurations
 * Keep all contact credentials, numbers, and profile URLs in one place.
 * Empty strings are configured so they can be easily populated without altering components.
 */

const RAW_PHONE = '9316515672';
const COUNTRY_CODE = '91';

// Professional pre-filled message for WhatsApp
const WHATSAPP_PREFILLED_MESSAGE = encodeURIComponent(
  'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.'
);

// Professional pre-filled message for Telegram
const TELEGRAM_PREFILLED_MESSAGE = encodeURIComponent(
  'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.'
);

export const socialLinks = {
  // Official External Profile URLs
  github: 'https://github.com/mhd-coder-10',
  linkedin: 'https://www.linkedin.com/in/momin-mahmmadbhai-3b482836b/',
  instagram: 'https://www.instagram.com/mohmdd._.10/',

  // Direct Communication Channels
  email: 'mailto:mhd.developer10@gmail.com',
  rawEmail: 'mhd.developer10@gmail.com',
  phone: `tel:${RAW_PHONE}`,
  rawPhone: RAW_PHONE,
  formattedPhone: '+91 93165 15672',

  // WhatsApp click-to-chat integration
  whatsapp: `https://wa.me/${COUNTRY_CODE}${RAW_PHONE}?text=${WHATSAPP_PREFILLED_MESSAGE}`,

  // Telegram direct click-to-chat integration (with pre-filled message like WhatsApp)
  telegram: `https://telegram.me/Mohammad_041?text=${TELEGRAM_PREFILLED_MESSAGE}`,
  telegramApp: `tg://resolve?domain=Mohammad_041&text=${TELEGRAM_PREFILLED_MESSAGE}`,
  telegramProfile: 'https://telegram.me/Mohammad_041',
  telegramUsername: '@Mohammad_041',
  telegramBot: 'https://telegram.me/Mohammad_041_bot',

  // Downloadable Resume path (populated dynamically from Cloudinary)
  resume: '',
};

export default socialLinks;
