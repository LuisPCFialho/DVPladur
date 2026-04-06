'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Orcamento } from '@/types';

export default function ListaOrcamentos({
  onViewOrcamento,
  onEditOrcamento,
}: {
  onViewOrcamento: (orcamento: Orcamento) => void;
  onEditOrcamento: (orcamento: Orcamento) => void;
}) {
  const { orcamentos, deleteOrcamento, renomearOrcamento } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');

  const handleRenomear = (id: string) => {
    if (novoNome.trim()) {
      renomearOrcamento(id, novoNome);
      setEditingId(null);
      setNovoNome('');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem a certeza que quer eliminar este orçamento?')) {
      deleteOrcamento(id);
    }
  };

  const rascunhos = orcamentos.filter((o) => o.status === 'rascunho');
  const finalizados = orcamentos.filter((o) => o.status === 'finalizado');

  const renderOrcamentoItem = (orcamento: Orcamento) => (
    <div
      key={orcamento.id}
      className="bg-gray-50 p-4 rounded-lg border border-gray-300 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {editingId === orcamento.id ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={() => handleRenomear(orcamento.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                OK
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg text-gray-800">{orcamento.nome}</h3>
              <p className="text-sm text-gray-600">Cliente: {orcamento.cliente}</p>
            </>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-semibold ${
            orcamento.status === 'rascunho'
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {orcamento.status === 'rascunho' ? 'Rascunho' : 'Finalizado'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div>
          <p>Metragem: {orcamento.metragem.toFixed(2)} m²</p>
          <p>Tipo: {orcamento.tipoTrabalho}</p>
        </div>
        <div>
          <p>Data: {new Date(orcamento.data).toLocaleDateString('pt-PT')}</p>
          <p>Endereço: {orcamento.endereco}</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded mb-4 border border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Antes de Margem</p>
            <p className="font-bold">{orcamento.precoAntesDaMargemLucro.toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-gray-600">Lucro ({orcamento.percentagemMargemLucro}%)</p>
            <p className="font-bold text-green-600">{orcamento.valorLucrado.toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-gray-600">Preço Cliente</p>
            <p className="font-bold text-blue-600">{orcamento.precoLiquidoCliente.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewOrcamento(orcamento)}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition text-sm"
        >
          Ver Detalhes
        </button>
        <button
          onClick={() => onEditOrcamento(orcamento)}
          className="flex-1 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 transition text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => {
            setEditingId(orcamento.id);
            setNovoNome(orcamento.nome);
          }}
          className="bg-amber-500 text-white px-3 py-2 rounded hover:bg-amber-600 transition text-sm"
        >
          Renomear
        </button>
        <button
          onClick={() => handleDelete(orcamento.id)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Orçamentos</h2>

      {rascunhos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-yellow-700">Rascunhos ({rascunhos.length})</h3>
          <div className="space-y-4">{rascunhos.map(renderOrcamentoItem)}</div>
        </div>
      )}

      {finalizados.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-green-700">
            Finalizados ({finalizados.length})
          </h3>
          <div className="space-y-4">{finalizados.map(renderOrcamentoItem)}</div>
        </div>
      )}

      {orcamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum orçamento criado ainda</p>
        </div>
      )}
    </div>
  );
}
