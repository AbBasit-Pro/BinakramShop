import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/lib/store-data';

interface DbProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string | null;
  category_id: string | null;
  description: string | null;
  in_stock: boolean;
  rating: number | null;
  reviews: number | null;
  categories?: { name: string } | null;
}

const mapProduct = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.original_price ?? undefined,
  image: p.image || '/placeholder.svg',
  category: p.categories?.name || 'Uncategorized',
  description: p.description || '',
  inStock: p.in_stock,
  rating: Number(p.rating) || 0,
  reviews: p.reviews || 0,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as DbProduct[]).map(mapProduct);
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapProduct(data as DbProduct);
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      name: string; price: number; original_price?: number | null;
      image?: string | null; category_id?: string | null; description?: string | null;
      in_stock?: boolean; rating?: number; reviews?: number;
    }) => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string; name?: string; price?: number; original_price?: number | null;
      image?: string | null; category_id?: string | null; description?: string | null;
      in_stock?: boolean;
    }) => {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};
