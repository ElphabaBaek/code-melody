import Link from 'next/link';

export default function Header() {
  return (
    <nav className="flex w-full justify-center py-4 items-center border-b border-gray-300 backdrop-blur-2xl font-mono text-sm px-4 lg:px-0">
      <div className="max-w-3xl flex w-full items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Code Melody
          </span>
        </Link>
      </div>
    </nav>
  );
}
