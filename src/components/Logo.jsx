import Image from 'next/image';

export default function Logo({ className = '', size = 64 }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/logo_256.png"
        alt="Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
} 