import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowLeft, Menu, Send, UserRound, X } from 'lucide-react';

export default function ForumHeader({ data, onRegister }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const header = data || {};
  const navLinks = Array.isArray(header.nav_items) ? header.nav_items : [];
  const brandTitle = header.brand_title || '';
  const brandSubtitle = header.brand_subtitle || '';
  const buttonText = header.button_text || '';

  const openRegistration = () => {
    setMobileMenuOpen(false);
    onRegister?.();
  };

  const handleAnchorClick = (event, href) => {
    if (!href?.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    setMobileMenuOpen(false);
    target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="relative z-50 shadow-sm">
      <div className="bg-[#062b67] text-white">
        <div className="mx-auto flex min-h-8 max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4 py-1 text-[10px] font-semibold sm:px-6 sm:text-xs">
          <Link
            to={header.top_back_link || '/'}
            className="inline-flex items-center gap-1.5 hover:text-blue-200"
          >
            <ArrowLeft size={14} />
            <span>{header.top_back_text}</span>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-blue-100">
            <span>{header.top_slogan}</span>
            {header.top_hotline && <span>Hotline: {header.top_hotline}</span>}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/forum" className="flex min-w-0 items-center gap-3 text-[#082e68]">
            {header.logo_image ? (
              <img
                src={header.logo_image}
                alt=""
                className="h-11 w-12 shrink-0 object-contain"
              />
            ) : (
              <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0756a8]">
                <Award size={25} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-xs font-extrabold leading-tight tracking-wide sm:text-sm">
                {brandTitle}
              </span>
              <span className="mt-0.5 block text-[10px] font-medium leading-tight text-slate-600 sm:text-xs">
                {brandSubtitle}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex 2xl:gap-5" aria-label="Điều hướng diễn đàn">
            {navLinks.map((item, index) => (
              <a
                key={`${item.href}-${item.label}-${index}`}
                href={item.href}
                onClick={(event) => handleAnchorClick(event, item.href)}
                className="max-w-24 text-center text-[10px] font-semibold leading-tight text-slate-700 transition-colors hover:text-[#0756a8] 2xl:max-w-40 2xl:text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openRegistration}
              className="hidden items-center gap-2 rounded-md bg-[#082e68] px-4 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#0b4b9e] sm:inline-flex"
            >
              {buttonText}
              <Send size={14} />
            </button>
            {header.show_user_icon !== false && (
              <span
                aria-hidden="true"
                className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#082e68] text-white sm:flex"
              >
                <UserRound size={17} />
              </span>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-md border border-slate-200 p-2 text-[#082e68] lg:hidden"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden"
            aria-label="Điều hướng diễn đàn"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col">
              {navLinks.map((item, index) => (
                <a
                  key={`${item.href}-${item.label}-${index}`}
                  href={item.href}
                  onClick={(event) => handleAnchorClick(event, item.href)}
                  className="border-b border-slate-100 px-2 py-3 text-sm font-semibold text-slate-700 last:border-0"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={openRegistration}
                className="mt-3 rounded-md bg-[#082e68] px-4 py-3 text-center text-sm font-bold text-white"
              >
                {buttonText}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
