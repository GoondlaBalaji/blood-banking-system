import React, { useEffect, useRef, useState, useCallback } from "react";
import Login from "./login";
import Register from "./Register";
import DonorResults from "./DonorResults";
/* ============================================================
   STYLES — injected via a <style> tag approach
   ============================================================ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red:   #c0392b; --red2: #e74c3c; --red3: #ff6b6b; --red4: #ff9a9a;
    --dark:  #07070d; --dark2: #0e0e1a;
    --glass: rgba(255,255,255,0.05); --glass2: rgba(255,255,255,0.09);
    --border: rgba(255,255,255,0.10); --border2: rgba(192,57,43,0.45); --border3: rgba(255,255,255,0.18);
    --text: #ededf5; --muted: rgba(237,237,245,0.55); --muted2: rgba(237,237,245,0.35);
    --white: #ffffff;
    --ff-display: 'Bebas Neue', sans-serif;
    --ff-body: 'DM Sans', sans-serif;
    --ff-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--ff-body);
    background: var(--dark);
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
    line-height: 1.6;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--dark2); }
  ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 3px; }

  /* NOISE OVERLAY */
  #root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1; opacity: 0.5;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(7,7,13,0.6);
    backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 68px;
    transition: background 0.3s, border-color 0.3s;
  }
  .nav.scrolled { background: rgba(7,7,13,0.88); border-bottom-color: var(--border2); }

  .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; cursor: pointer; }
  .logo-mark {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--red), var(--red2));
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
    animation: logoPulse 3s ease-in-out infinite;
  }
  @keyframes logoPulse {
    0%,100% { box-shadow: 0 0 24px rgba(192,57,43,0.55); }
    50%      { box-shadow: 0 0 40px rgba(192,57,43,0.8), 0 0 80px rgba(192,57,43,0.2); }
  }
  .logo-text { display: flex; flex-direction: column; line-height: 1.15; }
  .logo-text .brand { font-family: var(--ff-display); font-size: 1.25rem; letter-spacing: 2px; color: var(--white); }
  .logo-text .sub { font-size: 0.65rem; color: var(--red3); letter-spacing: 2.5px; font-weight: 500; text-transform: uppercase; }

  .nav-links { display: flex; align-items: center; gap: 2.5rem; list-style: none; }
  .nav-links a {
    color: var(--muted); text-decoration: none; font-size: 0.85rem;
    font-weight: 500; letter-spacing: 0.4px; transition: color 0.2s; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1.5px; background: var(--red3);
    transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { transform: scaleX(1); }

  .nav-actions { display: flex; align-items: center; gap: 1rem; }
  .nav-login {
    background: transparent; color: var(--muted); border: 1px solid var(--border);
    padding: 0.5rem 1.3rem; border-radius: 50px; font-size: 0.83rem; font-weight: 500;
    font-family: var(--ff-body); cursor: pointer; transition: all 0.25s;
  }
  .nav-login:hover { color: var(--white); border-color: var(--border3); background: var(--glass2); }
  .nav-emergency {
    background: linear-gradient(135deg, var(--red), var(--red2)); color: #fff; border: none;
    padding: 0.55rem 1.4rem; border-radius: 50px; font-size: 0.83rem; font-weight: 700;
    font-family: var(--ff-body); cursor: pointer; box-shadow: 0 0 20px rgba(192,57,43,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav-emergency:hover { transform: scale(1.05); box-shadow: 0 0 36px rgba(231,76,60,0.65); }

  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--muted); border-radius: 2px; transition: all 0.3s; }

  /* MOBILE NAV */
  .mobile-nav {
    display: none; position: fixed; inset: 0; z-index: 999;
    background: rgba(7,7,13,0.97); backdrop-filter: blur(20px);
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .mobile-nav.open { display: flex; }
  .mobile-nav a { font-family: var(--ff-display); font-size: 2.5rem; letter-spacing: 4px; color: var(--white); text-decoration: none; transition: color 0.2s; }
  .mobile-nav a:hover { color: var(--red3); }
  .mobile-nav-close {
    position: absolute; top: 1.5rem; right: 1.5rem;
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--glass2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--muted); font-size: 1.3rem; transition: background 0.2s;
  }
  .mobile-nav-close:hover { background: rgba(192,57,43,0.2); color: var(--red3); }

  /* CANVAS */
  #dot-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

  /* SECTIONS */
  section { position: relative; z-index: 10; }
  .container { max-width: 1140px; margin: 0 auto; padding: 0 2rem; }

  .section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--red3); margin-bottom: 1rem;
  }
  .section-label::before { content: ''; display: block; width: 20px; height: 1.5px; background: var(--red3); }
  .section-title { font-family: var(--ff-display); font-size: clamp(2.2rem,5vw,3.8rem); letter-spacing: 2px; line-height: 1; margin-bottom: 1rem; color: var(--white); }
  .section-title span { color: var(--red3); }
  .section-sub { color: var(--muted); font-size: 0.95rem; max-width: 480px; line-height: 1.75; }

  /* HERO */
  #hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    padding: 120px 2rem 6rem; position: relative; overflow: hidden;
  }
  #hero::after {
    content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 700px; height: 500px;
    background: radial-gradient(ellipse, rgba(192,57,43,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: -1;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(192,57,43,0.12); border: 1px solid rgba(192,57,43,0.35);
    color: var(--red3); padding: 0.45rem 1.2rem; border-radius: 50px;
    font-size: 0.78rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 2.2rem; animation: fadeUp 0.9s ease both;
  }
  .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red3); animation: pulseDot 1.6s infinite; }
  @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.6); } 50% { box-shadow: 0 0 0 7px rgba(255,107,107,0); } }

  .hero-title { font-family: var(--ff-display); font-size: clamp(3.5rem,10vw,8.5rem); letter-spacing: 4px; line-height: 0.95; margin-bottom: 1.5rem; animation: fadeUp 1s 0.15s ease both; }
  .hero-title .line1 { display: block; color: var(--white); }
  .hero-title .line2 { display: block; background: linear-gradient(135deg, var(--red2), var(--red3), var(--red4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: clamp(0.9rem,2vw,1.1rem); color: var(--muted); max-width: 520px; line-height: 1.8; margin-bottom: 2.8rem; animation: fadeUp 1s 0.3s ease both; }
  .hero-btns { display: flex; gap: 1.2rem; flex-wrap: wrap; justify-content: center; animation: fadeUp 1s 0.45s ease both; }

  .hero-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: var(--muted2); font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase;
    animation: fadeUp 1s 1s ease both;
  }
  .scroll-arrow { width: 20px; height: 20px; border-right: 1.5px solid var(--muted2); border-bottom: 1.5px solid var(--muted2); transform: rotate(45deg); animation: scrollBounce 1.5s ease-in-out infinite; }
  @keyframes scrollBounce { 0%,100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(5px); } }

  /* BUTTONS */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--red), var(--red2));
    color: #fff; border: none; padding: 0.9rem 2.4rem; border-radius: 50px;
    font-size: 0.95rem; font-weight: 700; font-family: var(--ff-body); cursor: pointer;
    position: relative; overflow: hidden; box-shadow: 0 0 32px rgba(192,57,43,0.45);
    transition: transform 0.25s, box-shadow 0.25s; letter-spacing: 0.5px;
  }
  .btn-primary:hover { transform: scale(1.06) translateY(-2px); box-shadow: 0 0 56px rgba(231,76,60,0.7); }
  .btn-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); border-radius: inherit; }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--red3); border: 1.5px solid rgba(192,57,43,0.5);
    padding: 0.9rem 2.4rem; border-radius: 50px; font-size: 0.95rem; font-weight: 700;
    font-family: var(--ff-body); cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.25s; letter-spacing: 0.5px;
  }
  .btn-outline:hover { background: rgba(192,57,43,0.12); border-color: rgba(192,57,43,0.8); transform: scale(1.06) translateY(-2px); box-shadow: 0 0 36px rgba(192,57,43,0.3); }

  .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.3); transform: scale(0); animation: rippleAnim 0.6s linear forwards; pointer-events: none; }
  @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }

  /* STATS */
  #stats { padding: 5rem 0; position: relative; z-index: 10; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 1.5rem; }
  .stat-card {
    background: var(--glass); border: 1px solid var(--border); border-radius: 20px;
    padding: 2rem 1.8rem; text-align: center; backdrop-filter: blur(14px);
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; position: relative; overflow: hidden;
  }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,var(--red2),transparent); opacity: 0; transition: opacity 0.3s; }
  .stat-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(192,57,43,0.18); border-color: rgba(192,57,43,0.3); }
  .stat-card:hover::before { opacity: 1; }
  .stat-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(192,57,43,0.12); border: 1px solid rgba(192,57,43,0.25); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem; }
  .stat-num { font-family: var(--ff-display); font-size: 3rem; letter-spacing: 2px; color: var(--red3); line-height: 1; margin-bottom: 0.4rem; }
  .stat-label { color: var(--muted); font-size: 0.78rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; }

  /* DIVIDER */
  .section-divider { border: none; border-top: 1px solid var(--border); max-width: 1140px; margin: 0 auto; }

  /* BLOOD AVAILABILITY */
  #blood-avail { padding: 6rem 0; }
  .blood-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(210px,1fr)); gap: 1.2rem; margin-top: 3rem; }
  .blood-card {
    background: var(--glass); border: 1px solid var(--border); border-radius: 18px;
    padding: 1.6rem 1.4rem; backdrop-filter: blur(12px);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.3s;
    cursor: default; position: relative; overflow: hidden;
  }
  .blood-card::after { content: attr(data-type); position: absolute; right: -10px; bottom: -20px; font-family: var(--ff-display); font-size: 5rem; letter-spacing: 2px; color: rgba(255,255,255,0.03); pointer-events: none; user-select: none; }
  .blood-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 28px 70px rgba(192,57,43,0.22); border-color: var(--border2); }
  .blood-type { font-family: var(--ff-display); font-size: 2.8rem; letter-spacing: 3px; color: var(--red3); line-height: 1; margin-bottom: 0.3rem; }
  .blood-units { font-size: 0.78rem; color: var(--muted); margin-bottom: 1.2rem; font-family: var(--ff-mono); }
  .prog-track { height: 5px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; margin-bottom: 0.8rem; }
  .prog-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--red), var(--red3)); transition: width 1.6s cubic-bezier(0.16,1,0.3,1); }
  .avail-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 50px; letter-spacing: 0.5px; }
  .avail-high { background: rgba(39,174,96,0.15); color: #2ecc71; border: 1px solid rgba(39,174,96,0.3); }
  .avail-med  { background: rgba(243,156,18,0.15); color: #f39c12; border: 1px solid rgba(243,156,18,0.3); }
  .avail-low  { background: rgba(231,76,60,0.15); color: #e74c3c; border: 1px solid rgba(231,76,60,0.3); }

  /* FORMS */
  #donate, #request-section { padding: 6rem 0; }
  .glass-form { background: var(--glass); border: 1px solid var(--border); border-radius: 24px; padding: 3rem; backdrop-filter: blur(20px); position: relative; overflow: hidden; }
  .glass-form::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--red), var(--red3), var(--red)); }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 1.3rem; margin-top: 2rem; }
  .form-group { position: relative; }
  .form-group.full { grid-column: 1 / -1; }
  .form-group label { display: block; font-size: 0.75rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; transition: color 0.2s; }
  .form-group:focus-within label { color: var(--red3); }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 12px; padding: 0.9rem 1.1rem; color: var(--text); font-size: 0.9rem;
    font-family: var(--ff-body); outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
  }
  .form-group select option { background: #1a1a24; color: #fff; }
  .form-group input::placeholder, .form-group textarea::placeholder { color: var(--muted2); font-size: 0.85rem; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: rgba(192,57,43,0.6); box-shadow: 0 0 0 3px rgba(192,57,43,0.12); background: rgba(255,255,255,0.06); }
  .form-group textarea { resize: vertical; min-height: 100px; }
  .form-hint { font-size: 0.73rem; color: var(--muted2); margin-top: 0.4rem; }

  /* EMERGENCY BANNER */
  .emergency-banner {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(192,57,43,0.14); border: 1px solid rgba(192,57,43,0.4);
    color: var(--red3); padding: 0.45rem 1.2rem; border-radius: 50px;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 1.2rem; animation: emergencyPulse 2s ease-in-out infinite;
  }
  @keyframes emergencyPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(192,57,43,0.4); } 50% { box-shadow: 0 0 0 10px rgba(192,57,43,0); } }
  .e-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red2); animation: pulseDot 1.2s infinite; }

  /* SERVICES */
  #services { padding: 6rem 0; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(195px,1fr)); gap: 1.3rem; margin-top: 3rem; }
  .service-card { background: var(--glass); border: 1px solid var(--border); border-radius: 18px; padding: 2rem 1.6rem; text-align: center; backdrop-filter: blur(12px); transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.3s; cursor: default; }
  .service-card:hover { transform: translateY(-10px); box-shadow: 0 24px 60px rgba(192,57,43,0.18); border-color: var(--border2); }
  .service-icon-wrap { width: 60px; height: 60px; border-radius: 16px; background: rgba(192,57,43,0.12); border: 1px solid rgba(192,57,43,0.25); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; margin: 0 auto 1.2rem; transition: background 0.3s, transform 0.3s; }
  .service-card:hover .service-icon-wrap { background: rgba(192,57,43,0.22); transform: scale(1.1) rotate(-3deg); }
  .service-card h3 { font-size: 0.95rem; font-weight: 700; color: var(--white); margin-bottom: 0.6rem; }
  .service-card p { font-size: 0.8rem; color: var(--muted); line-height: 1.7; }

  /* HOW IT WORKS */
  #how-it-works { padding: 6rem 0; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 1.5rem; margin-top: 3rem; }
  .step-card { background: var(--glass); border: 1px solid var(--border); border-radius: 18px; padding: 2rem 1.6rem; backdrop-filter: blur(12px); transition: transform 0.3s, box-shadow 0.3s; }
  .step-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(192,57,43,0.15); }
  .step-number { font-family: var(--ff-display); font-size: 3.5rem; color: rgba(192,57,43,0.18); line-height: 1; margin-bottom: 1rem; letter-spacing: 3px; }
  .step-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--white); }
  .step-card p { font-size: 0.82rem; color: var(--muted); line-height: 1.7; }

  /* TOAST */
  .toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; background: rgba(14,20,14,0.92); border-radius: 14px; padding: 1rem 1.5rem; font-size: 0.88rem; font-weight: 500; backdrop-filter: blur(16px); box-shadow: 0 8px 40px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px; max-width: 340px; animation: toastIn 0.4s ease; border: 1px solid; }
  .toast.success { border-color: rgba(39,174,96,0.4); color: #2ecc71; }
  .toast.error { border-color: rgba(231,76,60,0.4); color: #e74c3c; }
  @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }

  /* FOOTER */
  footer { position: relative; z-index: 10; background: rgba(7,7,13,0.92); backdrop-filter: blur(16px); border-top: 1px solid var(--border); padding: 4rem 2rem 2rem; }
  .footer-inner { max-width: 1140px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 1.4fr repeat(3,1fr); gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border); }
  .footer-brand p { font-size: 0.83rem; color: var(--muted); line-height: 1.8; margin-top: 1rem; max-width: 260px; }
  .social-row { display: flex; gap: 0.7rem; margin-top: 1.5rem; }
  .social-btn { width: 36px; height: 36px; border-radius: 10px; background: var(--glass2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.2s; color: var(--muted); font-family: var(--ff-mono); font-weight: 500; }
  .social-btn:hover { background: rgba(192,57,43,0.2); border-color: var(--border2); transform: translateY(-2px); color: var(--red3); }
  .footer-col h4 { font-size: 0.8rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--white); margin-bottom: 1.3rem; }
  .footer-col a, .footer-col span { display: block; font-size: 0.82rem; color: var(--muted); text-decoration: none; line-height: 2.1; transition: color 0.2s; }
  .footer-col a:hover { color: var(--red3); }
  .emergency-num { font-family: var(--ff-display); font-size: 1.5rem; letter-spacing: 2px; color: var(--red3); line-height: 1.4; }
  .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 2rem; font-size: 0.78rem; color: var(--muted2); flex-wrap: wrap; gap: 1rem; }
  .footer-bottom a { color: var(--muted2); text-decoration: none; transition: color 0.2s; }
  .footer-bottom a:hover { color: var(--red3); }

  /* SCROLL REVEAL */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.75s ease, transform 0.75s ease; }
  .reveal.active { opacity: 1; transform: none; }
  .reveal.scale { transform: scale(0.88); }
  .reveal.scale.active { opacity: 1; transform: none; }
  .stagger-1 { transition-delay: 0.1s !important; } .stagger-2 { transition-delay: 0.2s !important; }
  .stagger-3 { transition-delay: 0.3s !important; } .stagger-4 { transition-delay: 0.4s !important; }
  .stagger-5 { transition-delay: 0.5s !important; } .stagger-6 { transition-delay: 0.6s !important; }
  .stagger-7 { transition-delay: 0.7s !important; } .stagger-8 { transition-delay: 0.8s !important; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }

  /* RESPONSIVE */
  @media (max-width: 960px) { .footer-top { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 768px) {
    .nav { padding: 0 1.2rem; }
    .nav-links, .nav-actions { display: none; }
    .hamburger { display: flex; }
    .footer-top { grid-template-columns: 1fr; gap: 2rem; }
    .glass-form { padding: 1.8rem 1.4rem; }
    .hero-title { font-size: 3.5rem !important; }
  }
  @media (max-width: 480px) {
    .hero-btns { flex-direction: column; align-items: center; }
    .btn-primary, .btn-outline { width: 100%; justify-content: center; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .blood-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* ============================================================
   DATA
   ============================================================ */
const BLOOD_DATA = [
  { type: "A+", units: 420, pct: 84, avail: "high" },
  { type: "A-", units: 85, pct: 28, avail: "low" },
  { type: "B+", units: 380, pct: 76, avail: "high" },
  { type: "B-", units: 112, pct: 37, avail: "med" },
  { type: "AB+", units: 210, pct: 62, avail: "med" },
  { type: "AB-", units: 48, pct: 16, avail: "low" },
  { type: "O+", units: 510, pct: 92, avail: "high" },
  { type: "O-", units: 63, pct: 21, avail: "low" },
];
const BADGE_LABEL = { high: "High Stock", med: "Moderate", low: "Low Stock" };

const STATS_DATA = [
  { icon: "👥", target: 127400, label: "Registered Donors" },
  { icon: "🩸", target: 43600, label: "Available Blood Units" },
  { icon: "🏥", target: 214, label: "Hospitals Connected" },
  { icon: "❤️", target: 92800, label: "Lives Saved" },
];

const SERVICES = [
  {
    icon: "🚑",
    title: "24/7 Emergency Blood",
    desc: "Round-the-clock emergency supply with rapid dispatch in under 30 minutes anywhere in the network.",
  },
  {
    icon: "✅",
    title: "Verified Donors",
    desc: "Every donor undergoes thorough medical screening, blood typing, and infectious disease testing.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "Dedicated cold-chain logistics fleet ensures blood reaches patients within critical timeframes.",
  },
  {
    icon: "🌐",
    title: "Hospital Network",
    desc: "Interconnected with 214+ Apollo facilities across India for seamless inter-hospital transfers.",
  },
  {
    icon: "📡",
    title: "Real-time Tracking",
    desc: "Live GPS and IoT tracking of blood units from the donation point to the transfusion bed.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Register Online",
    desc: "Fill in your details and medical history to join the verified Apollo donor network.",
  },
  {
    num: "02",
    title: "Health Screening",
    desc: "Attend a brief health check at your nearest Apollo centre — fully free of charge.",
  },
  {
    num: "03",
    title: "Donate & Rest",
    desc: "The donation takes under 15 minutes. Refreshments are provided post-donation.",
  },
  {
    num: "04",
    title: "Track Your Impact",
    desc: "Receive a notification when your blood is matched and used to save a life.",
  },
];

/* ============================================================
   HOOKS
   ============================================================ */
function useDotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W,
      H,
      dots = [];
    const DOT_SPACING = 30,
      BASE_RADIUS = 1.4,
      INFLUENCE = 130;
    const MOUSE = { x: -9999, y: -9999 };
    let raf;

    const buildDots = () => {
      dots = [];
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING)
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING)
          dots.push({ bx: x, by: y, x, y });
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildDots();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;
      for (const d of dots) {
        const dx = MOUSE.x - d.bx,
          dy = MOUSE.y - d.by;
        const dist = Math.hypot(dx, dy);
        let tx = d.bx,
          ty = d.by;
        if (dist < INFLUENCE && dist > 0) {
          const str = (1 - dist / INFLUENCE) * 20;
          tx = d.bx - (dx / dist) * str;
          ty = d.by - (dy / dist) * str;
        }
        tx += Math.sin(t * 0.7 + d.bx * 0.018) * 2.5;
        ty += Math.cos(t * 0.5 + d.by * 0.018) * 2.5;
        d.x += (tx - d.x) * 0.09;
        d.y += (ty - d.y) * 0.09;
        const cd = Math.hypot(d.x - MOUSE.x, d.y - MOUSE.y);
        const glow = Math.max(0, 1 - cd / INFLUENCE);
        const r = Math.round(192 + 63 * glow);
        const g = Math.round(57 * glow);
        const b = Math.round(43 * glow);
        ctx.beginPath();
        ctx.arc(d.x, d.y, BASE_RADIUS + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.15 + glow * 0.65})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };

    const onMouse = (e) => {
      MOUSE.x = e.clientX;
      MOUSE.y = e.clientY;
    };
    const onTouch = (e) => {
      if (e.touches[0]) {
        MOUSE.x = e.touches[0].clientX;
        MOUSE.y = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      MOUSE.x = -9999;
      MOUSE.y = -9999;
    };

    resize();
    animate();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return canvasRef;
}

function useScrollReveal() {
  useEffect(() => {
    const trigger = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 70) {
          el.classList.add("active");
          el.querySelectorAll(".prog-fill").forEach((f) => {
            setTimeout(() => {
              f.style.width = f.dataset.pct + "%";
            }, 250);
          });
        }
      });
    };
    window.addEventListener("scroll", trigger, { passive: true });
    setTimeout(trigger, 400);
    return () => window.removeEventListener("scroll", trigger);
  }, []);
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function useCounter(target, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 2200;
    const startTime = Date.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target]);
  return value;
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function Ripple({ e, btn }) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  return (
    <span
      className="ripple"
      style={{
        width: size,
        height: size,
        left: e.clientX - rect.left - size / 2,
        top: e.clientY - rect.top - size / 2,
      }}
    />
  );
}

function RippleButton({ className, style, onClick, children }) {
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now();
    setRipples((r) => [
      ...r,
      {
        id,
        size,
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
      },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick && onClick(e);
  };

  return (
    <button
      ref={btnRef}
      className={`ripple-btn ${className}`}
      style={style}
      onClick={handleClick}
    >
      {children}
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="ripple"
          style={{ width: rp.size, height: rp.size, left: rp.x, top: rp.y }}
        />
      ))}
    </button>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast ${type}`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      {message}
    </div>
  );
}

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */
function Navbar({ scrolled, onMobileOpen, onLogin, onRegister }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => scrollTo("hero")}>
        <div className="logo-mark">🩸</div>
        <div className="logo-text">
          <span className="brand">Apollo</span>
          <span className="sub">Blood Banking</span>
        </div>
      </div>
      <ul className="nav-links">
        {[
          ["hero", "Home"],
          ["donate", "Donate Blood"],
          ["request-section", "Request Blood"],
          ["blood-avail", "Availability"],
          ["services", "Hospitals"],
          ["contact", "Contact"],
        ].map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        {user ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: "white", fontWeight: "600" }}>
              👤 {user.name}
            </span>

            <button
              className="nav-login"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button className="nav-login" onClick={onRegister}>
              Register
            </button>

            <button className="nav-login" onClick={onLogin}>
              Login
            </button>
          </>
        )}
        <button className="nav-emergency">🚨 Emergency</button>
      </div>
      <button className="hamburger" onClick={onMobileOpen}>
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}

function MobileNav({ open, onClose }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    onClose();
  };
  return (
    <div className={`mobile-nav ${open ? "open" : ""}`}>
      <button className="mobile-nav-close" onClick={onClose}>
        ✕
      </button>
      {[
        ["hero", "Home"],
        ["donate", "Donate Blood"],
        ["request-section", "Request Blood"],
        ["blood-avail", "Availability"],
        ["services", "Hospitals"],
        ["contact", "Contact"],
      ].map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(id);
          }}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section id="hero">
      <div className="hero-badge">
        <span className="pulse-dot" />
        Apollo Hospital Blood Banking Network
      </div>
      <h1 className="hero-title">
        <span className="line1">Save Lives.</span>
        <span className="line2">Donate Blood.</span>
      </h1>
      <p className="hero-sub">
        Apollo Hospital Blood Banking Network — Real-time Blood Availability
        across 200+ hospitals nationwide. Every drop counts.
      </p>
      <div className="hero-btns">
        <RippleButton
          className="btn-primary"
          onClick={() =>
            document
              .getElementById("donate")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          🩸 Donate Blood
        </RippleButton>
        <RippleButton
          className="btn-outline"
          onClick={() =>
            document
              .getElementById("request-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          🚨 Request Blood
        </RippleButton>
      </div>
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}

function StatCard({ icon, target, label, stagger, started }) {
  const value = useCounter(target, started);
  return (
    <div className={`stat-card reveal stagger-${stagger}`}>
      <div className="stat-icon-wrap">{icon}</div>
      <div className="stat-num">{value.toLocaleString("en-IN")}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Stats() {
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="stats" ref={sectionRef}>
      <div className="container">
        <div className="stats-grid">
          {STATS_DATA.map((s, i) => (
            <StatCard key={s.label} {...s} stagger={i + 1} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BloodCard({ type, units, pct, avail, stagger }) {
  return (
    <div className={`blood-card reveal stagger-${stagger}`} data-type={type}>
      <div className="blood-type">{type}</div>
      <div className="blood-units">{units} UNITS AVAILABLE</div>
      <div className="prog-track">
        <div className="prog-fill" data-pct={pct} style={{ width: 0 }} />
      </div>
      <span className={`avail-badge avail-${avail}`}>{BADGE_LABEL[avail]}</span>
    </div>
  );
}

function BloodAvailability() {
  return (
    <section id="blood-avail">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Real-time Inventory</div>
          <h2 className="section-title">
            Blood <span>Availability</span>
          </h2>
          <p className="section-sub">
            Live blood inventory updated every 15 minutes across the Apollo
            network.
          </p>
        </div>
        <div className="blood-grid">
          {BLOOD_DATA.map((b, i) => (
            <BloodCard key={b.type} {...b} stagger={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DonorForm({ showToast }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    bg: "",
    loc: "",
    phone: "",
    date: "",
    email: "",
    notes: "",
    units: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showToast("Please login first", "error");
      return;
    }

    const data = {
      user_id: user.id,
      name: form.name,
      email: user.email,
      age: form.age,
      gender: form.gender,
      blood_group: form.bg,
      location: form.loc,
      phone: form.phone,
      last_donation: form.date,
      notes: form.notes,
      units: form.units,
    };

    const res = await fetch("http://localhost:5000/donor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.status === "success") {
      showToast("Donor Registered Successfully", "success");
    } else {
      showToast("Error saving donor", "error");
    }
  };

  return (
    <section id="donate">
      <div className="container">
        <div className="reveal" style={{ marginBottom: "2.5rem" }}>
          <div className="section-label">Join the Network</div>
          <h2 className="section-title">
            Donor <span>Registration</span>
          </h2>
          <p className="section-sub">
            Become a verified Apollo blood donor and help save lives in your
            community.
          </p>
        </div>
        <div className="glass-form reveal scale">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={set("name")}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="18 – 65"
                min="18"
                max="65"
                value={form.age}
                onChange={set("age")}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={set("gender")}>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select value={form.bg} onChange={set("bg")}>
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City / Location</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, Telangana"
                value={form.loc}
                onChange={set("loc")}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
            <div className="form-group">
              <label>UNITS AVAILABLE</label>

              <input
                type="number"
                placeholder="e.g 2"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Last Donation Date</label>
              <input type="date" value={form.date} onChange={set("date")} />
              <div className="form-hint">
                Leave blank if this is your first donation.
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div className="form-group full">
              <label>Medical Notes (optional)</label>
              <textarea
                placeholder="Any relevant medical history or conditions…"
                value={form.notes}
                onChange={set("notes")}
              />
            </div>
            <div className="form-group full">
              <RippleButton
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "1.1rem",
                  fontSize: "1rem",
                  borderRadius: "14px",
                }}
                onClick={handleSubmit}
              >
                🩸 Register as Donor
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RequestForm({ showToast, setPage, setDonorList }) {
  const [form, setForm] = useState({
    name: "",
    bg: "",
    units: "",
    hosp: "",
    loc: "",
    contact: "",
    date: "",
    urgency: "",
    notes: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.bg ||
      !form.units ||
      !form.hosp ||
      !form.loc ||
      !form.contact || !form.units
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    /* SAVE REQUEST TO DB */
    await fetch("http://localhost:5000/request-blood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        bg: form.bg,
        units: form.units,
        hospital: form.hosp,
        city: form.loc,
        phone: form.contact,
        date: form.date,
        urgency: form.urgency,
        notes: form.notes,
        units: form.units,
      }),
    });

    /* SEARCH DONORS */
    const res = await fetch("http://localhost:5000/search-donors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blood_group: form.bg,
        units: form.units,
      }),
    });

    const donors = await res.json();

    if (donors.length === 0) {
      showToast("No donors available", "error");
      return;
    }

    setDonorList(donors);
    setPage("donors");
  };

  return (
    <section id="request-section">
      <div className="container">
        <div className="reveal" style={{ marginBottom: "2.5rem" }}>
          <div className="section-label">Emergency Services</div>
          <h2 className="section-title">
            Request <span>Blood</span>
          </h2>
          <p className="section-sub">
            Submit an emergency request — our coordination team responds within
            30 minutes.
          </p>
        </div>
        <div className="glass-form reveal scale">
          <div className="emergency-banner">
            <span className="e-dot" />
            🚨 Emergency Blood Request — 24/7 Active
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                placeholder="Full name of patient"
                value={form.name}
                onChange={set("name")}
              />
            </div>
            <div className="form-group">
              <label>Blood Group Required</label>
              <select value={form.bg} onChange={set("bg")}>
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Units Required</label>
              <input
                type="number"
                placeholder="e.g. 2"
                min="1"
                max="20"
                value={form.units}
                onChange={set("units")}
              />
            </div>
            <div className="form-group">
              <label>Hospital Name</label>
              <input
                type="text"
                placeholder="e.g. Apollo Hospitals, Jubilee Hills"
                value={form.hosp}
                onChange={set("hosp")}
              />
            </div>
            <div className="form-group">
              <label>Location / City</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, Telangana"
                value={form.loc}
                onChange={set("loc")}
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.contact}
                onChange={set("contact")}
              />
            </div>
            <div className="form-group">
              <label>Date Required</label>
              <input type="date" value={form.date} onChange={set("date")} />
            </div>
            <div className="form-group">
              <label>Urgency Level</label>
              <select value={form.urgency} onChange={set("urgency")}>
                <option value="">Select Urgency</option>
                <option>🔴 Critical — Within 1 hour</option>
                <option>🟡 Urgent — Within 6 hours</option>
                <option>🟢 Scheduled — Within 24 hours</option>
              </select>
            </div>
            <div className="form-group full">
              <label>Additional Notes</label>
              <textarea
                placeholder="Patient condition, ward number, attending doctor…"
                value={form.notes}
                onChange={set("notes")}
              />
            </div>
            <div className="form-group full">
              <RippleButton
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "1.1rem",
                  fontSize: "1rem",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#a93226,#c0392b)",
                }}
                onClick={handleSubmit}
              >
                🚨 Submit Emergency Request
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Process</div>
          <h2 className="section-title">
            How It <span>Works</span>
          </h2>
          <p className="section-sub">
            A seamless, four-step process from donation to transfusion.
          </p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.num} className={`step-card reveal stagger-${i + 1}`}>
              <div className="step-number">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Our Services</div>
          <h2 className="section-title">
            Hospital <span>Services</span>
          </h2>
          <p className="section-sub">
            World-class blood banking infrastructure powered by Apollo
            Healthcare.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`service-card reveal stagger-${i + 1}`}
            >
              <div className="service-icon-wrap">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: "1rem" }}>
              <div className="logo-mark">🩸</div>
              <div className="logo-text">
                <span className="brand">Apollo</span>
                <span className="sub">Blood Banking</span>
              </div>
            </div>
            <p>
              India's most trusted blood banking network, connecting donors and
              recipients in real time across the entire Apollo healthcare
              ecosystem since 1983.
            </p>
            <div className="social-row">
              {["𝕏", "f", "in", "▶"].map((s) => (
                <div key={s} className="social-btn">
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Emergency</h4>
            <span className="emergency-num">1800-425-1066</span>
            <a href="#">+91 40 2355 5555</a>
            <a href="#">Blood Emergency Line</a>
            <a href="#">WhatsApp Support</a>
            <a href="#">NOTTO Integration</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#">blood@apollohospitals.com</a>
            <a href="#">Apollo Hospitals, Jubilee Hills</a>
            <a href="#">Hyderabad — 500 033</a>
            <a href="#">Telangana, India</a>
            <span
              style={{
                marginTop: ".5rem",
                color: "var(--red3)",
                fontSize: ".78rem",
                fontWeight: 600,
              }}
            >
              🕐 24 / 7 — Always Open
            </span>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            {[
              ["#donate", "Become a Donor"],
              ["#request-section", "Request Blood"],
              ["#blood-avail", "Check Availability"],
              ["#how-it-works", "How It Works"],
              ["#", "Privacy Policy"],
              ["#", "Terms of Service"],
            ].map(([href, label]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2025 Apollo Hospitals Blood Banking System. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [page, setPage] = useState("home");
  const [donorList, setDonorList] = useState([]);
  const canvasRef = useDotGrid();
  useScrollReveal();
  const scrolled = useNavScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <canvas id="dot-canvas" ref={canvasRef} />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Navbar
        scrolled={scrolled}
        onMobileOpen={() => setMobileOpen(true)}
        onLogin={() => setPage("login")}
        onRegister={() => setPage("register")}
      />
      {page === "login" && <Login onBack={() => setPage("home")} />}

      {page === "register" && <Register onBack={() => setPage("home")} />}
      {page === "donors" && <DonorResults donors={donorList} />}
      {page === "home" && (
        <>
          <main>
            <Hero />
            <Stats />
            <hr className="section-divider" />
            <BloodAvailability />
            <hr className="section-divider" />
            <DonorForm showToast={showToast} />
            <hr className="section-divider" />
            <RequestForm
              showToast={showToast}
              setPage={setPage}
              setDonorList={setDonorList}
            />
            <hr className="section-divider" />
            <HowItWorks />
            <hr className="section-divider" />
            <Services />
          </main>

          <Footer />
        </>
      )}

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
