# Sistema de Orçamentos para Pladur

Uma ferramenta web moderna para criar e gerir orçamentos de trabalhos em pladur/drywall.

## Características

✨ **Interface Intuitiva** - Crie orçamentos em minutos
💾 **Dados Persistentes** - Todos os dados são guardados automaticamente
📊 **Cálculos Automáticos** - Margem de lucro, mão-de-obra, deslocamento
🗂️ **Histórico Completo** - Rascunhos e orçamentos finalizados
⚙️ **Preços Personalizáveis** - Gerencie todos os seus preços
☁️ **Cloud Ready** - Pronto para integração com Supabase

## Quick Start

### 1. Iniciar o Servidor
```bash
cd orcamento-pladur
npm run dev
```
Acede a `http://localhost:3000`

### 2. Configurar Preços
1. Clique em "Configurar Preços" no menu
2. Defina:
   - Tamanho padrão da placa
   - Preço da mão-de-obra (€/m²)
   - Margem de lucro (%)
   - Preço de deslocamento (€/km)
3. Gerencie materiais (adicionar, editar, remover)

### 3. Criar um Orçamento
1. Clique em "+ Criar Novo Orçamento"
2. Preencha os dados:
   - Nome do orçamento
   - Nome do cliente
   - Endereço
   - Metragem (m²)
   - Tipo de trabalho
   - Deslocamento (km)
3. Adicione materiais com quantidades
4. Revise o resumo e guarde

### 4. Consultar Histórico
1. Clique em "Histórico"
2. Veja todos os seus orçamentos
3. Veja detalhes, edite ou renomeie
4. Delete se necessário

## Como Funciona o Cálculo

```
Custo Total = (Materiais) + (Mão-de-Obra) + (Deslocamento)

Mão-de-Obra = Metragem × Preço/m²
Deslocamento = KMs × Preço/km

Margem = Custo Total × Percentagem
Preço Final = Custo Total + Margem
```

## Armazenamento de Dados

### Padrão: LocalStorage (Navegador)
- ✅ Funciona offline
- ✅ Sem servidor necessário
- ⚠️ Dados apenas neste dispositivo/navegador

### Opcional: Supabase (Cloud)
- ✅ Acesso de qualquer lugar
- ✅ Backup automático
- ✅ Sincronização entre dispositivos

Veja `SETUP.md` para integração com Supabase.

## Estrutura de Dados

### Orçamento
```
{
  id: UUID único
  nome: "Orçamento Apartamento A"
  cliente: "João Silva"
  endereco: "Rua..., Lisboa"
  data: "2026-04-06"
  metragem: 50.5
  tipoTrabalho: "revestimento"
  itens: [materiais]
  deslocamento: 15 km
  precoAntesDaMargemLucro: 1500€
  percentagemMargemLucro: 30%
  valorLucrado: 450€
  precoLiquidoCliente: 1950€
  status: "rascunho" ou "finalizado"
}
```

## Dicas de Uso

1. **Backup de Dados**
   - Exporte regularmente seus orçamentos
   - Use Supabase para backup automático

2. **Atualização de Preços**
   - Todos os novos orçamentos usam os preços atualizados
   - Preços antigos ficam nos orçamentos passados

3. **Renomeação**
   - Use a função renomear para organizar melhor
   - Exemplo: "Apto-Joao-04-2026"

4. **Rascunhos vs Finalizados**
   - Guarde como rascunho para editar depois
   - Finalize quando tiver confirmação do cliente

## Tipos de Trabalhos Padrão

- Revestimento
- Forro
- Cofragem
- Divisória Interior
- Parede Exterior
- Parede com Humidade (Resistente)

*Pode adicionar/editar no código se precisar outros tipos*

## Troubleshooting

### Preços desaparecem
→ Os preços são guardados, mas pode ter limpado o cache do navegador

### Não consigo ver os orçamentos
→ Certifique-se que está no mesmo navegador/dispositivo

### Quero fazer backup
→ Copie os dados do localStorage (F12 > Application > Local Storage)

## Para Developers

### Stack Técnico
- **Frontend**: React 19 + TypeScript
- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS 4
- **Estado**: Zustand (com localStorage)
- **BD**: Supabase (opcional)

### Estrutura de Pastas
```
orcamento-pladur/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   ├── lib/             # Lógica reutilizável
│   └── types/           # Tipos TypeScript
├── public/              # Arquivos estáticos
└── [configurações]
```

### Customização

**Adicionar novo tipo de trabalho:**
Edite em `src/components/NovoOrcamento.tsx`, opção `tipoTrabalho`

**Mudar cores:**
Tailwind classes em `src/app/globals.css`

**Adicionar novo material padrão:**
Edite `src/lib/store.ts`, array `initialPrecosConfig.materiais`

## Contacto e Suporte

Para dúvidas ou funcionalidades adicionais, contacte o desenvolvedor.

---

**Versão**: 1.0
**Data de Criação**: 6 de Abril de 2026
**Licença**: Privado
