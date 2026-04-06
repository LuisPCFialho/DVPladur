import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PrecosConfig, Orcamento, Material } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialPrecosConfig: PrecosConfig = {
  dimensaoPadraoPlaca: 2.88, // 1.20m x 2.40m
  materiais: [
    { id: uuidv4(), nome: 'Placa de Pladur Standard', unidade: 'm2', preco: 5.0 },
    { id: uuidv4(), nome: 'Placa de Pladur Resistente à Humidade', unidade: 'm2', preco: 7.5 },
    { id: uuidv4(), nome: 'Estrutura Metálica (Montantes)', unidade: 'm', preco: 2.5 },
    { id: uuidv4(), nome: 'Estrutura Metálica (Guias)', unidade: 'm', preco: 1.5 },
    { id: uuidv4(), nome: 'Parafusos (Caixa)', unidade: 'unidade', preco: 8.0 },
    { id: uuidv4(), nome: 'Massa de Pladur', unidade: 'kg', preco: 0.8 },
    { id: uuidv4(), nome: 'Primer', unidade: 'L', preco: 12.0 },
    { id: uuidv4(), nome: 'Tinta', unidade: 'L', preco: 15.0 },
  ],
  precoMaoDeObra: 25, // por m2
  margem: 30, // percentagem
  precoKmDeslocamento: 1.5, // por km
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      precosConfig: initialPrecosConfig,
      orcamentos: [],
      orcamentoAtual: null,

      setPrecosConfig: (config) => set({ precosConfig: config }),

      addMaterial: (material) =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            materiais: [...state.precosConfig.materiais, { ...material, id: uuidv4() }],
          },
        })),

      updateMaterial: (id, material) =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            materiais: state.precosConfig.materiais.map((m) =>
              m.id === id ? { ...material, id } : m
            ),
          },
        })),

      removeMaterial: (id) =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            materiais: state.precosConfig.materiais.filter((m) => m.id !== id),
          },
        })),

      setOrcamentos: (orcamentos) => set({ orcamentos }),

      addOrcamento: (orcamento) =>
        set((state) => ({
          orcamentos: [...state.orcamentos, orcamento],
        })),

      updateOrcamento: (id, orcamento) =>
        set((state) => ({
          orcamentos: state.orcamentos.map((o) => (o.id === id ? orcamento : o)),
        })),

      deleteOrcamento: (id) =>
        set((state) => ({
          orcamentos: state.orcamentos.filter((o) => o.id !== id),
        })),

      setOrcamentoAtual: (orcamento) => set({ orcamentoAtual: orcamento }),

      renomearOrcamento: (id, novoNome) =>
        set((state) => ({
          orcamentos: state.orcamentos.map((o) =>
            o.id === id ? { ...o, nome: novoNome, atualizadoEm: new Date().toISOString() } : o
          ),
        })),
    }),
    {
      name: 'orcamento-pladur-storage',
    }
  )
);
