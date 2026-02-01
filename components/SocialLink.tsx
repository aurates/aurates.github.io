
import React from 'react';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  onClick?: (e: React.MouseEvent) => void;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label, bgColor, onClick }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`group relative flex items-center justify-center w-20 h-20 rounded-full text-white transition-transform duration-300 hover:scale-105 active:scale-95 ${bgColor}`}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
};

export default SocialLink;
