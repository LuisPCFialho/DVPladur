'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Orcamento, ItemOrcamento } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function NovoOrcamento({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (orcamento: Orcamento) => void;
}) {
  const { precosConfig } = useStore();

  const [formData, setFormData] = useState({
    nome: '',
    cliente: '',
    endereco: '',
    metragem: 0,
    tipoTrabalho: 'revestimento',
    deslocamento: 0,
  });

  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    precosConfig.materiais[0]?.id || ''
  );
  const [quantidadeItem, setQuantidadeItem] = useState(1);

  const handleAddItem = () => {
    const material = precosConfig.materiais.find((m) => m.id === selectedMaterial);
    if (!material) return;

    const novoItem: ItemOrcamento = {
      id: uuidv4(),
      materialId: material.id,
      quantidade: quantidadeItem,
      preco: material.preco,
      subtotal: material.preco * quantidadeItem,
    };

    setItens([...itens, novoItem]);
    setQuantidadeItem(1);
    setShowAddItem(false);
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const calcularTotais = () => {
    const custoMateriais = itens.reduce((sum, item) => sum + item.subtotal, 0);
    const maoDeObraTotal = formData.metragem * precosConfig.precoMaoDeObra;
    const custoDeslocamento = formData.deslocamento * precosConfig.precoKmDeslocamento;

    const precoAntesDaMargemLucro = custoMateriais + maoDeObraTotal + custoDeslocamento;
    const valorLucrado = (precoAntesDaMargemLucro * precosConfig.margem) / 100;
    const precoLiquidoCliente = precoAntesDaMargemLucro + valorLucrado;

    return {
      custoMateriais,
      maoDeObraTotal,
      custoDeslocamento,
      precoAntesDaMargemLucro,
      valorLucrado,
      precoLiquidoCliente,
    };
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cliente || formData.metragem <= 0 || itens.length === 0) {
      alert('Por favor preencha todos os campos e adicione pelo menos um material');
      return;
    }

    const totais = calcularTotais();

    const orcamento: Orcamento = {
      id: uuidv4(),
      nome: formData.nome,
      cliente: formData.cliente,
      endereco: formData.endereco,
      data: new Date().toISOString().split('T')[0],
      metragem: formData.metragem,
      tipoTrabalho: formData.tipoTrabalho,
      itens,
      maoDeObraTotal: totais.maoDeObraTotal,
      deslocamento: formData.deslocamento,
      custoDeslocamento: totais.custoDeslocamento,
      precoAntesDaMargemLucro: totais.precoAntesDaMargemLucro,
      percentagemMargemLucro: precosConfig.margem,
      valorLucrado: totais.valorLucrado,
      precoLiquidoCliente: totais.precoLiquidoCliente,
      status: 'rascunho',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    onSave(orcamento);
  };

  const totais = calcularTotais();
  const materialSelecionado = precosConfig.materiais.find((m) => m.id === selectedMaterial);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Novo Orçamento</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nome do Orçamento"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Nome do Cliente"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="Metragem (m²)"
            step="0.01"
            value={formData.metragem}
            onChange={(e) => setFormData({ ...formData, metragem: parseFloat(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
          />
          <select
            value={formData.tipoTrabalho}
            onChange={(e) => setFormData({ ...formData, tipoTrabalho: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
          >
            <option value="revestimento">Revestimento</option>
            <option value="forro">Forro</option>
            <option value="cofagem">Cofragem</option>
            <option value="divisoria">Divisória Interior</option>
            <option value="parede-exterior">Parede Exterior</option>
            <option value="humidade">Parede com Humidade</option>
          </select>
          <input
            type="number"
            placeholder="Deslocamento (km)"
            step="0.1"
            value={formData.deslocamento}
            onChange={(e) => setFormData({ ...formData, deslocamento: parseFloat(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
          />
        </div>

        <h3 className="text-lg font-bold mb-4 text-gray-800">Materiais</h3>

        {!showAddItem ? (
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mb-4"
          >
            + Adicionar Material
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-300">
            <div className="space-y-3">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                {precosConfig.materiais.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} ({m.preco.toFixed(2)}€/{m.unidade})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantidade"
                min="0.01"
                step="0.01"
                value={quantidadeItem}
                onChange={(e) => setQuantidadeItem(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              />
              {materialSelecionado && (
                <p className="text-sm text-gray-600">
                  Subtotal: {(materialSelecionado.preco * quantidadeItem).toFixed(2)}€
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleAddItem}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {itens.map((item) => {
            const material = precosConfig.materiais.find((m) => m.id === item.materialId);
            return (
              <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{material?.nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantidade} {material?.unidade} x {item.preco.toFixed(2)}€ ={' '}
                      {item.subtotal.toFixed(2)}€
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-300">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Mão-de-obra:</p>
              <p className="font-bold text-lg">{totais.maoDeObraTotal.toFixed(2)}€</p>
            </div>
            <div>
              <p className="text-gray-600">Deslocamento:</p>
              <p className="font-bold text-lg">{totais.custoDeslocamento.toFixed(2)}€</p>
            </div>
            <div>
              <p className="text-gray-600">Total Antes de Margem:</p>
              <p className="font-bold text-lg">{totais.precoAntesDaMargemLucro.toFixed(2)}€</p>
            </div>
            <div>
              <p className="text-gray-600">Valor Lucrado ({precosConfig.margem}%):</p>
              <p className="font-bold text-lg text-green-600">{totais.valorLucrado.toFixed(2)}€</p>
            </div>
            <div className="col-span-2 pt-4 border-t border-blue-300">
              <p className="text-gray-600">Preço Líquido para Cliente:</p>
              <p className="font-bold text-2xl text-green-600">
                {totais.precoLiquidoCliente.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Guardar Orçamento
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
