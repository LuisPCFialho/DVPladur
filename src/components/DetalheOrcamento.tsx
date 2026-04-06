'use client';

import { useStore } from '@/lib/store';
import { Orcamento } from '@/types';

export default function DetalheOrcamento({
  orcamento,
  onClose,
  onFinalize,
}: {
  orcamento: Orcamento;
  onClose: () => void;
  onFinalize: (orcamento: Orcamento) => void;
}) {
  const { precosConfig } = useStore();

  const handleFinalize = () => {
    if (orcamento.status === 'rascunho') {
      onFinalize({ ...orcamento, status: 'finalizado' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{orcamento.nome}</h2>
            <p className="text-gray-600">Cliente: {orcamento.cliente}</p>
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

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
          <div>
            <p className="text-sm text-gray-600">Data</p>
            <p className="font-semibold text-gray-800">
              {new Date(orcamento.data).toLocaleDateString('pt-PT')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Endereço</p>
            <p className="font-semibold text-gray-800">{orcamento.endereco}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Metragem</p>
            <p className="font-semibold text-gray-800">{orcamento.metragem.toFixed(2)} m²</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Trabalho</p>
            <p className="font-semibold text-gray-800">{orcamento.tipoTrabalho}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 text-gray-800">Materiais</h3>
        <div className="space-y-2 mb-6">
          {orcamento.itens.map((item) => {
            const material = precosConfig.materiais.find((m) => m.id === item.materialId);
            return (
              <div key={item.id} className="bg-gray-50 p-3 rounded border border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{material?.nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantidade} {material?.unidade} × {item.preco.toFixed(2)}€
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">{item.subtotal.toFixed(2)}€</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-300 mb-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Custo de Materiais:</span>
              <span className="font-semibold">
                {orcamento.itens.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}€
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                Mão-de-obra ({orcamento.metragem.toFixed(2)} m² × {precosConfig.precoMaoDeObra}€/m²):
              </span>
              <span className="font-semibold">{orcamento.maoDeObraTotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                Deslocamento ({orcamento.deslocamento} km × {precosConfig.precoKmDeslocamento}€/km):
              </span>
              <span className="font-semibold">{orcamento.custoDeslocamento.toFixed(2)}€</span>
            </div>
            <div className="border-t border-blue-300 pt-3 flex justify-between font-bold text-lg">
              <span className="text-gray-800">Preço Antes de Margem:</span>
              <span className="text-blue-600">{orcamento.precoAntesDaMargemLucro.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-800">Margem de Lucro ({orcamento.percentagemMargemLucro}%):</span>
              <span className="text-green-600">+{orcamento.valorLucrado.toFixed(2)}€</span>
            </div>
            <div className="border-t border-blue-300 pt-3 flex justify-between font-bold text-2xl bg-white p-3 rounded">
              <span className="text-gray-800">Preço Líquido para Cliente:</span>
              <span className="text-green-600">{orcamento.precoLiquidoCliente.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {orcamento.status === 'rascunho' && (
            <button
              onClick={handleFinalize}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Finalizar Orçamento
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
