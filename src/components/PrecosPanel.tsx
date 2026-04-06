'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Material, CategoriaMateria, ConsumoItem, TIPOS_TRABALHO } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide';
const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';
const sectionCls = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5';

const CATEGORIAS: CategoriaMateria[] = ['Placas', 'Perfis', 'Fixações', 'Acabamentos', 'Isolamento', 'Outro'];

const emptyMat = (): Material => ({ id: '', nome: '', unidade: 'm2', preco: 0, categoria: 'Placas' });

export default function PrecosPanel() {
  const { precosConfig, setPrecosConfig, addMaterial, updateMaterial, removeMaterial, setRendimentos, resetRendimentos } = useStore();
  const [showMatForm, setShowMatForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [matForm, setMatForm] = useState<Material>(emptyMat());

  // Rendimentos state
  const [rendTipo, setRendTipo] = useState(Object.keys(TIPOS_TRABALHO)[0]);
  const [rendEditIdx, setRendEditIdx] = useState<number | null>(null);
  const [rendMatId, setRendMatId] = useState(precosConfig.materiais[0]?.id ?? '');
  const [rendQty, setRendQty] = useState(1);
  const [rendResetDone, setRendResetDone] = useState(false);
  const [filterCat, setFilterCat] = useState<CategoriaMateria | 'Todos'>('Todos');
  const [saved, setSaved] = useState(false);

  const setC = (k: string, v: string | number) =>
    setPrecosConfig({ ...precosConfig, [k]: v });

  const handleSaveMat = () => {
    if (!matForm.nome || matForm.preco <= 0) return;
    if (editingId) {
      updateMaterial(editingId, matForm);
    } else {
      addMaterial(matForm);
    }
    setShowMatForm(false);
    setEditingId(null);
    setMatForm(emptyMat());
  };

  const handleEditMat = (m: Material) => {
    setMatForm(m);
    setEditingId(m.id);
    setShowMatForm(true);
  };

  const handleSaveEmpresa = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = precosConfig.materiais.filter(
    (m) => filterCat === 'Todos' || m.categoria === filterCat
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-slate-500 text-sm mt-0.5">Dados da empresa, preços e catálogo de materiais</p>
      </div>

      {/* Empresa */}
      <div className={sectionCls}>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Dados da Empresa / Prestador</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nome / Empresa</label>
            <input className={inputCls} value={precosConfig.nomeEmpresa} onChange={(e) => setC('nomeEmpresa', e.target.value)} placeholder="Nome ou razão social" />
          </div>
          <div>
            <label className={labelCls}>NIF</label>
            <input className={inputCls} value={precosConfig.nif} onChange={(e) => setC('nif', e.target.value)} placeholder="123 456 789" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Morada</label>
            <input className={inputCls} value={precosConfig.morada} onChange={(e) => setC('morada', e.target.value)} placeholder="Rua, código postal, localidade" />
          </div>
          <div>
            <label className={labelCls}>Telefone</label>
            <input className={inputCls} value={precosConfig.telefone} onChange={(e) => setC('telefone', e.target.value)} placeholder="9XX XXX XXX" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={precosConfig.email} onChange={(e) => setC('email', e.target.value)} placeholder="email@empresa.pt" />
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={handleSaveEmpresa}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
          >
            {saved ? 'Guardado!' : 'Guardar Dados'}
          </button>
        </div>
      </div>

      {/* Preços base */}
      <div className={sectionCls}>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Preços Base</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Mão-de-obra (€/m²)</label>
            <input type="number" step="0.01" min="0" className={inputCls}
              value={precosConfig.precoMaoDeObra}
              onChange={(e) => setC('precoMaoDeObra', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelCls}>Margem de Lucro (%)</label>
            <input type="number" step="0.1" min="0" max="100" className={inputCls}
              value={precosConfig.margem}
              onChange={(e) => setC('margem', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelCls}>Deslocamento (€/km)</label>
            <input type="number" step="0.01" min="0" className={inputCls}
              value={precosConfig.precoKmDeslocamento}
              onChange={(e) => setC('precoKmDeslocamento', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelCls}>Dimensão Padrão Placa (m²)</label>
            <input type="number" step="0.01" min="0" className={inputCls}
              value={precosConfig.dimensaoPadraoPlaca}
              onChange={(e) => setC('dimensaoPadraoPlaca', parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {/* Materiais */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">Catálogo de Materiais ({precosConfig.materiais.length})</h3>
          <button
            onClick={() => { setMatForm(emptyMat()); setEditingId(null); setShowMatForm(true); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Material
          </button>
        </div>

        {showMatForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-700">{editingId ? 'Editar' : 'Novo'} Material</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Nome</label>
                <input className={inputCls} value={matForm.nome} onChange={(e) => setMatForm({ ...matForm, nome: e.target.value })} placeholder="Nome do material" />
              </div>
              <div>
                <label className={labelCls}>Categoria</label>
                <select className={inputCls} value={matForm.categoria} onChange={(e) => setMatForm({ ...matForm, categoria: e.target.value as CategoriaMateria })}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Unidade</label>
                <select className={inputCls} value={matForm.unidade} onChange={(e) => setMatForm({ ...matForm, unidade: e.target.value })}>
                  <option value="m2">m²</option>
                  <option value="m">m (linear)</option>
                  <option value="un">Unidade</option>
                  <option value="cx">Caixa</option>
                  <option value="kg">kg</option>
                  <option value="balde">Balde</option>
                  <option value="rolo">Rolo</option>
                  <option value="saco">Saco</option>
                  <option value="L">Litro (L)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Preço (€/{matForm.unidade})</label>
                <input type="number" step="0.01" min="0" className={inputCls}
                  value={matForm.preco || ''}
                  onChange={(e) => setMatForm({ ...matForm, preco: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveMat} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                {editingId ? 'Guardar' : 'Adicionar'}
              </button>
              <button onClick={() => { setShowMatForm(false); setEditingId(null); }} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg text-sm border border-slate-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-3">
          {(['Todos', ...CATEGORIAS] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${filterCat === cat ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Nenhum material nesta categoria.</p>
          ) : (
            filtered.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{m.nome}</p>
                  <p className="text-xs text-slate-500">
                    <span className="inline-block bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 mr-2 text-[10px] font-semibold">{m.categoria}</span>
                    {m.preco.toFixed(2)}€ / {m.unidade}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button onClick={() => handleEditMat(m)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors">
                    Editar
                  </button>
                  <button onClick={() => removeMaterial(m.id)} className="text-xs font-semibold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors">
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rendimentos por tipo de trabalho */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Rendimentos por Tipo de Trabalho</h3>
            <p className="text-xs text-slate-400 mt-0.5">Consumo automático de materiais por m² — usado no botão "Auto-calcular"</p>
          </div>
          <button
            onClick={() => {
              resetRendimentos();
              setRendResetDone(true);
              setTimeout(() => setRendResetDone(false), 2000);
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${rendResetDone ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            {rendResetDone ? 'Reposto!' : 'Restaurar Predefinições'}
          </button>
        </div>

        {/* Tipo selector */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(TIPOS_TRABALHO).map(([k, v]) => {
            const count = precosConfig.rendimentos?.[k]?.length ?? 0;
            return (
              <button
                key={k}
                onClick={() => { setRendTipo(k); setRendEditIdx(null); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${rendTipo === k ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {v.replace(' em Pladur', '').replace(' (Hidrófuga)', '')}
                {count > 0 && <span className={`ml-1.5 px-1 rounded text-[10px] font-bold ${rendTipo === k ? 'bg-blue-400 text-white' : 'bg-slate-300 text-slate-600'}`}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Consumo table for selected tipo */}
        {(() => {
          const consumos: ConsumoItem[] = precosConfig.rendimentos?.[rendTipo] ?? [];
          return (
            <div className="space-y-1">
              {consumos.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-3">Nenhum rendimento configurado para este tipo.</p>
              )}
              {consumos.length > 0 && (
                <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 px-2 pb-1 uppercase tracking-wide">
                  <div className="col-span-6">Material</div>
                  <div className="col-span-2 text-right">Un.</div>
                  <div className="col-span-3 text-right">Qtd / m²</div>
                  <div className="col-span-1"></div>
                </div>
              )}
              {consumos.map((c, idx) => {
                const mat = precosConfig.materiais.find((m) => m.id === c.materialId);
                if (!mat) return null;
                return (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                    {rendEditIdx === idx ? (
                      <>
                        <div className="col-span-6">
                          <select
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-900 bg-white"
                            value={rendMatId}
                            onChange={(e) => setRendMatId(e.target.value)}
                          >
                            {precosConfig.materiais.map((m) => (
                              <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 text-center text-xs text-slate-500">
                          {precosConfig.materiais.find(m => m.id === rendMatId)?.unidade}
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number" step="0.001" min="0"
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-900 bg-white text-right"
                            value={rendQty}
                            onChange={(e) => setRendQty(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-1 flex gap-1 justify-end">
                          <button
                            onClick={() => {
                              const novo = consumos.map((item, i) =>
                                i === idx ? { materialId: rendMatId, rendimento: rendQty } : item
                              );
                              setRendimentos(rendTipo, novo);
                              setRendEditIdx(null);
                            }}
                            className="text-green-600 font-bold text-xs"
                          >✓</button>
                          <button onClick={() => setRendEditIdx(null)} className="text-slate-400 text-xs">✕</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-6 text-xs text-slate-800 font-medium leading-tight">{mat.nome}</div>
                        <div className="col-span-2 text-right text-xs text-slate-500">{mat.unidade}</div>
                        <div className="col-span-3 text-right text-xs font-semibold text-slate-700">{c.rendimento}</div>
                        <div className="col-span-1 flex gap-1 justify-end">
                          <button
                            onClick={() => { setRendEditIdx(idx); setRendMatId(c.materialId); setRendQty(c.rendimento); }}
                            className="text-slate-400 hover:text-blue-600 text-xs"
                          >✎</button>
                          <button
                            onClick={() => setRendimentos(rendTipo, consumos.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 text-xs"
                          >×</button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Add new row */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                <select
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                  value={rendMatId}
                  onChange={(e) => setRendMatId(e.target.value)}
                >
                  {precosConfig.materiais.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome} ({m.unidade})</option>
                  ))}
                </select>
                <input
                  type="number" step="0.001" min="0"
                  placeholder="Qtd/m²"
                  className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white text-right"
                  value={rendQty || ''}
                  onChange={(e) => setRendQty(parseFloat(e.target.value) || 0)}
                />
                <button
                  onClick={() => {
                    if (!rendMatId || rendQty <= 0) return;
                    const novoConsumo: ConsumoItem = { materialId: rendMatId, rendimento: rendQty };
                    setRendimentos(rendTipo, [...consumos, novoConsumo]);
                    setRendQty(0);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Adicionar
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
