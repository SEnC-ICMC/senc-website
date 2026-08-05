import Link from 'next/link';

export default function ParticipantDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
          Área do Participante
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bem-vindo! Em breve, seu QR Code de acesso e certificados aparecerão aqui.
        </p>
        
        {/* Placeholder for future QR Code component */}
        <div className="w-64 h-64 bg-gray-100 border-4 border-dashed border-gray-300 mx-auto rounded-lg flex items-center justify-center mb-8">
          <span className="text-gray-400 font-semibold">[ Espaço do QR Code ]</span>
        </div>

        <Link href="/" className="text-green-600 font-bold hover:underline">
          &larr; Voltar para a Home
        </Link>
      </div>
    </main>
  );
}