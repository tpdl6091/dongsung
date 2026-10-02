const CATEGORIES = { skincare: '스킨케어', makeup: '메이크업', tools: '메이크업 도구' };

const PRODUCTS = [
  { id: 1, cat: 'skincare', name: '수분 앰플 토너', desc: '촉촉함이 오래가는 저자극 토너', price: 18000, emoji: '💧', bg: '#d9efff' },
  { id: 2, cat: 'skincare', name: '히알루론 세럼', desc: '속건조를 채워주는 고농축 세럼', price: 32000, emoji: '🧴', bg: '#e6f7f1' },
  { id: 3, cat: 'skincare', name: '시카 진정 크림', desc: '예민한 피부를 위한 진정 크림', price: 27000, emoji: '🌿', bg: '#e3f5d8' },
  { id: 4, cat: 'skincare', name: '비타민C 브라이트닝 에센스', desc: '맑고 환한 피부 톤 케어', price: 35000, emoji: '🍊', bg: '#ffeccc' },
  { id: 5, cat: 'skincare', name: '약산성 클렌징 폼', desc: '부드럽게 씻기는 데일리 폼', price: 12000, emoji: '🫧', bg: '#e8eefc' },
  { id: 6, cat: 'skincare', name: '데일리 선크림 SPF50+', desc: '백탁 없는 산뜻한 자외선 차단제', price: 19000, emoji: '☀️', bg: '#fff3c4' },
  { id: 7, cat: 'makeup', name: '벨벳 매트 립스틱', desc: '선명한 발색, 부드러운 사용감', price: 16000, emoji: '💄', bg: '#ffd9e0' },
  { id: 8, cat: 'makeup', name: '쿠션 파운데이션', desc: '커버력과 촉촉함을 동시에', price: 29000, emoji: '🪞', bg: '#fde6d8' },
  { id: 9, cat: 'makeup', name: '9색 아이섀도 팔레트', desc: '데일리부터 포인트까지 활용', price: 24000, emoji: '🎨', bg: '#ebdcf7' },
  { id: 10, cat: 'makeup', name: '워터프루프 마스카라', desc: '번짐 없이 길고 선명하게', price: 13000, emoji: '👁️', bg: '#e4e4ea' },
  { id: 11, cat: 'makeup', name: '핑크 블러셔', desc: '자연스러운 혈색 표현', price: 14000, emoji: '🌸', bg: '#ffdce8' },
  { id: 12, cat: 'makeup', name: '글로시 틴트', desc: '촉촉하게 반짝이는 물막 입술', price: 11000, emoji: '🍒', bg: '#ffd1d1' },
  { id: 13, cat: 'tools', name: '페이스 브러시 세트', desc: '부드러운 모 5종 세트', price: 22000, emoji: '🖌️', bg: '#f3e1d3' },
  { id: 14, cat: 'tools', name: '에어 퍼프 (2P)', desc: '밀착력 좋은 쿠션 전용 퍼프', price: 6000, emoji: '☁️', bg: '#e8f1fa' },
  { id: 15, cat: 'tools', name: '뷰티 블렌더 스펀지', desc: '물을 먹으면 커지는 메이크업 스펀지', price: 9000, emoji: '🧽', bg: '#ffe0ec' },
  { id: 16, cat: 'tools', name: '속눈썹 뷰러', desc: '오래 유지되는 자연스러운 컬', price: 8000, emoji: '✂️', bg: '#e9e9f5' },
  { id: 17, cat: 'tools', name: '접이식 파우치 거울', desc: '휴대하기 좋은 LED 거울', price: 15000, emoji: '🔍', bg: '#e0f4f4' },
  { id: 18, cat: 'tools', name: '메이크업 브러시 파우치', desc: '브러시를 깔끔하게 보관', price: 10000, emoji: '👜', bg: '#f1e4f7' },
];

const won = n => n.toLocaleString('ko-KR') + '원';
const $ = id => document.getElementById(id);
const state = { cat: 'all', query: '', sort: 'default', cart: loadCart() };

function loadCart() {
  try { return JSON.parse(localStorage.getItem('dongsung-cart')) || {}; } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem('dongsung-cart', JSON.stringify(state.cart)); } catch {}
}

function renderProducts() {
  let list = PRODUCTS.filter(p =>
    (state.cat === 'all' || p.cat === state.cat) &&
    (p.name + p.desc).toLowerCase().includes(state.query));
  if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  $('grid').innerHTML = list.map(p => `
    <article class="card">
      <div class="thumb" style="background:${p.bg}">${p.emoji}</div>
      <div class="info">
        <span class="badge">${CATEGORIES[p.cat]}</span>
        <h3 class="name">${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <span class="price">${won(p.price)}</span>
          <button class="add" data-add="${p.id}">담기</button>
        </div>
      </div>
    </article>`).join('');
  $('resultCount').textContent = `상품 ${list.length}개`;
  $('empty').hidden = list.length > 0;
}

function renderCart() {
  const items = Object.entries(state.cart).map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id == id), qty })).filter(i => i.p);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.p.price, 0);
  $('cartCount').textContent = count;
  $('cartTotal').textContent = won(total);
  $('cartList').innerHTML = items.length ? items.map(({ p, qty }) => `
    <li class="cart-item">
      <span class="em">${p.emoji}</span>
      <div class="meta">${p.name}<br><small>${won(p.price)}</small>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="수량 감소">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="수량 증가">+</button>
        </div>
      </div>
      <button class="rm" data-rm="${p.id}" aria-label="삭제">✕</button>
    </li>`).join('') : '<li class="cart-empty">장바구니가 비어 있습니다.</li>';
  saveCart();
}

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 1800);
}

function toggleCart(open) {
  $('drawer').classList.toggle('open', open);
  $('drawer').setAttribute('aria-hidden', String(!open));
  $('overlay').hidden = !open;
}

function change(id, delta) {
  const q = (state.cart[id] || 0) + delta;
  if (q <= 0) delete state.cart[id]; else state.cart[id] = q;
  renderCart();
}

$('tabs').addEventListener('click', e => {
  const b = e.target.closest('.tab');
  if (!b) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === b));
  state.cat = b.dataset.cat;
  renderProducts();
});
$('search').addEventListener('input', e => { state.query = e.target.value.trim().toLowerCase(); renderProducts(); });
$('sort').addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });
$('grid').addEventListener('click', e => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  change(b.dataset.add, 1);
  toast('장바구니에 담았습니다 🛒');
});
$('cartList').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.inc) change(b.dataset.inc, 1);
  if (b.dataset.dec) change(b.dataset.dec, -1);
  if (b.dataset.rm) { delete state.cart[b.dataset.rm]; renderCart(); }
});
$('cartBtn').addEventListener('click', () => toggleCart(true));
$('closeCart').addEventListener('click', () => toggleCart(false));
$('overlay').addEventListener('click', () => toggleCart(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('logo').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('checkout').addEventListener('click', () => {
  if (!Object.keys(state.cart).length) return toast('장바구니가 비어 있습니다.');
  state.cart = {};
  renderCart();
  toggleCart(false);
  toast('주문이 완료되었습니다! 감사합니다 💖');
});

renderProducts();
renderCart();
