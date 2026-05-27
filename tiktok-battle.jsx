import { useState, useEffect, useRef, useCallback } from "react";

// ── WebSocket hook — konek ke server TikTok Live ──
// Ganti ws://localhost:8080 dengan URL server kamu kalau sudah di-deploy
const WS_URL = "ws://localhost:8080";

function useTikTokLive(onEvent) {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let reconnectTimer;
    function connect() {
      try {
        ws.current = new WebSocket(WS_URL);
        ws.current.onopen = () => {
          setConnected(true);
          console.log("✅ Terhubung ke TikTok Live server!");
        };
        ws.current.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            onEvent(data);
          } catch {}
        };
        ws.current.onclose = () => {
          setConnected(false);
          console.log("⚠️ Koneksi terputus, reconnect 3 detik...");
          reconnectTimer = setTimeout(connect, 3000);
        };
        ws.current.onerror = () => {
          ws.current.close();
        };
      } catch {}
    }
    connect();
    return () => {
      clearTimeout(reconnectTimer);
      ws.current?.close();
    };
  }, []);

  return connected;
}

const GIFTS = [
  { name: "Mawar",      emoji: "🌹", points: 1,    color: "#FF6B9D", tier: 1 },
  { name: "Love",       emoji: "❤️", points: 5,    color: "#FF4444", tier: 2 },
  { name: "Topi",       emoji: "🎩", points: 15,   color: "#9B5DE5", tier: 3 },
  { name: "Bom",        emoji: "💣", points: 20,   color: "#FFD93D", tier: 3 },
  { name: "Singa",      emoji: "🦁", points: 30,   color: "#F77F00", tier: 3 },
  { name: "Berlian",    emoji: "💎", points: 50,   color: "#00BBF9", tier: 4 },
  { name: "Elang",      emoji: "🦅", points: 60,   color: "#6BCB77", tier: 4 },
  { name: "Gelombang",  emoji: "🌊", points: 70,   color: "#4D96FF", tier: 4 },
  { name: "Kembang Api",emoji: "🎆", points: 80,   color: "#FF8E53", tier: 4 },
  { name: "Mahkota",    emoji: "👑", points: 100,  color: "#FFD700", tier: 5 },
  { name: "Naga",       emoji: "🐉", points: 150,  color: "#FF2200", tier: 5 },
  { name: "Roket",      emoji: "🚀", points: 200,  color: "#FF6600", tier: 5, isRocket: true },
];

const FAKE_USERS = [
  { name: "Budi123",    color: "#FF6B6B", emoji: "😎" },
  { name: "SitiR",      color: "#FF8E53", emoji: "🥰" },
  { name: "Andi_gm",    color: "#FFD93D", emoji: "😤" },
  { name: "Rizky77",    color: "#6BCB77", emoji: "🤩" },
  { name: "Nisa_cute",  color: "#4D96FF", emoji: "😊" },
  { name: "Doni_play",  color: "#9B5DE5", emoji: "😈" },
  { name: "Fitri99",    color: "#F15BB5", emoji: "🥳" },
  { name: "Yoga_gamer", color: "#00BBF9", emoji: "😏" },
  { name: "Lala88",     color: "#FF6B9D", emoji: "🤗" },
  { name: "Bagas_pro",  color: "#C77DFF", emoji: "😍" },
  { name: "Keke123",    color: "#43AA8B", emoji: "😜" },
  { name: "Reza_yt",    color: "#F77F00", emoji: "🔥" },
  { name: "Nova_live",  color: "#E63946", emoji: "💪" },
  { name: "Iqbal_ff",   color: "#2EC4B6", emoji: "⚡" },
  { name: "Dewi_22",    color: "#FFBA08", emoji: "✨" },
  { name: "Farhan99",   color: "#A8DADC", emoji: "🎮" },
  { name: "Ayu_cantik", color: "#E9C46A", emoji: "🌸" },
  { name: "Kevin_gG",   color: "#52B788", emoji: "🦁" },
  { name: "Putri21",    color: "#E76F51", emoji: "🦋" },
  { name: "Hendra_X",   color: "#8338EC", emoji: "👾" },
];

const randomUser = () => FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
const randomGift = () => {
  const r = Math.random();
  if (r < 0.25) return GIFTS[0];       // Mawar
  if (r < 0.42) return GIFTS[1];       // Love
  if (r < 0.52) return GIFTS[2];       // Topi
  if (r < 0.60) return GIFTS[3];       // Bom
  if (r < 0.67) return GIFTS[4];       // Singa
  if (r < 0.73) return GIFTS[5];       // Berlian
  if (r < 0.78) return GIFTS[6];       // Elang
  if (r < 0.83) return GIFTS[7];       // Gelombang
  if (r < 0.87) return GIFTS[8];       // Kembang Api
  if (r < 0.91) return GIFTS[9];       // Mahkota
  if (r < 0.96) return GIFTS[10];      // Naga
  return GIFTS[11];                    // Roket
};
const randomTeam = () => (Math.random() > 0.5 ? "A" : "B");

// ── Universal Attack Projectile ──
// Semua gift terbang dari sisi pengirim ke sisi lawan dengan animasi unik
function AttackProjectile({ id, fromTeam, gift, onDone }) {
  const [phase, setPhase] = useState("fly");
  const topPct = useRef(10 + Math.random() * 60);
  const flyDur = gift.tier <= 2 ? 600 : gift.tier === 3 ? 700 : gift.tier === 4 ? 750 : 800;
  const totalDur = flyDur + (gift.tier <= 2 ? 1200 : gift.tier === 3 ? 1800 : gift.tier === 4 ? 2200 : 2800);
  const impactX = fromTeam === "A" ? "80%" : "20%";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("impact"), flyDur);
    const t2 = setTimeout(() => onDone(id), totalDur);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [id, onDone]);

  // Partikel per gift
  const impactData = {
    "🌹": { particles: ["🌹","🌸","🌺","💮","🌷"], count: 6,  size: 14 },
    "❤️": { particles: ["❤️","💕","💗","💖","💓","💝"], count: 8, size: 16 },
    "🎩": { particles: ["🎩","⭐","✨","🪄","🎪","🎭"], count: 8, size: 18 },
    "💣": { particles: ["💥","🔥","💣","✨","⭐","🧨","💫"], count: 10, size: 20 },
    "🦁": { particles: ["🦁","🔥","💥","⚡","🌟","😤","💪"], count: 10, size: 20 },
    "💎": { particles: ["💎","✨","💫","⭐","🌟","💙","❄️"], count: 12, size: 20 },
    "🦅": { particles: ["🦅","💨","⚡","🌪️","💥","🔥","✨"], count: 12, size: 22 },
    "🌊": { particles: ["🌊","💧","🌀","❄️","💙","🫧","🌈"], count: 12, size: 22 },
    "🎆": { particles: ["🎆","🎇","✨","⭐","🌟","💫","🎉","🎊"], count: 14, size: 22 },
    "👑": { particles: ["👑","💥","🔥","⭐","✨","💫","🌟","⚡"], count: 16, size: 24 },
    "🐉": { particles: ["🐉","🔥","💥","⚡","🌋","💀","🔴","🌑"], count: 18, size: 26 },
    "🚀": { particles: ["💥","🔥","⭐","✨","💫","🌟","⚡","🧨"], count: 20, size: 28 },
  };
  const data = impactData[gift.emoji] || { particles:["💥","✨"], count:8, size:18 };
  const ringCount = Math.min(gift.tier, 4);

  // Efek trail unik per gift
  const trailEmojis = {
    "🌹": "🌸", "❤️": "💕", "🎩": "⭐", "💣": "💨",
    "🦁": "🔥", "💎": "✨", "🦅": "💨", "🌊": "💧",
    "🎆": "✨", "👑": "💫", "🐉": "🔥", "🚀": "🔥",
  };

  return (
    <div style={{ position:"absolute", inset:0, zIndex:45, pointerEvents:"none" }}>
      {phase === "fly" && (
        <>
          {/* Projectile utama */}
          <div style={{
            position:"absolute",
            top:`${topPct.current}%`,
            left: fromTeam==="A" ? "-2%" : undefined,
            right: fromTeam==="B" ? "-2%" : undefined,
            fontSize: 16 + gift.tier * 4,
            animation: fromTeam==="A"
              ? `attackFlyA ${flyDur}ms cubic-bezier(0.2,0,0.8,1) forwards`
              : `attackFlyB ${flyDur}ms cubic-bezier(0.2,0,0.8,1) forwards`,
            filter:`drop-shadow(0 0 10px ${gift.color}) drop-shadow(0 0 20px ${gift.color}88)`,
            transform: fromTeam==="A" ? "rotate(10deg)" : "rotate(-10deg) scaleX(-1)",
          }}>{gift.emoji}</div>

          {/* Trail partikel */}
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              top:`${topPct.current + (Math.random()-0.5)*10}%`,
              left: fromTeam==="A" ? `${i*12}%` : undefined,
              right: fromTeam==="B" ? `${i*12}%` : undefined,
              fontSize: 10 + Math.random()*6,
              opacity: 0.8 - i*0.15,
              animation:`trailFade ${400+i*80}ms ease-out forwards`,
              filter:`drop-shadow(0 0 4px ${gift.color})`,
            }}>{trailEmojis[gift.emoji]}</div>
          ))}
        </>
      )}

      {phase === "impact" && (
        <div style={{ position:"absolute", top:"45%", left:impactX, transform:"translate(-50%,-50%)" }}>
          {/* Shockwave rings */}
          {[...Array(ringCount)].map((_,i) => (
            <div key={i} style={{
              position:"absolute", top:"50%", left:"50%",
              transform:"translate(-50%,-50%)",
              width:8, height:8, borderRadius:"50%",
              border:`${3-Math.min(i,2)}px solid ${i%2===0?gift.color:"#fff"}`,
              animation:`bigRing ${0.5+i*0.18}s ease-out ${i*0.12}s forwards`,
            }}/>
          ))}

          {/* Impact emoji besar */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            fontSize: 32 + gift.tier*4,
            animation:"impactBoom 0.6s ease-out forwards",
            filter:`drop-shadow(0 0 20px ${gift.color})`,
            zIndex:2,
          }}>{gift.emoji}</div>

          {/* Partikel beterbangan */}
          {[...Array(data.count)].map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              fontSize: data.size * (0.6 + Math.random()*0.8),
              animation:`megaOut${i%8} ${0.6+Math.random()*0.9}s ease-out ${Math.random()*0.2}s forwards`,
              filter:`drop-shadow(0 0 8px ${gift.color})`,
            }}>{data.particles[i%data.particles.length]}</div>
          ))}

          {/* Screen flash */}
          <div style={{
            position:"fixed", inset:0,
            background: fromTeam==="A"
              ? `radial-gradient(circle at 80% 45%,${gift.color}${gift.tier>=4?"55":"33"},transparent ${gift.tier>=5?"65%":"50%"})`
              : `radial-gradient(circle at 20% 45%,${gift.color}${gift.tier>=4?"55":"33"},transparent ${gift.tier>=5?"65%":"50%"})`,
            animation:"flashFade 0.7s ease-out forwards",
            pointerEvents:"none", zIndex:99,
          }}/>

          {/* Efek khusus per gift */}
          {gift.emoji==="🦁" && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-150%)", fontSize:40, animation:"roarAnim 1s ease-out forwards", filter:"drop-shadow(0 0 15px #F77F00)" }}>🦁</div>
          )}
          {gift.emoji==="🌊" && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:50, animation:"waveAnim 1s ease-out forwards", filter:"drop-shadow(0 0 15px #4D96FF)" }}>🌊</div>
          )}
          {gift.emoji==="🐉" && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:48, animation:"dragonAnim 1.2s ease-out forwards", filter:"drop-shadow(0 0 20px #FF2200)" }}>🐉</div>
          )}
          {gift.emoji==="🎆" && (
            [...Array(6)].map((_,i) => (
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", fontSize:24, animation:`firework${i%4} 1s ease-out ${i*0.15}s forwards`, filter:"drop-shadow(0 0 10px #FF8E53)" }}>🎆</div>
            ))
          )}
          {gift.emoji==="💎" && (
            [...Array(8)].map((_,i) => (
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", fontSize:18, animation:`diamondSpin${i%4} 1.2s ease-out ${i*0.1}s forwards`, filter:"drop-shadow(0 0 10px #00BBF9)" }}>💎</div>
            ))
          )}
          {gift.emoji==="🦅" && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:44, animation:"eagleSwoop 1s ease-out forwards", filter:"drop-shadow(0 0 15px #6BCB77)" }}>🦅</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Follow Alert ──
function FollowAlert({ alert, onDone }) {
  const [phase, setPhase] = useState("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 200);
    const t2 = setTimeout(() => setPhase("exit"), 4500);
    const t3 = setTimeout(() => onDone(alert.id), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [alert.id, onDone]);

  const isMega = alert.gift.tier === 5;
  const bgGrad = isMega
    ? "linear-gradient(135deg,#FF2200,#FF6600,#FFD93D)"
    : "linear-gradient(135deg,#00BBF9,#9B5DE5,#FFD700)";

  return (
    <div style={{
      position:"absolute", top:"15%", left:"50%",
      transform: phase==="show" ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(0.3)",
      opacity: phase==="show" ? 1 : 0,
      transition: phase==="enter"
        ? "transform 0.5s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s"
        : "transform 0.4s ease-in,opacity 0.4s ease-in",
      zIndex:80, pointerEvents:"none",
      display:"flex", flexDirection:"column", alignItems:"center",
      width:210,
    }}>
      <div style={{ position:"absolute", inset:-30, background:`radial-gradient(circle,${alert.gift.color}33,transparent 70%)`, borderRadius:"50%", animation:"pulse 1s infinite" }}/>
      <div style={{ background:"linear-gradient(180deg,#111122ee,#0a0a1aee)", border:`2px solid ${alert.gift.color}`, borderRadius:20, padding:"12px 18px", textAlign:"center", boxShadow:`0 0 30px ${alert.gift.color}66,0 4px 20px #00000099`, backdropFilter:"blur(10px)", width:"100%" }}>
        <div style={{ fontSize:34, animation:"crownSpin 1.5s ease-out", filter:`drop-shadow(0 0 12px ${alert.gift.color})`, marginBottom:4 }}>{alert.gift.emoji}</div>
        <div style={{ width:50, height:50, borderRadius:"50%", background:bgGrad, padding:3, margin:"0 auto 6px", boxShadow:`0 0 16px ${alert.gift.color}88` }}>
          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:`radial-gradient(circle at 35% 35%,${alert.user.color}ee,${alert.user.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{alert.user.emoji}</div>
        </div>
        <div style={{ background:bgGrad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:900, fontSize:14, marginBottom:2 }}>@{alert.user.name}</div>
        <div style={{ color:"#888", fontSize:9, marginBottom:8 }}>kirim {alert.gift.emoji} {alert.gift.name} · +{alert.gift.points} poin</div>
        <div style={{ background:bgGrad, borderRadius:20, padding:"7px 18px", color:"#fff", fontWeight:900, fontSize:12, boxShadow:`0 4px 14px ${alert.gift.color}66`, animation:"pulse 1s infinite", display:"inline-block" }}>➕ Ikuti Sekarang!</div>
        <div style={{ color:"#555", fontSize:8, marginTop:5 }}>{isMega?"🔥 MEGA GIFTER! Wajib di-follow!":"⭐ TOP GIFTER! Follow dia!"}</div>
      </div>
      {["⭐","✨","🌟","💫","⭐","✨"].map((e,i) => (
        <div key={i} style={{ position:"absolute", top:"50%", left:"50%", fontSize:12, animation:`orbitStar${i} 2s linear infinite`, animationDelay:`${i*0.33}s` }}>{e}</div>
      ))}
    </div>
  );
}

// ── Join Bubble notif ──
function JoinBubble({ notif, onDone }) {
  const [phase, setPhase] = useState("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 300);
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(() => onDone(notif.id), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [notif.id, onDone]);
  const borders = [["#FF6B6B","#FFD93D"],["#4D96FF","#9B5DE5"],["#F15BB5","#FF8E53"],["#43AA8B","#00BBF9"]];
  const [c1,c2] = borders[notif.id % borders.length];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7, transform:phase==="show"?"translateX(0)":"translateX(-80px)", opacity:phase==="show"?1:0, transition:phase==="enter"?"transform 0.35s cubic-bezier(0.34,1.4,0.64,1),opacity 0.25s":"transform 0.4s ease-in,opacity 0.4s ease-in" }}>
      <div style={{ position:"relative", width:36, height:36, flexShrink:0 }}>
        <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:`linear-gradient(135deg,${c1},${c2})`, padding:2.5 }}>
          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:`radial-gradient(circle at 35% 35%,${notif.user.color}ee,${notif.user.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{notif.user.emoji}</div>
        </div>
        <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:"#FF0050", border:"1.5px solid #060610", boxShadow:"0 0 5px #FF005088" }}/>
      </div>
      <div style={{ background:"#111122ee", borderRadius:14, padding:"4px 10px", border:"1px solid #ffffff15" }}>
        <div style={{ color:notif.user.color, fontWeight:800, fontSize:11 }}>{notif.user.name}</div>
        <div style={{ color:"#888", fontSize:9 }}>bergabung ke live</div>
      </div>
    </div>
  );
}

// ── Viewer Dot ──
function ViewerDot({ viewer, index, team, id, onDone }) {
  const cols = 5;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const baseX = useRef(team==="A"?1+col*9.5:51+col*9.5);
  const baseY = useRef(52+row*16);
  const bobDur = useRef(2+Math.random()*2);
  const bobDelay = useRef(Math.random()*2);
  useEffect(()=>{const t=setTimeout(()=>onDone(id),12000+Math.random()*5000);return()=>clearTimeout(t);},[id,onDone]);
  const initials = viewer.name.replace(/[^a-zA-Z]/g,"").slice(0,2).toUpperCase()||"?";
  return (
    <div style={{position:"absolute",left:`${baseX.current}%`,top:`${baseY.current}%`,display:"flex",flexDirection:"column",alignItems:"center",zIndex:11,pointerEvents:"none",animation:"viewerPop 0.45s cubic-bezier(0.34,1.56,0.64,1)"}}>
      <div style={{position:"relative",width:30,height:30,animation:`floatBob ${bobDur.current}s ease-in-out infinite`,animationDelay:`${bobDelay.current}s`}}>
        <div style={{width:"100%",height:"100%",borderRadius:"50%",background:team==="A"?"linear-gradient(135deg,#FF6B6B,#FFD93D)":"linear-gradient(135deg,#4D96FF,#9B5DE5)",padding:2,boxShadow:team==="A"?"0 0 8px #FF6B6B66":"0 0 8px #4D96FF66"}}>
          <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${viewer.color}cc,${viewer.color}77)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontSize:initials.length>1?8:11,fontWeight:900,letterSpacing:-0.5,textShadow:"0 1px 3px #0008"}}>{initials}</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",background:"#FF0050",border:"1.5px solid #060610",animation:"pulse 1.5s infinite"}}/>
      </div>
      <div style={{marginTop:2,background:"#000000bb",borderRadius:5,padding:"1px 4px",fontSize:6,color:team==="A"?"#FF8E53":"#6EB8FF",whiteSpace:"nowrap",maxWidth:38,overflow:"hidden",textOverflow:"ellipsis",fontWeight:700}}>{viewer.name.split("_")[0].slice(0,6)}</div>
    </div>
  );
}

// ── Arena Bubble ──
function ArenaBubble({ user, team, id, onDone }) {
  const pos = useRef({x:team==="A"?4+Math.random()*38:55+Math.random()*38,y:8+Math.random()*60});
  useEffect(()=>{const t=setTimeout(()=>onDone(id),5000+Math.random()*2000);return()=>clearTimeout(t);},[id,onDone]);
  const bc=team==="A"?"#FF6B6B":"#4D96FF";
  return (
    <div style={{position:"absolute",left:`${pos.current.x}%`,top:`${pos.current.y}%`,display:"flex",flexDirection:"column",alignItems:"center",animation:"bubbleIn 0.45s cubic-bezier(0.34,1.56,0.64,1)",zIndex:10,pointerEvents:"none"}}>
      <div style={{position:"relative",width:30,height:30,animation:"floatBob 3s ease-in-out infinite"}}>
        <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${user.color}dd,${user.color}77)`,border:`2.5px solid ${bc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:`0 0 10px ${bc}55`}}>{user.emoji}</div>
        <div style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",background:bc,border:"1.5px solid #060610"}}/>
      </div>
      <div style={{marginTop:2,background:"#000000cc",borderRadius:5,padding:"1px 4px",fontSize:6,color:"#fff",whiteSpace:"nowrap",maxWidth:44,overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
    </div>
  );
}

function ShakeOverlay({ team }) {
  return <div style={{position:"absolute",inset:0,zIndex:48,pointerEvents:"none",background:team==="A"?"linear-gradient(90deg,#FF000033,transparent 60%)":"linear-gradient(270deg,#0044FF33,transparent 60%)",animation:"flashFade 0.5s ease-out forwards"}}/>;
}

function CommandIndicator({ cmd, id, onDone }) {
  useEffect(()=>{const t=setTimeout(()=>onDone(id),2000);return()=>clearTimeout(t);},[id,onDone]);
  const isA=cmd.team==="A";
  return <div style={{position:"absolute",bottom:`${20+Math.random()*40}%`,left:isA?"5%":undefined,right:isA?undefined:"5%",background:isA?"linear-gradient(90deg,#FF4444cc,#FF6B6Bcc)":"linear-gradient(90deg,#4D96FFcc,#9B5DE5cc)",color:"#fff",fontWeight:800,fontSize:10,padding:"4px 10px",borderRadius:18,animation:"cmdPop 2s ease forwards",zIndex:35,pointerEvents:"none",whiteSpace:"nowrap"}}>{cmd.user} ketik "{cmd.word}" {isA?"🔴":"🔵"}</div>;
}

function MiniAvatar({ user, team }) {
  return <div style={{width:26,height:26,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${user.color}cc,${user.color}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,border:`2px solid ${(team||"A")==="A"?"#FF6B6B":"#4D96FF"}`,flexShrink:0}}>{user.emoji}</div>;
}

// ══════════════════════════════════════════════════════
export default function TikTokBattle() {
  const [scoreA, setScoreA]           = useState(0);
  const [scoreB, setScoreB]           = useState(0);
  const [time, setTime]               = useState(120);
  const [running, setRunning]         = useState(false);
  const [done, setDone]               = useState(false);
  const [chat, setChat]               = useState([]);
  const [attacks, setAttacks]         = useState([]);
  const [bubbles, setBubbles]         = useState([]);
  const [rockets, setRockets]         = useState([]);
  const [shakes, setShakes]           = useState([]);
  const [joinBubbles, setJoinBubbles] = useState([]);
  const [viewerDotsA, setViewerDotsA] = useState([]);
  const [viewerDotsB, setViewerDotsB] = useState([]);
  const [cmdIndicators, setCmds]      = useState([]);
  const [followAlerts, setFollowAlerts] = useState([]);
  const [combo, setCombo]             = useState(null);
  const [viewers, setViewers]         = useState(1247);
  const [chatInput, setChatInput]     = useState("");
  const [screenFlash, setScreenFlash] = useState(null);

  const [wsConnected, setWsConnected] = useState(false);
  const [liveMode, setLiveMode]       = useState(false); // true = pakai data TikTok asli

  // Handler event dari TikTok Live server
  const handleLiveEvent = useCallback((event) => {
    if (!running) return;
    const avatarColors = ["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4D96FF","#9B5DE5","#F15BB5","#00BBF9","#FF6B9D","#C77DFF"];
    const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

    if (event.type === "join") {
      const user = {
        name: event.user.nickname || event.user.name,
        color: getColor(event.user.name),
        emoji: "👤",
        avatar: event.user.avatar, // foto profil asli!
      };
      addJoin(user);
    }
    else if (event.type === "chat") {
      const user = {
        name: event.user.nickname || event.user.name,
        color: getColor(event.user.name),
        emoji: "💬",
        avatar: event.user.avatar,
      };
      processChat(event.message, user);
      setChat(c => [{
        id: Date.now()+Math.random(),
        user, isText:true, text:event.message, team:null,
      }, ...c].slice(0,30));
    }
    else if (event.type === "gift") {
      const user = {
        name: event.user.nickname || event.user.name,
        color: getColor(event.user.name),
        emoji: "🎁",
        avatar: event.user.avatar,
      };
      addGift(user, event.gift, event.team);
    }
    else if (event.type === "viewers") {
      setViewers(event.count);
    }
  }, [running, addJoin, addGift, processChat]);

  // Konek ke WebSocket server TikTok Live
  const wsConn = useTikTokLive(handleLiveEvent);
  useEffect(() => { setWsConnected(wsConn); }, [wsConn]);

  const atkId    = useRef(0);
  const bubbleId = useRef(0);
  const joinId   = useRef(0);
  const rocketId = useRef(0);
  const shakeId  = useRef(0);
  const cmdId    = useRef(0);
  const followId = useRef(0);
  const chatRef  = useRef(null);
  const intervalRef  = useRef(null);
  const botRef       = useRef(null);
  const joinBotRef   = useRef(null);
  const chatBotRef   = useRef(null);

  const doShake = useCallback((team) => {
    const sid = shakeId.current++;
    setShakes(s=>[...s,{id:sid,team}]);
    setTimeout(()=>setShakes(s=>s.filter(x=>x.id!==sid)),600);
  },[]);

  const doFlash = useCallback((color) => {
    setScreenFlash(color);
    setTimeout(()=>setScreenFlash(null),600);
  },[]);

  const removeAtk     = useCallback((id)=>setAttacks(a=>a.filter(x=>x.id!==id)),[]);
  const removeBubble  = useCallback((id)=>setBubbles(b=>b.filter(x=>x.id!==id)),[]);
  const removeRocket  = useCallback((id)=>setRockets(r=>r.filter(x=>x.id!==id)),[]);
  const removeJoin    = useCallback((id)=>setJoinBubbles(b=>b.filter(x=>x.id!==id)),[]);
  const removeVdA     = useCallback((id)=>setViewerDotsA(d=>d.filter(x=>x.id!==id).map((v,i)=>({...v,index:i}))),[]);
  const removeVdB     = useCallback((id)=>setViewerDotsB(d=>d.filter(x=>x.id!==id).map((v,i)=>({...v,index:i}))),[]);
  const removeCmd     = useCallback((id)=>setCmds(c=>c.filter(x=>x.id!==id)),[]);
  const removeFollow  = useCallback((id)=>setFollowAlerts(f=>f.filter(x=>x.id!==id)),[]);

  const processChat = useCallback((text, user) => {
    const lower = text.toLowerCase().trim();
    let team = null;
    if (["merah","red","tim a","team a","🔴"].some(k=>lower.includes(k))) team="A";
    else if (["biru","blue","tim b","team b","🔵"].some(k=>lower.includes(k))) team="B";
    if (team) {
      const rid=rocketId.current++;
      setRockets(r=>[...r,{id:rid,fromTeam:team}]);
      doShake(team==="A"?"B":"A");
      const cid=cmdId.current++;
      setCmds(c=>[...c.slice(-3),{id:cid,user:user.name,word:text,team}]);
    }
  },[doShake]);

  const addGift = useCallback((user, gift, team) => {
    const pts = gift.points;
    if (team==="A") setScoreA(s=>s+pts); else setScoreB(s=>s+pts);
    const userObj = typeof user==="string"?{name:user,color:"#FFD93D",emoji:"🙋"}:user;

    // Attack projectile — semua gift terbang ke lawan
    const aid = atkId.current++;
    if (gift.isRocket) {
      const rid=rocketId.current++;
      setRockets(r=>[...r,{id:rid,fromTeam:team}]);
      doShake(team==="A"?"B":"A"); doShake(team==="A"?"B":"A");
      doFlash(team==="A"?"#FF000044":"#0000FF44");
    } else {
      setAttacks(a=>[...a,{id:aid,gift,team}]);
      if (gift.tier>=3) { doShake(team==="A"?"B":"A"); doFlash(team==="A"?"#FF440022":"#0044FF22"); }
      if (gift.tier>=4) { doShake(team); doFlash(`${gift.color}22`); }
      if (gift.tier>=5) { doShake(team==="A"?"B":"A"); doFlash(`${gift.color}44`); }
    }

    // Arena bubble
    const bid=bubbleId.current++;
    setBubbles(b=>[...b.slice(-20),{id:bid,user:userObj,team}]);
    setChat(c=>[{id:Date.now()+Math.random(),user:userObj,gift,team},...c].slice(0,30));

    // Follow alert tier 4+
    if (gift.tier>=4) {
      const fid=followId.current++;
      setFollowAlerts(f=>[...f.slice(-1),{id:fid,user:userObj,gift}]);
    }

    // Combo
    const comboMap = {
      1:null, 2:["💕 LOVE RAIN!"], 3:["💥 SERANGAN "+gift.name.toUpperCase()+"!"],
      4:["⭐ "+gift.name.toUpperCase()+" ATTACK! +"+pts],
      5:["🔥 MEGA "+gift.name.toUpperCase()+"!! +"+pts+"!"],
    };
    const texts = comboMap[gift.tier];
    if (texts) { setCombo({text:texts[0],team,tier:gift.tier}); setTimeout(()=>setCombo(null),2000); }
    setViewers(v=>v+Math.floor(Math.random()*3));
  },[doShake,doFlash]);

  const addJoin = useCallback((user) => {
    const jid=joinId.current++;
    setJoinBubbles(b=>[...b.slice(-3),{id:jid,user}]);
    const joinTeam=Math.random()>0.5?"A":"B";
    const vid=bubbleId.current++;
    if (joinTeam==="A") setViewerDotsA(d=>{const n=[...d,{id:vid,user}];return n.slice(-18).map((v,i)=>({...v,index:i}));});
    else setViewerDotsB(d=>{const n=[...d,{id:vid,user}];return n.slice(-18).map((v,i)=>({...v,index:i}));});
    setViewers(v=>v+1);
  },[]);

  const sendChat = useCallback(() => {
    if (!chatInput.trim()||!running) return;
    const me={name:"Kamu",color:"#FFD93D",emoji:"🙋"};
    processChat(chatInput,me);
    setChat(c=>[{id:Date.now(),user:me,isText:true,text:chatInput,team:null},...c].slice(0,30));
    setChatInput("");
  },[chatInput,running,processChat]);

  const startGame = () => {
    setScoreA(0);setScoreB(0);setTime(120);setRunning(true);setDone(false);
    setChat([]);setAttacks([]);setBubbles([]);setRockets([]);setShakes([]);
    setJoinBubbles([]);setViewerDotsA([]);setViewerDotsB([]);setCmds([]);
    setFollowAlerts([]);setCombo(null);setScreenFlash(null);setViewers(1247);
  };

  useEffect(()=>{
    if(!running)return;
    intervalRef.current=setInterval(()=>{
      setTime(t=>{if(t<=1){clearInterval(intervalRef.current);setRunning(false);setDone(true);return 0;}return t-1;});
    },1000);
    return()=>clearInterval(intervalRef.current);
  },[running]);

  useEffect(()=>{
    if(!running)return;
    const s=()=>{botRef.current=setTimeout(()=>{addGift(randomUser(),randomGift(),randomTeam());s();},500+Math.random()*1500);};
    s();return()=>clearTimeout(botRef.current);
  },[running,addGift]);

  useEffect(()=>{
    if(!running)return;
    const s=()=>{joinBotRef.current=setTimeout(()=>{addJoin(randomUser());s();},1200+Math.random()*2000);};
    s();return()=>clearTimeout(joinBotRef.current);
  },[running,addJoin]);

  useEffect(()=>{
    if(!running)return;
    const words=["merah","biru","merah","biru","🔴","🔵","tim a","tim b"];
    const s=()=>{chatBotRef.current=setTimeout(()=>{const u=randomUser();const w=words[Math.floor(Math.random()*words.length)];processChat(w,u);setChat(c=>[{id:Date.now()+Math.random(),user:u,isText:true,text:w,team:null},...c].slice(0,30));s();},2000+Math.random()*3000);};
    s();return()=>clearTimeout(chatBotRef.current);
  },[running,processChat]);

  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=0;},[chat]);

  const total=scoreA+scoreB||1;
  const pctA=Math.round((scoreA/total)*100);
  const pctB=100-pctA;
  const winner=scoreA>scoreB?"TIM A 🔴":scoreB>scoreA?"TIM B 🔵":"SERI 🤝";
  const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const comboBg=combo?["","linear-gradient(135deg,#FF6B9D,#FF4488)","linear-gradient(135deg,#FF4444,#FF8888)","linear-gradient(135deg,#FFD93D,#FF6600)","linear-gradient(135deg,#FFD700,#FF8C00)","linear-gradient(135deg,#FF2200,#FF8800)"][combo.tier||1]:"";

  return (
    <div style={{width:"100%",maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#060610",fontFamily:"'Segoe UI',sans-serif",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes slideIn{from{transform:translateX(-14px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes bubbleIn{0%{transform:scale(0) rotate(-15deg);opacity:0}60%{transform:scale(1.15) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes viewerPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes flashFade{0%{opacity:1}100%{opacity:0}}
        @keyframes trailFade{0%{opacity:0.8;transform:scale(1)}100%{opacity:0;transform:scale(2.5)}}
        @keyframes impactBoom{0%{transform:translate(-50%,-50%) scale(0.3);opacity:1}50%{transform:translate(-50%,-50%) scale(2);opacity:1}100%{transform:translate(-50%,-50%) scale(1.2);opacity:0}}
        @keyframes bigRing{0%{width:8px;height:8px;opacity:1;margin:-4px 0 0 -4px}100%{width:140px;height:140px;opacity:0;margin:-70px 0 0 -70px}}
        @keyframes crownSpin{0%{transform:scale(0) rotate(0deg)}60%{transform:scale(1.4) rotate(180deg)}100%{transform:scale(1) rotate(360deg)}}
        @keyframes attackFlyA{0%{left:-3%;opacity:1;transform:rotate(10deg) scale(1)}100%{left:100%;opacity:0.2;transform:rotate(10deg) scale(1.5)}}
        @keyframes attackFlyB{0%{right:-3%;opacity:1;transform:rotate(-10deg) scaleX(-1) scale(1)}100%{right:100%;opacity:0.2;transform:rotate(-10deg) scaleX(-1) scale(1.5)}}
        @keyframes rocketA{0%{left:-5%;opacity:1}100%{left:100%;opacity:0.2}}
        @keyframes rocketB{0%{right:-5%;opacity:1}100%{right:100%;opacity:0.2}}
        @keyframes smokeFade{0%{opacity:0.5;transform:scale(1)}100%{opacity:0;transform:scale(3)}}
        @keyframes roarAnim{0%{transform:translate(-50%,-150%) scale(0.5);opacity:1}50%{transform:translate(-50%,-200%) scale(1.5);opacity:1}100%{transform:translate(-50%,-250%) scale(0.5);opacity:0}}
        @keyframes waveAnim{0%{transform:translate(-50%,-50%) scale(0.5) rotate(-10deg);opacity:1}50%{transform:translate(-50%,-50%) scale(2) rotate(5deg);opacity:1}100%{transform:translate(-50%,-50%) scale(3) rotate(-5deg);opacity:0}}
        @keyframes dragonAnim{0%{transform:translate(-50%,-50%) scale(0.3) rotate(-15deg);opacity:1}40%{transform:translate(-50%,-50%) scale(2) rotate(5deg);opacity:1}100%{transform:translate(-50%,-50%) scale(3) rotate(-10deg);opacity:0}}
        @keyframes eagleSwoop{0%{transform:translate(-50%,-200%) scale(0.5);opacity:1}50%{transform:translate(-50%,-50%) scale(1.8);opacity:1}100%{transform:translate(-50%,50%) scale(0.8);opacity:0}}
        @keyframes firework0{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-60px,-80px) scale(0.2);opacity:0}}
        @keyframes firework1{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(60px,-80px) scale(0.2);opacity:0}}
        @keyframes firework2{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-80px,0) scale(0.2);opacity:0}}
        @keyframes firework3{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(80px,0) scale(0.2);opacity:0}}
        @keyframes diamondSpin0{0%{transform:translate(-50%,-50%) rotate(0deg) translateX(40px);opacity:1}100%{transform:translate(-50%,-50%) rotate(360deg) translateX(70px);opacity:0}}
        @keyframes diamondSpin1{0%{transform:translate(-50%,-50%) rotate(45deg) translateX(40px);opacity:1}100%{transform:translate(-50%,-50%) rotate(405deg) translateX(70px);opacity:0}}
        @keyframes diamondSpin2{0%{transform:translate(-50%,-50%) rotate(90deg) translateX(40px);opacity:1}100%{transform:translate(-50%,-50%) rotate(450deg) translateX(70px);opacity:0}}
        @keyframes diamondSpin3{0%{transform:translate(-50%,-50%) rotate(135deg) translateX(40px);opacity:1}100%{transform:translate(-50%,-50%) rotate(495deg) translateX(70px);opacity:0}}
        @keyframes megaOut0{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-95px,-95px) scale(0.1);opacity:0}}
        @keyframes megaOut1{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(95px,-85px) scale(0.1);opacity:0}}
        @keyframes megaOut2{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(100px,65px) scale(0.1);opacity:0}}
        @keyframes megaOut3{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-90px,75px) scale(0.1);opacity:0}}
        @keyframes megaOut4{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(20px,-105px) scale(0.1);opacity:0}}
        @keyframes megaOut5{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-105px,20px) scale(0.1);opacity:0}}
        @keyframes megaOut6{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(65px,95px) scale(0.1);opacity:0}}
        @keyframes megaOut7{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(-65px,-100px) scale(0.1);opacity:0}}
        @keyframes comboAnim{0%{transform:translate(-50%,-50%) scale(0.3) rotate(-10deg);opacity:0}30%{transform:translate(-50%,-50%) scale(1.3) rotate(3deg);opacity:1}70%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(0.8);opacity:0}}
        @keyframes cmdPop{0%{transform:translateY(8px);opacity:0}10%{transform:translateY(0);opacity:1}80%{opacity:1}100%{opacity:0}}
        @keyframes shakeA{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(8px)}}
        @keyframes shakeB{0%,100%{transform:translateX(0)}25%{transform:translateX(10px)}75%{transform:translateX(-8px)}}
        @keyframes orbitStar0{0%{transform:translate(-50%,-50%) rotate(0deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(360deg) translateX(80px)}}
        @keyframes orbitStar1{0%{transform:translate(-50%,-50%) rotate(60deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(420deg) translateX(80px)}}
        @keyframes orbitStar2{0%{transform:translate(-50%,-50%) rotate(120deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(480deg) translateX(80px)}}
        @keyframes orbitStar3{0%{transform:translate(-50%,-50%) rotate(180deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(540deg) translateX(80px)}}
        @keyframes orbitStar4{0%{transform:translate(-50%,-50%) rotate(240deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(600deg) translateX(80px)}}
        @keyframes orbitStar5{0%{transform:translate(-50%,-50%) rotate(300deg) translateX(80px)}100%{transform:translate(-50%,-50%) rotate(660deg) translateX(80px)}}
        ::-webkit-scrollbar{width:0}
      `}</style>

      {screenFlash&&<div style={{position:"fixed",inset:0,background:screenFlash,pointerEvents:"none",zIndex:200,animation:"flashFade 0.6s ease-out forwards"}}/>}

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#10102a,#1a1a3e)",padding:"9px 14px 7px",borderBottom:"1px solid #ffffff15"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#ff6b6b,#ffd93d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 14px #ff6b6b55"}}>⚔️</div>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:14}}>LIVE BATTLE</div>
              <div style={{color:"#999",fontSize:10}}>👁 {viewers.toLocaleString()} penonton</div>
              <div style={{fontSize:8,marginTop:1,color:wsConnected?"#6BCB77":"#FF6B6B",fontWeight:700}}>
                {wsConnected?"🟢 Terhubung TikTok Live":"🔴 Mode Simulasi (server offline)"}
              </div>
            </div>
          </div>
          <div style={{background:"#FF0050",color:"#fff",padding:"4px 12px",borderRadius:18,fontSize:11,fontWeight:800,letterSpacing:1,animation:running?"pulse 1.5s infinite":"none",boxShadow:running?"0 0 10px #FF005077":"none"}}>● LIVE</div>
        </div>
      </div>

      {/* Score */}
      <div style={{background:"#0d0d1e",padding:"8px 14px",borderBottom:"1px solid #ffffff10"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <div style={{color:"#FF6B6B",fontWeight:800,fontSize:11}}>🔴 TIM A · {scoreA.toLocaleString()}</div>
          <div style={{color:time<20?"#FF6B6B":"#FFD93D",fontWeight:900,fontSize:15,animation:time<20&&running?"pulse 0.5s infinite":"none",textShadow:"0 0 10px currentColor"}}>{fmt(time)}</div>
          <div style={{color:"#4D96FF",fontWeight:800,fontSize:11,textAlign:"right"}}>{scoreB.toLocaleString()} · TIM B 🔵</div>
        </div>
        <div style={{height:13,borderRadius:7,overflow:"hidden",background:"#181830",display:"flex"}}>
          <div style={{width:`${pctA}%`,background:"linear-gradient(90deg,#FF2222,#FF8E53,#FFD93D)",transition:"width 0.4s ease",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:800}}>{pctA>13?`${pctA}%`:""}</div>
          <div style={{width:`${pctB}%`,background:"linear-gradient(90deg,#4D96FF,#9B5DE5)",transition:"width 0.4s ease",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:800}}>{pctB>13?`${pctB}%`:""}</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginTop:3,gap:10}}>
          <div style={{color:"#FF6B6B44",fontSize:7}}>💬 "merah" → 🚀 serang B</div>
          <div style={{color:"#4D96FF44",fontSize:7}}>💬 "biru" → 🚀 serang A</div>
        </div>
      </div>

      {/* Arena */}
      <div style={{height:285,background:"linear-gradient(180deg,#0c0c20,#070714)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,#ffffff04 1px,transparent 1px)",backgroundSize:"20px 20px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:"50%",animation:shakes.some(s=>s.team==="A")?"shakeA 0.4s ease":"none"}}>
          <div style={{position:"absolute",top:8,left:8,background:"#FF6B6B1a",border:"1px solid #FF6B6B33",borderRadius:7,padding:"2px 9px",color:"#FF6B6B",fontSize:9,fontWeight:800,letterSpacing:1}}>TEAM A ⚔️</div>
          {shakes.some(s=>s.team==="A")&&<ShakeOverlay team="A"/>}
        </div>
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:"50%",animation:shakes.some(s=>s.team==="B")?"shakeB 0.4s ease":"none"}}>
          <div style={{position:"absolute",top:8,right:8,background:"#4D96FF1a",border:"1px solid #4D96FF33",borderRadius:7,padding:"2px 9px",color:"#4D96FF",fontSize:9,fontWeight:800,letterSpacing:1}}>🛡 TEAM B</div>
          {shakes.some(s=>s.team==="B")&&<ShakeOverlay team="B"/>}
        </div>
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1.5,background:"linear-gradient(180deg,transparent,#ffffff20,#ffffff20,transparent)",transform:"translateX(-50%)",zIndex:5}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",fontSize:18,zIndex:6,filter:"drop-shadow(0 0 5px #fff5)"}}>⚡</div>

        {viewerDotsA.map(v=><ViewerDot key={v.id} id={v.id} viewer={v.user} index={v.index} team="A" onDone={removeVdA}/>)}
        {viewerDotsB.map(v=><ViewerDot key={v.id} id={v.id} viewer={v.user} index={v.index} team="B" onDone={removeVdB}/>)}
        {bubbles.map(b=><ArenaBubble key={b.id} id={b.id} user={b.user} team={b.team} onDone={removeBubble}/>)}
        {attacks.map(a=><AttackProjectile key={a.id} id={a.id} fromTeam={a.team} gift={a.gift} onDone={removeAtk}/>)}
        {rockets.map(r=><Tier5Rocket key={r.id} id={r.id} fromTeam={r.fromTeam} onDone={removeRocket}/>)}
        {cmdIndicators.map(c=><CommandIndicator key={c.id} cmd={c} id={c.id} onDone={removeCmd}/>)}
        {followAlerts.map(a=><FollowAlert key={a.id} alert={a} onDone={removeFollow}/>)}

        <div style={{position:"absolute",top:32,left:8,display:"flex",flexDirection:"column",gap:5,zIndex:40,pointerEvents:"none"}}>
          {joinBubbles.map(n=><JoinBubble key={n.id} notif={n} onDone={removeJoin}/>)}
        </div>

        <div style={{position:"absolute",bottom:40,left:0,right:0,display:"flex",justifyContent:"space-around",zIndex:15,pointerEvents:"none"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:900,color:"#FF6B6B",textShadow:"0 0 14px #FF6B6B"}}>{scoreA}</div>
            <div style={{fontSize:8,color:"#FF6B6B77"}}>POIN</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:900,color:"#4D96FF",textShadow:"0 0 14px #4D96FF"}}>{scoreB}</div>
            <div style={{fontSize:8,color:"#4D96FF77"}}>POIN</div>
          </div>
        </div>

        {combo&&<div style={{position:"absolute",top:"38%",left:"50%",background:comboBg,color:"#fff",fontWeight:900,fontSize:[0,12,13,14,16,18][combo.tier||1],padding:"9px 20px",borderRadius:28,zIndex:60,animation:"comboAnim 2s ease forwards",whiteSpace:"nowrap",textAlign:"center",boxShadow:"0 0 30px rgba(255,200,50,0.8)"}}>{combo.text}</div>}
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{height:90,overflowY:"auto",background:"#050510",padding:"4px 10px",display:"flex",flexDirection:"column",gap:2,borderTop:"1px solid #ffffff08"}}>
        {chat.map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:5,animation:"slideIn 0.2s ease",background:c.isText?"#ffffff05":c.gift?.tier>=4?"#FFD70010":c.team==="A"?"#FF6B6B08":"#4D96FF08",borderRadius:6,padding:"2px 7px",borderLeft:`2px solid ${c.isText?"#ffffff22":c.gift?.tier>=4?"#FFD700":c.team==="A"?"#FF6B6B":"#4D96FF"}`}}>
            <MiniAvatar user={c.user} team={c.team}/>
            <div style={{flex:1}}>
              <span style={{color:c.team==="A"?"#FF8E53":c.team==="B"?"#6EB8FF":"#FFD93D",fontWeight:700,fontSize:10}}>{c.user.name} </span>
              {c.isText?<span style={{color:"#aaa",fontSize:10}}>{c.text}</span>:<><span style={{color:"#444",fontSize:9}}>→ Tim {c.team} </span><span style={{fontSize:11}}>{c.gift.emoji}</span><span style={{color:"#FFD93D",fontWeight:700,fontSize:9}}> +{c.gift.points}</span></>}
            </div>
          </div>
        ))}
        {chat.length===0&&<div style={{color:"#222",textAlign:"center",fontSize:10,marginTop:8}}>Ketik "merah"/"biru" untuk serang! 🚀</div>}
      </div>

      {/* Input */}
      <div style={{background:"#0a0a1a",padding:"5px 10px",borderTop:"1px solid #ffffff0a",display:"flex",gap:5}}>
        <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder='Ketik "merah" atau "biru" → 🚀' disabled={!running} style={{flex:1,background:"#ffffff0e",border:"1px solid #ffffff15",borderRadius:18,padding:"6px 12px",color:"#fff",fontSize:10,outline:"none",opacity:running?1:0.4}}/>
        <button onClick={sendChat} disabled={!running} style={{background:"linear-gradient(135deg,#FF0050,#FF6B6B)",border:"none",borderRadius:18,padding:"6px 12px",color:"#fff",fontWeight:800,fontSize:10,cursor:running?"pointer":"not-allowed",opacity:running?1:0.4}}>Kirim</button>
      </div>

      {/* Gift buttons */}
      <div style={{background:"#0d0d1c",padding:"5px 8px",borderTop:"1px solid #ffffff0d"}}>
        <div style={{color:"#333",fontSize:7,marginBottom:3,letterSpacing:1}}>KIRIM HADIAH :</div>
        <div style={{display:"flex",gap:3,overflowX:"auto",paddingBottom:2}}>
          {GIFTS.map(g=>(
            <div key={g.name} style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center",flexShrink:0}}>
              {["A","B"].map(team=>(
                <button key={team} disabled={!running}
                  onClick={()=>addGift({name:"Kamu",color:"#FFD93D",emoji:"🙋"},g,team)}
                  style={{background:g.tier>=5?team==="A"?"linear-gradient(135deg,#FF2200,#FF6600)":"linear-gradient(135deg,#0033FF,#4D96FF)":team==="A"?"linear-gradient(135deg,#FF3333,#FF6B6B)":"linear-gradient(135deg,#2255FF,#4D96FF)",border:g.tier>=4?`1px solid ${g.color}44`:"none",borderRadius:8,padding:"2px 4px",cursor:running?"pointer":"not-allowed",opacity:running?1:0.3,color:"#fff",fontWeight:800,minWidth:40,boxShadow:g.tier>=4&&running?`0 0 8px ${g.color}55`:"none"}}>
                  <div style={{fontSize:g.tier===5?18:g.tier===4?16:13}}>{g.emoji}</div>
                  <div style={{fontSize:6}}>{g.name.slice(0,6)}</div>
                  <div style={{fontSize:6,color:g.tier>=4?"#FFD93D":"#FFD93Dbb"}}>T{team}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Start */}
      <div style={{background:"#08081a",padding:"7px 14px 10px",borderTop:"1px solid #ffffff08",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
        {done?<div style={{textAlign:"center"}}><div style={{fontSize:17,fontWeight:900,background:"linear-gradient(90deg,#FFD93D,#FF6B6B,#4D96FF,#FFD93D)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 1.5s linear infinite"}}>🏆 PEMENANG: {winner}</div><div style={{color:"#444",fontSize:10,marginTop:2}}>{scoreA} vs {scoreB} poin</div></div>:<div style={{color:"#333",fontSize:10}}>{running?"🔴 Battle berlangsung!":"Siap untuk battle? ⚔️"}</div>}
        <button onClick={startGame} style={{background:"linear-gradient(135deg,#FF0050,#FF6B6B)",border:"none",borderRadius:22,color:"#fff",fontWeight:900,fontSize:13,padding:"9px 30px",cursor:"pointer",letterSpacing:1,boxShadow:"0 4px 18px #FF005055"}}>
          {running?"🔄 RESTART":done?"▶️ MAIN LAGI":"⚔️ MULAI BATTLE"}
        </button>
      </div>
    </div>
  );
}

// Tier5Rocket (roket ultimate)
function Tier5Rocket({ id, fromTeam, onDone }) {
  const [phase, setPhase] = useState("fly");
  const topPct = useRef(10+Math.random()*60);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase("explode"),750);
    const t2=setTimeout(()=>onDone(id),2600);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[id,onDone]);
  const impactX=fromTeam==="A"?"78%":"22%";
  const color=fromTeam==="A"?"#FF6B6B":"#4D96FF";
  return (
    <div style={{position:"absolute",inset:0,zIndex:50,pointerEvents:"none"}}>
      {phase==="fly"&&(
        <>
          <div style={{position:"absolute",top:`${topPct.current}%`,left:fromTeam==="A"?"-5%":undefined,right:fromTeam==="B"?"-5%":undefined,fontSize:30,transform:fromTeam==="A"?"rotate(45deg)":"rotate(-135deg)",animation:fromTeam==="A"?"rocketA 0.75s cubic-bezier(0.4,0,1,1) forwards":"rocketB 0.75s cubic-bezier(0.4,0,1,1) forwards",filter:"drop-shadow(0 0 12px #FFD93D) drop-shadow(0 0 24px #FF6600)"}}>🚀</div>
          {[...Array(8)].map((_,i)=>(
            <div key={i} style={{position:"absolute",top:`${topPct.current+(Math.random()-0.5)*8}%`,left:fromTeam==="A"?`${4+i*10}%`:undefined,right:fromTeam==="B"?`${4+i*10}%`:undefined,width:5+i*2,height:5+i*2,borderRadius:"50%",background:"#ffffff22",animation:`smokeFade 0.9s ease-out ${i*0.06}s forwards`}}/>
          ))}
        </>
      )}
      {phase==="explode"&&(
        <div style={{position:"absolute",top:"48%",left:impactX,transform:"translate(-50%,-50%)"}}>
          {[0,0.1,0.22,0.35].map((d,i)=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:8,height:8,borderRadius:"50%",border:`${3-Math.min(i,2)}px solid ${i%2===0?color:"#FFD93D"}`,animation:`bigRing ${0.65+i*0.15}s ease-out ${d}s forwards`}}/>
          ))}
          {[...Array(22)].map((_,i)=>(
            <div key={i} style={{position:"absolute",fontSize:16+Math.random()*18,animation:`megaOut${i%8} ${0.7+Math.random()*1}s ease-out ${Math.random()*0.18}s forwards`,filter:`drop-shadow(0 0 10px ${i%2===0?color:"#FFD93D"})`}}>{"💥🔥⭐✨💫🌟⚡🧨"[i%8]}</div>
          ))}
          <div style={{position:"fixed",inset:0,background:fromTeam==="A"?"radial-gradient(circle at 78% 48%,#FF333366,transparent 55%)":"radial-gradient(circle at 22% 48%,#4D96FF66,transparent 55%)",animation:"flashFade 0.8s ease-out forwards",pointerEvents:"none",zIndex:99}}/>
          <div style={{position:"fixed",inset:0,border:`5px solid ${color}`,opacity:0,animation:"flashFade 0.5s ease-out forwards",pointerEvents:"none",zIndex:100}}/>
        </div>
      )}
    </div>
  );
}
