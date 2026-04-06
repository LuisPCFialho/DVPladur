import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not configured. Using local storage only.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções auxiliares para BD
export async function salvarOrcamento(orcamento: any) {
  try {
    const { data, error } = await supabase
      .from('orcamentos')
      .upsert(orcamento, { onConflict: 'id' });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    throw error;
  }
}

export async function buscarOrcamentos() {
  try {
    const { data, error } = await supabase
      .from('orcamentos')
      .select('*')
      .order('criadoEm', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return [];
  }
}

export async function buscarOrcamentoPorId(id: string) {
  try {
    const { data, error } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    return null;
  }
}

export async function deletarOrcamento(id: string) {
  try {
    const { error } = await supabase
      .from('orcamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    throw error;
  }
}

export async function salvarPrecosConfig(config: any) {
  try {
    const { data, error } = await supabase
      .from('precos_config')
      .upsert(config, { onConflict: 'id' });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar configuração de preços:', error);
    throw error;
  }
}

export async function buscarPrecosConfig() {
  try {
    const { data, error } = await supabase
      .from('precos_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar configuração de preços:', error);
    return null;
  }
}
