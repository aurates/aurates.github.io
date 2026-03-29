import React from 'react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const DONATE_METHODS = [
  { label: 'BTC', address: 'bc1qmcjmyr09q0pp63egxdm45auzaarwqhgwlyuv28' },
  { label: 'LTC', address: 'ltc1qmxz4t5az3jvpmfcxxpy4tjsjus4sznlj4ffkgj' },
  { label: 'ETH', address: '0x3D9D06b9F956802B40E371906a360F8f8d3A8BC2' },
  { label: 'USDC (SPL)', address: 'CQoJTwTGtu29kMo9UdFcHvmgerXiZipogBcBGu9TxkrT' },
];

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        style={{
          backgroundColor: isOpen
            ? (isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)')
            : 'rgba(0, 0, 0, 0)',
          backdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
        }}
        onClick={onClose}
      />

      <div
        className={`relative z-10 p-10 md:p-14 rounded-[3rem] glass-liquid transition-all duration-500 ease-in-out transform ${
          isOpen ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto' : 'scale-90 translate-y-12 opacity-0'
        } ${
          isDarkMode ? 'text-white border-white/10' : 'text-slate-900 border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-[280px] flex-col items-center gap-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">{'Dotate </3'}</h2>

          <div className="w-full space-y-4">
            {DONATE_METHODS.map((method) => (
              <div key={method.label} className="space-y-1">
                <p className="text-xs md:text-sm font-bold tracking-[0.18em] uppercase opacity-70">{method.label}</p>
                <p className="text-sm md:text-base font-mono break-all select-all">{method.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;