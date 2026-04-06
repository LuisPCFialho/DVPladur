# DVPladur - Sistema de Orçamentos Pladur

Sistema de gestão de orçamentos para montadores de pladur, desenvolvido com Next.js 16, TypeScript e Tailwind CSS 4.

## Links do Projeto

- **Site em Produção**: https://orcamento-pladur.vercel.app
- **Repositório GitHub**: https://github.com/LuisPCFialho/DVPladur

## Funcionalidades

- ✅ Gestão de preços de materiais configuráveis
- ✅ Criação de orçamentos com cálculo automático
- ✅ Histórico de orçamentos (rascunhos e finalizados)
- ✅ Cálculo de mão-de-obra por m²
- ✅ Cálculo de deslocamento por km
- ✅ Margem de lucro configurável
- ✅ Persistência de dados com localStorage (sem necessidade de backend)
- ✅ Interface em português
- ✅ Design responsivo

## Tipos de Trabalho Suportados

- Revestimento
- Forro
- Cofragem
- Divisória Interior
- Parede Exterior
- Parede com Humidade

## Materiais Pré-configurados

1. Placa de Pladur Standard
2. Placa de Pladur Resistente à Humidade
3. Estrutura Metálica (Montantes)
4. Estrutura Metálica (Guias)
5. Parafusos (Caixa)
6. Massa de Pladur
7. Primer
8. Tinta

## Tecnologias Utilizadas

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Estado Global**: Zustand com persistência localStorage
- **Deployment**: Vercel
- **Icons**: Heroicons (via SVG)

## Como Usar

### Online (Recomendado)
Aceda diretamente a: https://orcamento-pladur.vercel.app

### Desenvolvimento Local

```bash
# Clonar o repositório
git clone https://github.com/LuisPCFialho/DVPladur.git
cd DVPladur

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000
```

## Cálculos Automáticos

O sistema calcula automaticamente:

- **Custo de Materiais**: Soma de todos os materiais × quantidades
- **Mão-de-obra**: Metragem (m²) × Preço/m²
- **Deslocamento**: Distância (km) × Preço/km
- **Subtotal**: Materiais + Mão-de-obra + Deslocamento
- **Lucro**: Subtotal × Margem (%)
- **Preço Final**: Subtotal + Lucro

## Persistência de Dados

Os dados são guardados automaticamente no **localStorage** do navegador:
- Configuração de preços
- Materiais personalizados
- Histórico de orçamentos

**Nota**: Os dados ficam guardados apenas no navegador utilizado.

---

**Desenvolvido para profissionais de pladur**
