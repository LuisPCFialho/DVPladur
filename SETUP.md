# Sistema de Orçamentos Pladur - Guia de Setup

## Descrição
Sistema completo de orçamentos para trabalhos de pladur/drywall com:
- ✅ Gestão de preços de materiais (persistidos entre sessões)
- ✅ Cálculo automático de custos e margem de lucro
- ✅ Histórico de orçamentos (rascunhos e finalizados)
- ✅ Renomeação e eliminação de orçamentos
- ✅ Cálculo de deslocamento por KM
- ✅ Armazenamento local de dados (localStorage)

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout global
│   └── globals.css          # Estilos globais
├── components/
│   ├── PrecosPanel.tsx       # Gestão de preços e materiais
│   ├── NovoOrcamento.tsx     # Formulário para criar orçamentos
│   ├── ListaOrcamentos.tsx   # Listagem de orçamentos
│   └── DetalheOrcamento.tsx  # Visualização detalhada
├── lib/
│   ├── store.ts             # Zustand store (estado global)
│   ├── supabase.ts          # Cliente Supabase (futuro)
│   └── types/index.ts       # Tipos TypeScript
└── types/
    └── index.ts             # Interfaces TypeScript
```

## Funcionalidades Principais

### 1. Configuração de Preços
- Dimensão padrão da placa (padrão: 2.88m²)
- Preço de mão-de-obra por m² (padrão: 25€)
- Margem de lucro em % (padrão: 30%)
- Preço de deslocamento por km (padrão: 1.50€)
- Gestão completa de materiais com edição e remoção

### 2. Criação de Orçamentos
Preencher:
- Nome do orçamento
- Nome do cliente
- Endereço
- Metragem total (m²)
- Tipo de trabalho (revestimento, forro, cofragem, etc.)
- Deslocamento em km
- Adicionar materiais com quantidades

### 3. Cálculos Automáticos
- Custo total de materiais
- Custo de mão-de-obra (m² × preço/m²)
- Custo de deslocamento (km × preço/km)
- Preço antes de margem
- Valor de lucro (preço × percentagem)
- **Preço final para cliente**

### 4. Armazenamento
- **localStorage**: Todos os dados são salvos automaticamente no navegador
- Os dados persistem entre sessões
- Possível futura integração com Supabase

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup Inicial

```bash
cd orcamento-pladur

# Instalar dependências (já feito)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Aceder em: http://localhost:3000
```

### Build para Produção
```bash
npm run build
npm start
```

## Próximas Etapas - Supabase Setup (Opcional)

Para ativar armazenamento na cloud com Supabase:

1. **Criar conta em supabase.com**

2. **Criar novo projeto**

3. **Copiar credenciais** (URL e Anon Key)

4. **Criar arquivo `.env.local`** na raiz:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

5. **Criar tabelas no Supabase** (SQL Editor):
```sql
-- Tabela de orçamentos
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  cliente TEXT NOT NULL,
  endereco TEXT,
  data TEXT,
  metragem NUMERIC,
  tipoTrabalho TEXT,
  itens JSONB,
  maoDeObraTotal NUMERIC,
  deslocamento NUMERIC,
  custoDeslocamento NUMERIC,
  precoAntesDaMargemLucro NUMERIC,
  percentagemMargemLucro NUMERIC,
  valorLucrado NUMERIC,
  precoLiquidoCliente NUMERIC,
  status TEXT,
  criadoEm TEXT,
  atualizadoEm TEXT
);

-- Tabela de configuração de preços
CREATE TABLE precos_config (
  id TEXT PRIMARY KEY,
  dimensaoPadraoPlaca NUMERIC,
  materiais JSONB,
  precoMaoDeObra NUMERIC,
  margem NUMERIC,
  precoKmDeslocamento NUMERIC
);
```

## Deploy no Vercel

1. **Push para GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin seu-repositorio-github
git push -u origin main
```

2. **Ir para vercel.com** e conectar o repositório

3. **Configurar variáveis de ambiente** (se usar Supabase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy automático** a cada push!

## Materiais Padrão Pré-configurados
- Placa de Pladur Standard (5€/m²)
- Placa de Pladur Resistente à Humidade (7.50€/m²)
- Estrutura Metálica Montantes (2.50€/m)
- Estrutura Metálica Guias (1.50€/m)
- Parafusos (8€/caixa)
- Massa de Pladur (0.80€/kg)
- Primer (12€/L)
- Tinta (15€/L)

*Todos estes valores são editáveis no painel de configuração!*

## Suporte e Troubleshooting

### Dados desaparecem?
- Limpe o cache/localStorage do navegador
- Verifique F12 > Application > LocalStorage

### Componentes não aparecem?
- Certifique-se que tem o arquivo `page.tsx` na pasta `src/app/`
- Execute `npm run dev` novamente

### Erros de build?
```bash
npm run build
```

## Tecnologias Utilizadas
- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Supabase**: Banco de dados (opcional)
- **UUID**: Geração de IDs únicos

## Contato e Ajustes

Se precisar de ajustes futuros:
- Adicionar mais tipos de trabalhos
- Personalizar preços
- Integrar com outros sistemas
- Adicionar cálculos adicionais

## Licença
Privado - Uso exclusivo do montador de pladur

---
Criado em: 06 de Abril de 2026
