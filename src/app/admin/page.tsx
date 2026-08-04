import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-900 text-white p-6 pt-20">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-black mb-4 uppercase text-green-400">
          Painel de Controle SEnC
        </h1>
        <p className="text-gray-400 mb-12">
          Sistema de credenciamento e leitura de QR Codes.
        </p>

        {/* Placeholder for future Camera/Scanner component */}
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-6">Leitor de Check-in</h2>
          <div className="w-full aspect-video bg-black border border-gray-600 rounded flex items-center justify-center">
             <span className="text-gray-500 font-mono tracking-widest">[ INICIALIZANDO CÂMERA... ]</span>
          </div>
        </div>

        <Link href="/" className="text-gray-400 hover:text-white transition">
          &larr; Sair do modo Admin
        </Link>
      </div>
    </main>
  );
}