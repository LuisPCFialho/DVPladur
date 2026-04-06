export interface Cliente {
  id: string;
  nome: string;
  nif: string;
  morada: string;
  telefone: string;
  email: string;
}

export type CategoriaMateria = 'Placas' | 'Perfis' | 'Fixações' | 'Acabamentos' | 'Isolamento' | 'Outro';

export interface Material {
  id: string;
  nome: string;
  unidade: string;
  preco: number;
  categoria: CategoriaMateria;
}

export interface ConsumoItem {
  materialId: string;
  rendimento: number; // quantidade por m²
}

export interface PrecosConfig {
  dimensaoPadraoPlaca: number;
  materiais: Material[];
  precoMaoDeObra: number;
  margem: number;
  precoKmDeslocamento: number;
  nomeEmpresa: string;
  nif: string;
  morada: string;
  telefone: string;
  email: string;
  rendimentos: Record<string, ConsumoItem[]>; // tipoTrabalho → consumos por m²
}

export interface ItemOrcamento {
  id: string;
  materialId: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

export const TIPOS_TRABALHO: Record<string, string> = {
  'divisoria': 'Divisória em Pladur',
  'tecto-falso': 'Tecto Falso',
  'tecto-suspenso': 'Tecto Suspenso',
  'forra': 'Forra de Parede',
  'sanca': 'Sanca / Moldura',
  'caixa-tecnica': 'Caixa Técnica',
  'zona-humida': 'Zona Húmida (Hidrófuga)',
  'corta-fogo': 'Parede Corta-Fogo',
  'acustica': 'Divisória Acústica',
  'barramento': 'Barramento / Acabamento',
  'roupeiro': 'Roupeiro / Armário',
  'revestimento': 'Revestimento Geral',
};

export interface Orcamento {
  id: string;
  numero: string;
  nome: string;
  clienteId: string | null;
  cliente: string;
  nifCliente: string;
  telefoneCliente: string;
  emailCliente: string;
  enderecoObra: string;
  data: string;
  validadeAte: string;
  prazoExecucao: string;
  metragem: number;
  tipoTrabalho: string;
  fatorDesperdicio: number;
  taxaIVA: number;
  itens: ItemOrcamento[];
  maoDeObraTotal: number;
  deslocamento: number;
  custoDeslocamento: number;
  subtotalMateriais: number;
  precoAntesDaMargemLucro: number;
  percentagemMargemLucro: number;
  valorLucrado: number;
  precoSemIVA: number;
  valorIVA: number;
  precoComIVA: number;
  precoLiquidoCliente: number;
  status: 'rascunho' | 'finalizado';
  notas: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AppState {
  precosConfig: PrecosConfig;
  clientes: Cliente[];
  orcamentos: Orcamento[];
  orcamentoAtual: Orcamento | null;
  contadorOrcamentos: number;

  setPrecosConfig: (config: PrecosConfig) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, material: Material) => void;
  removeMaterial: (id: string) => void;

  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Cliente) => void;
  deleteCliente: (id: string) => void;

  setRendimentos: (tipo: string, consumos: ConsumoItem[]) => void;
  resetRendimentos: () => void;

  setOrcamentos: (orcamentos: Orcamento[]) => void;
  addOrcamento: (orcamento: Orcamento) => void;
  updateOrcamento: (id: string, orcamento: Orcamento) => void;
  deleteOrcamento: (id: string) => void;
  setOrcamentoAtual: (orcamento: Orcamento | null) => void;
  renomearOrcamento: (id: string, novoNome: string) => void;
  nextNumeroOrcamento: () => string;
}
