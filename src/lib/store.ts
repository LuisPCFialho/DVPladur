import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PrecosConfig, Material, Cliente, CategoriaMateria, ConsumoItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const m = (nome: string, unidade: string, preco: number, categoria: CategoriaMateria): Material => ({
  id: uuidv4(), nome, unidade, preco, categoria,
});

// Materiais iniciais com IDs estáveis (gerados uma vez e persistidos)
const MAT = {
  placaStd125:   m('Placa Pladur Standard N 12,5mm',       'm2',   4.50, 'Placas'),
  placaStd15:    m('Placa Pladur Standard N 15mm',          'm2',   5.80, 'Placas'),
  placaHidro:    m('Placa Pladur Hidrófuga H 12,5mm',       'm2',   6.50, 'Placas'),
  placaFogo:     m('Placa Pladur Corta-Fogo F 15mm',        'm2',   8.00, 'Placas'),
  placaDura:     m('Placa Pladur Alta Dureza D 12,5mm',     'm2',   7.20, 'Placas'),
  canalU48:      m('Canal U 48mm (Guia)',                   'm',    1.20, 'Perfis'),
  canalU70:      m('Canal U 70mm (Guia)',                   'm',    1.50, 'Perfis'),
  montC48:       m('Montante C 48mm',                       'm',    1.40, 'Perfis'),
  montC70:       m('Montante C 70mm',                       'm',    1.80, 'Perfis'),
  perfilCD:      m('Perfil Omega CD 60mm (Tecto)',           'm',    1.60, 'Perfis'),
  perfilUD:      m('Perfil UD Perímetro (Tecto)',            'm',    0.90, 'Perfis'),
  suspensor:     m('Suspensor Regulável',                   'un',   0.45, 'Perfis'),
  grampo:        m('Grampo de Fixação Directa',             'un',   0.25, 'Perfis'),
  parafTN25:     m('Parafusos TN 3,5×25mm (cx/500)',        'cx',   6.50, 'Fixações'),
  parafTN35:     m('Parafusos TN 3,5×35mm (cx/500)',        'cx',   7.00, 'Fixações'),
  parafTB:       m('Parafusos TB Metal-Metal (cx/500)',      'cx',   6.00, 'Fixações'),
  buchas:        m('Buchas + Parafusos para betão (cx/100)', 'cx',   5.00, 'Fixações'),
  fitaPapel:     m('Fita de Papel para Juntas (rolo 50m)',  'rolo', 3.50, 'Acabamentos'),
  fitaMalha:     m('Fita Malha Fibra de Vidro (rolo 45m)',  'rolo', 5.00, 'Acabamentos'),
  massaJuntas:   m('Massa para Juntas (balde 20kg)',         'balde',18.00,'Acabamentos'),
  massaAcab:     m('Massa de Acabamento (balde 20kg)',       'balde',22.00,'Acabamentos'),
  cantoneira:    m('Cantoneira Metálica 2,5m',              'un',   1.80, 'Acabamentos'),
  bandaAcust:    m('Banda Acústica de Borracha (rolo 30m)', 'rolo', 12.00,'Acabamentos'),
  primer:        m('Primário de Fixação (5L)',               'un',  14.00, 'Acabamentos'),
  laRocha40:     m('Lã de Rocha 40mm',                      'm2',   8.50, 'Isolamento'),
  laRocha60:     m('Lã de Rocha 60mm',                      'm2',  11.00, 'Isolamento'),
  laVidro40:     m('Lã de Vidro 40mm',                      'm2',   6.00, 'Isolamento'),
};

// Rendimentos padrão (consumo por m²) para cada tipo de trabalho
// Valores baseados em práticas reais de montagem de pladur em Portugal
function buildDefaultRendimentos(): Record<string, ConsumoItem[]> {
  const c = (key: keyof typeof MAT, r: number): ConsumoItem => ({
    materialId: MAT[key].id,
    rendimento: r,
  });

  return {
    // Divisória simples (1 face cada lado, montante 48mm @ 60cm, parede de pé-direito ~2,6m)
    'divisoria': [
      c('placaStd125', 2.20),   // 2 faces × 1m²/m² + 10% desperdício
      c('montC48',     1.80),   // montante 48 @ 60cm → ~1,8 m/m²
      c('canalU48',    0.35),   // guia chão + tecto → ~0,35 m/m²
      c('parafTN25',   0.020),  // ~10 parafusos/m² ÷ 500/cx
      c('fitaPapel',   0.020),  // ~1 m fita/m² ÷ 50 m/rolo
      c('massaJuntas', 0.030),  // ~0,6 kg/m² ÷ 20 kg/balde
      c('bandaAcust',  0.070),  // banda perimetral ~0,07 m/m²
    ],
    // Divisória dupla (2 placas por face = EI60 ou acústica)
    'acustica': [
      c('placaStd125', 4.00),   // 4 placas (2 por face) + 10%
      c('montC70',     1.80),
      c('canalU70',    0.35),
      c('laRocha40',   1.05),   // lã de rocha no interior
      c('parafTN25',   0.035),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.040),
      c('bandaAcust',  0.070),
    ],
    // Corta-fogo (placas F, duplas)
    'corta-fogo': [
      c('placaFogo',   4.00),
      c('montC70',     1.80),
      c('canalU70',    0.35),
      c('parafTN35',   0.040),
      c('fitaMalha',   0.025),
      c('massaJuntas', 0.040),
      c('bandaAcust',  0.070),
    ],
    // Tecto falso plano (CD @ 50cm, UD perímetro, suspensores @ 1,2m²)
    'tecto-falso': [
      c('placaStd125', 1.10),   // 1 placa/m² + 10%
      c('perfilCD',    2.20),   // CD @ 50cm = 2 m/m²+ perda
      c('perfilUD',    0.42),   // UD perímetro
      c('suspensor',   0.90),   // 1 suspensor por 1,1m²
      c('parafTN25',   0.015),
      c('parafTB',     0.010),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.025),
    ],
    // Tecto suspenso (altura ≥ 40cm, grampos directos substituídos por suspensores reguláveis)
    'tecto-suspenso': [
      c('placaStd125', 1.10),
      c('perfilCD',    2.20),
      c('perfilUD',    0.42),
      c('suspensor',   1.20),   // mais suspensores por maior altura
      c('parafTN25',   0.015),
      c('parafTB',     0.010),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.025),
    ],
    // Forra de parede (placa colada ou fixada directamente à alvenaria)
    'forra': [
      c('placaStd125', 1.10),
      c('buchas',      0.015),  // 7-8 buchas/m² ÷ 100/cx
      c('parafTN25',   0.015),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.030),
    ],
    // Zona húmida (placa H + fita malha em vez de papel)
    'zona-humida': [
      c('placaHidro',  1.10),
      c('montC48',     1.80),
      c('canalU48',    0.35),
      c('parafTN25',   0.020),
      c('fitaMalha',   0.025),  // fita malha (mais resistente à humidade)
      c('massaJuntas', 0.030),
      c('bandaAcust',  0.070),
    ],
    // Sanca / moldura (estimativa por metro linear de perímetro)
    'sanca': [
      c('placaStd125', 0.60),   // ~0,6 m²/m linear de sanca
      c('perfilCD',    1.20),
      c('perfilUD',    0.50),
      c('parafTN25',   0.010),
      c('massaJuntas', 0.020),
    ],
    // Caixa técnica (envolvimento de tubagem/condutas)
    'caixa-tecnica': [
      c('placaStd125', 1.10),
      c('montC48',     2.50),
      c('canalU48',    0.60),
      c('parafTN25',   0.025),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.030),
    ],
    // Roupeiro / armário em pladur
    'roupeiro': [
      c('placaDura',   2.20),   // placa alta dureza nas faces
      c('montC48',     2.00),
      c('canalU48',    0.40),
      c('parafTN35',   0.030),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.030),
    ],
    // Barramento / acabamento de juntas (só acabamento, sem estrutura)
    'barramento': [
      c('fitaPapel',   0.025),
      c('massaJuntas', 0.050),
      c('massaAcab',   0.035),
      c('cantoneira',  0.010),
      c('primer',      0.010),
    ],
    // Revestimento geral (igual a forra)
    'revestimento': [
      c('placaStd125', 1.10),
      c('buchas',      0.015),
      c('parafTN25',   0.015),
      c('fitaPapel',   0.020),
      c('massaJuntas', 0.030),
    ],
  };
}

const initialPrecosConfig: PrecosConfig = {
  dimensaoPadraoPlaca: 2.88,
  materiais: Object.values(MAT),
  precoMaoDeObra: 18,
  margem: 25,
  precoKmDeslocamento: 0.40,
  nomeEmpresa: '',
  nif: '',
  morada: '',
  telefone: '',
  email: '',
  rendimentos: buildDefaultRendimentos(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      precosConfig: initialPrecosConfig,
      clientes: [],
      orcamentos: [],
      orcamentoAtual: null,
      contadorOrcamentos: 0,

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
            materiais: state.precosConfig.materiais.map((m) => (m.id === id ? { ...material, id } : m)),
          },
        })),

      removeMaterial: (id) =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            materiais: state.precosConfig.materiais.filter((m) => m.id !== id),
          },
        })),

      setRendimentos: (tipo, consumos) =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            rendimentos: { ...state.precosConfig.rendimentos, [tipo]: consumos },
          },
        })),

      resetRendimentos: () =>
        set((state) => ({
          precosConfig: {
            ...state.precosConfig,
            rendimentos: buildDefaultRendimentos(),
          },
        })),

      addCliente: (cliente) =>
        set((state) => ({ clientes: [...state.clientes, { ...cliente, id: uuidv4() }] })),

      updateCliente: (id, cliente) =>
        set((state) => ({
          clientes: state.clientes.map((c) => (c.id === id ? { ...cliente, id } : c)),
        })),

      deleteCliente: (id) =>
        set((state) => ({ clientes: state.clientes.filter((c) => c.id !== id) })),

      setOrcamentos: (orcamentos) => set({ orcamentos }),

      addOrcamento: (orcamento) =>
        set((state) => ({ orcamentos: [...state.orcamentos, orcamento] })),

      updateOrcamento: (id, orcamento) =>
        set((state) => ({
          orcamentos: state.orcamentos.map((o) => (o.id === id ? orcamento : o)),
        })),

      deleteOrcamento: (id) =>
        set((state) => ({ orcamentos: state.orcamentos.filter((o) => o.id !== id) })),

      setOrcamentoAtual: (orcamento) => set({ orcamentoAtual: orcamento }),

      renomearOrcamento: (id, novoNome) =>
        set((state) => ({
          orcamentos: state.orcamentos.map((o) =>
            o.id === id ? { ...o, nome: novoNome, atualizadoEm: new Date().toISOString() } : o
          ),
        })),

      nextNumeroOrcamento: () => {
        const newCounter = get().contadorOrcamentos + 1;
        set({ contadorOrcamentos: newCounter });
        const year = new Date().getFullYear();
        return `ORC-${year}-${String(newCounter).padStart(3, '0')}`;
      },
    }),
    {
      name: 'dvpladur-v3',
    }
  )
);
