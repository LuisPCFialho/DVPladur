'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Orcamento, ItemOrcamento, TIPOS_TRABALHO } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide';
const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';
const sectionCls = 'bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3';

export default function NovoOrcamento({
  onClose,
  onSave,
  orcamentoExistente,
}: {
  onClose: () => void;
  onSave: (orcamento: Orcamento) => void;
  orcamentoExistente?: Orcamento | null;
}) {
  const { precosConfig, clientes, nextNumeroOrcamento } = useStore();

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    nome: orcamentoExistente?.nome ?? '',
    clienteId: orcamentoExistente?.clienteId ?? '',
    cliente: orcamentoExistente?.cliente ?? '',
    nifCliente: orcamentoExistente?.nifCliente ?? '',
    telefoneCliente: orcamentoExistente?.telefoneCliente ?? '',
    emailCliente: orcamentoExistente?.emailCliente ?? '',
    enderecoObra: orcamentoExistente?.enderecoObra ?? '',
    data: orcamentoExistente?.data ?? new Date().toISOString().split('T')[0],
    validadeAte: orcamentoExistente?.validadeAte ?? addDays(30),
    prazoExecucao: orcamentoExistente?.prazoExecucao ?? '',
    metragem: orcamentoExistente?.metragem ?? 0,
    tipoTrabalho: orcamentoExistente?.tipoTrabalho ?? 'divisoria',
    fatorDesperdicio: orcamentoExistente?.fatorDesperdicio ?? 10,
    taxaIVA: orcamentoExistente?.taxaIVA ?? 6,
    deslocamento: orcamentoExistente?.deslocamento ?? 0,
    notas: orcamentoExistente?.notas ?? '',
  });

  const [itens, setItens] = useState<ItemOrcamento[]>(orcamentoExistente?.itens ?? []);
  const [selMat, setSelMat] = useState(precosConfig.materiais[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [showAddItem, setShowAddItem] = useState(false);
  const [err, setErr] = useState('');

  const setF = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleAutoCalc = () => {
    const consumos = precosConfig.rendimentos?.[form.tipoTrabalho];
    if (!consumos || consumos.length === 0 || form.metragem <= 0) return;
    const fator = 1 + (form.fatorDesperdicio || 0) / 100;
    const novosItens: ItemOrcamento[] = consumos
      .map((c) => {
        const mat = precosConfig.materiais.find((m) => m.id === c.materialId);
        if (!mat) return null;
        const qtd = Math.ceil(c.rendimento * form.metragem * fator * 100) / 100;
        return {
          id: uuidv4(),
          materialId: mat.id,
          descricao: mat.nome,
          unidade: mat.unidade,
          quantidade: qtd,
          preco: mat.preco,
          subtotal: mat.preco * qtd,
        } as ItemOrcamento;
      })
      .filter(Boolean) as ItemOrcamento[];
    if (itens.length > 0 && !confirm('Substituir os materiais actuais pelo cálculo automático?')) return;
    setItens(novosItens);
  };

  const hasRendimentos = !!(precosConfig.rendimentos?.[form.tipoTrabalho]?.length);

  const handleClienteSelect = (id: string) => {
    if (!id) {
      setF('clienteId', '');
      return;
    }
    const c = clientes.find((c) => c.id === id);
    if (c) {
      setForm((f) => ({
        ...f,
        clienteId: c.id,
        cliente: c.nome,
        nifCliente: c.nif,
        telefoneCliente: c.telefone,
        emailCliente: c.email,
      }));
    }
  };

  const handleAddItem = () => {
    const mat = precosConfig.materiais.find((m) => m.id === selMat);
    if (!mat || qty <= 0) return;
    const item: ItemOrcamento = {
      id: uuidv4(),
      materialId: mat.id,
      descricao: mat.nome,
      unidade: mat.unidade,
      quantidade: qty,
      preco: mat.preco,
      subtotal: mat.preco * qty,
    };
    setItens((prev) => [...prev, item]);
    setQty(1);
    setShowAddItem(false);
  };

  const calcular = () => {
    const subtotalMateriais = itens.reduce((s, i) => s + i.subtotal, 0);
    const maoDeObraTotal = form.metragem * precosConfig.precoMaoDeObra;
    const custoDeslocamento = form.deslocamento * precosConfig.precoKmDeslocamento;
    const precoAntesDaMargemLucro = subtotalMateriais + maoDeObraTotal + custoDeslocamento;
    const valorLucrado = (precoAntesDaMargemLucro * precosConfig.margem) / 100;
    const precoSemIVA = precoAntesDaMargemLucro + valorLucrado;
    const valorIVA = (precoSemIVA * form.taxaIVA) / 100;
    const precoComIVA = precoSemIVA + valorIVA;
    return {
      subtotalMateriais, maoDeObraTotal, custoDeslocamento,
      precoAntesDaMargemLucro, valorLucrado, precoSemIVA, valorIVA, precoComIVA,
    };
  };

  const handleSave = () => {
    if (!form.nome) { setErr('Indique um nome para o orçamento.'); return; }
    if (!form.cliente) { setErr('Indique o nome do cliente.'); return; }
    if (form.metragem <= 0) { setErr('Indique a metragem da obra.'); return; }
    if (itens.length === 0) { setErr('Adicione pelo menos um material.'); return; }
    setErr('');

    const totais = calcular();
    const numero = orcamentoExistente?.numero ?? nextNumeroOrcamento();

    const orcamento: Orcamento = {
      id: orcamentoExistente?.id ?? uuidv4(),
      numero,
      nome: form.nome,
      clienteId: form.clienteId || null,
      cliente: form.cliente,
      nifCliente: form.nifCliente,
      telefoneCliente: form.telefoneCliente,
      emailCliente: form.emailCliente,
      enderecoObra: form.enderecoObra,
      data: form.data,
      validadeAte: form.validadeAte,
      prazoExecucao: form.prazoExecucao,
      metragem: form.metragem,
      tipoTrabalho: form.tipoTrabalho,
      fatorDesperdicio: form.fatorDesperdicio,
      taxaIVA: form.taxaIVA,
      itens,
      maoDeObraTotal: totais.maoDeObraTotal,
      deslocamento: form.deslocamento,
      custoDeslocamento: totais.custoDeslocamento,
      subtotalMateriais: totais.subtotalMateriais,
      precoAntesDaMargemLucro: totais.precoAntesDaMargemLucro,
      percentagemMargemLucro: precosConfig.margem,
      valorLucrado: totais.valorLucrado,
      precoSemIVA: totais.precoSemIVA,
      valorIVA: totais.valorIVA,
      precoComIVA: totais.precoComIVA,
      precoLiquidoCliente: totais.precoComIVA,
      status: orcamentoExistente?.status ?? 'rascunho',
      notas: form.notas,
      criadoEm: orcamentoExistente?.criadoEm ?? new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    onSave(orcamento);
  };

  const t = calcular();
  const matSel = precosConfig.materiais.find((m) => m.id === selMat);
  const categorias = [...new Set(precosConfig.materiais.map((m) => m.categoria))];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {orcamentoExistente ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            {orcamentoExistente && (
              <p className="text-xs text-slate-500 mt-0.5">{orcamentoExistente.numero}</p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Info básica */}
              <div className={sectionCls}>
                <h3 className="text-sm font-bold text-slate-700 pb-1 border-b border-slate-200">Informação do Orçamento</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Nome do Orçamento</label>
                    <input className={inputCls} value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Moradia Rua das Flores" />
                  </div>
                  <div>
                    <label className={labelCls}>Data</label>
                    <input type="date" className={inputCls} value={form.data} onChange={(e) => setF('data', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Válido até</label>
                    <input type="date" className={inputCls} value={form.validadeAte} onChange={(e) => setF('validadeAte', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Prazo de Execução</label>
                    <input className={inputCls} value={form.prazoExecucao} onChange={(e) => setF('prazoExecucao', e.target.value)} placeholder="Ex: 5 dias úteis" />
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className={sectionCls}>
                <h3 className="text-sm font-bold text-slate-700 pb-1 border-b border-slate-200">Cliente</h3>
                {clientes.length > 0 && (
                  <div>
                    <label className={labelCls}>Selecionar cliente guardado</label>
                    <select
                      className={inputCls}
                      value={form.clienteId}
                      onChange={(e) => handleClienteSelect(e.target.value)}
                    >
                      <option value="">— Selecionar ou preencher manualmente —</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome} (NIF: {c.nif})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Nome do Cliente *</label>
                    <input className={inputCls} value={form.cliente} onChange={(e) => setF('cliente', e.target.value)} placeholder="Nome completo ou empresa" />
                  </div>
                  <div>
                    <label className={labelCls}>NIF do Cliente</label>
                    <input className={inputCls} value={form.nifCliente} onChange={(e) => setF('nifCliente', e.target.value)} placeholder="123 456 789" />
                  </div>
                  <div>
                    <label className={labelCls}>Telefone</label>
                    <input className={inputCls} value={form.telefoneCliente} onChange={(e) => setF('telefoneCliente', e.target.value)} placeholder="9XX XXX XXX" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input className={inputCls} value={form.emailCliente} onChange={(e) => setF('emailCliente', e.target.value)} placeholder="email@exemplo.pt" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Morada da Obra (para IVA 6%)</label>
                    <input className={inputCls} value={form.enderecoObra} onChange={(e) => setF('enderecoObra', e.target.value)} placeholder="Rua, número, código postal, localidade" />
                  </div>
                </div>
              </div>

              {/* Obra */}
              <div className={sectionCls}>
                <h3 className="text-sm font-bold text-slate-700 pb-1 border-b border-slate-200">Detalhes da Obra</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Tipo de Trabalho *</label>
                    <select className={inputCls} value={form.tipoTrabalho} onChange={(e) => setF('tipoTrabalho', e.target.value)}>
                      {Object.entries(TIPOS_TRABALHO).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Metragem (m²) *</label>
                    <input type="number" step="0.01" min="0" className={inputCls} value={form.metragem || ''} onChange={(e) => setF('metragem', parseFloat(e.target.value) || 0)} placeholder="0.00" />
                  </div>
                  <div>
                    <label className={labelCls}>Fator Desperdício (%)</label>
                    <input type="number" step="1" min="0" max="30" className={inputCls} value={form.fatorDesperdicio} onChange={(e) => setF('fatorDesperdicio', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>Taxa IVA</label>
                    <select className={inputCls} value={form.taxaIVA} onChange={(e) => setF('taxaIVA', parseInt(e.target.value))}>
                      <option value={6}>6% — Reabilitação Habitação (Lista I CIVA)</option>
                      <option value={23}>23% — Taxa Normal / Obra Nova</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Deslocamento (km)</label>
                    <input type="number" step="0.1" min="0" className={inputCls} value={form.deslocamento || ''} onChange={(e) => setF('deslocamento', parseFloat(e.target.value) || 0)} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Notas / Observações</label>
                  <textarea className={`${inputCls} resize-none`} rows={2} value={form.notas} onChange={(e) => setF('notas', e.target.value)} placeholder="Condições especiais, observações..." />
                </div>
              </div>

              {/* Materiais */}
              <div className={sectionCls}>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-700">Materiais</h3>
                  <div className="flex items-center gap-2">
                    {hasRendimentos && form.metragem > 0 && (
                      <button
                        onClick={handleAutoCalc}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200"
                        title={`Calcular automaticamente para ${form.metragem} m²`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M12 7h.01M15 7h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                        Auto-calcular ({form.metragem} m²)
                      </button>
                    )}
                    <button
                      onClick={() => setShowAddItem(!showAddItem)}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>

                {showAddItem && (
                  <div className="bg-white rounded-lg border border-blue-200 p-3 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className={labelCls}>Material</label>
                        <select className={inputCls} value={selMat} onChange={(e) => setSelMat(e.target.value)}>
                          {categorias.map((cat) => (
                            <optgroup key={cat} label={cat}>
                              {precosConfig.materiais
                                .filter((m) => m.categoria === cat)
                                .map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.nome} ({m.preco.toFixed(2)}€/{m.unidade})
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Qtd ({matSel?.unidade})</label>
                        <input type="number" step="0.01" min="0.01" className={inputCls} value={qty} onChange={(e) => setQty(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    {matSel && (
                      <p className="text-xs text-slate-500">
                        Subtotal: <strong>{(matSel.preco * qty).toFixed(2)}€</strong>
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={handleAddItem} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
                        Adicionar
                      </button>
                      <button onClick={() => setShowAddItem(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {itens.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Nenhum material adicionado</p>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-2 pb-1">
                      <div className="col-span-5">Material</div>
                      <div className="col-span-2 text-right">Qtd</div>
                      <div className="col-span-2 text-right">P.Unit.</div>
                      <div className="col-span-2 text-right">Total</div>
                      <div className="col-span-1"></div>
                    </div>
                    {itens.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg px-2 py-2 border border-slate-100 text-sm">
                        <div className="col-span-5 text-slate-800 font-medium text-xs leading-tight">{item.descricao}</div>
                        <div className="col-span-2 text-right text-slate-600 text-xs">{item.quantidade} {item.unidade}</div>
                        <div className="col-span-2 text-right text-slate-600 text-xs">{item.preco.toFixed(2)}€</div>
                        <div className="col-span-2 text-right font-semibold text-slate-800 text-xs">{item.subtotal.toFixed(2)}€</div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => setItens((prev) => prev.filter((i) => i.id !== item.id))} className="text-red-400 hover:text-red-600">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Resumo */}
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-xl p-4 text-white sticky top-0">
                <h3 className="text-sm font-bold text-slate-300 mb-3 pb-2 border-b border-slate-700">Resumo do Orçamento</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Materiais</span>
                    <span className="text-white">{t.subtotalMateriais.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mão-de-obra</span>
                    <span className="text-white">{t.maoDeObraTotal.toFixed(2)}€</span>
                  </div>
                  {form.deslocamento > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Deslocamento</span>
                      <span className="text-white">{t.custoDeslocamento.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-300">
                    <span>Custo total</span>
                    <span>{t.precoAntesDaMargemLucro.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Margem ({precosConfig.margem}%)</span>
                    <span>+{t.valorLucrado.toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-200 font-semibold">
                    <span>Subtotal s/ IVA</span>
                    <span>{t.precoSemIVA.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IVA ({form.taxaIVA}%)</span>
                    <span>{t.valorIVA.toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2 mt-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-300 text-sm">Total c/ IVA</span>
                      <span className="text-2xl font-bold text-white">{t.precoComIVA.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>

              {form.taxaIVA === 6 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold">IVA 6% — Verba 2.27</p>
                  <p className="text-xs text-blue-600 mt-1">Taxa reduzida ao abrigo da Lista I anexa ao CIVA — obras de reabilitação de imóveis habitacionais.</p>
                </div>
              )}

              {err && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-700">{err}</p>
                </div>
              )}

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {orcamentoExistente ? 'Guardar Alterações' : 'Criar Orçamento'}
              </button>
              <button
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
