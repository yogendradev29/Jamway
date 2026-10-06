const WA_NUMBER='918302891147';
const $=id=>document.getElementById(id);
const wa=(message)=>window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,'_blank');

const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',window.scrollY>30));
const menu=$('menuBtn');
const nav=document.querySelector('.main-nav');
if(menu) menu.addEventListener('click',()=>nav.classList.toggle('open'));

document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav&&nav.classList.remove('open')));

function setDateLimits(){
  const checkins=document.querySelectorAll('input[type="date"][data-role="checkin"]');
  const today=new Date().toISOString().split('T')[0];
  checkins.forEach(input=>{
    input.min=today;
    const outId=input.dataset.out;
    const out=document.getElementById(outId);
    input.addEventListener('change',()=>{if(out&&input.value){const d=new Date(input.value+'T00:00:00');d.setDate(d.getDate()+1);out.min=d.toISOString().split('T')[0];if(out.value&&out.value<=input.value)out.value='';}});
  });
}
setDateLimits();
function pretty(value){return value?new Date(value+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):''}

// Resort availability
const resortForm=$('resortAvailability');
const modal=$('availabilityModal');
if(resortForm){
  resortForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(resortForm);
    $('availabilitySummary').textContent=`${pretty(data.get('checkin'))} → ${pretty(data.get('checkout'))} · ${data.get('rooms')} room(s)`;
    modal.classList.add('show');
  });
}
if($('closeAvailability')) $('closeAvailability').onclick=()=>modal.classList.remove('show');
if(modal) modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
const bookingForm=$('bookingForm');
if(bookingForm) bookingForm.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(bookingForm);const original=new FormData(resortForm);
  const msg=`Hello, I want to check room availability.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')||'Not provided'}\nCheck-in: ${pretty(original.get('checkin'))}\nCheck-out: ${pretty(original.get('checkout'))}\nRooms required: ${original.get('rooms')}\n\nPlease confirm availability and tariff.`;
  wa(msg);modal.classList.remove('show');bookingForm.reset();
});

// Safari enquiry
const safariForm=$('safariEnquiry');
if(safariForm) safariForm.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(safariForm);
  const msg=`Hello, I am interested in a safari / experience package.\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')||'Not provided'}\nPackage: ${d.get('package')}\nCheck-in: ${pretty(d.get('checkin'))}\nCheck-out: ${pretty(d.get('checkout'))}\nGuests: ${d.get('guests')||'Not specified'}\nExtra services / remarks: ${d.get('remarks')||'None'}\n\nPlease share availability, price and inclusions.`;
  wa(msg);safariForm.reset();
});

document.querySelectorAll('[data-package]').forEach(btn=>btn.addEventListener('click',()=>{
  const select=$('package');
  if(select){
    const raw=btn.dataset.package||'';
    const option=[...select.options].find(o=>raw.toLowerCase().startsWith(o.text.toLowerCase())||o.text.toLowerCase().startsWith(raw.toLowerCase()));
    if(option) select.value=option.value;
  }
  document.getElementById('enquiry')?.scrollIntoView({behavior:'smooth'});
}));

document.querySelectorAll('[data-stay]').forEach(btn=>btn.addEventListener('click',()=>{
  const raw=btn.dataset.stay||'';
  wa(`Hello, I am interested in the following stay plan.\n\n${raw}\n\nPlease share the current JAMWAY tariff, availability and exact meal inclusions for my dates.`);
}));

const contactForm=$('contactForm');
if(contactForm) contactForm.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(contactForm);
  wa(`Hello, I have a general enquiry.\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')||'Not provided'}\nMessage: ${d.get('message')}`);contactForm.reset();
});


const reviewForm=$('reviewForm');
if(reviewForm) reviewForm.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(reviewForm);
  const msg=`Hello, I would like to share my experience.\n\nName: ${d.get('name')}\nExperience: ${d.get('experience')}\nRating: ${d.get('rating')}\nReview: ${d.get('review')}\n\nPlease let me know if this feedback can be featured on the JAMWAY website.`;
  wa(msg);reviewForm.reset();
});

// Keep forms safe if opened directly
if($('year')) $('year').textContent=new Date().getFullYear();


// Mobile dropdowns and subtle reveal animations
if(window.matchMedia('(max-width: 900px)').matches){
  document.querySelectorAll('.drop-label').forEach(label=>label.addEventListener('click',e=>{
    e.preventDefault();
    label.parentElement.classList.toggle('open');
  }));
}
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal,.section .container').forEach(el=>revealObserver.observe(el));
