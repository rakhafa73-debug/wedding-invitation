import { supabase, isSupabaseConfigured } from './supabase';
import { OrderItem, PricingPackage } from '../types/wedding';
import { INITIAL_ORDERS, INITIAL_PACKAGES, DEMO_USERS } from '../data/seedData';

const ORDERS_STORAGE_KEY = 'nuptia_orders_store';
const PACKAGES_STORAGE_KEY = 'nuptia_packages_store';

function getLocalOrders(): OrderItem[] {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveLocalOrders(items: OrderItem[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(items));
}

export function getPackages(): PricingPackage[] {
  const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
    return INITIAL_PACKAGES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PACKAGES;
  }
}

export function updatePackagePrice(pkgId: string, newDiscountedPrice: number): boolean {
  const list = getPackages();
  const target = list.find(p => p.id === pkgId);
  if (target) {
    target.discounted_price = newDiscountedPrice;
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(list));
    return true;
  }
  return false;
}

export async function getOrders(): Promise<OrderItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as OrderItem[];
      }
    } catch (e) {
      console.warn('Supabase getOrders failed, using local store', e);
    }
  }

  return getLocalOrders();
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'paid' | 'cancelled'): Promise<boolean> {
  const list = getLocalOrders();
  const order = list.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveLocalOrders(list);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase update order status failed', e);
      }
    }
    return true;
  }
  return false;
}

export async function createNewOrder(
  userId: string,
  userEmail: string,
  invitationId: string,
  invitationTitle: string,
  packageName: string,
  amount: number,
  paymentMethod: string
): Promise<OrderItem> {
  const newOrder: OrderItem = {
    id: 'ord-' + Math.random().toString(36).substring(2, 8),
    order_number: 'NPT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900),
    user_id: userId,
    user_email: userEmail,
    invitation_id: invitationId,
    invitation_title: invitationTitle,
    package_name: packageName,
    amount,
    status: 'pending',
    payment_method: paymentMethod,
    created_at: new Date().toISOString(),
  };

  const list = getLocalOrders();
  list.unshift(newOrder);
  saveLocalOrders(list);

  return newOrder;
}

export async function getAdminMetrics() {
  const orders = await getOrders();
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  return {
    totalUsers: DEMO_USERS.length + 12,
    activeInvitations: 8,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'paid').length,
    totalRevenue,
  };
}
