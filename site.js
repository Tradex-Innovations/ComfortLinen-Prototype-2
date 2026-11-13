import {media} from './media.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const heroPreview = document.documentElement.dataset.preview === 'hero';
if (heroPreview) {
  $$('.desktop-nav a, #site-menu nav a').filter(link => link.getAttribute('href') !== '#home').forEach(link => {
    link.setAttribute('aria-disabled', 'true');
    link.tabIndex = -1;
    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
    }, {capture: true});
  });
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = $('#home');
const heroVideo = $('#hero-video');
const playbackButton = $('#hero-playback');
const fullFilm = $('#full-film');
const filmDialog = $('#film-dialog');
let userPaused = false;
let currentService = 0;
let serviceTimer = 0;

for (const video of [heroVideo, fullFilm]) {
  video.poster = media.hero.poster;
  const source = $('source', video);
  if (source.getAttribute('src') !== media.hero.video) {
    source.src = media.hero.video;
    video.load();
  }
}

$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Explicit user pauses are respected when returning to the hero or a tab.
async function syncHeroPlayback() {
  const heroVisible = hero.getBoundingClientRect().bottom > 0;
  const shouldPlay = !userPaused && !reducedMotion.matches && !document.hidden && !document.querySelector('dialog[open]') && heroVisible;
  if (!shouldPlay) { heroVideo.pause(); return; }
  try { await heroVideo.play(); } catch { /* Keep the poster and a working Play control when autoplay is blocked. */ }
}
function updatePlaybackButton() {
  const paused = heroVideo.paused;
  playbackButton.setAttribute('aria-label', paused ? 'Play background film' : 'Pause background film');
  $('use', playbackButton).setAttribute('href', paused ? '#play' : '#pause');
}
heroVideo.addEventListener('play', updatePlaybackButton);
heroVideo.addEventListener('pause', updatePlaybackButton);
playbackButton.addEventListener('click', () => {
  userPaused = !heroVideo.paused;
  if (userPaused) heroVideo.pause();
  else heroVideo.play().catch(updatePlaybackButton);
});
if (reducedMotion.matches || navigator.connection?.saveData) { userPaused = true; heroVideo.pause(); }
syncHeroPlayback();
updatePlaybackButton();

// All optional section videos are controlled from media.js and only play onscreen.
const sectionVideos = [];
function setSectionMedia(image, video, source, alt) {
  video.pause();
  video.removeAttribute('src');
  video.hidden = true;
  if (image.getAttribute('src') !== source.image) image.src = source.image;
  if (alt) image.alt = alt;
  image.hidden = false;
  if (source.video) {
    video.src = source.video;
    video.poster = source.image;
    video.hidden = false;
    if (!sectionVideos.includes(video)) sectionVideos.push(video);
    video.onerror = () => { video.hidden = true; image.hidden = false; };
    syncSectionPlayback();
  }
}
function syncSectionPlayback() {
  for (const video of sectionVideos) {
    const rect = video.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < innerHeight && !video.hidden;
    if (visible && !reducedMotion.matches && !document.hidden && !document.querySelector('dialog[open]')) video.play().catch(() => {});
    else video.pause();
  }
}
setSectionMedia($('#story .story-place img'), $('#story-video'), media.story);
setSectionMedia($('#service-image'), $('#service-video'), media.services[0], media.services[0].alt);
setSectionMedia($('#care-image'), $('#care-video'), media.care.water);

// A single accessible service panel, with mouse, touch and arrow-key navigation.
function displayService(index, focusTab = false) {
  const service = media.services[index];
  currentService = index;
  $$('.service-tabs [role=tab]').forEach((tab, i) => {
    tab.classList.toggle('selected', i === index);
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    if (i === index && focusTab) tab.focus();
  });
  $('#service-panel').setAttribute('aria-labelledby', `tab-${service.id}`);
  $('.service-visual').classList.add('changing');
  clearTimeout(serviceTimer);
  serviceTimer = setTimeout(() => {
    setSectionMedia($('#service-image'), $('#service-video'), service, service.alt);
    const heading = $('#service-headline');
    heading.replaceChildren(...service.headline.split('\n').flatMap((line, i) => i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
    $('#service-text').textContent = service.text;
    $('#service-details').replaceChildren(...service.details.map(detail => {
      const item = document.createElement('li'); item.textContent = detail; return item;
    }));
    $('#service-number').textContent = String(index + 1).padStart(2, '0');
    $('#service-caption').textContent = `${String(index + 1).padStart(2, '0')} / ${service.title.toUpperCase()}`;
    $('#service-enquire').dataset.enquire = service.title;
    $('.service-visual').classList.remove('changing');
    $('.service-copy').classList.remove('swap-in');
    requestAnimationFrame(() => $('.service-copy').classList.add('swap-in'));
  }, reducedMotion.matches ? 0 : 160);
}
$$('[data-service]').forEach(tab => {
  tab.addEventListener('click', () => displayService(Number(tab.dataset.service)));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (currentService + 1) % media.services.length;
    if (event.key === 'ArrowLeft') next = (currentService + media.services.length - 1) % media.services.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = media.services.length - 1;
    if (next !== undefined) { event.preventDefault(); displayService(next, true); }
  });
});
$('#previous-service').addEventListener('click', () => displayService((currentService + media.services.length - 1) % media.services.length));
$('#next-service').addEventListener('click', () => displayService((currentService + 1) % media.services.length));

const careAlts = {water: 'The quiet shoreline at sunset', energy: 'Solar panels being installed on the ComfortLinen laundry roof', linen: 'Linen being carefully processed in a commercial laundry'};
$$('[data-care]').forEach(button => button.addEventListener('click', () => {
  const alreadyOpen = button.getAttribute('aria-expanded') === 'true';
  $$('[data-care]').forEach(other => {
    const open = other === button && !alreadyOpen;
    other.setAttribute('aria-expanded', String(open));
    other.closest('.care-item').classList.toggle('open', open);
    document.getElementById(other.getAttribute('aria-controls')).hidden = !open;
  });
  if (!alreadyOpen) setSectionMedia($('#care-image'), $('#care-video'), media.care[button.dataset.care], careAlts[button.dataset.care]);
}));

// Native dialogs keep focus inside, support Escape and restore the opener.
function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
  syncHeroPlayback(); syncSectionPlayback();
}
$$('dialog').forEach(dialog => {
  $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.toggle('dialog-open', !!document.querySelector('dialog[open]'));
    if (dialog === filmDialog) fullFilm.pause();
    if (dialog.id === 'site-menu') $('.menu-toggle').setAttribute('aria-expanded', 'false');
    syncHeroPlayback(); syncSectionPlayback();
  });
});
$('.menu-toggle').addEventListener('click', () => {
  $('.menu-toggle').setAttribute('aria-expanded', 'true');
  openDialog($('#site-menu'));
});
$$('#site-menu a[href^="#"]').forEach(link => link.addEventListener('click', () => $('#site-menu').close()));
$$('[data-open-film]').forEach(button => button.addEventListener('click', () => {
  openDialog(filmDialog);
  fullFilm.currentTime = 0;
  fullFilm.play().catch(() => {});
}));
$$('[data-enquire]').forEach(button => button.addEventListener('click', () => {
  const service = button.dataset.enquire;
  if (service) $('#enquiry-form select').value = service;
  openDialog($('#enquiry-dialog'));
}));
$('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hello ComfortLinen,\n\nI’d like to discuss ${data.get('service').toLowerCase()}.\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nEmail: ${data.get('email')}\n\n${data.get('message') || 'Please contact me to discuss our linen requirements.'}\n\nKind regards,\n${data.get('name')}`;
  $('#draft-preview').textContent = message;
  $('#email-draft').href = `mailto:hello@comfortlinen.co.uk?subject=${encodeURIComponent(`Linen enquiry — ${data.get('business')}`)}&body=${encodeURIComponent(message)}`;
  $('#email-draft').removeAttribute('aria-disabled');
  $('#draft-heading').textContent = 'Your enquiry is ready.';
  $('#draft-status').textContent = 'Open the draft in your email app to review and send it to ComfortLinen.';
  $('#enquiry-result').classList.add('draft-ready');
  $('#email-draft').focus({preventScroll: true});
  $('#enquiry-result').scrollIntoView({block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth'});
});
$('#enquiry-form').addEventListener('input', () => {
  $('#email-draft').removeAttribute('href');
  $('#email-draft').setAttribute('aria-disabled', 'true');
  $('#draft-heading').textContent = 'Your email draft';
  $('#draft-status').textContent = 'Prepare your updated enquiry before opening the email draft.';
  $('#enquiry-result').classList.remove('draft-ready');
  $('#draft-preview').textContent = '';
});

// Native scrolling remains intact. Reveal and parallax work is bounded to a frame.
if (!reducedMotion.matches) document.documentElement.classList.add('js-motion');
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
}), {threshold: .1});
$$('[data-reveal]').forEach(el => revealObserver.observe(el));
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    $$('.desktop-nav a').forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, {rootMargin: '-15% 0px -60% 0px'});
$$('main>.section').forEach(section => sectionObserver.observe(section));
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const offset = scrollY;
  const denominator = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress i').style.transform = `scaleX(${denominator > 0 ? offset / denominator : 0})`;
  $('#header').classList.toggle('scrolled', offset > innerHeight - 100);
  $('.back-to-top').classList.toggle('visible', offset > innerHeight);
  if (!reducedMotion.matches && offset < innerHeight) $('.hero-media').style.transform = `translateY(${offset * .16}px)`;
  else $('.hero-media').style.transform = '';
  syncHeroPlayback(); syncSectionPlayback();
}
function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', scheduleScroll, {passive: true});
window.addEventListener('resize', scheduleScroll, {passive: true});
document.addEventListener('visibilitychange', () => { syncHeroPlayback(); syncSectionPlayback(); });
reducedMotion.addEventListener('change', () => {
  document.documentElement.classList.toggle('js-motion', !reducedMotion.matches);
  syncHeroPlayback(); syncSectionPlayback(); scheduleScroll();
});
updateScroll();
