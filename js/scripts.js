// ===== CONFIG ADMIN =====
const ADMIN_EMAIL = 'hendri78gusiin@gmail.com';
// Password: Arisan@Hendri2026 — ubah string ini sesuai password yang diinginkan
const ADMIN_PASS = btoa('Arisan@Hendri2026' + '_secret_salt_2026');

let session = { role: null, nama: '' };

// ===== DATA =====
let D = {
  jadwal:[
    {id:1,nama:"Amanda",bulan:"Juni 2026",status:"done",kunci:true},
    {id:2,nama:"Sendi",bulan:"Juli 2026",status:"done",kunci:true},
    {id:3,nama:"Nova",bulan:"Agustus 2026",status:"done",kunci:true},
    {id:4,nama:"Neza",bulan:"September 2026",status:"done",kunci:true},
    {id:5,nama:"Serly Namang",bulan:"Oktober 2026",status:"done",kunci:true},
    {id:6,nama:"Suci L",bulan:"November 2026",status:"done",kunci:true},
    {id:7,nama:"Intan",bulan:"Desember 2026",status:"done",kunci:true},
    {id:8,nama:"Hendri",bulan:"Januari 2027",status:"done",kunci:true},
    {id:9,nama:"",bulan:"Februari 2027",status:"waiting",kunci:false},
    {id:10,nama:"",bulan:"Maret 2027",status:"waiting",kunci:false},
    {id:11,nama:"",bulan:"April 2027",status:"waiting",kunci:false},
    {id:12,nama:"",bulan:"Mei 2027",status:"waiting",kunci:false},
    {id:13,nama:"",bulan:"Juni 2027",status:"waiting",kunci:false},
    {id:14,nama:"",bulan:"Juli 2027",status:"waiting",kunci:false},
    {id:15,nama:"",bulan:"Agustus 2027",status:"waiting",kunci:false},
  ],
  anggota:[
    {id:1,nama:"Amanda",hp:""},
    {id:2,nama:"Sendi",hp:""},
    {id:3,nama:"Nova",hp:""},
    {id:4,nama:"Neza",hp:""},
    {id:5,nama:"Serly Namang",hp:""},
    {id:6,nama:"Suci L",hp:""},
    {id:7,nama:"Intan",hp:""},
    {id:8,nama:"Hendri",hp:""},
  ],
  pembayaran:{},
  nextId:16,
  editJadwalId:null,
  editBayarNama:null,
  prize:7500000,
  iuran:500000,
  cicilan:125000,
  tgl:"05",
  adminFee:100000,
};

const COLORS=['#C9922A','#2D6A4F','#C0392B','#8E44AD','#2471A3','#D35400','#1A5276','#784212','#1B4F72','#154360'];
const gc=s=>{if(!s)return'#888';let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%COLORS.length;return COLORS[Math.abs(h)];};
const ini=n=>{if(!n)return'?';const p=n.trim().split(' ');return p.length===1?p[0][0].toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();};
const rp=n=>'Rp '+Number(n).toLocaleString('id-ID');
const curMonth=()=>{const d=new Date();return['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][d.getMonth()]+' '+d.getFullYear();};

function save(){try{localStorage.setItem('arisanku3',JSON.stringify(D));}catch(e){}}
function load(){try{const s=localStorage.getItem('arisanku3');if(s)Object.assign(D,JSON.parse(s));}catch(e){}}

// ===== AUTH =====
function switchLockTab(t){
  document.getElementById('tabTamuBtn').classList.toggle('active',t==='tamu');
  document.getElementById('tabAdminBtn').classList.toggle('active',t==='admin');
  document.getElementById('panelTamu').style.display=t==='tamu'?'block':'none';
  document.getElementById('panelAdmin').style.display=t==='admin'?'block':'none';
}

function masukTamu(){
  const nama=document.getElementById('inputNamaTamu').value.trim();
  if(!nama){showToast('Masukkan namamu dulu!');return;}
  session={role:'guest',nama};
  boot();
}

function loginAdmin(){
  const email=document.getElementById('inputEmail').value.trim().toLowerCase();
  const pass=document.getElementById('inputPass').value;
  const err=document.getElementById('adminErr');
  const hash=btoa(pass+'_secret_salt_2026');
  if(email!==ADMIN_EMAIL||hash!==ADMIN_PASS){
    err.classList.add('show');
    document.getElementById('inputPass').value='';
    return;
  }
  err.classList.remove('show');
  session={role:'admin',nama:'Hendri'};
  boot();
}

function logout(){
  session={role:null,nama:''};
  try{sessionStorage.removeItem('ak_sess');}catch(e){}
  document.getElementById('appWrapper').style.display='none';
  document.getElementById('lockScreen').style.display='flex';
  document.getElementById('inputPass').value='';
  document.getElementById('inputNamaTamu').value='';
  document.getElementById('adminErr').classList.remove('show');
}

const isAdmin=()=>session.role==='admin';

function requireAdmin(){
  if(!isAdmin()){openModal('modalDitolak');return false;}
  return true;
}

function boot(){
  try{sessionStorage.setItem('ak_sess',JSON.stringify(session));}catch(e){}
  document.getElementById('lockScreen').style.display='none';
  document.getElementById('appWrapper').style.display='block';
  applyRole();
  renderAll();
}

function applyRole(){
  const admin=isAdmin();
  document.getElementById('adminBar').style.display=admin?'flex':'none';
  document.getElementById('guestBar').style.display=admin?'none':'flex';
  if(!admin)document.getElementById('guestBarName').textContent=session.nama;
  const br=document.getElementById('heroBadgeRole');
  if(admin){br.textContent='👑 Admin';br.className='badge-role badge-admin-role';}
  else{br.textContent='👁️ Tamu';br.className='badge-role badge-guest-role';}
  document.getElementById('btnTambahJadwal').style.display=admin?'':'none';
  document.getElementById('btnTambahAnggota').style.display=admin?'':'none';
  document.getElementById('fabBtn').style.display=admin?'flex':'none';
  document.getElementById('hintJadwal').style.display=admin?'none':'';
  document.getElementById('hintAnggota').style.display=admin?'none':'';
  document.getElementById('hintBayar').style.display=admin?'none':'';
  document.getElementById('accessBanner').style.display=admin?'none':'block';
}

// ===== TABS =====
function switchTab(name,btn){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  btn.classList.add('active');
  renderAll();
}

// ===== RENDER =====
function renderAll(){
  const done=D.jadwal.filter(j=>j.status==='done').length;
  const total=D.jadwal.length;
  document.getElementById('statTotal').textContent=total;
  document.getElementById('statDone').textContent=done;
  document.getElementById('statSisa').textContent=total-done;
  document.getElementById('progressBar').style.width=Math.round(done/total*100)+'%';
  document.getElementById('progressDone').textContent=done+' sudah kena';
  document.getElementById('progressPct').textContent=Math.round(done/total*100)+'%';
  document.getElementById('prizeDisplay').textContent=rp(D.prize);
  document.getElementById('infoIuran').textContent=rp(D.iuran);
  document.getElementById('infoCicil').textContent=rp(D.cicilan);
  document.getElementById('infoTgl').textContent=D.tgl+' setiap bulan';
  document.getElementById('infoAdminFee').textContent=rp(D.adminFee);
  document.getElementById('rekapTerkumpul').textContent=rp(D.iuran*total);
  document.getElementById('rekapDibagi').textContent=rp(D.prize*done);
  document.getElementById('rekapSaldo').textContent=rp(D.iuran*total-D.prize*done);
  renderNextUp();renderJadwal();renderMembers();renderPayments();
}

function renderNextUp(){
  const next=D.jadwal.find(j=>j.status==='current')||D.jadwal.find(j=>j.status==='waiting');
  const el=document.getElementById('nextUpCard');
  if(!next){el.innerHTML='<div class="empty">🎉 Semua sudah kena!</div>';return;}
  const col=gc(next.nama||'?');
  el.innerHTML=`<div class="info-card" style="border-left:4px solid ${col};">
    <div class="info-card-top" style="background:linear-gradient(135deg,${col} 0%,${col}cc 100%);">
      <div>
        <div style="font-size:13px;color:rgba(255,255,255,.8);margin-bottom:4px;">🎯 Giliran ke-${next.id}</div>
        <div class="prize-amount">${next.nama||'Belum ditentukan'}</div>
        <div class="prize-sub">${next.bulan} • Tanggal ${D.tgl}</div>
      </div>
      <div class="prize-icon" style="font-size:32px;">${next.nama?'🔑':'❓'}</div>
    </div>
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:13px;color:var(--text-muted);">Hadiah diterima</span>
      <span style="font-size:16px;font-weight:700;color:var(--green);">${rp(D.prize)}</span>
    </div>
  </div>`;
}

function renderJadwal(){
  const el=document.getElementById('jadwalList');
  if(!el)return;
  el.innerHTML=D.jadwal.map(j=>{
    const lbl=j.status==='done'?'✓ Sudah Kena':j.status==='current'?'🎯 Sekarang':'⏳ Menunggu';
    return `<div class="jadwal-item ${j.status}" onclick="showDetailJadwal(${j.id})">
      <div class="jadwal-num">${j.id}</div>
      <div class="jadwal-info">
        <div class="jadwal-name">${j.nama||'(Belum diisi)'}</div>
        <div class="jadwal-date">📅 ${j.bulan} • Tgl ${D.tgl}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div class="jadwal-status">${lbl}</div>
        ${j.kunci?'<div style="color:var(--gold);font-size:10px;margin-top:3px;">🔒</div>':''}
      </div>
    </div>`;
  }).join('');
}

function renderMembers(){
  const el=document.getElementById('memberGrid');
  if(!el)return;
  el.innerHTML=D.anggota.map(a=>{
    const col=gc(a.nama);
    const jd=D.jadwal.find(j=>j.nama&&j.nama.toLowerCase()===a.nama.toLowerCase());
    const badge=jd?(jd.status==='done'?'✓':jd.status==='current'?'🎯':''):'';
    const bbg=jd?(jd.status==='done'?'var(--green)':jd.status==='current'?'var(--gold)':'transparent'):'transparent';
    return `<div class="member-card" onclick="showMemberDetail('${a.nama.replace(/'/g,"\\'")}')">
      ${badge?`<div class="member-badge" style="background:${bbg};color:#fff;">${badge}</div>`:''}
      <div class="member-avatar" style="background:${col};">${ini(a.nama)}</div>
      <div class="member-name">${a.nama}</div>
      <div class="member-giliran">${jd?'Giliran ke-'+jd.id:'Belum terjadwal'}</div>
      <div style="font-size:11px;color:${jd?.status==='done'?'var(--green)':jd?.status==='current'?'var(--gold)':'var(--text-muted)'};margin-top:4px;font-weight:600;">
        ${jd?(jd.status==='done'?'✓ Sudah':jd.status==='current'?'🎯 Giliran':jd.bulan):''}
      </div>
    </div>`;
  }).join('');
}

function renderPayments(){
  const el=document.getElementById('paymentList');
  if(!el)return;
  const bln=curMonth();
  document.getElementById('paymentMonth').textContent=bln;
  if(!D.pembayaran[bln])D.pembayaran[bln]={};
  el.innerHTML=D.anggota.map(a=>{
    const paid=D.pembayaran[bln][a.nama];
    const col=gc(a.nama);
    const myName=session.nama.toLowerCase()===a.nama.toLowerCase();
    const canTap=isAdmin()||myName;
    const isSelf=!isAdmin()&&myName;
    return `<div class="payment-row" onclick="${canTap?`openBayar('${a.nama.replace(/'/g,"\\'")}')`:''}" style="${!canTap?'opacity:.55;cursor:not-allowed;':''}">
      <div class="payment-avatar" style="background:${col};">${ini(a.nama)}</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:500;">${a.nama}${isSelf?' <span style="font-size:11px;background:var(--blue-light);color:var(--blue);padding:2px 8px;border-radius:20px;">Kamu</span>':''}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${paid?paid.metode+' • '+paid.tgl:'Belum bayar'}</div>
      </div>
      <div style="text-align:right;">
        ${paid?`<div style="font-size:14px;font-weight:700;color:var(--green);">${rp(paid.jumlah)}</div><div class="payment-lunas" style="background:var(--green-light);color:var(--green);">✓ Lunas</div>`
        :`<div class="payment-lunas" style="background:var(--red-light);color:var(--red);">Belum</div>`}
      </div>
    </div>`;
  }).join('');
}

// ===== MODALS =====
function openModal(id){document.getElementById(id).classList.add('active');}
function closeModal(id){document.getElementById(id).classList.remove('active');}

function openAddJadwal(){
  if(!requireAdmin())return;
  D.editJadwalId=null;
  document.getElementById('mJadwalTitle').textContent='Tambah Giliran';
  document.getElementById('inputNama').value='';
  document.getElementById('inputBulan').value='';
  document.getElementById('inputStatus').value='waiting';
  openModal('modalJadwal');
}

function saveJadwal(){
  if(!requireAdmin())return;
  const nama=document.getElementById('inputNama').value.trim();
  const bulan=document.getElementById('inputBulan').value.trim();
  const status=document.getElementById('inputStatus').value;
  if(!bulan){showToast('Masukkan bulan & tahun!');return;}
  if(D.editJadwalId){
    const j=D.jadwal.find(x=>x.id===D.editJadwalId);
    if(j){j.nama=nama;j.bulan=bulan;j.status=status;}
  } else {
    D.jadwal.push({id:D.nextId++,nama,bulan,status,kunci:false});
  }
  closeModal('modalJadwal');save();renderAll();
  showToast('✓ Giliran berhasil disimpan!');
}

function showDetailJadwal(id){
  const j=D.jadwal.find(x=>x.id===id);
  if(!j)return;
  document.getElementById('detailNama').textContent=(j.nama||'Belum diisi')+' — Giliran ke-'+j.id;
  document.getElementById('detailSub').textContent=j.bulan+' • Tanggal '+D.tgl;
  const adminBtns=isAdmin()?`
    <div style="display:flex;gap:8px;margin-bottom:8px;">
      <button onclick="ubahStatus(${id},'done');closeModal('modalDetail')" style="flex:1;padding:12px;background:var(--green-light);color:var(--green);border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">✓ Sudah Kena</button>
      <button onclick="ubahStatus(${id},'current');closeModal('modalDetail')" style="flex:1;padding:12px;background:#FFF9EC;color:var(--gold);border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">🎯 Sekarang</button>
    </div>
    <button onclick="editJadwal(${id})" style="width:100%;padding:12px;background:var(--cream);color:var(--dark);border:1px solid var(--cream-dark);border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px;">✏️ Edit Giliran</button>
    ${!j.kunci?`<button onclick="hapusJadwal(${id})" style="width:100%;padding:12px;background:var(--red-light);color:var(--red);border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">🗑️ Hapus</button>`:''}`
  :`<div style="text-align:center;padding:14px;background:var(--cream);border-radius:14px;">
    <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">🔒 Hanya Admin yang dapat mengubah data</div>
    <button onclick="kirimRequest();closeModal('modalDetail')" style="padding:10px 18px;background:var(--dark);color:var(--gold-light);border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">📧 Minta Izin Admin</button>
  </div>`;
  document.getElementById('detailBody').innerHTML=`
    <div style="background:var(--cream);border-radius:14px;padding:16px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--cream-dark);">
        <span style="font-size:13px;color:var(--text-muted);">Status</span>
        <span style="font-size:13px;font-weight:600;color:${j.status==='done'?'var(--green)':j.status==='current'?'var(--gold)':'var(--text-muted)'};">${j.status==='done'?'✓ Sudah Kena':j.status==='current'?'🎯 Giliran Sekarang':'⏳ Menunggu'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--cream-dark);">
        <span style="font-size:13px;color:var(--text-muted);">Hadiah</span>
        <span style="font-size:13px;font-weight:700;color:var(--green);">${rp(D.prize)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:7px 0;">
        <span style="font-size:13px;color:var(--text-muted);">Kunci</span>
        <span style="font-size:13px;">${j.kunci?'🔒 Terkunci':'🔓 Bebas'}</span>
      </div>
    </div>${adminBtns}`;
  openModal('modalDetail');
}

function ubahStatus(id,status){
  if(!requireAdmin())return;
  const j=D.jadwal.find(x=>x.id===id);
  if(j){j.status=status;save();renderAll();showToast('Status diperbarui! ✓');}
}

function editJadwal(id){
  if(!requireAdmin())return;
  closeModal('modalDetail');
  const j=D.jadwal.find(x=>x.id===id);
  D.editJadwalId=id;
  document.getElementById('mJadwalTitle').textContent='Edit Giliran';
  document.getElementById('inputNama').value=j.nama||'';
  document.getElementById('inputBulan').value=j.bulan||'';
  document.getElementById('inputStatus').value=j.status;
  openModal('modalJadwal');
}

function hapusJadwal(id){
  if(!requireAdmin())return;
  if(!confirm('Hapus giliran ini?'))return;
  D.jadwal=D.jadwal.filter(x=>x.id!==id);
  closeModal('modalDetail');save();renderAll();
  showToast('Giliran dihapus!');
}

function openAddAnggota(){
  if(!requireAdmin())return;
  document.getElementById('inputAnggotaNama').value='';
  document.getElementById('inputAnggotaHp').value='';
  openModal('modalAnggota');
}

function saveAnggota(){
  if(!requireAdmin())return;
  const nama=document.getElementById('inputAnggotaNama').value.trim();
  const hp=document.getElementById('inputAnggotaHp').value.trim();
  if(!nama){showToast('Masukkan nama!');return;}
  D.anggota.push({id:Date.now(),nama,hp});
  closeModal('modalAnggota');save();renderAll();
  showToast('Anggota ditambahkan! 🎉');
}

function showMemberDetail(nama){
  const a=D.anggota.find(x=>x.nama===nama);
  const j=D.jadwal.find(x=>x.nama&&x.nama.toLowerCase()===nama.toLowerCase());
  const col=gc(nama);
  document.getElementById('detailNama').textContent=nama;
  document.getElementById('detailSub').textContent=j?j.bulan+' • Giliran ke-'+j.id:'Belum terjadwal';
  document.getElementById('detailBody').innerHTML=`
    <div style="text-align:center;margin-bottom:20px;">
      <div style="width:70px;height:70px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fff;margin:0 auto 10px;">${ini(nama)}</div>
      ${a?.hp?`<div style="font-size:13px;color:var(--text-muted);">📱 ${a.hp}</div>`:''}
    </div>
    <div style="background:var(--cream);border-radius:14px;padding:16px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--cream-dark);">
        <span style="font-size:13px;color:var(--text-muted);">Giliran ke-</span>
        <span style="font-size:13px;font-weight:600;">${j?j.id:'Belum terjadwal'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:7px 0;">
        <span style="font-size:13px;color:var(--text-muted);">Status</span>
        <span style="font-size:13px;font-weight:600;color:${j?.status==='done'?'var(--green)':j?.status==='current'?'var(--gold)':'var(--text-muted)'};">${j?(j.status==='done'?'✓ Sudah Kena':j.status==='current'?'🎯 Giliran Sekarang':'⏳ Menunggu'):'-'}</span>
      </div>
    </div>
    ${isAdmin()?`<button onclick="hapusAnggota('${nama.replace(/'/g,"\\'")}');closeModal('modalDetail')" style="width:100%;padding:12px;background:var(--red-light);color:var(--red);border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">🗑️ Hapus Anggota</button>`:''}`;
  openModal('modalDetail');
}

function hapusAnggota(nama){
  if(!requireAdmin())return;
  D.anggota=D.anggota.filter(a=>a.nama!==nama);
  save();renderAll();showToast('Anggota dihapus!');
}

function openBayar(nama){
  if(!isAdmin()&&session.nama.toLowerCase()!==nama.toLowerCase()){
    showToast('Kamu hanya bisa tandai bayar namamu sendiri!');return;
  }
  D.editBayarNama=nama;
  document.getElementById('mBayarSub').textContent='Konfirmasi iuran '+nama+' — '+curMonth();
  document.getElementById('inputJumlah').value=D.iuran;
  openModal('modalBayar');
}

function konfirmasiBayar(){
  const nama=D.editBayarNama;
  if(!isAdmin()&&session.nama.toLowerCase()!==nama.toLowerCase()){showToast('Tidak diizinkan!');return;}
  const jumlah=parseInt(document.getElementById('inputJumlah').value)||D.iuran;
  const metode=document.getElementById('inputMetode').value;
  const bln=curMonth();
  if(!D.pembayaran[bln])D.pembayaran[bln]={};
  const now=new Date();
  D.pembayaran[bln][nama]={jumlah,metode,tgl:now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear()};
  closeModal('modalBayar');save();renderAll();
  showToast(nama+' berhasil dicatat lunas! 💚');
}

function openQuickAction(){
  if(!requireAdmin())return;
  const a=document.querySelector('.tab-content.active');
  if(a?.id==='tab-jadwal')openAddJadwal();
  else if(a?.id==='tab-anggota')openAddAnggota();
  else openAddJadwal();
}

function kirimRequest(){
  const sub=encodeURIComponent('[ArisanKu] Permintaan Izin Edit Data Arisan');
  const body=encodeURIComponent(`Halo Admin Hendri,\n\nSaya ${session.nama} ingin meminta izin akses edit untuk website arisan.\n\nMohon berikan password atau akses kepada saya.\n\nTerima kasih!`);
  window.open(`mailto:${ADMIN_EMAIL}?subject=${sub}&body=${body}`,'_blank');
  showToast('📧 Membuka email ke Admin...');
}

let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

document.querySelectorAll('.modal-overlay').forEach(o=>{
  o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('active');});
});

// INIT
load();
try{
  const ss=JSON.parse(sessionStorage.getItem('ak_sess')||'null');
  if(ss&&ss.role){session=ss;boot();}
}catch(e){}