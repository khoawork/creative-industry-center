import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/shared/logo/creative-industry-center-logo.png';
import { site } from '../../config/shared/site.js';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Nếu đã đăng nhập thì tự chuyển hướng vào admin
  const from = location.state?.from?.pathname || '/admin';
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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
      const msg = error.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
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

          {/* Form */}
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
              disabled={loading}
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

