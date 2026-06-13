// ==========================================
// 1. Core State & Initializations
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCanvas();
  initBentoGlow();
  initNavbarScroll();
  initMobileMenu();
  initTerminal();
  initClipboard();
  initFormValidation();
});

function initFormValidation() {
  const inputName = document.getElementById("form-name");
  const inputEmail = document.getElementById("form-email");
  const inputMsg = document.getElementById("form-message");

  const errorName = document.getElementById("error-name");
  const errorEmail = document.getElementById("error-email");
  const errorMsg = document.getElementById("error-message");

  if (inputName && errorName) {
    inputName.addEventListener("input", () => {
      errorName.classList.add("hidden");
      inputName.classList.remove("border-red-500", "focus:border-red-500");
    });
  }

  if (inputEmail && errorEmail) {
    inputEmail.addEventListener("input", () => {
      errorEmail.classList.add("hidden");
      inputEmail.classList.remove("border-red-500", "focus:border-red-500");
    });
  }

  if (inputMsg && errorMsg) {
    inputMsg.addEventListener("input", () => {
      errorMsg.classList.add("hidden");
      inputMsg.classList.remove("border-red-500", "focus:border-red-500");
    });
  }
}

// ==========================================
// 2. Dynamic Theme Toggling (Blue / Gold)
// ==========================================
const THEME_KEY = "sri-prasad-theme";

function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const mobileToggleBtn = document.getElementById("mobile-theme-toggle");

  // Retrieve saved theme preference or default to blue
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "gold") {
    applyTheme("gold");
  } else {
    applyTheme("blue");
  }

  // Bind desktop toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isGold = document.documentElement.classList.contains("theme-gold");
      applyTheme(isGold ? "blue" : "gold");
    });
  }

  // Bind mobile toggle
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener("click", () => {
      const isGold = document.documentElement.classList.contains("theme-gold");
      applyTheme(isGold ? "blue" : "gold");
    });
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  const iconBlue = document.getElementById("theme-icon-blue");
  const iconGold = document.getElementById("theme-icon-gold");
  const label = document.getElementById("theme-label");
  const mobileLabel = document.getElementById("mobile-theme-label");

  if (theme === "gold") {
    root.classList.add("theme-gold");
    localStorage.setItem(THEME_KEY, "gold");

    if (iconBlue) iconBlue.classList.replace("block", "hidden");
    if (iconGold) iconGold.classList.replace("hidden", "block");
    if (label) label.textContent = "Cyber Gold";
    if (mobileLabel) mobileLabel.textContent = "Cyber Gold";
  } else {
    root.classList.remove("theme-gold");
    localStorage.setItem(THEME_KEY, "blue");

    if (iconBlue) iconBlue.classList.replace("hidden", "block");
    if (iconGold) iconGold.classList.replace("block", "hidden");
    if (label) label.textContent = "Electric Blue";
    if (mobileLabel) mobileLabel.textContent = "Electric Blue";
  }

  // Redraw terminal prompt color immediately if instantiated
  const promptText = document.querySelector(".terminal-prompt");
  if (promptText) {
    promptText.style.color = getComputedStyle(root).getPropertyValue("--accent-color").trim();
  }
}

// ==========================================
// 3. High-Performance Particle Canvas
// ==========================================
let canvas, ctx;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function initCanvas() {
  canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  animateCanvas();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createParticles();
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 0.5;
    this.baseSpeed = Math.random() * 0.4 + 0.1;
    this.angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(this.angle) * this.baseSpeed;
    this.vy = Math.sin(this.angle) * this.baseSpeed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off bounds
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
  }

  draw() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  // Adjust particle density based on screen resolution
  const densityMultiplier = window.innerWidth < 768 ? 0.5 : 1.0;
  const particleCount = Math.floor((canvas.width * canvas.height) / 8000 * densityMultiplier);

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
  const accentRGB = hexToRgb(accentColor);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        const alpha = (1 - dist / 110) * 0.12;
        ctx.strokeStyle = `rgba(${accentRGB}, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Connect to mouse pointer
    if (mouse.x !== null && mouse.y !== null) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const alpha = (1 - dist / mouse.radius) * 0.18;
        ctx.strokeStyle = `rgba(${accentRGB}, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}

// Utility to convert HEX to RGB string
function hexToRgb(hex) {
  // Simple check in case of variables or named colors
  if (!hex.startsWith('#')) return "0, 210, 255";
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 210, 255";
}

// ==========================================
// 4. Bento Card Mouse-Hover Glow Tracking
// ==========================================
function initBentoGlow() {
  const cards = document.querySelectorAll(".bento-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// ==========================================
// 5. Navbar Solid Transition on Scroll
// ==========================================
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("glass-nav shadow-lg");
      navbar.classList.remove("bg-transparent py-2");
    } else {
      navbar.classList.remove("glass-nav shadow-lg");
      navbar.classList.add("bg-transparent");
    }
  });
}

// ==========================================
// 6. Responsive Mobile Navigation Menu
// ==========================================
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-link");
  const line1 = document.getElementById("nav-line-1");
  const line2 = document.getElementById("nav-line-2");
  const line3 = document.getElementById("nav-line-3");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    toggleMenu(!isOpen);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  function toggleMenu(open) {
    if (open) {
      menu.classList.remove("hidden");
      line1.classList.add("rotate-45", "translate-y-2");
      line2.classList.add("opacity-0");
      line3.classList.add("-rotate-45", "-translate-y-2");
    } else {
      menu.classList.add("hidden");
      line1.classList.remove("rotate-45", "translate-y-2");
      line2.classList.remove("opacity-0");
      line3.classList.remove("-rotate-45", "-translate-y-2");
    }
  }
}

// ==========================================
// 7. Futuristic Terminal Interaction System
// ==========================================
let terminalLog, terminalInput;
let terminalState = "normal"; // normal, wait_name, wait_email, wait_message
let contactData = { name: "", email: "", message: "" };

function initTerminal() {
  terminalLog = document.getElementById("terminal-log");
  terminalInput = document.getElementById("terminal-input");
  const toggleBtn = document.getElementById("form-mode-toggle");
  const terminalInterface = document.getElementById("terminal-interface");
  const classicForm = document.getElementById("classic-form-interface");

  if (!terminalInput || !terminalLog) return;

  // Key event listeners
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = terminalInput.value.trim();
      terminalInput.value = "";
      if (cmd !== "") {
        handleTerminalCommand(cmd);
      } else {
        // Output blank prompt line
        appendLog(`visitor@sriprasad:~$ `, "text-slate-500");
      }
    }
  });

  // Keep terminal text input focused when clicking body of terminal
  terminalInterface.addEventListener("click", () => {
    terminalInput.focus();
  });

  // Switch between Terminal mode and Classic Form mode
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isTerminalVisible = !terminalInterface.classList.contains("hidden");
      const toggleText = document.getElementById("form-toggle-text");

      if (isTerminalVisible) {
        terminalInterface.classList.add("hidden");
        classicForm.classList.remove("hidden");
        if (toggleText) toggleText.textContent = "Terminal CLI";
      } else {
        terminalInterface.classList.remove("hidden");
        classicForm.classList.add("hidden");
        if (toggleText) toggleText.textContent = "Classic UI";
        terminalInput.focus();
      }
    });
  }
}

// Global macro execution (called by bottom link buttons)
window.executeMacro = function (cmd) {
  if (terminalInput) {
    terminalInput.value = "";
    handleTerminalCommand(cmd);
  }
};

function appendLog(text, className = "text-slate-300", isPrompt = false) {
  const line = document.createElement("div");
  line.className = className;

  if (isPrompt) {
    line.innerHTML = `<span class="text-slate-500 mr-2">visitor@sriprasad:~$</span>${text}`;
  } else {
    line.innerHTML = text;
  }

  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function handleTerminalCommand(cmd) {
  // 1. Process active wizard states
  if (terminalState === "wait_name") {
    contactData.name = cmd;
    appendLog(cmd, "text-white", true);
    appendLog(`[SECURE SHELL] Welcome, ${contactData.name}.<br>Enter your professional email:`, "text-accent");
    terminalState = "wait_email";
    return;
  }

  if (terminalState === "wait_email") {
    if (!validateEmail(cmd)) {
      appendLog(cmd, "text-white", true);
      appendLog(`[ERROR] Invalid email format. Try again:`, "text-red-400");
      return;
    }
    contactData.email = cmd;
    appendLog(cmd, "text-white", true);
    appendLog(`[SECURE SHELL] Channel authorized.<br>Enter message payload (one line):`, "text-accent");
    terminalState = "wait_message";
    return;
  }

  if (terminalState === "wait_message") {
    contactData.message = cmd;
    appendLog(cmd, "text-white", true);
    appendLog(`[CONNECT] Initiating secure uplink packets...`, "text-slate-500");

    // Simulate transmission delay
    setTimeout(() => {
      appendLog(`[OK] Packets decrypted. Transmission successful.`, "text-emerald-400");
      appendLog(`[CLOSE] Secure communications channel closed. Thank you!`, "text-accent");
      terminalState = "normal";
      // Clear contact object
      contactData = { name: "", email: "", message: "" };
    }, 1200);
    return;
  }

  // 2. Process regular command structure
  appendLog(cmd, "text-white font-medium", true);

  const parsedCmd = cmd.toLowerCase().trim();

  switch (parsedCmd) {
    case "help":
      appendLog(
        `Available Commands:<br>` +
        `  <span class="text-white">about</span>     - Details Sri Prasad's core philosophy<br>` +
        `  <span class="text-white">skills</span>    - List certifications & specialization matrix<br>` +
        `  <span class="text-white">services</span>  - Show available client consulting operations<br>` +
        `  <span class="text-white">contact</span>   - Initiate stateful connection wizard<br>` +
        `  <span class="text-white">theme</span>     - Toggle styling colors (Electric Blue / Cyber Gold)<br>` +
        `  <span class="text-white">clear</span>     - Wipe terminal display history`
      );
      break;

    case "about":
      appendLog(
        `Sri Prasad is a Senior Enterprise Systems Architect and Technology Consultant.<br>` +
        `Focusing on bridging business needs and scalable software blueprints, he has designed<br>` +
        `architectural frameworks that serve millions of clients and protect companies from technical debt.`
      );
      break;

    case "skills":
      appendLog(
        `Accreditations & Competency Matrix:<br>` +
        `  - TOGAF 9 Certified Enterprise Systems Planner<br>` +
        `  - AWS Certified Solutions Architect Professional<br>` +
        `  - Certified Scrum Master<br>` +
        `  - Domain-Driven Design (DDD), Microservices, CQRS, Event-Driven Architecture`
      );
      break;

    case "services":
      appendLog(
        `Available Advisory Plans:<br>` +
        `  1. Strategic Architecture Design (Enterprise Software Maps)<br>` +
        `  2. Tech Audits (Cloud Cost Leakage & Security Bottlenecks)<br>` +
        `  3. Fractional CTO Leadership (Process optimization for start-ups)`
      );
      break;

    case "contact":
      appendLog(`[PROTOCOL INITIATED] Entering secure correspondence wizard...`, "text-emerald-400");
      appendLog(`Please enter your full name:`, "text-accent");
      terminalState = "wait_name";
      break;

    case "theme":
      const isGold = document.documentElement.classList.contains("theme-gold");
      applyTheme(isGold ? "blue" : "gold");
      appendLog(`System colors updated successfully to theme accent.`, "text-emerald-400");
      break;

    case "clear":
      terminalLog.innerHTML = `<div><span class="text-slate-500">SYSTEM DISPLAY FLUSHED.</span></div>`;
      break;

    default:
      appendLog(`[SHELL ERROR] Command not recognized: '${cmd}'. Type <span class="underline">help</span> for specifications.`, "text-red-400");
  }
}

// Simple email validation regex helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ==========================================
// 8. Classic UI Contact Submission Form (Wizard)
// ==========================================
let currentFormStep = 1;

window.nextFormStep = function () {
  const errorName = document.getElementById("error-name");
  const errorEmail = document.getElementById("error-email");
  const inputName = document.getElementById("form-name");
  const inputEmail = document.getElementById("form-email");

  if (currentFormStep === 1) {
    const nameVal = inputName.value.trim();
    if (!nameVal) {
      errorName.classList.remove("hidden");
      inputName.classList.add("border-red-500", "focus:border-red-500");
      return;
    } else {
      errorName.classList.add("hidden");
      inputName.classList.remove("border-red-500", "focus:border-red-500");
    }
  }

  if (currentFormStep === 2) {
    const emailVal = inputEmail.value.trim();
    if (!validateEmail(emailVal)) {
      errorEmail.classList.remove("hidden");
      inputEmail.classList.add("border-red-500", "focus:border-red-500");
      return;
    } else {
      errorEmail.classList.add("hidden");
      inputEmail.classList.remove("border-red-500", "focus:border-red-500");
    }
  }

  // Go to next step
  document.getElementById(`form-step-${currentFormStep}`).classList.add("hidden");
  currentFormStep++;
  const nextStepEl = document.getElementById(`form-step-${currentFormStep}`);
  nextStepEl.classList.remove("hidden");

  // Focus the main input of that step
  const nextInput = nextStepEl.querySelector("input, textarea");
  if (nextInput) nextInput.focus();

  updateFormProgress();
};

window.prevFormStep = function () {
  if (currentFormStep <= 1) return;

  document.getElementById(`form-step-${currentFormStep}`).classList.add("hidden");
  currentFormStep--;
  const prevStepEl = document.getElementById(`form-step-${currentFormStep}`);
  prevStepEl.classList.remove("hidden");

  // Focus the input
  const prevInput = prevStepEl.querySelector("input, textarea");
  if (prevInput) prevInput.focus();

  updateFormProgress();
};

function updateFormProgress() {
  const badge = document.getElementById("form-step-badge");
  badge.textContent = `${currentFormStep} / 3`;

  // Update dots
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`form-dot-${i}`);
    if (i === currentFormStep) {
      dot.classList.replace("bg-slate-800", "bg-accent");
    } else {
      dot.classList.replace("bg-accent", "bg-slate-800");
    }
  }
}

window.handleClassicSubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("form-name").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const msg = document.getElementById("form-message").value.trim();
  const errorMsg = document.getElementById("error-message");
  const inputMsg = document.getElementById("form-message");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");

  if (currentFormStep === 3) {
    if (!msg) {
      errorMsg.classList.remove("hidden");
      inputMsg.classList.add("border-red-500", "focus:border-red-500");
      return;
    } else {
      errorMsg.classList.add("hidden");
      inputMsg.classList.remove("border-red-500", "focus:border-red-500");
    }
  }

  if (!name || !email || !msg) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Transmitting...";

  // Simulate remote server saving action
  setTimeout(() => {
    status.classList.remove("hidden");
    submitBtn.textContent = "Transmission Complete";

    // Clear fields and reset wizard step
    document.getElementById("contact-form").reset();

    setTimeout(() => {
      // Hide Step 3, show Step 1
      document.getElementById(`form-step-3`).classList.add("hidden");
      document.getElementById(`form-step-1`).classList.remove("hidden");
      currentFormStep = 1;
      updateFormProgress();

      status.classList.add("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Transmit Message";
    }, 2500);
  }, 1200);
};

// ==========================================
// 9. Footer Email Clipboard Actions
// ==========================================
function initClipboard() {
  const copyBtn = document.getElementById("copy-email-btn");
  const copyIcon = document.getElementById("copy-icon");
  const checkIcon = document.getElementById("check-icon");
  const tooltip = document.getElementById("copy-tooltip");
  const emailVal = "contact@sriprasad.com";

  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(emailVal).then(() => {
      // Toggle Checked SVGs
      copyIcon.classList.replace("block", "hidden");
      checkIcon.classList.replace("hidden", "block");

      // Reveal Tooltip
      tooltip.classList.replace("opacity-0", "opacity-100");

      // Reset UI feedback after 2.5 seconds
      setTimeout(() => {
        copyIcon.classList.replace("hidden", "block");
        checkIcon.classList.replace("block", "hidden");
        tooltip.classList.replace("opacity-100", "opacity-0");
      }, 2500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });
}
