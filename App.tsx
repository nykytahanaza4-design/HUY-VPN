import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { ServerList } from './components/ServerList';
import { QuickConnectQR } from './components/QuickConnectQR';
import { Platforms } from './components/Platforms';
import { GitHubSection } from './components/GitHubSection';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { Toast, ToastMessage } from './components/Toast';
import { VPNServer } from './data/servers';

export default function App() {
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);
  const [modalPlatform, setModalPlatform] = React.useState<string>('Windows');
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopyText = (text: string, title: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    addToast('Скопировано в буфер обмена', title);
  };

  const handleOpenDownload = (platform: string = 'Windows') => {
    setModalPlatform(platform);
    setDownloadModalOpen(true);
  };

  const handleOpenGithub = () => {
    const el = document.getElementById('github');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open('https://github.com', '_blank');
    }
  };

  const handleDownloadSingleConfig = (server: VPNServer) => {
    const element = document.createElement('a');
    const file = new Blob([server.configSnippet], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `huy-vpn-${server.countryCode.toLowerCase()}.conf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('Конфигурация сохранена', `${server.country} (${server.protocol})`);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-sans relative">
      {/* Background Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Main Top Navigation */}
      <Header onOpenDownload={() => handleOpenDownload('Windows')} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero 
          onOpenDownload={handleOpenDownload} 
          onOpenGithub={handleOpenGithub} 
        />

        <Manifesto />

        <ServerList 
          onCopyConfig={handleCopyText} 
          onDownloadConfig={handleDownloadSingleConfig} 
        />

        <QuickConnectQR onCopyConfig={handleCopyText} />

        <Platforms onOpenDownload={handleOpenDownload} />

        <GitHubSection onCopyConfig={handleCopyText} />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer 
        onOpenDownload={() => handleOpenDownload('Windows')} 
        onOpenGithub={handleOpenGithub} 
      />

      {/* Interactive Download Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        initialPlatform={modalPlatform}
        onCopyText={handleCopyText}
      />

      {/* Toast Feedbacks */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
