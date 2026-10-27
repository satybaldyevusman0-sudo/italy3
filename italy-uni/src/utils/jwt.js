// JWT түзүү жана текшерүү (демо: HMAC ордуна жөнөкөй кол тамга).
// Чыныгы долбоордо токенди сервер берет, фронтенд аны гана сактап, текшерет.
const SECRET = 'studyitalia-demo-secret';

const b64 = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const unb64 = (str) => {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(s))));
};

function sign(data) {
  let h = 0;
  const s = data + SECRET;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export function createToken(payload, hours = 24) {
  const header = b64({ alg: 'HS256', typ: 'JWT' });
  const body = b64({ ...payload, iat: Date.now(), exp: Date.now() + hours * 3600 * 1000 });
  return `${header}.${body}.${sign(header + '.' + body)}`;
}

export function decodeToken(token) {
  try {
    return unb64(token.split('.')[1]);
  } catch {
    return null;
  }
}

export function verifyToken(token) {
  if (!token || token.split('.').length !== 3) return null;
  const [h, b, s] = token.split('.');
  if (sign(h + '.' + b) !== s) return null;
  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) return null;
  return payload;
}
