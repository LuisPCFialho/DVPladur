'use client';

import { useStore } from '@/lib/store';
import { Orcamento, TIPOS_TRABALHO } from '@/types';

export default function DetalheOrcamento({
  orcamento,
  onClose,
  onFinalize,
  onEdit,
}: {
  orcamento: Orcamento;
  onClose: () => void;
  onFinalize: (orcamento: Orcamento) => void;
  onEdit: (orcamento: Orcamento) => void;
}) {
  const { precosConfig } = useStore();

  const handleFinalize = () => {
    if (orcamento.status === 'rascunho') {
      onFinalize({ ...orcamento, status: 'finalizado' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tipoLabel = TIPOS_TRABALHO[orcamento.tipoTrabalho] ?? orcamento.tipoTrabalho;
  const dataFmt = (s: string) => {
    try { return new Date(s).toLocaleDateString('pt-PT'); } catch { return s; }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:items-center lg:justify-center lg:p-4 lg:bg-black/60 lg:backdrop-blur-sm">
      <div className="bg-white flex flex-col h-full lg:h-auto lg:rounded-2xl w-full lg:max-w-3xl lg:max-h-[95vh] lg:shadow-2xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 lg:p-4 border-b border-slate-200 print:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${orcamento.status === 'rascunho' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {orcamento.status === 'rascunho' ? 'Rascunho' : 'Finalizado'}
            </span>
            <span className="text-xs text-slate-500 font-mono">{orcamento.numero}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir / PDF
            </button>
            {orcamento.status === 'rascunho' && (
              <button
                onClick={() => onEdit(orcamento)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="flex-1 overflow-auto" id="print-area">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                {precosConfig.nomeEmpresa && (
                  <h1 className="text-xl font-bold text-slate-900">{precosConfig.nomeEmpresa}</h1>
                )}
                {precosConfig.nif && <p className="text-sm text-slate-500">NIF: {precosConfig.nif}</p>}
                {precosConfig.morada && <p className="text-sm text-slate-500">{precosConfig.morada}</p>}
                {precosConfig.telefone && <p className="text-sm text-slate-500">{precosConfig.telefone}</p>}
                {precosConfig.email && <p className="text-sm text-slate-500">{precosConfig.email}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Orçamento</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{orcamento.numero}</p>
                <p className="text-sm text-slate-600">Data: {dataFmt(orcamento.data)}</p>
                {orcamento.validadeAte && (
                  <p className="text-sm text-slate-600">Válido até: {dataFmt(orcamento.validadeAte)}</p>
                )}
              </div>
            </div>

            {/* Client + Work */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 lg:mb-5">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cliente</p>
                <p className="font-bold text-slate-800">{orcamento.cliente}</p>
                {orcamento.nifCliente && <p className="text-sm text-slate-600">NIF: {orcamento.nifCliente}</p>}
                {orcamento.telefoneCliente && <p className="text-sm text-slate-600">{orcamento.telefoneCliente}</p>}
                {orcamento.emailCliente && <p className="text-sm text-slate-600">{orcamento.emailCliente}</p>}
                {orcamento.enderecoObra && (
                  <p className="text-sm text-slate-600 mt-1">{orcamento.enderecoObra}</p>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Obra</p>
                <p className="font-bold text-slate-800">{orcamento.nome}</p>
                <p className="text-sm text-slate-600">Tipo: {tipoLabel}</p>
                <p className="text-sm text-slate-600">Metragem: {orcamento.metragem.toFixed(2)} m²</p>
                {orcamento.prazoExecucao && (
                  <p className="text-sm text-slate-600">Prazo: {orcamento.prazoExecucao}</p>
                )}
                {orcamento.deslocamento > 0 && (
                  <p className="text-sm text-slate-600">Deslocamento: {orcamento.deslocamento} km</p>
                )}
              </div>
            </div>

            {/* Materials */}
            <div className="mb-4 lg:mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Materiais</p>
              {/* Mobile: cards */}
              <div className="sm:hidden space-y-2">
                {orcamento.itens.map((item) => {
                  const mat = precosConfig.materiais.find((m) => m.id === item.materialId);
                  return (
                    <div key={item.id} className="flex items-start justify-between gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-tight">{item.descricao || mat?.nome || '—'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.quantidade} {item.unidade || mat?.unidade} × {item.preco.toFixed(2)}€</p>
                      </div>
                      <span className="text-sm font-bold text-slate-800 flex-shrink-0">{item.subtotal.toFixed(2)}€</span>
                    </div>
                  );
                })}
              </div>
              {/* Desktop: table */}
              <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Descrição</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Qtd</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Un.</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">P.Unit.</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orcamento.itens.map((item) => {
                      const mat = precosConfig.materiais.find((m) => m.id === item.materialId);
                      return (
                        <tr key={item.id} className="bg-white">
                          <td className="px-3 py-2 text-slate-800">{item.descricao || mat?.nome || '—'}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{item.quantidade}</td>
                          <td className="px-3 py-2 text-right text-slate-500">{item.unidade || mat?.unidade}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{item.preco.toFixed(2)}€</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-800">{item.subtotal.toFixed(2)}€</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {orcamento.notas && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Observações</p>
                    <p className="text-sm text-amber-800">{orcamento.notas}</p>
                  </div>
                )}
                {orcamento.taxaIVA === 6 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                    <p className="text-xs text-blue-700 font-semibold">IVA 6% — Verba 2.27 da Lista I anexa ao CIVA</p>
                    <p className="text-xs text-blue-600 mt-1">Taxa reduzida aplicada a obras de reabilitação de imóveis habitacionais.</p>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Materiais</span>
                  <span>{(orcamento.subtotalMateriais ?? orcamento.itens.reduce((s, i) => s + i.subtotal, 0)).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mão-de-obra</span>
                  <span>{orcamento.maoDeObraTotal.toFixed(2)}€</span>
                </div>
                {orcamento.custoDeslocamento > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Deslocamento</span>
                    <span>{orcamento.custoDeslocamento.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Margem ({orcamento.percentagemMargemLucro}%)</span>
                  <span>+{orcamento.valorLucrado.toFixed(2)}€</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-semibold text-slate-800">
                  <span>Subtotal s/ IVA</span>
                  <span>{(orcamento.precoSemIVA ?? orcamento.precoAntesDaMargemLucro + orcamento.valorLucrado).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA ({orcamento.taxaIVA ?? 23}%)</span>
                  <span>{(orcamento.valorIVA ?? 0).toFixed(2)}€</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-slate-800">Total c/ IVA</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {(orcamento.precoComIVA ?? orcamento.precoLiquidoCliente).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 p-4 border-t border-slate-200 print:hidden flex-shrink-0">
          {orcamento.status === 'rascunho' && (
            <button
              onClick={handleFinalize}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Finalizar Orçamento
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
