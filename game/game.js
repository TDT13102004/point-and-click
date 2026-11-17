/* Những bóng người trên tầng 13 — bản chơi thử (demo v1).
   Scenes, hotspots and story beats live in SCENES below. Asset paths come from
   assets/demo-v1/manifest.json, so a v2 file registered there shows up here. */
(() => {
  'use strict';
  const ASSET_ROOT = '../assets/demo-v1/';
  const SAVE_KEY = 'anvan-demo-v1';

  // Fallback paths, used if manifest.json cannot be loaded.
  let files = {
    'BG-1305': 'backgrounds/bg-1305-v1.png',
    'BG-CORRIDOR': 'backgrounds/bg-corridor-v1.png',
    'BG-STATION': 'backgrounds/bg-station-v1.png',
    'CL-HATCH-CLOSED': 'closeups/cl-hatch-closed-v1.png',
    'CL-HATCH-OPEN': 'closeups/cl-hatch-open-v1.png',
    'CL-HATCH-EMPTY': 'closeups/cl-hatch-empty-v1.png',
    'PROP-RED-BOOK': 'props/prop-red-book-v1.png',
    'MAP-F13': 'maps/map-floor13-v1.svg',
    'OV-SHADOW': 'overlays/ov-shadow-v1.svg',
    'OV-VIGNETTE': 'overlays/ov-vignette-v1.svg',
    'OV-CCTV': 'overlays/ov-cctv-v1.svg',
    'AMB-ROOM': 'audio/amb-room-tone-v1.wav',
    'SFX-STATIC': 'audio/sfx-recorder-static-v1.wav',
    'SFX-KNOCK': 'audio/sfx-three-knocks-v1.wav',
    'SFX-CREAK': 'audio/sfx-door-creak-v1.wav',
    'SFX-PAPER': 'audio/sfx-paper-v1.wav',
    'SFX-CLICK': 'audio/sfx-ui-click-v1.wav',
    'VOICE-EVP': 'audio/voice-evp-placeholder-v1.wav',
  };
  const url = id => ASSET_ROOT + files[id];

  // ---------- Text ----------
  const DOCS = {
    notice: {
      title: 'Ghi chú bàn giao chìa khóa',
      body: 'An Linh kiểm tra căn 1305 theo sự thu xếp của tổ quản lý. Giữ lại hiện trạng đồ đạc, chụp ảnh trước khi di chuyển. Căn hộ đã bỏ trống nhiều năm.',
    },
    bookNote: {
      title: 'Mảnh giấy trong sách đỏ',
      body: 'Chúng tôi thuê lại căn hộ này qua một người quen để có chỗ gặp nhau. Tôi đã nghĩ ở ngay tầng này sẽ dễ che giấu mọi chuyện hơn. Nếu có ai tìm thấy cuốn sách, xin đừng coi những gì viết trong đó là một trò đùa.',
    },
    evp: '[Nhiễu] Đừng nhìn phía sau. Cuốn sách. Trong vách. [Nhiễu]',
  };

  // ---------- State ----------
  const fresh = () => ({
    scene: 'station', items: [], screws: [false, false, false, false],
    flags: {}, visited: {},
  });
  let S = fresh();
  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} };
  const load = () => { try { const v = JSON.parse(localStorage.getItem(SAVE_KEY)); return v && v.scene ? v : null; } catch (e) { return null; } };
  const has = i => S.items.includes(i);
  const give = i => { if (!has(i)) S.items.push(i); renderInv(); };
  const flag = f => !!S.flags[f];
  const set = f => { S.flags[f] = true; };

  // ---------- Audio ----------
  let soundOn = true;
  const sounds = {};
  let amb = null;
  function play(id, vol = 0.6) {
    if (!soundOn) return null;
    const a = sounds[id] || (sounds[id] = new Audio(url(id)));
    a.pause(); a.currentTime = 0; a.volume = vol;
    a.play().catch(() => {});
    return a;
  }
  function ambience(on) {
    if (!amb) { amb = new Audio(url('AMB-ROOM')); amb.loop = true; amb.volume = 0.25; }
    if (on && soundOn) amb.play().catch(() => {}); else amb.pause();
  }

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);
  const stage = $('stage'), base = $('base'), layers = $('layers'), spots = $('spots');
  let captionTimer = 0;
  function say(html, ms = 0) {
    $('caption').innerHTML = html;
    clearTimeout(captionTimer);
    if (ms) captionTimer = setTimeout(() => { $('caption').textContent = ''; }, ms);
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function modal(title, html, onClose) {
    $('mtitle').textContent = title;
    $('mbody').innerHTML = html;
    $('modal').hidden = false;
    $('mclose').focus();
    $('mclose').onclick = () => { $('modal').hidden = true; if (onClose) onClose(); };
  }

  // ---------- Inventory ----------
  const KEY_SVG = '<svg viewBox="0 0 96 96" fill="none" stroke="#cfc49f" stroke-width="5" stroke-linecap="round"><circle cx="30" cy="48" r="14"/><path d="M44 48h38M70 48v12M80 48v9"/></svg>';
  const DRIVER_SVG = '<svg viewBox="0 0 96 96" fill="none" stroke="#cfc49f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 78l14-14M32 64l8 8 30-30-8-8z"/><path d="M62 34l14-14M70 20l6 6"/></svg>';
  const ITEMS = {
    key: { name: 'Chìa khóa căn 1305', icon: () => KEY_SVG,
      use: () => say('Chìa khóa căn 1305, buộc bằng sợi dây dù đã bạc màu.', 4000) },
    driver: { name: 'Tua vít', icon: () => DRIVER_SVG,
      use: () => say('Tua vít đầu chữ thập, cán gỗ. Dùng được cho các con vít nhỏ.', 4000) },
    book: { name: 'Sách đỏ', icon: () => `<img src="${url('PROP-RED-BOOK')}" alt="">`,
      use: () => readBook() },
  };
  function renderInv() {
    const inv = $('inv'); inv.replaceChildren();
    for (const id of S.items) {
      const b = document.createElement('button');
      b.title = b.ariaLabel = ITEMS[id].name;
      b.innerHTML = ITEMS[id].icon();
      b.onclick = () => { play('SFX-CLICK', 0.3); ITEMS[id].use(); };
      inv.append(b);
    }
  }

  // ---------- Scenes ----------
  // rect = [x, y, w, h] normalized to the image (the stage has the image's aspect ratio).
  const SCENES = {
    station: {
      name: 'Chiếu nghỉ tầng 12', bg: 'BG-STATION', amb: true,
      enter() {
        if (!S.visited.station) say('Bạn dựng bàn theo dõi ở chiếu nghỉ tầng 12. Đêm qua máy ghi âm vẫn chạy. <em>Bấm vào đồ vật để xem xét.</em>');
      },
      spots: [
        { id: 'laptop', label: 'Máy tính', rect: [0.71, 0.455, 0.14, 0.18], act: caseFile },
        { id: 'recorder', label: 'Máy ghi âm', rect: [0.665, 0.555, 0.065, 0.085], act: listenEvp },
        { id: 'notebook', label: 'Sổ ghi chép', rect: [0.775, 0.62, 0.12, 0.09], act: readNotice },
        { id: 'camera', label: 'Máy ảnh', rect: [0.89, 0.61, 0.075, 0.095], act: () => go('cctv') },
        { id: 'board', label: 'Bảng tin', rect: [0.535, 0.235, 0.095, 0.145], act: showMap },
        { id: 'stairs', label: 'Cầu thang lên tầng 13', rect: [0.0, 0.2, 0.3, 0.8], act: () => go('corridor') },
      ],
    },
    cctv: {
      name: 'Ảnh chụp đêm qua', bg: 'BG-CORRIDOR', back: 'station',
      overlays: () => [
        { full: 'OV-CCTV', opacity: 0.6 },
        { shadow: [0.615, 0.36, 0.11, 0.49], opacity: 0.6 },
        { stamp: 'CAM 02 · TẦNG 13 · 02:13:47' },
      ],
      enter() { say('Ảnh tự chụp lúc 2 giờ 13 phút sáng. Ở khung cửa giữa hành lang có <em>một bóng người</em>. Lúc đó trên tầng 13 không có ai.'); },
      spots: [
        { id: 'shadow', label: 'Bóng người', rect: [0.615, 0.36, 0.11, 0.49],
          act: () => say('Không nhìn rõ mặt. Bóng đứng ngay trước cửa căn 1307, gần căn 1305.', 5000) },
      ],
    },
    corridor: {
      name: 'Hành lang tầng 13', bg: 'BG-CORRIDOR', back: 'station', backLabel: '← Xuống tầng 12',
      overlays: () => [
        { plate: '1305', rect: [0.868, 0.035, 0.055, 0.06] },
        { plate: '1307', rect: [0.645, 0.205, 0.04, 0.045] },
        ...(S.flags.corridorGhostNow ? [{ shadow: [0.615, 0.36, 0.11, 0.49], opacity: 0.55, id: 'cghost' }] : []),
      ],
      enter() {
        if (flag('heardEvp') && !flag('corridorGhost')) {
          set('corridorGhost'); S.flags.corridorGhostNow = true;
          say('Đèn tuýp chớp một nhịp. Ở cửa căn 1307…');
          setTimeout(() => {
            const g = layers.querySelector('[data-id="cghost"]');
            if (g) g.style.opacity = 0;
            S.flags.corridorGhostNow = false; save();
            say('…không còn gì. Bạn đứng yên một lúc lâu mới dám thở ra.', 6000);
          }, 1800);
        } else if (!S.visited.corridor) {
          say('Hành lang tầng 13. Các căn hộ đã bỏ trống từ lâu. Căn 1305 ở ngay bên phải.');
        }
      },
      spots: [
        { id: 'door1305', label: 'Cửa căn 1305', rect: [0.83, 0.11, 0.155, 0.89], act: enter1305 },
        { id: 'door1307', label: 'Cửa căn 1307', rect: [0.625, 0.25, 0.08, 0.62],
          act: () => say('Căn 1307 bung cửa, bên trong chỉ còn mấy chồng bát đĩa phủ bụi.', 4500) },
        { id: 'window', label: 'Lan can', rect: [0.0, 0.0, 0.2, 0.9],
          act: () => say('Bên kia sân là khối B. Vài ô cửa còn sáng đèn, quần áo phơi kín lan can.', 4500) },
        { id: 'stairs', label: 'Cầu thang', rect: [0.27, 0.38, 0.07, 0.2], act: () => go('station') },
      ],
    },
    room: {
      name: 'Căn 1305', bg: 'BG-1305', amb: true, back: 'corridor', backLabel: '← Ra hành lang',
      overlays: () => flag('readBook') && !flag('ended') ? [
        { full: 'OV-VIGNETTE', opacity: 0.35 },
        { shadow: [0.76, 0.32, 0.13, 0.48], opacity: 0.8, id: 'rghost' },
      ] : [],
      enter() {
        if (flag('readBook') && !flag('ended')) return say('Có thứ gì đó đứng ở cửa phòng ngủ.');
        if (!S.visited.room) say('Căn 1305. Mùi ẩm và bụi vôi. Đồ đạc vẫn để nguyên như ngày người ta dọn đi.');
      },
      spots: [
        { id: 'ghost', label: 'Bóng người', rect: [0.76, 0.32, 0.13, 0.48], when: () => flag('readBook') && !flag('ended'), act: ending },
        { id: 'window', label: 'Cửa sổ', rect: [0.16, 0.18, 0.2, 0.56],
          act: () => say('Song sắt hoen gỉ. Ngoài kia là tán cây sấu và mấy dây phơi đồ của khối B.', 4500) },
        { id: 'table', label: 'Bàn', rect: [0.43, 0.74, 0.15, 0.22],
          act: () => say('Mặt bàn có vòng tròn mờ như vết đáy cốc, và một lớp bụi rất dày. Không ai ngồi đây nhiều năm rồi.', 5000) },
        { id: 'cabinet', label: 'Tủ gỗ', rect: [0.0, 0.22, 0.15, 0.76], act: searchCabinet },
        { id: 'hatch', label: 'Ô kỹ thuật', rect: [0.62, 0.41, 0.09, 0.17], act: () => go('hatch') },
        { id: 'bedroom', label: 'Phòng ngủ', rect: [0.765, 0.27, 0.12, 0.5], when: () => !flag('readBook') || flag('ended'),
          act: () => say(flag('ended') ? 'Phòng ngủ yên ắng. Không khí đã bớt nặng nề.' : 'Một chiếc giường sắt trơ khung. Bạn có cảm giác ai đó vừa đứng đây.', 4500) },
      ],
    },
    hatch: {
      name: 'Ô kỹ thuật', back: 'room',
      bg: () => flag('tookBook') ? 'CL-HATCH-EMPTY' : flag('hatchOpen') ? 'CL-HATCH-OPEN' : 'CL-HATCH-CLOSED',
      enter() {
        if (flag('tookBook')) return say('Ô kỹ thuật trống trơn.');
        if (flag('hatchOpen')) return say('Bên trong ô kỹ thuật có một cuốn sách bìa đỏ.');
        say('Một ô kỹ thuật bằng tôn, bắt bốn con vít. Lớp sơn quanh mép còn mới hơn cả bức tường.');
      },
      spots: [
        ...[[0.302, 0.115], [0.696, 0.115], [0.302, 0.86], [0.696, 0.86]].map(([x, y], i) => ({
          id: 'screw' + i, label: 'Con vít', cls: () => 'screw' + (S.screws[i] ? ' done' : ''),
          rect: [x - 0.035, y - 0.06, 0.07, 0.12], when: () => !flag('hatchOpen'),
          act: () => unscrew(i),
        })),
        { id: 'handle', label: 'Tay nắm', rect: [0.655, 0.38, 0.06, 0.19], when: () => !flag('hatchOpen'), act: openHatch },
        { id: 'book', label: 'Sách đỏ', rect: [0.32, 0.64, 0.355, 0.2], when: () => flag('hatchOpen') && !flag('tookBook'), act: takeBook },
      ],
    },
  };

  // ---------- Actions ----------
  function caseFile() {
    play('SFX-CLICK', 0.3);
    const todo = [
      ['Đọc ghi chú bàn giao của tổ quản lý', flag('readNotice')],
      ['Nghe lại băng ghi âm đêm qua', flag('heardEvp')],
      ['Kiểm tra căn 1305', !!S.visited.room],
      ['Tìm thứ được giấu “trong vách”', flag('tookBook')],
    ];
    modal('Hồ sơ vụ việc — khu tập thể An Vân',
      `<p class="meta">Khối C · tầng 13 · đã bỏ trống</p>
       <p>Từ hôm đội thợ tháo vách xử lý thấm dột ở tầng 13, công nhân liên tục thấy <b>hai bóng người</b> lướt qua hành lang rồi khuất sau các cửa căn hộ. Cư dân tầng dưới nghe tiếng kéo lê đồ đạc ban đêm, dù trên đó không còn ai ở.</p>
       <p>Đội thợ đã xin tạm nghỉ. Các gia đình góp tiền mời An Linh đến tìm hiểu.</p>
       <ul>${todo.map(([t, d]) => `<li>${d ? '☑' : '☐'} ${t}</li>`).join('')}</ul>
       ${flag('heardEvp') ? `<p class="evp">${esc(DOCS.evp)}</p>` : ''}`);
  }
  function readNotice() {
    play('SFX-PAPER', 0.5);
    const first = !has('key');
    modal(DOCS.notice.title, `<p>${esc(DOCS.notice.body)}</p>${first ? '<p class="meta">Kẹp trong sổ là chìa khóa căn 1305.</p>' : ''}`, () => {
      if (first) { give('key'); set('readNotice'); save(); say('Bạn cất <em>chìa khóa căn 1305</em>.', 4000); }
    });
  }
  function listenEvp() {
    if (flag('playingEvp')) return;
    S.flags.playingEvp = true;
    play('SFX-CLICK', 0.4);
    const st = play('SFX-STATIC', 0.5);
    say('<em>Rè… rè…</em> Băng ghi âm lúc 2 giờ sáng ở hành lang tầng 13.');
    setTimeout(() => {
      if (st) st.pause();
      const v = play('VOICE-EVP', 0.9);
      say('<em>“…Đừng nhìn phía sau. Cuốn sách. Trong vách…”</em>');
      const done = () => {
        S.flags.playingEvp = false;
        const first = !flag('heardEvp');
        set('heardEvp'); save();
        modal('Phiên EVP — bản chép tạm', `<p class="evp">${esc(DOCS.evp)}</p><p class="meta">Một giọng nữ, rất nhỏ. Bạn chép lại vào hồ sơ.</p>`,
          () => first && say('Cuốn sách… trong vách. Có lẽ nên lên tầng 13 xem lại.', 6000));
      };
      if (v) { v.onended = done; setTimeout(() => { if (S.flags.playingEvp) done(); }, 9000); } else setTimeout(done, 2500);
    }, 1600);
  }
  function showMap() {
    modal('Sơ đồ tầng 13', `<img src="${url('MAP-F13')}" alt="Sơ đồ tầng 13"><p class="meta">Sơ đồ tổ quản lý dán trên bảng tin. Không theo tỷ lệ.</p>`);
  }
  function enter1305() {
    if (!has('key')) return say('Cửa căn 1305 khóa. Tổ quản lý có gửi lại chìa khóa, hình như kẹp trong sổ ghi chép ở bàn tầng 12.', 5500);
    play('SFX-CREAK', 0.6);
    go('room');
  }
  function searchCabinet() {
    if (has('driver')) return say('Ngăn tủ chỉ còn mấy cái nắp chai và một cuộn chỉ.', 4000);
    play('SFX-PAPER', 0.4);
    give('driver'); save();
    say('Trong ngăn tủ có một <em>tua vít</em> đầu chữ thập. Bạn cầm theo.', 4500);
  }
  function unscrew(i) {
    if (S.screws[i]) return;
    if (!has('driver')) return say('Vít bắt chặt. Tay không thì không tháo được. Cần một cái tua vít.', 4500);
    S.screws[i] = true; play('SFX-CLICK', 0.5); save();
    const n = S.screws.filter(Boolean).length;
    render();
    say(n < 4 ? `Đã tháo ${n}/4 con vít.` : 'Đã tháo hết vít. Tấm tôn hơi lỏng ra.', 3500);
  }
  function openHatch() {
    const n = S.screws.filter(Boolean).length;
    if (n < 4) return say(n ? `Tấm tôn còn bắt ${4 - n} con vít, chưa kéo ra được.` : 'Tấm tôn không nhúc nhích. Bốn góc đều bắt vít.', 4000);
    set('hatchOpen'); play('SFX-CREAK', 0.6); save();
    render();
    say('Tấm tôn bật ra. Bên trong, nằm im trên lớp bụi, là <em>một cuốn sách bìa đỏ</em>.');
  }
  function takeBook() {
    set('tookBook'); give('book'); play('SFX-PAPER', 0.6); save();
    render();
    say('Bạn lấy <em>cuốn sách đỏ</em>. Có một mảnh giấy kẹp ở giữa. Bấm vào cuốn sách trên thanh vật phẩm để đọc.');
  }
  function readBook() {
    play('SFX-PAPER', 0.6);
    modal(DOCS.bookNote.title,
      `<img src="${url('PROP-RED-BOOK')}" alt="Sách đỏ" style="max-height:180px;object-fit:contain">
       <p>${esc(DOCS.bookNote.body)}</p><p class="meta">Phần sau của mảnh giấy bị nhòe.</p>`,
      () => {
        if (flag('readBook')) return;
        set('readBook'); save();
        if (S.scene !== 'room' && S.scene !== 'hatch') return;
        if (S.scene === 'hatch') { go('room'); setTimeout(knock, 300); } else { render(); knock(); }
      });
  }
  function knock() {
    const a = play('SFX-KNOCK', 0.8);
    [0.35, 0.9, 1.45].forEach(t => setTimeout(() => {
      stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
    }, t * 1000));
    say('<em>Cộc. Cộc. Cộc.</em> Tiếng gõ phát ra từ sau vách.');
    setTimeout(() => say('Ở cửa phòng ngủ có <em>ai đó</em> đang đứng nhìn bạn.'), 2400);
    return a;
  }
  function ending() {
    const g = layers.querySelector('[data-id="rghost"]');
    if (g) g.style.opacity = 0;
    play('SFX-STATIC', 0.4);
    say('Bóng người tan dần như khói, nhưng bạn biết nó chưa đi xa.');
    setTimeout(() => {
      set('ended'); save(); render();
      const c = $('cover');
      c.querySelector('.cover-in').innerHTML = `
        <p class="kicker">Hết bản chơi thử</p>
        <h1 class="end">Cuốn sách đỏ</h1>
        <p>Bạn đã tìm được cuốn sách giấu trong vách căn 1305. Ai là người viết mảnh giấy, và “cô ấy” là ai?</p>
        <p class="small">Chương tiếp theo đang được làm. Hình và âm thanh trong bản này là bản tạm.</p>
        <button class="primary" id="again">Chơi lại từ đầu</button>
        <button class="primary" id="stay">Ở lại xem tiếp</button>`;
      c.hidden = false;
      $('again').onclick = restart;
      $('stay').onclick = () => { c.hidden = true; };
    }, 2600);
  }

  // ---------- Rendering ----------
  let curBg = null;
  function bgOf(sc) { return typeof sc.bg === 'function' ? sc.bg() : sc.bg; }
  const pct = r => `left:${r[0] * 100}%;top:${r[1] * 100}%;width:${r[2] * 100}%;height:${r[3] * 100}%`;
  function render() {
    const sc = SCENES[S.scene];
    $('where').textContent = sc.name;
    const bg = bgOf(sc);
    if (bg !== curBg) { curBg = bg; base.src = url(bg); }
    base.alt = sc.name;

    layers.replaceChildren();
    for (const o of (sc.overlays ? sc.overlays() : [])) {
      let el;
      if (o.full) { el = document.createElement('img'); el.src = url(o.full); el.className = 'layer-full'; el.alt = ''; }
      else if (o.shadow) { el = document.createElement('div'); el.className = 'shadow'; el.style.cssText = pct(o.shadow); el.innerHTML = `<img src="${url('OV-SHADOW')}" alt="">`; }
      else if (o.plate) { el = document.createElement('div'); el.className = 'plate'; el.style.cssText = pct(o.rect); el.textContent = o.plate; }
      else if (o.stamp) { el = document.createElement('div'); el.className = 'stamp'; el.innerHTML = `<span class="rec">● REC</span> ${o.stamp}`; }
      if (o.opacity != null) el.style.opacity = o.opacity;
      if (o.id) el.dataset.id = o.id;
      layers.append(el);
    }

    spots.replaceChildren();
    for (const p of sc.spots) {
      if (p.when && !p.when()) continue;
      const b = document.createElement('button');
      b.className = 'spot ' + (p.cls ? p.cls() : '');
      b.style.cssText = pct(p.rect);
      b.title = b.ariaLabel = p.label;
      b.onclick = e => { e.stopPropagation(); p.act(); };
      spots.append(b);
    }

    const back = $('back');
    back.hidden = !sc.back;
    back.textContent = sc.backLabel || '← Quay lại';
    back.onclick = () => go(sc.back);
    ambience(!!sc.amb);
  }
  function go(name) {
    S.scene = name;
    const sc = SCENES[name];
    base.classList.add('fade');
    setTimeout(() => {
      render();
      base.onload = () => base.classList.remove('fade');
      if (base.complete) base.classList.remove('fade');
      if (sc.enter) sc.enter();
      S.visited[name] = true; save();
    }, 200);
  }

  // ---------- Controls ----------
  function restart() {
    S = fresh(); save(); renderInv();
    location.reload();
  }
  $('hint').onclick = () => {
    stage.classList.remove('hint'); void stage.offsetWidth; stage.classList.add('hint');
    setTimeout(() => stage.classList.remove('hint'), 2100);
  };
  $('sound').onclick = () => {
    soundOn = !soundOn;
    $('sound').textContent = 'Âm thanh: ' + (soundOn ? 'bật' : 'tắt');
    $('sound').setAttribute('aria-pressed', String(soundOn));
    if (!soundOn) Object.values(sounds).forEach(a => a.pause());
    ambience(soundOn && !!SCENES[S.scene].amb);
  };
  $('menu').onclick = () => { if (confirm('Chơi lại từ đầu? Tiến trình hiện tại sẽ bị xoá.')) restart(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden) $('mclose').click(); });

  function begin(resume) {
    $('cover').hidden = true;
    if (!resume) S = fresh();
    S.flags.playingEvp = false; S.flags.corridorGhostNow = false;
    renderInv();
    go(S.scene);
  }

  // Preload images so scene changes are instant.
  function preload() {
    ['BG-1305', 'BG-CORRIDOR', 'CL-HATCH-CLOSED', 'CL-HATCH-OPEN', 'CL-HATCH-EMPTY', 'PROP-RED-BOOK']
      .forEach(id => { const i = new Image(); i.src = url(id); });
  }

  fetch(ASSET_ROOT + 'manifest.json').then(r => r.ok ? r.json() : null).then(m => {
    if (m && m.entries) for (const e of m.entries) if (e.id && e.path) files[e.id] = e.path;
  }).catch(() => {}).finally(() => {
    base.src = url('BG-STATION'); curBg = 'BG-STATION';
    const saved = load();
    if (saved && Object.keys(saved.visited || {}).length) {
      S = saved;
      $('cont').hidden = false;
      $('start').textContent = 'Chơi lại từ đầu';
    }
    $('start').onclick = () => begin(false);
    $('cont').onclick = () => begin(true);
    preload();
  });
})();
