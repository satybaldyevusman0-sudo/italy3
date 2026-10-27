// Сырткы интеграциялар: Telegram бот, Email (EmailJS), Cloudinary, котормочу API
const env = import.meta.env;

/** Telegram ботко билдирүү жөнөтүү */
export async function sendTelegram(text) {
  const token = env.VITE_TG_TOKEN;
  const chatId = env.VITE_TG_CHAT_ID;
  if (!token || !chatId) {
    console.info('[Telegram демо]', text);
    return { demo: true };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  return res.json();
}

/** Почтага заказ жөнөтүү (EmailJS REST API) */
export async function sendEmail(params) {
  const { VITE_EMAILJS_SERVICE: service, VITE_EMAILJS_TEMPLATE: template, VITE_EMAILJS_PUBLIC_KEY: key } = env;
  if (!service || !template || !key) {
    console.info('[Email демо]', params);
    return { demo: true };
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: service, template_id: template, user_id: key, template_params: params }),
  });
  return { ok: res.ok };
}

/** Заказ тууралуу Telegram + Email билдирүүлөрүн бирге жөнөтүү */
export async function notifyOrder(order) {
  const lines = order.items.map((i) => `• ${i.name} × ${i.qty} — ${i.price * i.qty} сом`).join('\n');
  const text = `🎓 <b>Жаңы заказ ${order.number}</b>\n👤 ${order.customer.name} (${order.customer.phone})\n📧 ${order.customer.email}\n\n${lines}\n\n💰 Жалпы: <b>${order.total} сом</b>\n💳 ${order.paymentMethod}`;
  const results = await Promise.allSettled([
    sendTelegram(text),
    sendEmail({ to_email: order.customer.email, to_name: order.customer.name, order_number: order.number, order_items: lines, order_total: order.total }),
  ]);
  return results;
}

/** Cloudinary'ге сүрөт жүктөө (unsigned preset). Ачкыч жок болсо base64 кайтарат */
export async function uploadImage(file, onProgress) {
  const cloud = env.VITE_CLOUDINARY_CLOUD;
  const preset = env.VITE_CLOUDINARY_PRESET;
  if (!cloud || !preset) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      reader.onload = () => resolve({ url: reader.result, demo: true });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      xhr.status < 300 ? resolve({ url: data.secure_url }) : reject(new Error(data.error?.message || 'Жүктөө катасы'));
    };
    xhr.onerror = () => reject(new Error('Тармак катасы'));
    xhr.send(form);
  });
}

/** Котормочу: MyMemory акысыз API (kg ↔ ru ↔ en) */
export async function translateText(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Котормо кызматы жеткиликсиз');
  const data = await res.json();
  return data.responseData?.translatedText || '';
}

/** Евро курсу (ачык API) — баа калькулятору үчүн */
export async function fetchEuroRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR');
    const data = await res.json();
    return data.rates?.KGS || 100;
  } catch {
    return 100;
  }
}
