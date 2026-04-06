'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Cliente } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide';
const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

const empty = (): Cliente => ({ id: '', nome: '', nif: '', morada: '', telefone: '', email: '' });

export default function ClientePanel() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useStore();
  const [form, setForm] = useState<Cliente>(empty());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const setF = (k: keyof Cliente, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.nome.trim()) return;
    if (editingId) {
      updateCliente(editingId, form);
    } else {
      addCliente({ ...form, id: uuidv4() });
    }
    setForm(empty());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (c: Cliente) => {
    setForm(c);
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Eliminar este cliente?')) deleteCliente(id);
  };

  const filtered = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.nif.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
          <p className="text-slate-500 text-sm mt-0.5">{clientes.length} clientes guardados</p>
        </div>
        <button
          onClick={() => { setForm(empty()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Cliente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            {editingId ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Nome / Empresa *</label>
              <input className={inputCls} value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Nome completo ou razão social" />
            </div>
            <div>
              <label className={labelCls}>NIF</label>
              <input className={inputCls} value={form.nif} onChange={(e) => setF('nif', e.target.value)} placeholder="123 456 789" />
            </div>
            <div>
              <label className={labelCls}>Telefone</label>
              <input className={inputCls} value={form.telefone} onChange={(e) => setF('telefone', e.target.value)} placeholder="9XX XXX XXX" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} value={form.email} onChange={(e) => setF('email', e.target.value)} placeholder="email@exemplo.pt" />
            </div>
            <div>
              <label className={labelCls}>Morada</label>
              <input className={inputCls} value={form.morada} onChange={(e) => setF('morada', e.target.value)} placeholder="Rua, código postal, localidade" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              {editingId ? 'Guardar Alterações' : 'Adicionar Cliente'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {clientes.length > 0 && (
        <div className="mb-4">
          <input
            className={inputCls}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, NIF ou email..."
          />
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-slate-400 font-medium">
            {clientes.length === 0 ? 'Nenhum cliente ainda' : 'Nenhum resultado'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{c.nome}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                  {c.nif && <span>NIF: <strong className="text-slate-700">{c.nif}</strong></span>}
                  {c.telefone && <span>{c.telefone}</span>}
                  {c.email && <span>{c.email}</span>}
                  {c.morada && <span className="truncate max-w-xs">{c.morada}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(c)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
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
