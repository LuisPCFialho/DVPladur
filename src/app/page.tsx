'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import PrecosPanel from '@/components/PrecosPanel';
import NovoOrcamento from '@/components/NovoOrcamento';
import ListaOrcamentos from '@/components/ListaOrcamentos';
import DetalheOrcamento from '@/components/DetalheOrcamento';
import ClientePanel from '@/components/ClientePanel';
import { Orcamento } from '@/types';

type View = 'dashboard' | 'orcamentos' | 'clientes' | 'config';

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default function Home() {
  const [view, setView] = useState<View>('dashboard');
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const { addOrcamento, updateOrcamento, orcamentos, precosConfig } = useStore();

  const handleSaveOrcamento = (orcamento: Orcamento) => {
    if (modoEdicao && orcamentoSelecionado) {
      updateOrcamento(orcamentoSelecionado.id, { ...orcamento, id: orcamentoSelecionado.id });
    } else {
      addOrcamento(orcamento);
    }
    setShowNovoOrcamento(false);
    setOrcamentoSelecionado(null);
    setModoEdicao(false);
    setView('orcamentos');
  };

  const handleViewOrcamento = (orcamento: Orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setShowDetalhe(true);
  };

  const handleEditOrcamento = (orcamento: Orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setModoEdicao(true);
    setShowDetalhe(false);
    setShowNovoOrcamento(true);
  };

  const handleFinalizeOrcamento = (orcamento: Orcamento) => {
    updateOrcamento(orcamento.id, orcamento);
    setShowDetalhe(false);
    setView('orcamentos');
  };

  const handleNovoOrcamento = () => {
    setOrcamentoSelecionado(null);
    setModoEdicao(false);
    setShowNovoOrcamento(true);
  };

  const totalFinalizado = orcamentos
    .filter((o) => o.status === 'finalizado')
    .reduce((sum, o) => sum + (o.precoComIVA || o.precoLiquidoCliente), 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-slate-900 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">
                {precosConfig.nomeEmpresa || 'DVPladur'}
              </h1>
              <p className="text-slate-400 text-xs">Orçamentos</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem
            active={view === 'dashboard'}
            onClick={() => setView('dashboard')}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            label="Dashboard"
          />
          <NavItem
            active={view === 'orcamentos'}
            onClick={() => setView('orcamentos')}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            label="Orçamentos"
          />
          <NavItem
            active={view === 'clientes'}
            onClick={() => setView('clientes')}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Clientes"
          />
          <NavItem
            active={view === 'config'}
            onClick={() => setView('config')}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Configurações"
          />
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleNovoOrcamento}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {view === 'dashboard' && (
          <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
              <p className="text-slate-500 text-sm mt-1">Visão geral dos seus orçamentos</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: 'Total',
                  value: orcamentos.length,
                  color: 'bg-blue-50 text-blue-700',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                },
                {
                  label: 'Rascunhos',
                  value: orcamentos.filter((o) => o.status === 'rascunho').length,
                  color: 'bg-amber-50 text-amber-700',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
                },
                {
                  label: 'Finalizados',
                  value: orcamentos.filter((o) => o.status === 'finalizado').length,
                  color: 'bg-green-50 text-green-700',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                },
                {
                  label: 'Faturado (c/ IVA)',
                  value: `${totalFinalizado.toFixed(0)}€`,
                  color: 'bg-slate-50 text-slate-700',
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>{icon}</div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Orçamentos Recentes</h3>
              {orcamentos.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400">Nenhum orçamento ainda.</p>
                  <button
                    onClick={handleNovoOrcamento}
                    className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Criar primeiro orçamento
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...orcamentos]
                    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
                    .slice(0, 5)
                    .map((o) => (
                      <button
                        key={o.id}
                        onClick={() => handleViewOrcamento(o)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{o.nome}</p>
                          <p className="text-xs text-slate-500">{o.cliente} · {o.numero}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-700">
                            {(o.precoComIVA || o.precoLiquidoCliente).toFixed(2)}€
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status === 'rascunho' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {o.status === 'rascunho' ? 'Rascunho' : 'Finalizado'}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'orcamentos' && (
          <div className="p-6">
            <ListaOrcamentos
              onViewOrcamento={handleViewOrcamento}
              onEditOrcamento={handleEditOrcamento}
              onNovoOrcamento={handleNovoOrcamento}
            />
          </div>
        )}

        {view === 'clientes' && (
          <div className="p-6">
            <ClientePanel />
          </div>
        )}

        {view === 'config' && (
          <div className="p-6">
            <PrecosPanel />
          </div>
        )}
      </div>

      {showNovoOrcamento && (
        <NovoOrcamento
          onClose={() => {
            setShowNovoOrcamento(false);
            setOrcamentoSelecionado(null);
            setModoEdicao(false);
          }}
          onSave={handleSaveOrcamento}
          orcamentoExistente={modoEdicao ? orcamentoSelecionado : null}
        />
      )}

      {showDetalhe && orcamentoSelecionado && (
        <DetalheOrcamento
          orcamento={orcamentoSelecionado}
          onClose={() => setShowDetalhe(false)}
          onFinalize={handleFinalizeOrcamento}
          onEdit={handleEditOrcamento}
        />
      )}
    </div>
  );
}
