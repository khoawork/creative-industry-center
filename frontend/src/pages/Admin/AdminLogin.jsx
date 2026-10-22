import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, RefreshCw, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/shared/logo/creative-industry-center-logo.png';
import { site } from '../../config/shared/site.js';

// --- PKCE Helpers cho SSO ---
function generateRandomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default function AdminLogin() {
  const { loginWithSSO, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [ssoLoading, setSsoLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const hasTriggeredRedirect = useRef(false);

  const from = location.state?.from?.pathname || '/admin';

  // 1. Chuyển hướng sang SSO Hub Keycloak
  const triggerSSORedirect = async () => {
    try {
      setSsoLoading(true);
      setErrorMessage('');

      const verifier = generateRandomString(64);
      sessionStorage.setItem('sso_code_verifier', verifier);

      const hashed = await sha256(verifier);
      const challenge = base64UrlEncode(hashed);

      const redirectUri = window.location.origin + window.location.pathname;
      const keycloakUrl = 'http://localhost:8888/realms/sso-platform/protocol/openid-connect/auth';
      const clientId = 'app-a';

      const authUrl = `${keycloakUrl}?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=openid profile email` +
        `&code_challenge=${encodeURIComponent(challenge)}` +
        `&code_challenge_method=S256`;

      window.location.href = authUrl;
    } catch (err) {
      setErrorMessage('Không thể khởi tạo phiên SSO: ' + err.message);
      setSsoLoading(false);
    }
  };

  useEffect(() => {
    // Nếu đã đăng nhập thì đi thẳng vào trang admin
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Nếu Keycloak vừa chuyển hướng về kèm mã code
    if (code) {
      setSsoLoading(true);
      const redirectUri = window.location.origin + window.location.pathname;
      const verifier = sessionStorage.getItem('sso_code_verifier') || '';

      loginWithSSO(code, redirectUri, verifier)
        .then(() => {
          sessionStorage.removeItem('sso_code_verifier');
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate(from, { replace: true });
        })
        .catch((error) => {
          const msg = error.response?.data?.message || 'Xác thực qua SSO Hub không thành công.';
          setErrorMessage(msg);
          setSsoLoading(false);
        });
    } else {
      // TỰ ĐỘNG CHUYỂN HƯỚNG SANG SSO HUB NGAY LẬP TỨC
      if (!hasTriggeredRedirect.current) {
        hasTriggeredRedirect.current = true;
        triggerSSORedirect();
      }
    }
  }, [isAuthenticated, loginWithSSO, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141412] text-[#e9e5da] font-[Inter,sans-serif] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-[#710008]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-[#d49520]/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1e1e1a] border border-[#39321f] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md text-center">
          
          {/* Header & Logo */}
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#0e0e0c] border border-[#39321f] mb-4 shadow-inner">
            <img src={logo} alt="Logo" className="size-14 object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Đăng nhập Quản trị
          </h1>
          <p className="mt-1.5 text-xs text-[#b8aa85]">
            {site.name} · Cổng xác thực tập trung
          </p>

          {/* Trạng thái lỗi (nếu có) */}
          {errorMessage ? (
            <div className="mt-6 text-left">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs leading-relaxed">
                <ShieldAlert size={16} className="shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>

              <button
                type="button"
                onClick={triggerSSORedirect}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#d49520] to-[#b37a13] hover:from-[#e0a12c] hover:to-[#c48719] text-slate-950 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                <KeyRound size={16} />
                <span>Thử kết nối lại với SSO Hub</span>
              </button>
            </div>
          ) : (
            /* Trạng thái Đang Tự Động Kết Nối */
            <div className="mt-8 py-4 space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#d49520]/10 text-[#d49520]">
                <RefreshCw size={28} className="animate-spin" />
              </div>
              <p className="text-sm font-medium text-white">
                Đang chuyển hướng sang SSO Hub...
              </p>
              <p className="text-xs text-slate-400">
                Hệ thống đang đồng bộ phiên đăng nhập tập trung
              </p>
            </div>
          )}

          {/* Footer Card */}
          <div className="mt-8 pt-5 border-t border-[#39321f]/60">
            <p className="text-[11px] text-[#b8aa85]/70 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-[#d49520]" />
              Bảo mật bởi chuẩn xác thực OpenID Connect (OIDC)
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          <a href="/" className="hover:text-[#d49520] transition underline underline-offset-4">
            ← Quay lại trang chủ website
          </a>
        </p>
      </div>
    </div>
  );
}
