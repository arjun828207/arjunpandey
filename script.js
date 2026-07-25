/**
 * ARJUN PANDEY - PORTFOLIO INTERACTIVE LOGIC & SIMULATION ENGINES
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initThemeToggle();
  initTerminal();
  initTradeSimulator();
  initTradeCanvas();
  initSemiconductorTwinCanvas();
  initSkillsObserver();
  initContactForm();
  initNavigation();
});

/* ==========================================================================
   THEME TOGGLE SYSTEM (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('arjun_portfolio_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    toggleBtn.innerHTML = '<i class="fas fa-sun" style="color:#f59e0b;"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('arjun_portfolio_theme', 'dark');
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      showToast('Switched to Obsidian Dark Mode');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('arjun_portfolio_theme', 'light');
      toggleBtn.innerHTML = '<i class="fas fa-sun" style="color:#f59e0b;"></i>';
      showToast('Switched to Clean Light Mode');
    }
  });
}

/* ==========================================================================
   1. BACKGROUND NODE CANVAS (Kafka Event Distributed Simulation)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.floor(width < 768 ? 25 : 55);
  const nodes = [];
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, '
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse attraction
      if (mouse.x !== null) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x -= (dx / dist) * force * 2;
          node.y -= (dy / dist) * force * 2;
        }
      }

      ctx.fillStyle = node.color + '0.7)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. INTERACTIVE CLI TERMINAL ENGINE
   ========================================================================== */
function initTerminal() {
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  if (!termBody || !termInput) return;

  const commands = {
    help: 'Available commands: <span class="term-highlight">experience</span>, <span class="term-highlight">skills</span>, <span class="term-highlight">morgan</span>, <span class="term-highlight">yes</span>, <span class="term-highlight">achievements</span>, <span class="term-highlight">contact</span>, <span class="term-highlight">clear</span>',
    experience: `
• <span class="term-highlight">Morgan Stanley</span> (Software Engineer II, June 2025-Present)
  Scaled derivatives clearing & trade pipelines (Java 21, Spring Boot, Kafka, Redis).
• <span class="term-highlight">Yield Engineering Systems</span> (Software Engineer, Oct 2022-May 2025)
  Built semiconductor wafer digital twin & UR10/Kawasaki robotics simulation (Clients: Intel, TSMC, NASA JPL).`,
    morgan: `Engineered high-throughput derivatives post-trade pipeline processing 10k+ msgs/sec with Java 21, Kafka & Redis cache-aside architecture. Boosted overall throughput by ~50%.`,
    yes: `Built C#/Java SECS/GEM digital twin simulating wafer transfer, load ports & robotic motion. Saved engineering team ~4 hrs/week via Azure DevOps automated backups.`,
    skills: `Java 21 | Spring Boot | Kafka | Redis | Microservices | C# | Docker | AWS | SQL | SECS/GEM | System Architecture`,
    achievements: `★ 500+ LeetCode & HackerRank Problems Solved\n★ HackerRank 5-Star Rating\n★ TCS CodeVita Season 9: Global Rank 7250 (Top 7%)`,
    contact: `Email: arjunpandey.lpu@gmail.com | Phone: +91-9304188720 | LinkedIn/GitHub: arjun-pandey01`,
    clear: ''
  };

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = termInput.value.trim().toLowerCase();
      termInput.value = '';

      if (inputVal === 'clear') {
        termBody.innerHTML = `
          <div class="term-line"><span class="term-prompt">arjun@system:~$</span> Terminal cleared. Type <span class="term-highlight">help</span> for commands.</div>
        `;
        return;
      }

      // Add input line
      const inputLine = document.createElement('div');
      inputLine.className = 'term-line';
      inputLine.innerHTML = `<span class="term-prompt">arjun@system:~$</span> ${inputVal}`;
      termBody.appendChild(inputLine);

      // Add output line
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line term-output';

      if (commands[inputVal]) {
        outputLine.innerHTML = commands[inputVal];
      } else if (inputVal !== '') {
        outputLine.innerHTML = `Command not recognized: "${inputVal}". Type <span class="term-highlight">help</span> to view available options.`;
      }

      termBody.appendChild(outputLine);
      termBody.scrollTop = termBody.scrollHeight;
    }
  });

  // Attach quick command button clicks
  document.querySelectorAll('.quick-cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      termInput.value = cmd;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      termInput.dispatchEvent(event);
    });
  });
}

/* ==========================================================================
   3. HIGH-THROUGHPUT TRADE EXECUTION SIMULATOR
   ========================================================================== */
let simInterval = null;
let isSimRunning = false;
let tradeCount = 14250;

function initTradeSimulator() {
  const startBtn = document.getElementById('sim-start-btn');
  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    if (isSimRunning) {
      stopSimulator();
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start Live Ingestion';
      startBtn.classList.remove('btn-secondary');
      startBtn.classList.add('btn-primary');
    } else {
      startSimulator();
      startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Pipeline';
      startBtn.classList.remove('btn-primary');
      startBtn.classList.add('btn-secondary');
    }
  });
}

function startSimulator() {
  isSimRunning = true;
  const nodes = document.querySelectorAll('.pipeline-node');
  const tpsElem = document.getElementById('sim-tps');
  const latencyElem = document.getElementById('sim-latency');
  const processedElem = document.getElementById('sim-processed');
  const cacheHitElem = document.getElementById('sim-cache-hit');

  let activeStep = 0;

  simInterval = setInterval(() => {
    // Pulse pipeline step visualizer
    nodes.forEach(n => n.classList.remove('active'));
    nodes[activeStep].classList.add('active');
    activeStep = (activeStep + 1) % nodes.length;

    // Simulate metrics
    tradeCount += Math.floor(Math.random() * 45) + 30;
    const currentTps = (Math.floor(Math.random() * 400) + 12400).toLocaleString();
    const currentLatency = (Math.random() * 0.8 + 1.2).toFixed(2);
    const cacheHit = (98.2 + (Math.random() * 0.6 - 0.3)).toFixed(1);

    if (tpsElem) tpsElem.innerText = `${currentTps} req/s`;
    if (latencyElem) latencyElem.innerText = `${currentLatency} ms`;
    if (processedElem) processedElem.innerText = tradeCount.toLocaleString();
    if (cacheHitElem) cacheHitElem.innerText = `${cacheHit}%`;
  }, 400);
}

function stopSimulator() {
  isSimRunning = false;
  clearInterval(simInterval);
  document.querySelectorAll('.pipeline-node').forEach(n => n.classList.remove('active'));
}

/* ==========================================================================
   3B. HIGH-THROUGHPUT TRADE EXECUTION CANVAS (LB -> Core -> MetaWriter DB -> Position Pub)
   ========================================================================== */
function initTradeCanvas() {
  const canvas = document.getElementById('trade-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeTradeCanvas() {
    const parent = canvas.parentElement;
    if (parent && parent.clientWidth > 0) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || 260;
    }
  }

  resizeTradeCanvas();
  window.addEventListener('resize', resizeTradeCanvas);
  window.resizeTradeCanvas = resizeTradeCanvas;

  let packets = [];
  let dbParticles = [];
  let pubParticles = [];
  let frame = 0;

  function renderTradeCanvas() {
    const width = canvas.width || 600;
    const height = canvas.height || 260;

    ctx.clearRect(0, 0, width, height);

    // 1. Grid pattern
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Node Positions
    const nodeY = height * 0.38;
    const node1_X = width * 0.12; // Ingress Gateway
    const node2_X = width * 0.38; // Execution Core Engine
    const node3_X = width * 0.64; // Persistence Service
    const node4_X = width * 0.88; // Event Publisher (Broadcasting outward in 360 deg)

    const dbY = height * 0.78;   // DB Cylinder position under Persistence Service

    // 2. Draw 3 Parallel Connection Sub-Lanes (Fanning out from 1 Load Balancer to 3x Worker Instances)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);

    [-8, 0, 8].forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(node1_X + 50, nodeY); // Single point at Ingress Gateway
      ctx.lineTo(node1_X + (node2_X - node1_X) * 0.4, nodeY + offset);
      ctx.lineTo(node4_X - 50, nodeY + offset);
      ctx.stroke();
    });

    // DB Connection Pipe (Persistence Service down to DB)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.beginPath();
    ctx.moveTo(node3_X, nodeY + 22);
    ctx.lineTo(node3_X, dbY - 14);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Spawn Ingestion Packets
    frame++;
    if (frame % 16 === 0) {
      packets.push({
        x: node1_X,
        progress: 0,
        speed: 0.012 + Math.random() * 0.004,
        type: Math.random() > 0.3 ? 'trade' : 'event',
        laneOffset: [-8, 0, 8][Math.floor(Math.random() * 3)] // Route to 1 of 3 worker instances
      });
    }

    // 4. Update and Draw Data Packets across Multi-Instance Lanes
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      p.x = node1_X + (node4_X - node1_X) * p.progress;

      // Calculate Y lane offset (starts at center at LB, fans out to 3 lanes)
      const fanOutFactor = Math.min(1, Math.max(0, (p.progress - 0.1) / 0.15));
      const packetY = nodeY + p.laneOffset * fanOutFactor;

      // Trigger DB Insertion Particles at Persistence node (node3_X)
      if (Math.abs(p.x - node3_X) < 10 && Math.random() > 0.3) {
        for (let k = 0; k < 2; k++) {
          dbParticles.push({
            x: node3_X + (Math.random() * 20 - 10),
            y: packetY + 18,
            vy: Math.random() * 1.6 + 1.2,
            alpha: 1
          });
        }
      }

      // Trigger Outward Radial Broadcast Arrows when packet arrives at Event Publisher (node4_X)
      if (p.progress >= 0.94) {
        for (let a = 0; a < 8; a++) {
          const angle = (a * Math.PI) / 4 + (Math.random() * 0.2 - 0.1);
          pubParticles.push({
            x: node4_X,
            y: packetY,
            vx: Math.cos(angle) * (2.2 + Math.random() * 1.2),
            vy: Math.sin(angle) * (2.2 + Math.random() * 1.2),
            angle: angle,
            dist: 0,
            alpha: 1
          });
        }
      }

      ctx.fillStyle = p.type === 'trade' ? '#00f2fe' : '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.type === 'trade' ? '#00f2fe' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(p.x, packetY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (p.progress >= 1) packets.splice(i, 1);
    }

    // Continuous ambient radial pulse from Event Publisher
    if (frame % 25 === 0) {
      for (let a = 0; a < 6; a++) {
        const angle = Math.random() * Math.PI * 2;
        pubParticles.push({
          x: node4_X,
          y: nodeY,
          vx: Math.cos(angle) * (1.8 + Math.random()),
          vy: Math.sin(angle) * (1.8 + Math.random()),
          angle: angle,
          dist: 0,
          alpha: 0.9
        });
      }
    }

    // 5. Update and Draw DB Persistence Particles
    for (let i = dbParticles.length - 1; i >= 0; i--) {
      const dp = dbParticles[i];
      dp.y += dp.vy;
      dp.alpha -= 0.035;
      ctx.fillStyle = `rgba(245, 158, 11, ${dp.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f59e0b';
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (dp.alpha <= 0 || dp.y > dbY + 12) dbParticles.splice(i, 1);
    }

    // 6. Update and Draw Outward Radiating Consumer Arrows from Event Publisher
    for (let i = pubParticles.length - 1; i >= 0; i--) {
      const pp = pubParticles[i];
      pp.x += pp.vx;
      pp.y += pp.vy;
      pp.dist += Math.hypot(pp.vx, pp.vy);
      pp.alpha -= 0.022;

      ctx.save();
      ctx.translate(pp.x, pp.y);
      ctx.rotate(pp.angle);

      // Draw Arrow Shaft & Tip
      ctx.strokeStyle = `rgba(16, 185, 129, ${pp.alpha})`;
      ctx.fillStyle = `rgba(16, 185, 129, ${pp.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#10b981';

      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();

      // Arrow head pointing outward
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(0, -3.5);
      ctx.lineTo(0, 3.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      if (pp.alpha <= 0 || pp.dist > 65) pubParticles.splice(i, 1);
    }

    // Outward Broadcasting Radial Wave Rings on Event Publisher
    const pulseRing = (frame * 0.8) % 35;
    ctx.strokeStyle = `rgba(16, 185, 129, ${1 - pulseRing / 35})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(node4_X, nodeY, 24 + pulseRing, 0, Math.PI * 2);
    ctx.stroke();

    // Node 1: Ingress Gateway (Single LB Instance)
    drawNodeBox(ctx, node1_X, nodeY, 'INGRESS GATEWAY', 'Traffic Balancer', '#3b82f6', false, '1 LB Instance');

    // Node 2: Core Engine (Stacked Multi-Instance Cluster managed by ZooKeeper)
    drawNodeBox(ctx, node2_X, nodeY, 'CORE ENGINE', 'Cache & Msg Format', '#8b5cf6', true, '18x Workers (ZooKeeper)');

    // Node 3: Persistence Service (Stacked Multi-Instance Cluster)
    drawNodeBox(ctx, node3_X, nodeY, 'PERSISTENCE', 'Async DB Writer', '#f59e0b', true, '3x Writers');

    // Relational Database Cylinder under Persistence Service
    drawDatabaseCylinder(ctx, node3_X, dbY, 'RELATIONAL DB', '#f59e0b');

    // Node 4: Event Publisher (Stacked Multi-Instance Cluster)
    drawNodeBox(ctx, node4_X, nodeY, 'EVENT PUBLISHER', 'Multi-Consumer Fanout', '#10b981', true, '3x Pub Nodes');

    // Top HUD Telemetry
    ctx.fillStyle = '#00f2fe';
    ctx.font = '600 11px "Fira Code", monospace';
    ctx.fillText('HIGH-THROUGHPUT PIPELINE ARCHITECTURE | 18 WORKERS (ZOOKEEPER PARTITIONED) [ACTIVE]', 15, 20);

    requestAnimationFrame(renderTradeCanvas);
  }

  renderTradeCanvas();
}

function drawNodeBox(ctx, x, y, title, subtitle, color, isMultiInstance = false, badgeText = '') {
  const w = 110, h = 44;

  if (isMultiInstance) {
    // Render 2 stacked background card layers offset by (-6, -6) and (-3, -3) to show 3D multi-instance cluster
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.fillRect(x - w / 2 - 6, y - h / 2 - 6, w, h);
    ctx.strokeRect(x - w / 2 - 6, y - h / 2 - 6, w, h);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(x - w / 2 - 3, y - h / 2 - 3, w, h);
    ctx.strokeRect(x - w / 2 - 3, y - h / 2 - 3, w, h);
  }

  // Front Main Node Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  ctx.shadowBlur = 0;

  // Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 9px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, x, y - 4);

  // Subtitle
  ctx.fillStyle = color;
  ctx.font = '500 8px "Fira Code", monospace';
  ctx.fillText(subtitle, x, y + 10);

  // Instance Badge pill (top right)
  if (badgeText) {
    ctx.fillStyle = color;
    ctx.font = '700 7.5px "Fira Code", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(badgeText, x + w / 2 - 2, y - h / 2 - 4);
  }
}

function drawDatabaseCylinder(ctx, x, y, label, color) {
  const rx = 38, ry = 8, h = 18;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;

  // DB Body & Top Ellipse
  ctx.beginPath(); ctx.ellipse(x, y - h / 2, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - rx, y - h / 2);
  ctx.lineTo(x - rx, y + h / 2);
  ctx.ellipse(x, y + h / 2, rx, ry, 0, 0, Math.PI, false);
  ctx.lineTo(x + rx, y - h / 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 8px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 3);
}

/* ==========================================================================
   4. SEMICONDUCTOR WAFER DIGITAL TWIN (Robotic Track Traverse & Extend/Pick/Retract Flow)
   ========================================================================== */
function initSemiconductorTwinCanvas() {
  const canvas = document.getElementById('twin-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeTwinCanvas() {
    const parent = canvas.parentElement;
    if (parent && parent.clientWidth > 0) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || 320;
    }
  }

  resizeTwinCanvas();
  window.addEventListener('resize', resizeTwinCanvas);
  window.resizeTwinCanvas = resizeTwinCanvas;

  let time = 0;
  let wafersProcessed = 42;
  let particles = [];

  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * 500,
      y: Math.random() * 300,
      r: Math.random() * 1.5 + 0.5,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function renderTwin() {
    const width = canvas.width || 500;
    const height = canvas.height || 320;

    ctx.clearRect(0, 0, width, height);

    // 1. Grid Background
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // 2. Cleanroom Particles
    particles.forEach(p => {
      p.y += p.vy;
      if (p.y < 0) p.y = height;
      ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
      ctx.beginPath(); ctx.arc(p.x % width, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });

    // 3. Station Coordinates
    const portA_X = width * 0.15;
    const chamber1_X = width * 0.50;
    const chamber2_X = width * 0.85;
    const stationY = height * 0.42;
    const trackY = height * 0.82;

    // Draw Linear Robot Rail / Track
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(width * 0.08, trackY); ctx.lineTo(width * 0.92, trackY); ctx.stroke();

    // Rail Encoder Notches
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)'; ctx.lineWidth = 1;
    for (let rx = width * 0.08; rx <= width * 0.92; rx += 15) {
      ctx.beginPath(); ctx.moveTo(rx, trackY - 4); ctx.lineTo(rx, trackY + 4); ctx.stroke();
    }

    // Draw Station 1: LOAD PORT A
    ctx.shadowBlur = 12; ctx.shadowColor = '#8b5cf6';
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.strokeRect(portA_X - 35, stationY - 50, 70, 95);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)'; ctx.fillRect(portA_X - 35, stationY - 50, 70, 95);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#a78bfa'; ctx.font = '600 10px "Fira Code", monospace'; ctx.textAlign = 'center';
    ctx.fillText('LOAD PORT A', portA_X, stationY + 62);

    // Draw Station 2: CHAMBER 1 (Etch/Thermal)
    ctx.shadowBlur = 12; ctx.shadowColor = '#00f2fe';
    ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 2;
    ctx.strokeRect(chamber1_X - 38, stationY - 50, 76, 95);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.15)'; ctx.fillRect(chamber1_X - 38, stationY - 50, 76, 95);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#38bdf8'; ctx.fillText('CHAMBER 1', chamber1_X, stationY + 62);

    // Draw Station 3: CHAMBER 2 (Deposition/Inspect)
    ctx.shadowBlur = 12; ctx.shadowColor = '#10b981';
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.strokeRect(chamber2_X - 38, stationY - 50, 76, 95);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; ctx.fillRect(chamber2_X - 38, stationY - 50, 76, 95);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#34d399'; ctx.fillText('CHAMBER 2', chamber2_X, stationY + 62);

    // 4. Robotic Kinematics & Physical Motion Sequence (0.0 to 1.0)
    time += 0.0022;
    if (time > 1) {
      time = 0;
      wafersProcessed++;
    }

    let robotX = portA_X;
    let armExtension = 0; // 0 = retracted down, 1 = extended up into station
    let hasWafer = false;
    let waferX = portA_X;
    let waferY = stationY;
    let stateText = '';
    let chamber1Active = false;
    let chamber2Active = false;

    if (time < 0.08) {
      // Step 1: Robot parked at Load Port A -> Extend arm UP to pick wafer
      robotX = portA_X;
      armExtension = Math.sin((time / 0.08) * Math.PI); // extend UP to pick
      hasWafer = time > 0.04;
      waferX = portA_X;
      waferY = stationY + (1 - armExtension) * (trackY - stationY - 20);
      stateText = 'ROBOT: EXTENDING ARM TO LOADPORT A (VACUUM PICK)';
    } else if (time < 0.20) {
      // Step 2: Retract arm & slide carriage along track: LoadPort A ➔ Chamber 1
      const progress = (time - 0.08) / 0.12;
      robotX = portA_X + (chamber1_X - portA_X) * progress;
      armExtension = 0.1; // arm folded down while sliding
      hasWafer = true;
      waferX = robotX;
      waferY = trackY - 25;
      stateText = 'ROBOT: SLIDING ON RAIL TRACK ➔ CHAMBER 1';
    } else if (time < 0.28) {
      // Step 3: Parked at Chamber 1 -> Extend arm UP into Chamber 1 & place wafer
      robotX = chamber1_X;
      armExtension = Math.sin(((time - 0.20) / 0.08) * Math.PI);
      hasWafer = time < 0.24;
      waferX = chamber1_X;
      waferY = stationY + (1 - armExtension) * (trackY - stationY - 20);
      stateText = 'ROBOT: EXTENDING ARM & PLACING WAFER IN CHAMBER 1';
    } else if (time < 0.40) {
      // Step 4: Arm retracted outside -> Chamber 1 Processing (Laser Etch)
      robotX = chamber1_X;
      armExtension = 0; // completely retracted down
      hasWafer = false;
      waferX = chamber1_X;
      waferY = stationY;
      chamber1Active = true;
      stateText = 'CHAMBER 1: THERMAL ETCH IN PROGRESS (ROBOT PARKED OUTSIDE)';
    } else if (time < 0.48) {
      // Step 5: Extend arm UP into Chamber 1 & pick processed wafer
      robotX = chamber1_X;
      armExtension = Math.sin(((time - 0.40) / 0.08) * Math.PI);
      hasWafer = time > 0.44;
      waferX = chamber1_X;
      waferY = stationY + (1 - armExtension) * (trackY - stationY - 20);
      stateText = 'ROBOT: EXTENDING ARM & PICKING PROCESSED WAFER FROM CHAMBER 1';
    } else if (time < 0.60) {
      // Step 6: Retract arm & slide carriage along track: Chamber 1 ➔ Chamber 2
      const progress = (time - 0.48) / 0.12;
      robotX = chamber1_X + (chamber2_X - chamber1_X) * progress;
      armExtension = 0.1; // folded down while sliding
      hasWafer = true;
      waferX = robotX;
      waferY = trackY - 25;
      stateText = 'ROBOT: SLIDING ON RAIL TRACK ➔ CHAMBER 2';
    } else if (time < 0.68) {
      // Step 7: Parked at Chamber 2 -> Extend arm UP into Chamber 2 & place wafer
      robotX = chamber2_X;
      armExtension = Math.sin(((time - 0.60) / 0.08) * Math.PI);
      hasWafer = time < 0.64;
      waferX = chamber2_X;
      waferY = stationY + (1 - armExtension) * (trackY - stationY - 20);
      stateText = 'ROBOT: EXTENDING ARM & PLACING WAFER IN CHAMBER 2';
    } else if (time < 0.80) {
      // Step 8: Arm retracted outside -> Chamber 2 Processing (Plasma Deposition)
      robotX = chamber2_X;
      armExtension = 0; // completely retracted down
      hasWafer = false;
      waferX = chamber2_X;
      waferY = stationY;
      chamber2Active = true;
      stateText = 'CHAMBER 2: THIN-FILM DEPOSITION IN PROGRESS (ROBOT PARKED OUTSIDE)';
    } else if (time < 0.88) {
      // Step 9: Extend arm UP into Chamber 2 & pick processed wafer
      robotX = chamber2_X;
      armExtension = Math.sin(((time - 0.80) / 0.08) * Math.PI);
      hasWafer = time > 0.84;
      waferX = chamber2_X;
      waferY = stationY + (1 - armExtension) * (trackY - stationY - 20);
      stateText = 'ROBOT: EXTENDING ARM & PICKING PROCESSED WAFER FROM CHAMBER 2';
    } else if (time < 0.96) {
      // Step 10: Retract arm & slide carriage along track back to Load Port A
      const progress = (time - 0.88) / 0.08;
      robotX = chamber2_X + (portA_X - chamber2_X) * progress;
      armExtension = 0.1;
      hasWafer = true;
      waferX = robotX;
      waferY = trackY - 25;
      stateText = 'ROBOT: SLIDING ON RAIL TRACK ➔ LOADPORT A';
    } else {
      // Step 11: Parked at Load Port A -> Extend arm & dock wafer
      robotX = portA_X;
      armExtension = Math.sin(((time - 0.96) / 0.04) * Math.PI);
      hasWafer = time < 0.98;
      waferX = portA_X;
      waferY = stationY;
      stateText = 'ROBOT: DOCKING WAFER IN LOADPORT A | CYCLE COMPLETE';
    }

    // Chamber 1 Laser Beam Processing FX
    if (chamber1Active) {
      ctx.shadowBlur = 15; ctx.shadowColor = '#00f2fe';
      ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(chamber1_X, stationY - 50); ctx.lineTo(chamber1_X, stationY + 45); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Chamber 2 Plasma Beam Processing FX
    if (chamber2Active) {
      ctx.shadowBlur = 15; ctx.shadowColor = '#10b981';
      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(chamber2_X, stationY - 50); ctx.lineTo(chamber2_X, stationY + 45); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Draw Robotic Arm Carriage on Rail Track (Sliding at robotX)
    ctx.shadowBlur = 12; ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 2;
    ctx.fillRect(robotX - 26, trackY - 12, 52, 24);
    ctx.strokeRect(robotX - 26, trackY - 12, 52, 24);
    ctx.shadowBlur = 0;

    // Carriage Linear Encoder Wheels
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath(); ctx.arc(robotX - 18, trackY + 10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(robotX + 18, trackY + 10, 4, 0, Math.PI * 2); ctx.fill();

    // 6. Draw Articulated Robotic Arm Segments (Shoulder -> Elbow -> Wrist End Effector)
    // Base pivot is at robotX on carriage
    const basePivotX = robotX;
    const basePivotY = trackY - 12;

    // End effector reaches UP to stationY when armExtension = 1
    const endEffectorX = robotX;
    const endEffectorY = trackY - 18 - armExtension * (trackY - 18 - stationY);

    // Elbow position calculation (bends sideways to allow smooth extension/retraction)
    const elbowOffset = 18 * (1 - armExtension * 0.5);
    const elbowX = robotX + elbowOffset;
    const elbowY = (basePivotY + endEffectorY) / 2;

    // Draw Arm Linkage 1: Base to Elbow
    ctx.shadowBlur = 10; ctx.shadowColor = '#00f2fe';
    ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(basePivotX, basePivotY); ctx.lineTo(elbowX, elbowY); ctx.stroke();

    // Draw Arm Linkage 2: Elbow to End-Effector Tip
    ctx.strokeStyle = '#8b5cf6'; ctx.shadowColor = '#8b5cf6'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(elbowX, elbowY); ctx.lineTo(endEffectorX, endEffectorY); ctx.stroke();
    ctx.shadowBlur = 0;

    // Joint Ring Hubs
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath(); ctx.arc(basePivotX, basePivotY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(elbowX, elbowY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(endEffectorX, endEffectorY, 4, 0, Math.PI * 2); ctx.fill();

    // End-Effector Vacuum Grip Chuck
    ctx.fillStyle = hasWafer ? '#00f2fe' : '#94a3b8';
    ctx.fillRect(endEffectorX - 18, endEffectorY - 3, 36, 6);

    // 6. Draw Silicon Wafer Disc
    if (hasWafer || chamber1Active || chamber2Active || time >= 0.94) {
      ctx.save();
      ctx.translate(waferX, waferY);

      ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.stroke();

      const gradient = ctx.createRadialGradient(0, 0, 3, 0, 0, 20);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(0.5, '#0284c7');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    // 7. Telemetry & Status HUD
    ctx.fillStyle = '#00f2fe'; ctx.font = '600 11px "Fira Code", monospace'; ctx.textAlign = 'left';
    ctx.fillText(`SECS/GEM DIGITAL TWIN | WAFERS PROCESSED: ${wafersProcessed}`, 15, 20);

    ctx.fillStyle = (chamber1Active || chamber2Active) ? '#10b981' : '#a78bfa';
    ctx.font = '500 10px "Fira Code", monospace';
    ctx.fillText(`STATUS: ${stateText}`, 15, 38);

    requestAnimationFrame(renderTwin);
  }

  renderTwin();
}

/* ==========================================================================
   5. INTERSECTION OBSERVER FOR SKILLS BARS ANIMATION
   ========================================================================== */
function initSkillsObserver() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-level');
        entry.target.style.width = targetWidth + '%';
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   6. CONTACT FORM & COPY TO CLIPBOARD HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showToast('✓ Message delivered directly to Arjun\'s inbox!');
          form.reset();
        } else {
          showToast('❌ Submission error: ' + (result.message || 'Please try again.'));
        }
      } catch (err) {
        showToast('❌ Unable to send message. Please check network connection.');
      } finally {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }
    });
  }

  // Copy contact buttons
  document.querySelectorAll('.contact-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: "${textToCopy}"`);
      });
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#00f2fe;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   7. NAVIGATION & TAB SWITCHING LOGIC
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const isOpen = navLinks.classList.contains('mobile-active');
      mobileBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Demo tabs switcher
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const views = document.querySelectorAll('.demo-view');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');

      tabBtns.forEach(b => b.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetView).classList.add('active');

      if (targetView === 'demo-twin' && typeof window.resizeTwinCanvas === 'function') {
        setTimeout(window.resizeTwinCanvas, 50);
      }
    });
  });
}
