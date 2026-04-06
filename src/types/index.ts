// Tipos para Materiais
export interface Material {
  id: string;
  nome: string;
  unidade: string; // m2, m, unidade, etc
  preco: number;
}

// Tipos para Configuração de Preços
export interface PrecosConfig {
  dimensaoPadraoPlaca: number; // em m2
  materiais: Material[];
  precoMaoDeObra: number; // por m2
  margem: number; // percentagem
  precoKmDeslocamento: number;
}

// Tipos para Item de Orçamento
export interface ItemOrcamento {
  id: string;
  materialId: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

// Tipos para Orçamento
export interface Orcamento {
  id: string;
  nome: string;
  cliente: string;
  endereco: string;
  data: string;
  metragem: number; // m2 da obra
  tipoTrabalho: string; // revestimento, forro, divisória, etc
  itens: ItemOrcamento[];
  maoDeObraTotal: number;
  deslocamento: number; // em km
  custoDeslocamento: number;
  precoAntesDaMargemLucro: number;
  percentagemMargemLucro: number;
  valorLucrado: number;
  precoLiquidoCliente: number;
  status: 'rascunho' | 'finalizado';
  criadoEm: string;
  atualizadoEm: string;
}

// Tipos para o estado da aplicação
export interface AppState {
  precosConfig: PrecosConfig;
  orcamentos: Orcamento[];
  orcamentoAtual: Orcamento | null;

  // Ações
  setPrecosConfig: (config: PrecosConfig) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, material: Material) => void;
  removeMaterial: (id: string) => void;
  setOrcamentos: (orcamentos: Orcamento[]) => void;
  addOrcamento: (orcamento: Orcamento) => void;
  updateOrcamento: (id: string, orcamento: Orcamento) => void;
  deleteOrcamento: (id: string) => void;
  setOrcamentoAtual: (orcamento: Orcamento | null) => void;
  renomearOrcamento: (id: string, novoNome: string) => void;
}
