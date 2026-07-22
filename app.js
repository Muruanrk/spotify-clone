// =============================================
//   SOUNDWAVE — SPOTIFY CLONE
//   Full Music Player JavaScript
// =============================================

// ---- Album Art Generator ----
// Generates beautiful unique canvas-based album art for each song
function generateAlbumArt(song, size = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const s = song.artStyle;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, s.c1);
  bg.addColorStop(0.5, s.c2);
  bg.addColorStop(1, s.c3);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Style-specific patterns
  ctx.save();
  switch (s.pattern) {
    case 'circles': {
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(size * 0.5, size * 0.5, (size * 0.1) + i * (size * 0.08), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.12 - i * 0.015})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;
    }
    case 'diagonal': {
      for (let i = -size; i < size * 2; i += size * 0.12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size * 0.5, size);
        ctx.strokeStyle = `rgba(255,255,255,0.08)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      break;
    }
    case 'waves': {
      for (let y = 0; y < size; y += size * 0.1) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= size; x += 4) {
          ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * 2) * 8);
        }
        ctx.strokeStyle = `rgba(255,255,255,0.09)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      break;
    }
    case 'triangles': {
      const pts = 5;
      for (let i = 0; i < pts; i++) {
        const angle = (i / pts) * Math.PI * 2;
        const r = size * 0.35;
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2);
        ctx.lineTo(size / 2 + Math.cos(angle) * r, size / 2 + Math.sin(angle) * r);
        ctx.lineTo(size / 2 + Math.cos(angle + Math.PI / pts) * r * 0.6, size / 2 + Math.sin(angle + Math.PI / pts) * r * 0.6);
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      break;
    }
    case 'grid': {
      const step = size / 7;
      ctx.strokeStyle = `rgba(255,255,255,0.07)`;
      ctx.lineWidth = 1;
      for (let x = 0; x <= size; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
      }
      for (let y = 0; y <= size; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
      }
      break;
    }
    case 'dots': {
      for (let x = 0; x < size; x += size * 0.12) {
        for (let y = 0; y < size; y += size * 0.12) {
          ctx.beginPath();
          ctx.arc(x + size * 0.06, y + size * 0.06, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,0.1)`;
          ctx.fill();
        }
      }
      break;
    }
    case 'spiral': {
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 8; angle += 0.05) {
        const r = angle * (size / (Math.PI * 16));
        const x = size / 2 + r * Math.cos(angle);
        const y = size / 2 + r * Math.sin(angle);
        angle === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,255,255,0.12)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
    case 'hexagons': {
      const hexR = size * 0.15;
      [[0.3, 0.3], [0.7, 0.3], [0.5, 0.6], [0.2, 0.65], [0.8, 0.65]].forEach(([cx, cy]) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const hx = cx * size + hexR * Math.cos(a);
          const hy = cy * size + hexR * Math.sin(a);
          i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,0.1)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      break;
    }
  }
  ctx.restore();

  // Central glow orb
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.4);
  glow.addColorStop(0, `rgba(255,255,255,0.18)`);
  glow.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Emoji / icon in center
  ctx.font = `${size * 0.28}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 12;
  ctx.fillText(song.emoji, size / 2, size / 2 + 2);
  ctx.shadowBlur = 0;

  // Bottom-left album title text
  ctx.font = `bold ${size * 0.065}px Inter, Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const title = song.title.length > 16 ? song.title.slice(0, 14) + '…' : song.title;
  ctx.fillText(title, size * 0.06, size * 0.92);

  return canvas.toDataURL('image/png');
}

// Cache generated art
const artCache = {};
function getArt(song, size = 200) {
  const key = `${song.id}-${size}`;
  if (!artCache[key]) artCache[key] = generateAlbumArt(song, size);
  return artCache[key];
}

// ---- Song Data ----
const songs = [
  // ========== ORIGINAL 9 SONGS ==========
  {
    id: 0, title: "Raga of Revenge", artist: "Cinematic Orchestra", album: "Epic Soundscapes", genre: "epic",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779478102/Raga_of_Revenge_hz0tec.mp3",
    color: "#c0392b", emoji: "🗡️",
    artStyle: { c1: "#e74c3c", c2: "#8e1a0e", c3: "#1a0000", pattern: "circles" },
    artistBio: "A cinematic powerhouse blending ancient Indian classical raga scales with thunderous orchestral revenge themes."
  },
  {
    id: 1, title: "God Mode", artist: "MassTamilan", album: "Mass Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779478048/God-Mode-MassTamilan.dev_ivwt2y.mp3",
    color: "#2980b9", emoji: "⚡",
    artStyle: { c1: "#00d4ff", c2: "#2980b9", c3: "#0d0d2b", pattern: "diagonal" },
    artistBio: "MassTamilan delivers hard-hitting Tamil mass anthems. God Mode is a declaration of unstoppable power and divine confidence."
  },
  {
    id: 2, title: "Bloody Valentine", artist: "MGK", album: "Gothic Love", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779478039/Bloody_Valentine_azxgfi.mp3",
    color: "#8e44ad", emoji: "🥀",
    artStyle: { c1: "#fd79a8", c2: "#8e44ad", c3: "#2d0040", pattern: "waves" },
    artistBio: "A dark romantic journey through love's most painful moments. Captures the bittersweet ache of passion, loss, and longing."
  },
  {
    id: 3, title: "Verappa (Extended)", artist: "MassTamilan", album: "Folk Epics", genre: "folk",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779478027/Verappa---Extended-MassTamilan.dev_z2tuut.mp3",
    color: "#d35400", emoji: "🪘",
    artStyle: { c1: "#f39c12", c2: "#d35400", c3: "#2c1500", pattern: "triangles" },
    artistBio: "An extended journey into South Indian folk heritage. Captures the raw energy of village celebrations and warrior stories."
  },
  {
    id: 4, title: "Verappa", artist: "MassTamilan", album: "Folk Epics", genre: "folk",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779477975/Verappa-MassTamilan.dev_yoevtl.mp3",
    color: "#e67e22", emoji: "🔱",
    artStyle: { c1: "#fdcb6e", c2: "#e67e22", c3: "#2d1200", pattern: "grid" },
    artistBio: "The original Verappa anthem — a raw, powerful celebration of Tamil folk culture featuring traditional percussion."
  },
  {
    id: 5, title: "Naanga Naalu Peru", artist: "MassTamilan", album: "Street Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779477900/Naanga-Naalu-Peru-MassTamilan.dev_i1tagj.mp3",
    color: "#27ae60", emoji: "👥",
    artStyle: { c1: "#55efc4", c2: "#27ae60", c3: "#0a2e1a", pattern: "dots" },
    artistBio: "A vibrant friendship anthem celebrating four inseparable friends and their unbreakable bond."
  },
  {
    id: 6, title: "Karuppa Kooda Va", artist: "MassTamilan", album: "Mass Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779477813/Karuppa-Kooda-Va-MassTamilan.dev_v6gxyp.mp3",
    color: "#1abc9c", emoji: "🌊",
    artStyle: { c1: "#00b894", c2: "#1abc9c", c3: "#003d35", pattern: "spiral" },
    artistBio: "An invocation of Karuppasamy — the Tamil folk deity. Channels ancestral power and devotion in an electrifying mass song."
  },
  {
    id: 7, title: "Athu Thalore", artist: "MassTamilan", album: "Tamil Vibes", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779477802/Athu-Thalore-MassTamilan.dev_pblskm.mp3",
    color: "#f39c12", emoji: "🌟",
    artStyle: { c1: "#ffeaa7", c2: "#f39c12", c3: "#2d1a00", pattern: "hexagons" },
    artistBio: "Athu Thalore brings the playful, joyful side of Tamil music — lighthearted, groovy, and contemporary."
  },
  {
    id: 8, title: "Ain't Nobody", artist: "Chaka Khan", album: "International Hits", genre: "international",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779477759/Ain_t_Nobody_x5l4uu.mp3",
    color: "#9b59b6", emoji: "💜",
    artStyle: { c1: "#a29bfe", c2: "#9b59b6", c3: "#1a0028", pattern: "circles" },
    artistBio: "Chaka Khan's iconic 1983 funk and R&B masterpiece. Timeless, soulful, and irresistibly groovy."
  },

  // ========== 25 NEW SONGS ==========
  {
    id: 9, title: "Kannukulla", artist: "Tamil Cinema", album: "Dude OST", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482769/Kannukulla_c3uaio.mp3",
    color: "#e84393", emoji: "👁️",
    artStyle: { c1: "#fd79a8", c2: "#e84393", c3: "#2d0020", pattern: "waves" },
    artistBio: "Kannukulla is a heartfelt Tamil love ballad that paints vivid imagery of someone who has become the world in your eyes."
  },
  {
    id: 10, title: "Pappali Pazhamey", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482755/Pappali_Pazhamey_qxfvev.mp3",
    color: "#e17055", emoji: "🍹",
    artStyle: { c1: "#fdcb6e", c2: "#e17055", c3: "#2d1000", pattern: "dots" },
    artistBio: "A fun, energetic Tamil track with folk undertones and playful rhythms that capture the joy of celebration."
  },
  {
    id: 11, title: "The Rage", artist: "Cinematic", album: "Epic Soundscapes", genre: "epic",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482741/The_Rage_sstuex.mp3",
    color: "#d63031", emoji: "🔥",
    artStyle: { c1: "#ff7675", c2: "#d63031", c3: "#1a0000", pattern: "triangles" },
    artistBio: "An explosive cinematic track that unleashes pure fury. Perfect for high-octane chase sequences and battle scenes."
  },
  {
    id: 12, title: "Unnai Nambi", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "devotional",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482649/Unnai_Nambi_o7gawc.mp3",
    color: "#f9ca24", emoji: "🙏",
    artStyle: { c1: "#f9ca24", c2: "#e67e22", c3: "#1a1000", pattern: "circles" },
    artistBio: "A soulful devotional Tamil track expressing unwavering faith and surrender to the divine with emotional depth."
  },
  {
    id: 13, title: "Aura 10-10", artist: "Tamil Cinema", album: "Mass Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482667/Aura_10-10_ub8vsw.mp3",
    color: "#6c5ce7", emoji: "✨",
    artStyle: { c1: "#a29bfe", c2: "#6c5ce7", c3: "#0d0028", pattern: "spiral" },
    artistBio: "Aura 10-10 is a mass anthem celebrating someone's irresistible charm and ten-out-of-ten vibes that command attention."
  },
  {
    id: 14, title: "Naa Vera Level", artist: "MassTamilan", album: "Street Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482635/Naa_Vera_Level_lsvtrn.mp3",
    color: "#00b894", emoji: "🆙",
    artStyle: { c1: "#55efc4", c2: "#00b894", c3: "#003028", pattern: "diagonal" },
    artistBio: "A self-assured swagger anthem — 'I'm on a different level' — celebrating uniqueness and unmatched street confidence."
  },
  {
    id: 15, title: "Velum Mayilum", artist: "Tamil Devotional", album: "Devotional Classics", genre: "devotional",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482630/Velum_Mayilum_ey1p1y.mp3",
    color: "#fdcb6e", emoji: "🦚",
    artStyle: { c1: "#ffeaa7", c2: "#fdcb6e", c3: "#1a1000", pattern: "hexagons" },
    artistBio: "A classic devotional song in praise of Lord Murugan, his divine Vel (spear) and Mayil (peacock). Timeless and sacred."
  },
  {
    id: 16, title: "Takita Taka Theme", artist: "Tamil Cinema", album: "Epic Soundscapes", genre: "epic",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482554/Takita_Taka_Theme_gfhfzn.mp3",
    color: "#0984e3", emoji: "🎭",
    artStyle: { c1: "#74b9ff", c2: "#0984e3", c3: "#001a40", pattern: "grid" },
    artistBio: "A percussion-driven cinematic theme with pulsating rhythmic patterns — the heartbeat of an unforgettable film."
  },
  {
    id: 17, title: "Chella Magale", artist: "MassTamilan", album: "Tamil Vibes", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482547/Chella-Magale-MassTamilan.dev_pefbvl.mp3",
    color: "#fd79a8", emoji: "👧",
    artStyle: { c1: "#ffeef7", c2: "#fd79a8", c3: "#2d0025", pattern: "dots" },
    artistBio: "A sweet and tender song — 'Chella Magale' means 'my dear daughter' — a father's pure love expressed through melody."
  },
  {
    id: 18, title: "Oru Pere Varalaaru", artist: "MassTamilan", album: "Street Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482541/Oru-Pere-Varalaaru-MassTamilan.dev_xqt7bl.mp3",
    color: "#e17055", emoji: "📖",
    artStyle: { c1: "#fab1a0", c2: "#e17055", c3: "#2d0e00", pattern: "triangles" },
    artistBio: "A mass anthem about building a legendary name from nothing — a story of struggle, identity, and triumph."
  },
  {
    id: 19, title: "Thalapathy Kacheri", artist: "Tamil Cinema", album: "Mass Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482414/Thalapathy_Kacheri_ntogaz.mp3",
    color: "#2d3436", emoji: "🎤",
    artStyle: { c1: "#636e72", c2: "#2d3436", c3: "#000000", pattern: "spiral" },
    artistBio: "Thalapathy Kacheri — a tribute concert to the legend Thalapathy Vijay. An electrifying celebration of Tamil cinema's icon."
  },
  {
    id: 20, title: "Kannukulla Reprise", artist: "Tamil Cinema", album: "Dude OST", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779482067/Kannukulla_Reprise_hcgkhs.mp3",
    color: "#e84393", emoji: "💞",
    artStyle: { c1: "#ff8dd9", c2: "#e84393", c3: "#2d0018", pattern: "waves" },
    artistBio: "The emotional reprise of Kannukulla — stripped back, raw, and even more heartbreaking than the original."
  },
  {
    id: 21, title: "Dude Trailer Blast Theme", artist: "Cinematic", album: "Dude OST", genre: "epic",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481951/Dude_Trailer_Blast_Theme_vbba2u.mp3",
    color: "#e84393", emoji: "💥",
    artStyle: { c1: "#ff6b6b", c2: "#e84393", c3: "#0d0010", pattern: "diagonal" },
    artistBio: "The explosive trailer theme from the movie Dude — big bass, orchestral hits, and pure cinematic adrenaline."
  },
  {
    id: 22, title: "Nallaru Po", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481614/Nallaru_Po_muff2d.mp3",
    color: "#badc58", emoji: "👋",
    artStyle: { c1: "#f9f9a0", c2: "#badc58", c3: "#1a2800", pattern: "circles" },
    artistBio: "A playful break-up anthem — 'Nallaru Po' means 'go away in peace' — light-hearted, humorous, and catchy."
  },
  {
    id: 23, title: "Blud Is On His Way", artist: "UK Drill", album: "International Hits", genre: "international",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481544/Blud_Is_On_His_Way_dxhaek.mp3",
    color: "#2d3436", emoji: "🥶",
    artStyle: { c1: "#74b9ff", c2: "#2d3436", c3: "#000000", pattern: "grid" },
    artistBio: "A chilling UK drill track with icy production and menacing delivery. A street anthem from the underground scene."
  },
  {
    id: 24, title: "Jilpanso", artist: "Tamil Cinema", album: "Folk Epics", genre: "folk",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481490/Jilpanso_f2r7mr.mp3",
    color: "#e84393", emoji: "🪅",
    artStyle: { c1: "#ff9ff3", c2: "#e84393", c3: "#2d0020", pattern: "dots" },
    artistBio: "A vibrant folk-fusion track blending traditional Tamil percussion with modern production for pure festive energy."
  },
  {
    id: 25, title: "Yumabaibesa", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481481/Yumabaibesa_a2rgjo.mp3",
    color: "#f368e0", emoji: "💬",
    artStyle: { c1: "#fd79a8", c2: "#f368e0", c3: "#1a0028", pattern: "hexagons" },
    artistBio: "A smooth Tamil track exploring the art of conversation — witty, charming, and full of playful wordplay."
  },
  {
    id: 26, title: "Oorum Blood Unplugged", artist: "Tamil Cinema", album: "Folk Epics", genre: "folk",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481434/Oorum_Blood_Unplugged_js3gsh.mp3",
    color: "#e17055", emoji: "🎸",
    artStyle: { c1: "#fab1a0", c2: "#e17055", c3: "#1a0800", pattern: "waves" },
    artistBio: "The raw, acoustic unplugged version of Oorum Blood — stripped to the bones, exposing the song's emotional core."
  },
  {
    id: 27, title: "Aasa Pulla", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481336/Aasa_Pulla_hza84n.mp3",
    color: "#ff7675", emoji: "🐦",
    artStyle: { c1: "#ffeaa7", c2: "#ff7675", c3: "#2d1000", pattern: "spiral" },
    artistBio: "Aasa Pulla is a sweet love song comparing the beloved to a beautiful little bird, full of warmth and tenderness."
  },
  {
    id: 28, title: "Pavazha Malli", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481243/Pavazha_Malli_yrzkjk.mp3",
    color: "#fd79a8", emoji: "🌸",
    artStyle: { c1: "#ffeef7", c2: "#fd79a8", c3: "#2d0018", pattern: "circles" },
    artistBio: "Pavazha Malli — a poetic love song named after the coral jasmine flower, delicate and fragrantly romantic."
  },
  {
    id: 29, title: "Ponmaaney", artist: "Tamil Cinema", album: "Tamil Vibes", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481230/Ponmaaney_oplghx.mp3",
    color: "#f9ca24", emoji: "🌙",
    artStyle: { c1: "#ffe066", c2: "#f9ca24", c3: "#1a1000", pattern: "dots" },
    artistBio: "Ponmaaney means 'golden one' — a deeply romantic Tamil melody that celebrates the golden beauty of a loved one."
  },
  {
    id: 30, title: "Loveah Sollitalea", artist: "Tamil Cinema", album: "Love Songs", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481227/Loveah_Sollitalea_loqqxx.mp3",
    color: "#e84393", emoji: "💌",
    artStyle: { c1: "#ff8dd9", c2: "#e84393", c3: "#1a0010", pattern: "diagonal" },
    artistBio: "Did I say I love you? — a playful and sweet Tamil song about the courage it takes to confess feelings for the first time."
  },
  {
    id: 31, title: "Mutta Kalakki", artist: "Tamil Cinema", album: "Street Anthems", genre: "tamil",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481193/Mutta_Kalakki_ldrxu7.mp3",
    color: "#fdcb6e", emoji: "🥚",
    artStyle: { c1: "#ffeaa7", c2: "#fdcb6e", c3: "#1a1000", pattern: "triangles" },
    artistBio: "A high-energy, humorous Tamil street anthem full of local slang and foot-stomping beats for mass entertainment."
  },
  {
    id: 32, title: "Paranthene Penne", artist: "Tamil Cinema", album: "Love Songs", genre: "love",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779481169/Paranthene_Penne_gdyfgj.mp3",
    color: "#74b9ff", emoji: "🕊️",
    artStyle: { c1: "#a8d8ff", c2: "#74b9ff", c3: "#001540", pattern: "waves" },
    artistBio: "Paranthene Penne — 'she who flew away' — a bittersweet love song about losing someone who was meant to stay."
  },
  {
    id: 33, title: "Alapuzha Sandhayila", artist: "Tamil Cinema", album: "Folk Epics", genre: "folk",
    url: "https://res.cloudinary.com/dpmpzwupa/video/upload/q_auto/f_auto/v1779480866/Alapuzha_Sandhayila_mjfkhx.mp3",
    color: "#00cec9", emoji: "🌅",
    artStyle: { c1: "#81ecec", c2: "#00cec9", c3: "#003035", pattern: "hexagons" },
    artistBio: "A vibrant folk song set in the markets of Alleppey (Alapuzha), Kerala — a cultural crossover celebrating Kerala-Tamil bonds."
  }
];

// ---- State ----
const state = {
  currentSong: null,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 0,
  volume: 0.8,
  isMuted: false,
  likedSongs: new Set(),
  currentView: 'grid',
  currentPage: 'home',
  history: [],
  isFullscreen: false,
  isDragging: false
};

// ---- DOM References ----
const audio = document.getElementById('audioPlayer');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const fsProgressFill = document.getElementById('fsProgressFill');
const fsProgressThumb = document.getElementById('fsProgressThumb');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const fsCurrentTimeEl = document.getElementById('fsCurrentTime');
const fsTotalTimeEl = document.getElementById('fsTotalTime');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const fsPlayIcon = document.getElementById('fsPlayIcon');
const fsPauseIcon = document.getElementById('fsPauseIcon');

// ---- Init ----
function init() {
  setGreeting();
  // Pre-generate album art for all songs
  songs.forEach(s => getArt(s, 200));
  renderSongs();
  renderQuickPicks();
  renderQueue();
  renderLibrary();
  updateStatCount();
  setupAudio();
  setupDragProgress();
  updateVolume(80);
}

function setGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById('greeting');
  if (hour < 12) greetingEl.textContent = 'Good Morning';
  else if (hour < 17) greetingEl.textContent = 'Good Afternoon';
  else greetingEl.textContent = 'Good Evening';
}

function updateStatCount() {
  const countEl = document.querySelector('.stat-number');
  if (countEl) countEl.textContent = songs.length;
}

// ---- Artwork HTML helper ----
function artImg(song, cls = '', extraStyle = '') {
  const src = getArt(song, 200);
  return `<img src="${src}" class="${cls}" style="width:100%;height:100%;object-fit:cover;display:block;${extraStyle}" alt="${song.title}" draggable="false" />`;
}

// ---- Render Songs ----
function renderSongs() { renderGridView(); }

function renderGridView() {
  const container = document.getElementById('songsContainer');
  if (!container) return;
  container.innerHTML = '';
  songs.forEach((song, i) => {
    const isActive = state.currentSong === i;
    const div = document.createElement('div');
    div.className = `song-card${isActive ? ' active' : ''}`;
    div.id = `song-card-${i}`;
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="song-card-artwork" style="overflow:hidden;border-radius:var(--radius-md);position:relative;">
        ${artImg(song, '', 'border-radius:inherit;')}
        <div class="song-card-play" style="position:absolute;inset:0;">
          ${isActive && state.isPlaying
            ? `<div class="playing-indicator"><span></span><span></span><span></span></div>`
            : `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`
          }
        </div>
      </div>
      <div class="song-card-num">${isActive && state.isPlaying ? '♪' : i + 1}</div>
      <div class="song-card-title">${song.title}</div>
      <div class="song-card-artist">${song.artist}</div>
    `;
    container.appendChild(div);
  });
}

function renderListView() {
  const container = document.getElementById('songsContainer');
  if (!container) return;
  container.innerHTML = '';
  songs.forEach((song, i) => {
    const isActive = state.currentSong === i;
    const isLiked = state.likedSongs.has(i);
    const div = document.createElement('div');
    div.className = `song-row${isActive ? ' active' : ''}`;
    div.id = `song-row-${i}`;
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="song-row-num">${isActive && state.isPlaying ? '♪' : i + 1}</div>
      <div class="song-row-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="song-row-artwork" style="overflow:hidden;border-radius:var(--radius-sm);">${artImg(song)}</div>
      <div class="song-row-info">
        <div class="song-row-title">${song.title}</div>
        <div class="song-row-artist">${song.artist}</div>
      </div>
      <div class="song-row-album">${song.album}</div>
      <div class="song-row-duration" id="duration-${i}">—</div>
      <button class="song-row-like${isLiked ? ' liked' : ''}" onclick="event.stopPropagation(); toggleSongLike(${i})">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
}

function renderQuickPicks() {
  const grid = document.getElementById('quickPicksGrid');
  if (!grid) return;
  // Show 6 random/first songs
  const picks = [...songs].sort(() => 0.5 - Math.random()).slice(0, 6);
  grid.innerHTML = '';
  picks.forEach(song => {
    const i = songs.indexOf(song);
    const div = document.createElement('div');
    div.className = 'quick-pick-card';
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="qp-artwork" style="overflow:hidden;position:relative;flex-shrink:0;width:56px;height:56px;">
        ${artImg(song, '', '')}
        <div class="qp-play-overlay" style="position:absolute;inset:0;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="qp-info">
        <div class="qp-title">${song.title}</div>
        <div class="qp-artist">${song.artist}</div>
      </div>
    `;
    grid.appendChild(div);
  });
}

function renderQueue() {
  const list = document.getElementById('queueList');
  if (!list) return;
  list.innerHTML = '';
  songs.forEach((song, i) => {
    const isActive = state.currentSong === i;
    const div = document.createElement('div');
    div.className = `queue-item${isActive ? ' active' : ''}`;
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="queue-artwork" style="overflow:hidden;border-radius:var(--radius-sm);flex-shrink:0;width:40px;height:40px;">${artImg(song)}</div>
      <div class="queue-info">
        <div class="queue-title">${song.title}</div>
        <div class="queue-artist">${song.artist}</div>
      </div>
      <div class="queue-num" id="queue-dur-${i}">—</div>
    `;
    list.appendChild(div);
  });
}

function renderLibrary() {
  const list = document.getElementById('libraryList');
  if (!list) return;
  list.innerHTML = '';
  songs.forEach((song, i) => {
    const isActive = state.currentSong === i;
    const isLiked = state.likedSongs.has(i);
    const div = document.createElement('div');
    div.className = `song-row${isActive ? ' active' : ''}`;
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="song-row-num">${i + 1}</div>
      <div class="song-row-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="song-row-artwork" style="overflow:hidden;border-radius:var(--radius-sm);">${artImg(song)}</div>
      <div class="song-row-info">
        <div class="song-row-title">${song.title}</div>
        <div class="song-row-artist">${song.artist}</div>
      </div>
      <div class="song-row-album">${song.album}</div>
      <div class="song-row-duration" id="lib-dur-${i}">—</div>
      <button class="song-row-like${isLiked ? ' liked' : ''}" onclick="event.stopPropagation(); toggleSongLike(${i})">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
      </button>
    `;
    list.appendChild(div);
  });
}

// ---- Audio Setup ----
function setupAudio() {
  audio.volume = state.volume;
  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('loadedmetadata', onMetadataLoaded);
  audio.addEventListener('ended', onSongEnded);
  audio.addEventListener('error', onAudioError);
}

function onTimeUpdate() {
  if (!audio.duration || state.isDragging) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  updateProgress(pct);
  currentTimeEl.textContent = formatTime(audio.currentTime);
  fsCurrentTimeEl.textContent = formatTime(audio.currentTime);
  updateFullscreenLyrics();
}

function onMetadataLoaded() {
  const dur = formatTime(audio.duration);
  totalTimeEl.textContent = dur;
  fsTotalTimeEl.textContent = dur;
  const songIdx = state.currentSong;
  if (songIdx !== null) {
    document.querySelectorAll(`#duration-${songIdx}, #lib-dur-${songIdx}, #queue-dur-${songIdx}`)
      .forEach(el => { if (el) el.textContent = dur; });
  }
  preloadDurations();
}

let preloaded = false;
function preloadDurations() {
  if (preloaded) return;
  preloaded = true;
  songs.forEach((song, i) => {
    if (i === state.currentSong) return;
    const t = new Audio();
    t.src = song.url;
    t.preload = 'metadata';
    t.addEventListener('loadedmetadata', () => {
      const dur = formatTime(t.duration);
      document.querySelectorAll(`#duration-${i}, #lib-dur-${i}, #queue-dur-${i}`)
        .forEach(el => { if (el) el.textContent = dur; });
    });
  });
}

function onSongEnded() {
  if (state.repeatMode === 2) { audio.currentTime = 0; audio.play(); }
  else if (state.isShuffle) playSong(Math.floor(Math.random() * songs.length));
  else nextSong();
}

function onAudioError() {
  showToast('⚠️ Error loading audio. Check your connection.');
  setPlayingState(false);
}

// ---- Play Song ----
function playSong(index) {
  if (index < 0 || index >= songs.length) return;
  if (state.currentSong !== null && state.currentSong !== index) state.history.push(state.currentSong);
  state.currentSong = index;
  currentLyricIndex = -1;
  const song = songs[index];
  audio.src = song.url;
  audio.load();
  audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  updateNowPlaying(song);
  updatePlayerBar(song);
  updateAmbient(song);
  updateActiveStates(index);
  updateQueue(index);
  document.title = `${song.title} — ${song.artist} | Soundwave`;
}

function setPlayingState(playing) {
  state.isPlaying = playing;
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
  fsPlayIcon.style.display = playing ? 'none' : 'block';
  fsPauseIcon.style.display = playing ? 'block' : 'none';
  const vinyl = document.getElementById('vinylRecord');
  const waves = document.getElementById('soundWaves');
  if (vinyl) vinyl.classList.toggle('spinning', playing);
  if (waves) waves.classList.toggle('active', playing);
  if (state.currentView === 'grid') renderGridView();
  else renderListView();
  renderQueue();
}

function togglePlay() {
  if (state.currentSong === null) { playSong(0); return; }
  if (state.isPlaying) { audio.pause(); setPlayingState(false); }
  else audio.play().then(() => setPlayingState(true));
}

function nextSong() {
  if (state.currentSong === null) { playSong(0); return; }
  const next = state.isShuffle ? Math.floor(Math.random() * songs.length) : (state.currentSong + 1) % songs.length;
  playSong(next);
}

function prevSong() {
  if (state.currentSong === null) { playSong(0); return; }
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (state.history.length > 0) playSong(state.history.pop());
  else playSong((state.currentSong - 1 + songs.length) % songs.length);
}

function toggleShuffle() {
  state.isShuffle = !state.isShuffle;
  document.getElementById('shuffleBtn').classList.toggle('active', state.isShuffle);
  document.getElementById('fsShuffleBtn').classList.toggle('active', state.isShuffle);
  showToast(state.isShuffle ? '🔀 Shuffle on' : '🔀 Shuffle off');
}

function toggleRepeat() {
  state.repeatMode = (state.repeatMode + 1) % 3;
  const btn = document.getElementById('repeatBtn');
  const fsBtn = document.getElementById('fsRepeatBtn');
  const modes = ['Repeat off', 'Repeat all', 'Repeat one'];
  const icon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`;
  btn.innerHTML = icon; fsBtn.innerHTML = icon;
  [btn, fsBtn].forEach(b => b.classList.toggle('active', state.repeatMode > 0));
  showToast(`🔁 ${modes[state.repeatMode]}`);
}

// ---- Volume ----
function setVolume(val) {
  const v = val / 100;
  state.volume = v;
  audio.volume = state.isMuted ? 0 : v;
  document.getElementById('volumeSlider').value = val;
  document.getElementById('fsVolumeSlider').value = val;
  if (v === 0 || state.isMuted) {
    document.getElementById('volIcon').style.display = 'none';
    document.getElementById('muteIcon').style.display = 'block';
  } else {
    document.getElementById('volIcon').style.display = 'block';
    document.getElementById('muteIcon').style.display = 'none';
  }
}
function updateVolume(val) { setVolume(val); }

function toggleMute() {
  state.isMuted = !state.isMuted;
  audio.volume = state.isMuted ? 0 : state.volume;
  document.getElementById('volIcon').style.display = state.isMuted ? 'none' : 'block';
  document.getElementById('muteIcon').style.display = state.isMuted ? 'block' : 'none';
}

// ---- Progress ----
function updateProgress(pct) {
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  fsProgressFill.style.width = pct + '%';
  fsProgressThumb.style.left = pct + '%';
}

function seekTo(event, isFullscreen = false) {
  const track = isFullscreen ? document.getElementById('fsProgressTrack') : document.getElementById('progressTrack');
  const rect = track.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  if (audio.duration) { audio.currentTime = pct * audio.duration; updateProgress(pct * 100); }
}

function setupDragProgress() {
  const bar = document.getElementById('progressTrack');
  let dragging = false;
  bar.addEventListener('mousedown', e => { dragging = true; state.isDragging = true; seekTo(e, false); });
  document.addEventListener('mousemove', e => { if (dragging) seekTo(e, false); });
  document.addEventListener('mouseup', () => { if (dragging) { dragging = false; state.isDragging = false; } });
}

// ---- Now Playing UI ----
function getArtDataUrl(song) { return getArt(song, 300); }

function updateNowPlaying(song) {
  const art = getArtDataUrl(song);
  document.getElementById('npTitle').textContent = song.title;
  document.getElementById('npArtist').textContent = song.artist;
  const npArtwork = document.getElementById('npArtwork');
  npArtwork.style.background = 'none';
  npArtwork.innerHTML = `<img src="${art}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-xl);" alt="${song.title}" />`;
  document.getElementById('npGlow').style.background = song.color;
  document.getElementById('npGlow').style.opacity = '0.4';

  document.getElementById('artistInfo').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;">
        <img src="${getArt(song, 36)}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div>
        <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);">${song.artist}</div>
        <div style="font-size:0.7rem;color:var(--green);">${song.genre.charAt(0).toUpperCase() + song.genre.slice(1)}</div>
      </div>
    </div>
    <p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.6;">${song.artistBio}</p>
  `;

  updateFullscreenLyrics();

  const liked = state.likedSongs.has(state.currentSong);
  document.getElementById('likeBtn')?.classList.toggle('liked', liked);
  document.getElementById('playerLikeBtn')?.classList.toggle('liked', liked);
}

function updatePlayerBar(song) {
  const art = getArt(song, 100);
  document.getElementById('playerTrackName').textContent = song.title;
  document.getElementById('playerTrackArtist').textContent = song.artist;
  const playerArtwork = document.getElementById('playerArtwork');
  playerArtwork.style.background = 'none';
  playerArtwork.innerHTML = `<img src="${art}" style="width:100%;height:100%;object-fit:cover;" alt="${song.title}" />`;

  const fsArt = getArt(song, 400);
  document.getElementById('fsTitle').textContent = song.title;
  document.getElementById('fsArtist').textContent = song.artist;
  document.getElementById('fsAlbum').textContent = song.album;
  const fsArtwork = document.getElementById('fsArtwork');
  fsArtwork.style.background = 'none';
  fsArtwork.innerHTML = `<img src="${fsArt}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-xl);" alt="${song.title}" />`;
  document.getElementById('fsGlow').style.background = song.color;
  document.getElementById('fsGlow').style.opacity = '0.5';
  document.getElementById('fsBg').style.background = `radial-gradient(ellipse at center, ${song.color}33 0%, var(--bg-base) 70%)`;
}

function updateAmbient(song) {
  document.getElementById('ambientBg').style.background = `
    radial-gradient(ellipse 80% 60% at 20% 10%, ${song.color}18 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 90%, ${song.color}10 0%, transparent 60%)
  `;
}

function updateActiveStates(index) {
  document.querySelectorAll('.song-card').forEach((el, i) => el.classList.toggle('active', i === index));
  document.querySelectorAll('.song-row').forEach((el, i) => el.classList.toggle('active', i === index));
}

function updateQueue(currentIndex) {
  document.querySelectorAll('.queue-item').forEach((el, i) => el.classList.toggle('active', i === currentIndex));
}

// ---- Utilities ----
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---- Navigation ----
function navigateTo(page) {
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`nav-${page}`)?.classList.add('active');
}

// ---- Search ----
function handleSearch(query) {
  navigateTo('search');
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  if (!query.trim()) {
    resultsEl.innerHTML = '<div style="color:var(--text-subdued);font-size:0.875rem;padding:8px;">Start typing to search...</div>';
    return;
  }
  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.album.toLowerCase().includes(query.toLowerCase()) ||
    s.genre.toLowerCase().includes(query.toLowerCase())
  );
  if (filtered.length === 0) {
    resultsEl.innerHTML = `<div style="color:var(--text-subdued);font-size:0.875rem;padding:8px;">No results for "<strong style="color:var(--text-primary)">${query}</strong>"</div>`;
    return;
  }
  resultsEl.innerHTML = '';
  filtered.forEach(song => {
    const i = songs.indexOf(song);
    const div = document.createElement('div');
    div.className = `song-row${state.currentSong === i ? ' active' : ''}`;
    div.onclick = () => playSong(i);
    div.innerHTML = `
      <div class="song-row-num">${i + 1}</div>
      <div class="song-row-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="song-row-artwork" style="overflow:hidden;border-radius:var(--radius-sm);">${artImg(song)}</div>
      <div class="song-row-info">
        <div class="song-row-title">${song.title}</div>
        <div class="song-row-artist">${song.artist}</div>
      </div>
      <div class="song-row-album">${song.album}</div>
      <div class="song-row-duration">—</div>
      <div></div>
    `;
    resultsEl.appendChild(div);
  });
}

function filterByGenre(genre) {
  navigateTo('search');
  const q = genre === 'all' ? '' : genre;
  document.getElementById('searchInput').value = q;
  handleSearch(q);
}

// ---- View Toggle ----
function toggleView(view) {
  state.currentView = view;
  document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
  const container = document.getElementById('songsContainer');
  if (view === 'grid') { container.className = 'songs-container grid-view'; renderGridView(); }
  else { container.className = 'songs-container list-view'; renderListView(); }
}

// ---- Like ----
function toggleLike() {
  if (state.currentSong === null) return;
  const i = state.currentSong;
  if (state.likedSongs.has(i)) { state.likedSongs.delete(i); showToast(`💔 Removed from Liked Songs`); }
  else { state.likedSongs.add(i); showToast(`💚 Added to Liked Songs`); }
  const liked = state.likedSongs.has(i);
  document.getElementById('likeBtn')?.classList.toggle('liked', liked);
  document.getElementById('playerLikeBtn')?.classList.toggle('liked', liked);
  if (state.currentView === 'grid') renderGridView(); else renderListView();
  renderLibrary();
}

function toggleSongLike(i) {
  const prevCurrent = state.currentSong;
  state.currentSong = i;
  if (state.likedSongs.has(i)) { state.likedSongs.delete(i); showToast(`💔 Removed`); }
  else { state.likedSongs.add(i); showToast(`💚 Liked`); }
  state.currentSong = prevCurrent;
  if (prevCurrent !== null) {
    const liked = state.likedSongs.has(prevCurrent);
    document.getElementById('likeBtn')?.classList.toggle('liked', liked);
    document.getElementById('playerLikeBtn')?.classList.toggle('liked', liked);
  }
  if (state.currentView === 'grid') renderGridView(); else renderListView();
  renderLibrary();
}

// ---- Fullscreen ----
function toggleFullscreen() {
  state.isFullscreen = !state.isFullscreen;
  document.getElementById('fullscreenPlayer').classList.toggle('open', state.isFullscreen);
  if (state.isFullscreen && state.currentSong !== null) {
    updatePlayerBar(songs[state.currentSong]);
    currentLyricIndex = -1;
    updateFullscreenLyrics();
  }
}

// ---- Right Panel ----
function toggleRightPanel() {
  const p = document.getElementById('rightPanel');
  p.style.display = p.style.display === 'none' ? 'flex' : 'none';
}

function switchTab(tab) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${tab}`)?.classList.add('active');
  document.getElementById(`panel-${tab}`)?.classList.add('active');
}

// ---- Playlist ----
function showPlaylist(type) {
  if (type === 'favorites' || type === 'recent') navigateTo('library');
  else navigateTo('home');
}

function createPlaylist() {
  showToast('➕ New playlist created!');
  const list = document.getElementById('playlistList');
  const li = document.createElement('li');
  li.className = 'playlist-item';
  li.innerHTML = `<div class="playlist-item-icon">🎵</div>My Playlist #${list.children.length}`;
  list.appendChild(li);
}

// ---- Misc ----
function toggleNotifications() { showToast('🔔 No new notifications'); }
function addToQueue() {
  if (state.currentSong === null) return;
  showToast(`➕ Added "${songs[state.currentSong].title}" to queue`);
}
function shareTrack() {
  if (state.currentSong === null) return;
  const song = songs[state.currentSong];
  if (navigator.clipboard) {
    navigator.clipboard.writeText(song.url).then(() => showToast(`🔗 Link copied: ${song.title}`)).catch(() => showToast(`🔗 ${song.title} by ${song.artist}`));
  } else { showToast(`🔗 ${song.title} by ${song.artist}`); }
}

// ---- Toast ----
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- Keyboard Shortcuts ----
document.addEventListener('keydown', e => {
  if (document.activeElement.tagName === 'INPUT') return;
  switch (e.code) {
    case 'Space': e.preventDefault(); togglePlay(); break;
    case 'ArrowRight': e.altKey ? nextSong() : (audio.duration && (audio.currentTime = Math.min(audio.duration, audio.currentTime + 5))); break;
    case 'ArrowLeft': e.altKey ? prevSong() : (audio.duration && (audio.currentTime = Math.max(0, audio.currentTime - 5))); break;
    case 'ArrowUp': e.preventDefault(); setVolume(Math.min(100, Math.round(state.volume * 100) + 5)); break;
    case 'ArrowDown': e.preventDefault(); setVolume(Math.max(0, Math.round(state.volume * 100) - 5)); break;
    case 'KeyM': toggleMute(); break;
    case 'KeyS': toggleShuffle(); break;
    case 'KeyR': toggleRepeat(); break;
    case 'KeyF': toggleFullscreen(); break;
    case 'Escape': if (state.isFullscreen) toggleFullscreen(); break;
  }
});

// ---- Curated Lyrics Database & Sync Helpers ----
const songLyrics = {
  0: [
    { time: 0, text: "🎶 (Distant, mysterious sitar scales rising...) 🎶" },
    { time: 6, text: "Under the shadow of the blood-red sun..." },
    { time: 12, text: "A silent promise of what has begun..." },
    { time: 18, text: "They took the light, left only cold gray stone" },
    { time: 24, text: "But a king returns to reclaim his throne!" },
    { time: 30, text: "Feel the fire rising deep within the core!" },
    { time: 36, text: "Hear the ancient raga, roaring like a storm!" },
    { time: 42, text: "Strike like thunder, let the shadows fall" },
    { time: 48, text: "This is the revenge that will end it all!" },
    { time: 54, text: "🎶 (Violent orchestral peak, string crescendos) 🎶" },
    { time: 66, text: "Justice written in the dust and flame" },
    { time: 72, text: "History will never speak their name!" }
  ],
  1: [
    { time: 0, text: "⚡ (God Mode Mass BGM plays...) ⚡" },
    { time: 5, text: "Yei! Machi ithu namma aattam da!" },
    { time: 10, text: "Vazhiyile ninnu ellam paarthuko da!" },
    { time: 15, text: "Naa vanthaa theri, nee ninnaa sarugu!" },
    { time: 20, text: "Ulagame namma kaiyil, mass anthems da!" },
    { time: 25, text: "Aadi paadu, accelerate the beat-u!" },
    { time: 30, text: "Namma gethu eppovumey top-u class-u!" },
    { time: 35, text: "GOD MODE Active! Ingey yaarumey illa!" },
    { time: 40, text: "Bayam thavirthu jeyikka thuniyum manasu da!" },
    { time: 45, text: "🔥 (Mass electronic dappan kuthu breakdown) 🔥" },
    { time: 55, text: "Vetri kodi naattu, bayam ini illai!" },
    { time: 60, text: "Soundwave aattam thodangiduchu thozha!" }
  ],
  2: [
    { time: 0, text: "🥀 (Melancholy gothic guitar intro plays...) 🥀" },
    { time: 6, text: "In a room of broken mirrors and neon lace" },
    { time: 12, text: "I still see the outline of your lovely face" },
    { time: 18, text: "We danced on the edge of a beautiful knife" },
    { time: 24, text: "You were the poison, the love of my life" },
    { time: 30, text: "Oh, be my bloody valentine tonight!" },
    { time: 36, text: "Bleeding in the dark, under silver light" },
    { time: 42, text: "Break my heart in two, I don't care at all" },
    { time: 48, text: "With you, I'm ready to take the final fall" },
    { time: 54, text: "🎶 (Heavy alternative rock drum beat swells) 🎶" },
    { time: 64, text: "Two dark souls intertwined in the cold" },
    { time: 70, text: "A tragic romance that will never grow old..." }
  ],
  3: [
    { time: 0, text: "🪘 (Raw South Indian folk instruments join...) 🪘" },
    { time: 6, text: "Ooru vala valavu, mela thaalam thuttu!" },
    { time: 12, text: "Verappa aattam pudaikka vanthachu thozhaa!" },
    { time: 18, text: "Mannin vaasam, namma mela satham!" },
    { time: 24, text: "Gramathu celebration kulla kudhika!" },
    { time: 30, text: "Thunda thooki tholaiyile podu machi!" },
    { time: 36, text: "Kottu melam adikka, thulli kudhika!" },
    { time: 42, text: "Intha folk beat namma gethu da!" },
    { time: 48, text: "Verappa kootathoda koodi magizhnthidu da!" },
    { time: 54, text: "🥁 (High energy village folk percussion roll) 🥁" }
  ],
  4: [
    { time: 0, text: "🔱 (Folk celebratory nadaswaram start!) 🔱" },
    { time: 5, text: "Verappa kural inge kaadula ketkuthu!" },
    { time: 10, text: "Gramathu sandhosham nenjukulla ottuthu!" },
    { time: 16, text: "Mannin perumaikkana warrior paatu da!" },
    { time: 22, text: "Kavalaiyillaa aattam potu jeyikkanum da!" },
    { time: 28, text: "Thiruvizha gethu namma gethu thozha!" },
    { time: 34, text: "Let's feel the high power folk, vaa!" },
    { time: 40, text: "🥁 (Intense folk-drum roll & whistle celebration) 🥁" }
  ],
  5: [
    { time: 0, text: "👥 (Sweet whistles and acoustic intro...) 👥" },
    { time: 5, text: "Naanga naalu peru, aana uyir onnu!" },
    { time: 10, text: "Enga friendship mela yaarumey illai!" },
    { time: 16, text: "School days muthal, college varai!" },
    { time: 22, text: "Koodavey vazhntha engal nanbaney!" },
    { time: 28, text: "Unbreakable bond, namma thozhargal!" },
    { time: 34, text: "Intha paatu unakaha thaan en macha!" },
    { time: 40, text: "🎶 (Melodic friendship guitar interlude) 🎶" }
  ],
  6: [
    { time: 0, text: "🔱 (Powerful devotional folk invocation...) 🔱" },
    { time: 6, text: "Karuppasamy vaaran, getha paarthuko da!" },
    { time: 12, text: "Aruvaalai thooki thunaiyaha nirkum deivam da!" },
    { time: 18, text: "Oru murai koovinaal, ododi varuvan da!" },
    { time: 24, text: "Bayam thavirthu engalukku pathukaapu tharuvan da!" },
    { time: 30, text: "Karuppa kooda vaa, thunaiyaha iru!" },
    { time: 36, text: "Vetri payanathi, engalai nee vazhivedu!" },
    { time: 42, text: "🥁 (Electrifying traditional urumi percussion) 🥁" }
  ],
  7: [
    { time: 0, text: "🌟 (Playful Tamil fusion music starts...) 🌟" },
    { time: 5, text: "Athu Thalore! Groovy satham ketkuthey!" },
    { time: 10, text: "Nenjukulle pudhu aattam aarambam aahuthey!" },
    { time: 16, text: "Kulirnthu paadu, jolly-aha vazhnthidu!" },
    { time: 22, text: "Soundwave vibes-il eppothumey jeyithidu!" },
    { time: 28, text: "Vaa thozha, lighthearted-ah paadu!" },
    { time: 34, text: "Nalla neram inge piranthathu da!" },
    { time: 40, text: "🎶 (Upbeat modern Tamil synth melody) 🎶" }
  ],
  9: [
    { time: 0, text: "👁️ (Deep emotional string pads intro...) 👁️" },
    { time: 5, text: "Kannukulla unnai naane vaithenadi..." },
    { time: 11, text: "Nenjukulla pudhu kadhal thodanguthadi..." },
    { time: 17, text: "Un chiripinil en ulagam marandhadhadi..." },
    { time: 23, text: "Nee illamal en vazhkai verumaiyadi..." },
    { time: 29, text: "En anbe, intha kadhal oru varam..." },
    { time: 35, text: "Unnodu vazhnthida thudikira manasu..." },
    { time: 41, text: "En kaigalai pidithu nee nadanthidu..." },
    { time: 47, text: "Vaanamellam namma kadhal ezhudhidu..." },
    { time: 53, text: "🎶 (Sould-stirring emotional violin build) 🎶" }
  ],
  14: [
    { time: 0, text: "🆙 (High swagger Tamil mass beats...) 🆙" },
    { time: 5, text: "Ennai thadukka yaarumey mudiyathu da!" },
    { time: 10, text: "Naa Vera Level, getha paarthuko da!" },
    { time: 15, text: "Uyarathil parakuren, en kodi ingey!" },
    { time: 20, text: "Hard work panni jeyippen da thozha!" },
    { time: 25, text: "Machi getha thooki, aattam podalaam!" },
    { time: 30, text: "This is Vera Level energy, ready da!" },
    { time: 35, text: "✨ (Punchy bass & street percussion dance) ✨" }
  ]
};

function getLyricsForSong(songId) {
  if (songLyrics[songId]) return songLyrics[songId];
  
  const song = songs[songId];
  const title = song.title;
  const artist = song.artist;
  const genre = song.genre;
  const emoji = song.emoji || "🎵";
  
  const isTamil = genre === 'tamil' || genre === 'folk' || genre === 'devotional' || 
                  artist.toLowerCase().includes('tamil') || 
                  ['pappali', 'unnai', 'velum', 'kannukulla', 'oru pere', 'thalapathy', 'nallaru', 'jilpanso', 'yumabaibesa', 'oorum', 'aasa', 'pavazha', 'ponmaaney', 'loveah', 'mutta', 'paranthene', 'alapuzha'].some(w => title.toLowerCase().includes(w));

  if (isTamil) {
    if (title.toLowerCase().includes('love') || title.toLowerCase().includes('aasa') || title.toLowerCase().includes('kannukulla') || title.toLowerCase().includes('pavazha') || title.toLowerCase().includes('ponmaaney') || title.toLowerCase().includes('paranthene')) {
      return [
        { time: 0, text: `💖 (Mellifluous Tanglish acoustic guitar...) 💖` },
        { time: 5, text: `Nenjukulla kadhal vandhu thottu nadakudhu...` },
        { time: 11, text: `Unnai mattume en manam eppodhum ketkudhu.` },
        { time: 17, text: `En anbe, un vizhiyil en ulagam theriya` },
        { time: 23, text: `Nam kadhal vazhkai kavidhaiyaga mariya.` },
        { time: 29, text: `Oru podhum unnai pirindhu iruka mudiyala` },
        { time: 35, text: `Intha kadhal solla varthaigal pathala.` },
        { time: 41, text: `Hold my hand tight, en thozhiye vaa` },
        { time: 47, text: `Ulagai marandhu kadhalil parakalaam vaa ${emoji}` },
        { time: 53, text: `🎶 (Beautiful violin and acoustic interlude) 🎶` },
        { time: 65, text: `Nee en swasamadi, en vazhvin niraivu` },
        { time: 71, text: `Living a beautiful Tanglish kadhal dream...` }
      ];
    } else if (title.toLowerCase().includes('devotional') || title.toLowerCase().includes('velum') || title.toLowerCase().includes('nambi')) {
      return [
        { time: 0, text: `🦚 (Divine bells and devotional strings...) 🦚` },
        { time: 5, text: `Unnai nambi vandhen, en deivame thunai` },
        { time: 11, text: `Velum mayilum thunai, endrume kaathu nirkum!` },
        { time: 17, text: `Bayam thavirthu vazhven, un arul kooda iruka` },
        { time: 23, text: `Urumi melam adikka, un sannidhi koota.` },
        { time: 29, text: `Kavalaigal ellaam un padhathil vaithen` },
        { time: 35, text: `Arul thandhu engalai nee vazhividu ayya!` },
        { time: 41, text: `Aadi paaduvom Murugan aalaya pattu` },
        { time: 47, text: `Nenjukulla niraivaana bakthi koodathu ${emoji}` },
        { time: 53, text: `🎶 (Sacred nadaswaram instrumental swell) 🎶` }
      ];
    } else {
      return [
        { time: 0, text: `🥁 (Fast Tanglish dappan kuthu beat starts...) 🥁` },
        { time: 5, text: `Soundwave paatu ketka kettukka kettukka!` },
        { time: 10, text: `Aadi paadu machi thulli kudhika!` },
        { time: 16, text: `Intha beat-u vera level speed da thozha` },
        { time: 22, text: `Namma gethu eppovumey top-u class thozha!` },
        { time: 28, text: `Kavalaigal ellaam thooki potu vazhvome` },
        { time: 34, text: `Nalla nanban kooda iruntha mass pannuvome ${emoji}` },
        { time: 40, text: `Vera level aattam, vera level gethu` },
        { time: 46, text: `This is the positive vibes that we all need!` },
        { time: 52, text: `🎶 (High-voltage heavy percussion and street dance BGM) 🎶` },
        { time: 64, text: `Soundwave mass hits-il eppothumey gethuda` }
      ];
    }
  }
  
  if (genre === 'love') {
    return [
      { time: 0, text: `💖 (Soft romantic acoustic intro...) 💖` },
      { time: 5, text: `Every heartbeat whispers your sweet name...` },
      { time: 11, text: `Since you came along, nothing feels the same.` },
      { time: 17, text: `In your gentle eyes, I have found my home` },
      { time: 23, text: `With you by my side, I am never alone.` },
      { time: 29, text: `Oh, this love is a beautiful, endless spark` },
      { time: 35, text: `Guiding us through the cold and the dark.` },
      { time: 41, text: `Hold my hand tight, let the melodies play` },
      { time: 47, text: `We'll chase all the shadows and worries away ${emoji}` },
      { time: 53, text: `🎶 (Symphonic love instrumental interlude) 🎶` },
      { time: 65, text: `Forever and always, you are my theme` },
      { time: 71, text: `Living a beautiful, waking dream...` }
    ];
  } else if (genre === 'epic') {
    return [
      { time: 0, text: `🎬 (Grand cinematic orchestration mounting...) 🎬` },
      { time: 6, text: `In the heart of the empire, where legends are born` },
      { time: 12, text: `Through the darkest of nights, before the new dawn.` },
      { time: 18, text: `A hero will rise, with a sword made of light` },
      { time: 24, text: `To conquer the shadows and end the long night.` },
      { time: 30, text: `Hear the trumpets of glory, the drums of the brave!` },
      { time: 36, text: `Through fire and water, a kingdom to save!` },
      { time: 42, text: `Stand tall in the storm, we shall never retreat` },
      { time: 48, text: `Victory lies waiting, there is no defeat ${emoji}` },
      { time: 54, text: `🎶 (Thundering brass chord progressions and choir) 🎶` },
      { time: 66, text: `The history is written by those who survive` },
      { time: 72, text: `Keeping the ancient legends alive!` }
    ];
  } else if (genre === 'folk') {
    return [
      { time: 0, text: `🪘 (Raw ethnic percussion and flute intro...) 🪘` },
      { time: 5, text: `Born from the soil, singing of the earth` },
      { time: 10, text: `A timeless rhythm of celebration and birth.` },
      { time: 16, text: `Hear the village singing, hear the spirits cry` },
      { time: 22, text: `Under the canopy of the starlit sky.` },
      { time: 28, text: `Step to the left, step to the right` },
      { time: 34, text: `We dance by the bonfire all through the night ${emoji}` },
      { time: 40, text: `Traditional sounds that will never decay` },
      { time: 46, text: `Washing all the modern stress far away!` },
      { time: 52, text: `🎶 (Soul-stirring acoustic and drum solo) 🎶` },
      { time: 64, text: `The roots run deep, the message is clear` },
      { time: 70, text: `Keeping our ancestors' heritage near.` }
    ];
  } else {
    return [
      { time: 0, text: `🎵 (Groovy electronic beat intro plays...) 🎵` },
      { time: 5, text: `Feel the rhythm catching, let the sound waves take control` },
      { time: 11, text: `Deep inside the quiet chambers of your very soul.` },
      { time: 17, text: `Every note is a story, every beat is a stride` },
      { time: 23, text: `In this musical spaceship, we happily ride.` },
      { time: 29, text: `Turn the volume higher, let the speakers start to glow ${emoji}` },
      { time: 35, text: `This is the perfect vibe that you wanted to know.` },
      { time: 41, text: `With headphones on, the entire world fades away` },
      { time: 47, text: `We are living in this melody, day after day.` },
      { time: 53, text: `🎶 (Synthesizer and clean bass drop interlude) 🎶` },
      { time: 65, text: `Lost in the sound, we are flying so free` },
      { time: 71, text: `Just the music, the moment, and you and me...` }
    ];
  }
}

let currentLyricIndex = -1;

function updateFullscreenLyrics() {
  if (state.currentSong === null) return;
  
  const song = songs[state.currentSong];
  const lyrics = getLyricsForSong(state.currentSong);
  const currentTime = audio.currentTime;
  
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }
  
  if (activeIndex !== currentLyricIndex) {
    currentLyricIndex = activeIndex;
    const activeLineText = activeIndex >= 0 ? lyrics[activeIndex].text : "🎶 (Instrumental) 🎶";
    updateSidebarLyrics(song, activeLineText);

    if (state.isFullscreen) {
      renderFullscreenLyrics(lyrics, activeIndex);
    }
  }
}

function updateSidebarLyrics(song, activeLineText) {
  const lyricsContainer = document.getElementById('lyricsContainer');
  if (!lyricsContainer) return;
  
  lyricsContainer.innerHTML = `
    <div style="text-align:center;color:var(--text-secondary);font-size:0.85rem;padding:8px;animation: fadeIn 0.3s ease;">
      <div style="font-size:1.5rem;margin-bottom:6px;">${song.emoji}</div>
      <div style="font-weight:700;color:var(--text-primary);margin-bottom:2px;">${song.title}</div>
      <div style="color:var(--text-subdued);font-size:0.75rem;margin-bottom:12px;">by ${song.artist}</div>
      <div style="font-size: 0.92rem; font-weight: 700; color: var(--green); padding: 10px; border-left: 3px solid var(--green); background: rgba(29, 185, 84, 0.05); border-radius: 4px; font-style: italic; line-height: 1.4;">
        "${activeLineText}"
      </div>
      <div style="margin-top:10px;font-size:0.68rem;color:var(--text-subdued);">Press 'F' for full screen lyrics</div>
    </div>
  `;
}

function renderFullscreenLyrics(lyrics, activeIndex) {
  const container = document.getElementById('fsLyricsContainer');
  if (!container) return;
  
  const song = songs[state.currentSong];
  
  container.innerHTML = lyrics.map((line, idx) => {
    const isActive = idx === activeIndex;
    return `
      <div class="lyric-line${isActive ? ' active' : ''}" 
           id="lyric-line-${idx}" 
           style="--song-glow-color: ${song.color || 'var(--green)'};"
           onclick="audio.currentTime = ${line.time}; updateFullscreenLyrics();">
        ${line.text}
      </div>
    `;
  }).join('');
  
  const activeEl = document.getElementById(`lyric-line-${activeIndex}`);
  if (activeEl) {
    const containerHeight = container.clientHeight;
    const elOffset = activeEl.offsetTop;
    const elHeight = activeEl.clientHeight;
    container.scrollTo({
      top: elOffset - containerHeight / 2 + elHeight / 2,
      behavior: 'smooth'
    });
  }
}

// ---- Offline Downloader ----
function downloadCurrentSong() {
  if (state.currentSong === null) {
    showToast("⚠️ Select a song first to download!");
    return;
  }
  downloadSong(state.currentSong);
}

function downloadSong(index) {
  if (index === null || index < 0 || index >= songs.length) return;
  const song = songs[index];
  showToast(`📥 Downloading: ${song.title}...`);
  
  fetch(song.url)
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${song.title} - ${song.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`✅ Saved: ${song.title}`);
    })
    .catch(error => {
      console.error('Offline download failed:', error);
      showToast(`⚠️ Direct download link opened!`);
      const a = document.createElement('a');
      a.href = song.url;
      a.target = '_blank';
      a.download = `${song.title}.mp3`;
      a.click();
    });
}
// ==========================
// THEME TOGGLE
// ==========================

function toggleTheme() {

    const body = document.body;
    const btn = document.querySelector(".theme-toggle");

    body.classList.toggle("light-theme");

    if (body.classList.contains("light-theme")) {
        btn.innerHTML = "☀️";
        localStorage.setItem("theme", "light");
    } else {
        btn.innerHTML = "🌙";
        localStorage.setItem("theme", "dark");
    }
}

// Load Saved Theme

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        const btn = document.querySelector(".theme-toggle");

        if (btn) {
            btn.innerHTML = "☀️";
        }
    }
});
// ============================
// VOICE SEARCH
// ============================

function startVoiceSearch() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice Search not supported");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    const voiceBtn = document.getElementById("voiceBtn");

    voiceBtn.classList.add("listening");

    recognition.start();

    recognition.onresult = function(event) {

        const speech =
            event.results[0][0].transcript.toLowerCase();

        document.getElementById("searchInput").value =
            speech;

        handleSearch(speech);

        songs.forEach(song => {

            if (
                speech.includes(song.title.toLowerCase())
            ) {
                playSong(song.id);
            }
        });
    };

    recognition.onend = function() {
        voiceBtn.classList.remove("listening");
    };
}
function toggleSidebar(){

  const sidebar =
      document.getElementById("sidebar");

   const overlay =
      document.getElementById("sidebarOverlay");

   sidebar.classList.toggle("active");
   overlay.classList.toggle("active");
}
document.addEventListener("DOMContentLoaded", () => {

    const overlay =
      document.getElementById("sidebarOverlay");

    if(overlay){

        overlay.addEventListener("click", () => {

            document
              .getElementById("sidebar")
              .classList.remove("active");

            overlay.classList.remove("active");
        });
    }
});
// ---- Init ----
document.addEventListener('DOMContentLoaded', init);
