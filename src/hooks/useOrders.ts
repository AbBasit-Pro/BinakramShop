import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  items?: DbOrderItem[];
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
}

export const useAllOrders = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        qc.invalidateQueries({ queryKey: ['admin-orders'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      const orderIds = orders.map(o => o.id);
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      if (itemsError) throw itemsError;

      return orders.map(o => ({
        ...o,
        items: items?.filter(i => i.order_id === o.id) || [],
      })) as DbOrder[];
    },
  });
};

export const useUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const orderIds = orders.map(o => o.id);
      if (orderIds.length === 0) return [] as DbOrder[];

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      return orders.map(o => ({
        ...o,
        items: items?.filter(i => i.order_id === o.id) || [],
      })) as DbOrder[];
    },
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      user_id: string;
      total: number;
      payment_method: string;
      customer_name: string;
      customer_phone: string;
      customer_address: string;
      transaction_id?: string;
      items: { product_id?: string; product_name: string; product_price: number; quantity: number }[];
    }) => {
      const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
      const { items, ...orderData } = order;

      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert({ ...orderData, order_number: orderNumber })
        .select()
        .single();
      if (error) throw error;

      const orderItems = items.map(item => ({ ...item, order_id: newOrder.id }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      return newOrder;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });
};

export const useUpdatePaymentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payment_status }: { id: string; payment_status: string }) => {
      const { error } = await supabase.from('orders').update({ payment_status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });
};
