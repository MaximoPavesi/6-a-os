const startDate = new Date(2020, 10, 2, 0, 0, 0);

function getElapsedParts() {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

function updateLivedTime() {
  const { years, months, days } = getElapsedParts();
  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
}

function getNextAnniversary() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), startDate.getDate(), 0, 0, 0);

  if (next <= now) {
    next.setMonth(next.getMonth() + 1);
  }

  return next;
}

function formatDate(date, locale = 'es-ES') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function updateCountdown() {
  const target = getNextAnniversary();
  const now = new Date();
  const diff = Math.max(target.getTime() - now.getTime(), 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('anniversaryDate').textContent = `Hasta el ${formatDate(target)}`;
  document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
  document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

function updateClock(zone, elementId, dateElementId) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const now = new Date();
  const parts = formatter.formatToParts(now);
  const time = parts
    .filter((part) => part.type === 'hour' || part.type === 'minute' || part.type === 'second')
    .map((part) => part.value)
    .join(':');

  const date = parts
    .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
    .map((part) => part.value)
    .join(' ');

  document.getElementById(elementId).textContent = time;
  document.getElementById(dateElementId).textContent = date;
}

function tick() {
  updateLivedTime();
  updateCountdown();
  updateClock('Europe/Madrid', 'spain-time', 'spain-date');
  updateClock('America/Argentina/Buenos_Aires', 'argentina-time', 'argentina-date');
}

const secretButton = document.getElementById('secretButton');
const secretMessage = document.getElementById('secretMessage');

if (secretButton && secretMessage) {
  secretButton.addEventListener('click', () => {
    secretMessage.classList.remove('hidden');
    secretButton.textContent = 'Ya lo sabes, te amo 💖';
    secretButton.disabled = true;
    secretButton.style.opacity = '0.9';
  });
}

tick();
setInterval(tick, 1000);
