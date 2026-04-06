'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Material } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function PrecosPanel() {
  const { precosConfig, setPrecosConfig, addMaterial, updateMaterial, removeMaterial } =
    useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Material>({
    id: '',
    nome: '',
    unidade: 'm2',
    preco: 0,
  });

  const handleAddMaterial = () => {
    setEditingId(null);
    setFormData({ id: uuidv4(), nome: '', unidade: 'm2', preco: 0 });
    setShowForm(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingId(material.id);
    setFormData(material);
    setShowForm(true);
  };

  const handleSaveMaterial = () => {
    if (!formData.nome || formData.preco <= 0) {
      alert('Por favor preencha todos os campos corretamente');
      return;
    }

    if (editingId) {
      updateMaterial(editingId, formData);
    } else {
      addMaterial(formData);
    }

    setShowForm(false);
    setFormData({ id: '', nome: '', unidade: 'm2', preco: 0 });
  };

  const handleChangePrecosConfig = (field: string, value: any) => {
    setPrecosConfig({
      ...precosConfig,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Configuração de Preços</h2>

      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dimensão Padrão da Placa (m²)
          </label>
          <input
            type="number"
            step="0.01"
            value={precosConfig.dimensaoPadraoPlaca}
            onChange={(e) =>
              handleChangePrecosConfig('dimensaoPadraoPlaca', parseFloat(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preço Mão-de-Obra (€/m²)
            </label>
            <input
              type="number"
              step="0.01"
              value={precosConfig.precoMaoDeObra}
              onChange={(e) =>
                handleChangePrecosConfig('precoMaoDeObra', parseFloat(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Margem de Lucro (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={precosConfig.margem}
              onChange={(e) => handleChangePrecosConfig('margem', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preço Deslocamento (€/km)
            </label>
            <input
              type="number"
              step="0.01"
              value={precosConfig.precoKmDeslocamento}
              onChange={(e) =>
                handleChangePrecosConfig('precoKmDeslocamento', parseFloat(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800">Materiais</h3>

      <div className="mb-4">
        <button
          onClick={handleAddMaterial}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          + Adicionar Material
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-300">
          <h4 className="font-semibold mb-3 text-gray-700">
            {editingId ? 'Editar' : 'Novo'} Material
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome do Material"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />
            <select
              value={formData.unidade}
              onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            >
              <option value="m2">m²</option>
              <option value="m">m</option>
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="unidade">Unidade</option>
            </select>
            <input
              type="number"
              placeholder="Preço"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveMaterial}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {precosConfig.materiais.map((material) => (
          <div
            key={material.id}
            className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-300"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{material.nome}</p>
              <p className="text-sm text-gray-600">
                {material.preco.toFixed(2)}€ / {material.unidade}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditMaterial(material)}
                className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => removeMaterial(material.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
