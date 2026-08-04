import Link from 'next/link';

export default function NovaInscricao() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase text-center">
          Nova Inscrição
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Crie sua conta para participar da X SEnC.
        </p>

        {/* Dummy Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nome Completo</label>
            <input type="text" disabled className="mt-1 w-full p-3 rounded-md border border-gray-200 bg-gray-100 cursor-not-allowed" placeholder="Em construção..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email da USP (ou Pessoal)</label>
            <input type="email" disabled className="mt-1 w-full p-3 rounded-md border border-gray-200 bg-gray-100 cursor-not-allowed" placeholder="Em construção..." />
          </div>
          <button type="button" disabled className="w-full mt-4 bg-gray-300 text-gray-500 px-6 py-3 rounded-md font-extrabold uppercase cursor-not-allowed">
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-green-600 font-bold hover:underline">
            &larr; Voltar para a Home
          </Link>
        </div>
      </div>
    </main>
  );
}