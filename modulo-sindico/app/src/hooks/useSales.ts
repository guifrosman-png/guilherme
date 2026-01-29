
import { useState, useMemo } from 'react';

export interface SaleItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category: string;
}

export interface SalesDay {
    id: string; // date string YYYY-MM-DD
    date: string;
    totalItems: number;
    totalValue: number;
    status: 'completed' | 'processing'; // To mimic ticket status styling if needed
    items: SaleItem[];
}

// Mock Data Generator
const generateMockSales = (): SalesDay[] => {
    const days = 10;
    const data: SalesDay[] = [];
    const now = new Date();

    const products = [
        { name: 'Coca-Cola 350ml', price: 5.50, category: 'Bebidas' },
        { name: 'Água Mineral 500ml', price: 3.00, category: 'Bebidas' },
        { name: 'Chocolate Barra', price: 8.90, category: 'Snacks' },
        { name: 'Batata Chips', price: 12.00, category: 'Snacks' },
        { name: 'Sabonete', price: 4.50, category: 'Higiene' },
        { name: 'Sorvete Pote', price: 25.90, category: 'Congelados' },
    ];

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate random items for the day
        const numItems = Math.floor(Math.random() * 20) + 5;
        const items: SaleItem[] = [];
        let dayTotal = 0;
        let dayQty = 0;

        for (let j = 0; j < numItems; j++) {
            const prod = products[Math.floor(Math.random() * products.length)];
            const qty = Math.floor(Math.random() * 3) + 1;
            const total = qty * prod.price;

            items.push({
                id: `${dateStr}-${j}`,
                productName: prod.name,
                quantity: qty,
                unitPrice: prod.price,
                totalPrice: total,
                category: prod.category
            });

            dayTotal += total;
            dayQty += qty;
        }

        // Aggregate items by product name
        const aggregatedItems: SaleItem[] = [];
        items.forEach(item => {
            const existing = aggregatedItems.find(x => x.productName === item.productName);
            if (existing) {
                existing.quantity += item.quantity;
                existing.totalPrice += item.totalPrice;
            } else {
                aggregatedItems.push({ ...item });
            }
        });

        data.push({
            id: dateStr,
            date: dateStr,
            totalItems: dayQty,
            totalValue: dayTotal,
            status: i === 0 ? 'processing' : 'completed',
            items: aggregatedItems.sort((a, b) => b.totalPrice - a.totalPrice)
        });
    }

    return data;
};

export function useSales() {
    const [sales, setSales] = useState<SalesDay[]>(generateMockSales());
    const [loading, setLoading] = useState(false);

    // Filter logic could go here

    return {
        sales,
        loading
    };
}
