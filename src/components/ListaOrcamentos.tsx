'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Orcamento, TIPOS_TRABALHO } from '@/types';

export default function ListaOrcamentos({
  onViewOrcamento,
  onEditOrcamento,
  onNovoOrcamento,
}: {
  onViewOrcamento: (o: Orcamento) => void;
  onEditOrcamento: (o: Orcamento) => void;
  onNovoOrcamento: () => void;
}) {
  const { orcamentos, deleteOrcamento, renomearOrcamento } = useStore();
  const [filtro, setFiltro] = useState<'todos' | 'rascunho' | 'finalizado'>('todos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');

  const handleRenomear = (id: string) => {
    if (novoNome.trim()) {
      renomearOrcamento(id, novoNome.trim());
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem a certeza que quer eliminar este orçamento? Esta ação é irreversível.')) {
      deleteOrcamento(id);
    }
  };

  const lista = [...orcamentos]
    .filter((o) => filtro === 'todos' || o.status === filtro)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

  const totRascunho = orcamentos.filter((o) => o.status === 'rascunho').length;
  const totFinalizado = orcamentos.filter((o) => o.status === 'finalizado').length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orçamentos</h2>
          <p className="text-slate-500 text-sm mt-0.5">{orcamentos.length} no total</p>
        </div>
        <button
          onClick={onNovoOrcamento}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Orçamento
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {([
          ['todos', 'Todos', orcamentos.length],
          ['rascunho', 'Rascunhos', totRascunho],
          ['finalizado', 'Finalizados', totFinalizado],
        ] as const).map(([val, label, count]) => (
          <button
            key={val}
            onClick={() => setFiltro(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtro === val
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-400 font-medium">Nenhum orçamento encontrado</p>
          <button onClick={onNovoOrcamento} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
            Criar orçamento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {editingId === o.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={novoNome}
                          onChange={(e) => setNovoNome(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenomear(o.id)}
                          autoFocus
                        />
                        <button onClick={() => handleRenomear(o.id)} className="text-xs font-semibold text-green-600 hover:text-green-700 px-2">OK</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancelar</button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800">{o.nome}</h3>
                          <span className="text-xs text-slate-400 font-mono">{o.numero}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.status === 'rascunho' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {o.status === 'rascunho' ? 'Rascunho' : 'Finalizado'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{o.cliente}{o.nifCliente ? ` · NIF ${o.nifCliente}` : ''}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-slate-800">
                      {(o.precoComIVA ?? o.precoLiquidoCliente).toFixed(2)}€
                    </p>
                    <p className="text-xs text-slate-400">c/ IVA ({o.taxaIVA ?? 23}%)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div>
                    <span className="font-medium text-slate-600">Tipo:</span>{' '}
                    {TIPOS_TRABALHO[o.tipoTrabalho] ?? o.tipoTrabalho}
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Metragem:</span> {o.metragem.toFixed(1)} m²
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Data:</span>{' '}
                    {new Date(o.data).toLocaleDateString('pt-PT')}
                  </div>
                  {o.enderecoObra && (
                    <div className="col-span-3 truncate">
                      <span className="font-medium text-slate-600">Obra:</span> {o.enderecoObra}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3 pb-3 flex gap-2 flex-wrap">
                <button onClick={() => onViewOrcamento(o)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Ver
                </button>
                {o.status === 'rascunho' && (
                  <button onClick={() => onEditOrcamento(o)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Editar
                  </button>
                )}
                <button
                  onClick={() => { setEditingId(o.id); setNovoNome(o.nome); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Renomear
                </button>
                <button onClick={() => handleDelete(o.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
