import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, RefreshCw, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/shared/logo/creative-industry-center-logo.png';
import { site } from '../../config/shared/site.js';

// --- PKCE Helpers cho SSO (khi người dùng chủ động nhấn đăng nhập SSO) ---
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
  const { login, loginWithSSO, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  // Tự động chuyển hướng nếu đã đăng nhập; chỉ xử lý SSO khi có ?code= trên URL callback
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Chỉ khi có mã code trả về từ Keycloak mới kích hoạt xác thực SSO
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
    }
  }, [isAuthenticated, loginWithSSO, navigate, from]);

  // Xử lý đăng nhập thông thường bằng form Username & Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Tùy chọn chuyển hướng sang SSO Hub Keycloak (chỉ khi người dùng chủ động click)
  const handleSSORedirect = async () => {
    try {
      setSsoLoading(true);
      setErrorMessage('');

      const verifier = generateRandomString(64);
      sessionStorage.setItem('sso_code_verifier', verifier);

      const hashed = await sha256(verifier);
      const challenge = base64UrlEncode(hashed);

      const redirectUri = window.location.origin + window.location.pathname;
      const keycloakUrl = import.meta.env.VITE_KEYCLOAK_AUTH_URL || 'http://localhost:8888/realms/sso-platform/protocol/openid-connect/auth';
      const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'app-a';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141412] text-[#e9e5da] font-[Inter,sans-serif] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-[#710008]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-[#d49520]/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1e1e1a] border border-[#39321f] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          
          {/* Header & Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#0e0e0c] border border-[#39321f] mb-4 shadow-inner">
              <img src={logo} alt="Logo" className="size-14 object-contain" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Đăng nhập Quản trị
            </h1>
            <p className="mt-1.5 text-xs text-[#b8aa85]">
              {site.name} · Cổng thông tin nội bộ
            </p>
          </div>

          {/* Form đăng nhập Username & Mật khẩu */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs leading-relaxed animate-shake">
                <ShieldAlert size={16} className="shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#d49520] mb-1.5 uppercase tracking-wider">
                Tài khoản hoặc Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin hoặc email..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141412] border border-[#39321f] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d49520] focus:ring-1 focus:ring-[#d49520] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d49520] mb-1.5 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141412] border border-[#39321f] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d49520] focus:ring-1 focus:ring-[#d49520] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || ssoLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#710008] to-[#91131c] hover:from-[#840610] hover:to-[#a31923] text-white shadow-lg shadow-[#710008]/30 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Phân cách hoặc đăng nhập SSO */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#39321f]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1e1e1a] px-3 text-[#b8aa85]/60 text-[11px]">
                Hoặc tùy chọn
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSSORedirect}
            disabled={ssoLoading || loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs bg-[#141412] hover:bg-[#252520] border border-[#39321f] text-[#d49520] hover:text-[#f0b542] transition cursor-pointer disabled:opacity-50"
          >
            {ssoLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin text-[#d49520]" />
                <span>Đang kết nối SSO Hub...</span>
              </>
            ) : (
              <>
                <KeyRound size={15} />
                <span>Đăng nhập bằng SSO Hub (Keycloak)</span>
              </>
            )}
          </button>

          {/* Footer Card */}
          <div className="mt-6 pt-5 border-t border-[#39321f]/60 text-center">
            <p className="text-[11px] text-[#b8aa85]/70 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-[#d49520]" />
              Khu vực bảo mật riêng biệt của ban quản trị
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
