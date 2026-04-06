'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import PrecosPanel from '@/components/PrecosPanel';
import NovoOrcamento from '@/components/NovoOrcamento';
import ListaOrcamentos from '@/components/ListaOrcamentos';
import DetalheOrcamento from '@/components/DetalheOrcamento';
import { Orcamento } from '@/types';

type View = 'home' | 'precos' | 'novoOrcamento' | 'historico';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);

  const { addOrcamento, updateOrcamento, orcamentos } = useStore();

  const handleSaveOrcamento = (orcamento: Orcamento) => {
    addOrcamento(orcamento);
    setShowNovoOrcamento(false);
    setView('historico');
  };

  const handleViewOrcamento = (orcamento: Orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setShowDetalhe(true);
  };

  const handleEditOrcamento = (orcamento: Orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setShowNovoOrcamento(true);
  };

  const handleFinalizeOrcamento = (orcamento: Orcamento) => {
    updateOrcamento(orcamento.id, orcamento);
    setShowDetalhe(false);
    setView('historico');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Orçamentos Pladur</h1>
          <p className="text-gray-600 mt-1">Sistema de Gestão de Orçamentos</p>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 py-2">
            <button
              onClick={() => setView('home')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                view === 'home'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setView('precos')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                view === 'precos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Preços
            </button>
            <button
              onClick={() => setView('historico')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                view === 'historico'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Bem-vindo ao Sistema de Orçamentos
              </h2>
              <p className="text-gray-600 mb-6">
                Crie e gerencie orçamentos de trabalhos de pladur com facilidade
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowNovoOrcamento(true)}
                  className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-semibold text-lg shadow-md"
                >
                  + Novo Orçamento
                </button>
                <button
                  onClick={() => setView('historico')}
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition font-semibold text-lg shadow-md"
                >
                  Ver Histórico
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Total de Orçamentos</p>
                    <p className="text-2xl font-bold text-gray-800">{orcamentos.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Rascunhos</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orcamentos.filter((o) => o.status === 'rascunho').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Finalizados</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orcamentos.filter((o) => o.status === 'finalizado').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'precos' && <PrecosPanel />}

        {view === 'historico' && (
          <ListaOrcamentos
            onViewOrcamento={handleViewOrcamento}
            onEditOrcamento={handleEditOrcamento}
          />
        )}
      </main>

      {showNovoOrcamento && (
        <NovoOrcamento onClose={() => setShowNovoOrcamento(false)} onSave={handleSaveOrcamento} />
      )}

      {showDetalhe && orcamentoSelecionado && (
        <DetalheOrcamento
          orcamento={orcamentoSelecionado}
          onClose={() => setShowDetalhe(false)}
          onFinalize={handleFinalizeOrcamento}
        />
      )}

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Sistema de Orçamentos Pladur - Desenvolvido para profissionais</p>
        </div>
      </footer>
    </div>
  );
}
