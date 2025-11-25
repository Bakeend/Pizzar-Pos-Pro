
import { MenuItem, Table, TableStatus, Order, OrderStatus, OrderType, Customer, Coupon } from '../types';

export const pizzas: MenuItem[] = [
  { id: 1, name: 'Margherita Speciale', description: 'O clássico napolitano. Molho de tomate San Marzano, mozzarella de búfala fresca, manjericão orgânico colhido na hora e um fio de azeite extra virgem.', price: 45.00, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 10 },
  { id: 2, name: 'Pepperoni Supremo', description: 'Para os amantes de sabor intenso. Fatias generosas de pepperoni picante sobre uma camada dupla de mozzarella derretida e nosso molho especial.', price: 50.00, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 12 },
  { id: 3, name: 'Quattro Formaggi', description: 'Uma fusão cremosa e sofisticada de Gorgonzola, Parmesão curado 12 meses, Provolone defumado e Mozzarella macia.', price: 55.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 13 },
  { id: 4, name: 'Veggie Garden', description: 'Leve e fresca. Pimentões coloridos, cebola roxa, azeitonas pretas, cogumelos frescos e tomates cereja confitados.', price: 48.00, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=500&q=80', category: 'pizza', tags: ['vegan'], preparationTime: 15 },
  { id: 5, name: 'Frango com Catupiry', description: 'A preferida dos brasileiros. Frango desfiado temperado com ervas finas e coberto com o autêntico requeijão Catupiry®.', price: 52.00, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 12 },
  { id: 6, name: 'Calabresa Acebolada', description: 'Linguiça calabresa artesanal fatiada, rodelas de cebola fresca e azeitonas pretas, finalizada com orégano.', price: 49.00, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 11 },
  { id: 7, name: 'Portuguesa Tradicional', description: 'Sabor caseiro. Presunto magro, ovos cozidos, cebola, ervilhas frescas e azeitonas sobre base de mozzarella.', price: 53.00, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 14 },
  { id: 8, name: 'Brigadeiro Gourmet', description: 'Adoce a vida. Pizza coberta com ganache de chocolate belga, brigadeiro artesanal enrolado e granulado crocante.', price: 40.00, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80', category: 'pizza', preparationTime: 8 },
];

export const drinks: MenuItem[] = [
  { id: 101, name: 'Coca-Cola 2L', description: 'Perfeita para compartilhar. Servida gelada.', price: 12.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80', category: 'drink', preparationTime: 1 },
  { id: 102, name: 'Guaraná Antarctica 2L', description: 'O original do Brasil. Refrescante e gelado.', price: 12.00, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=500&q=80', category: 'drink', preparationTime: 1 },
  { id: 103, name: 'Heineken Long Neck', description: 'Cerveja Premium Lager puro malte, 330ml.', price: 9.00, image: 'https://images.unsplash.com/photo-1618885481668-61676342c7a5?auto=format&fit=crop&w=500&q=80', category: 'drink', preparationTime: 1 },
  { id: 104, name: 'Água Mineral', description: '500ml. Opções com ou sem gás.', price: 5.00, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=500&q=80', category: 'drink', preparationTime: 1 },
];

export const desserts: MenuItem[] = [
    { id: 201, name: 'Tiramisu Clássico', description: 'Sobremesa italiana com camadas de mascarpone, biscoito champagne e café expresso.', price: 20.00, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80', category: 'dessert', preparationTime: 5 },
    { id: 202, name: 'Brownie Vulcão', description: 'Brownie de chocolate meio amargo aquecido, servido com sorvete de creme e calda quente.', price: 25.00, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=500&q=80', category: 'dessert', preparationTime: 7 },
];

export const menuItems: MenuItem[] = [...pizzas, ...drinks, ...desserts];

export const tables: Table[] = [
  { id: 1, name: 'Mesa 1', status: TableStatus.Available, capacity: 4 },
  { id: 2, name: 'Mesa 2', status: TableStatus.Occupied, capacity: 4, orderId: 1001 },
  { id: 3, name: 'Mesa 3', status: TableStatus.Available, capacity: 2 },
  { id: 4, name: 'Mesa 4', status: TableStatus.Occupied, capacity: 6, orderId: 1002 },
  { id: 5, name: 'Mesa 5', status: TableStatus.Available, capacity: 4 },
  { id: 6, name: 'Mesa 6', status: TableStatus.Available, capacity: 8 },
  { id: 7, name: 'Balcão 1', status: TableStatus.Available, capacity: 1 },
  { id: 8, name: 'Balcão 2', status: TableStatus.Occupied, capacity: 1, orderId: 1003 },
];


const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const orders: Order[] = [
  // Active Orders
  { id: 1001, type: OrderType.DineIn, status: OrderStatus.Preparing, items: [{ item: pizzas[1], quantity: 1 }, { item: drinks[0], quantity: 2 }], total: 74.00, customerName: 'Mesa 2', tableId: 2, createdAt: new Date(Date.now() - 10 * 60000).toISOString(), startedPreparingAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 1002, type: OrderType.DineIn, status: OrderStatus.Pending, items: [{ item: pizzas[2], quantity: 2 }], total: 110.00, customerName: 'Mesa 4', tableId: 4, createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 1003, type: OrderType.Takeout, status: OrderStatus.Preparing, items: [{ item: pizzas[4], quantity: 1 }], total: 52.00, customerName: 'João Silva', createdAt: new Date(Date.now() - 15 * 60000).toISOString(), startedPreparingAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 1004, type: OrderType.Delivery, status: OrderStatus.Delivering, items: [{ item: pizzas[0], quantity: 1 }, { item: pizzas[7], quantity: 1 }, { item: drinks[1], quantity: 1 }], total: 97.00, customerName: 'Maria Oliveira', address: 'Rua das Flores, 123', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
  
  // Completed Orders for Reports
  { id: 1005, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[5], quantity: 1 }], total: 49.00, customerName: 'Carlos Souza', address: 'Av. Principal, 456', createdAt: daysAgo(1) },
  { id: 1006, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[0], quantity: 1 }, { item: drinks[0], quantity: 1 }], total: 57.00, customerName: 'Ana Clara', createdAt: daysAgo(1) },
  { id: 1007, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[3], quantity: 2 }, { item: desserts[1], quantity: 1 }], total: 121.00, customerName: 'Mesa 1', tableId: 1, createdAt: daysAgo(2) },
  { id: 1008, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[6], quantity: 1 }], total: 53.00, customerName: 'Bruno Lima', createdAt: daysAgo(2) },
  { id: 1009, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[1], quantity: 1 }, { item: pizzas[4], quantity: 1 }], total: 98.00, customerName: 'Fernanda Costa', address: 'Rua da Paz, 789', createdAt: daysAgo(3) },
  { id: 1010, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[2], quantity: 1 }, { item: drinks[2], quantity: 4 }], total: 91.00, customerName: 'Mesa 5', tableId: 5, createdAt: daysAgo(4) },
  { id: 1011, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[7], quantity: 1 }, { item: desserts[0], quantity: 1 }], total: 60.00, customerName: 'Ricardo Alves', createdAt: daysAgo(5) },
  { id: 1012, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[0], quantity: 3 }], total: 135.00, customerName: 'Juliana Martins', address: 'Alameda dos Anjos, 101', createdAt: daysAgo(6) },
  { id: 1013, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[5], quantity: 1 }, { item: drinks[1], quantity: 1 }], total: 61.00, customerName: 'Mesa 3', tableId: 3, createdAt: daysAgo(7) },
  { id: 1014, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[1], quantity: 2 }, { item: drinks[0], quantity: 1 }], total: 112.00, customerName: 'Lucas Pereira', address: 'Travessa do Sol, 22', createdAt: daysAgo(8) },
  { id: 1015, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[3], quantity: 1 }], total: 48.00, customerName: 'Gabriela Gomes', createdAt: daysAgo(9) },
  { id: 1016, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[0], quantity: 1 }, { item: pizzas[6], quantity: 1 }], total: 98.00, customerName: 'Mesa 6', tableId: 6, createdAt: daysAgo(10) },
  { id: 1017, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[4], quantity: 1 }, { item: drinks[3], quantity: 2 }], total: 58.00, customerName: 'André Santos', address: 'Rua Larga, 300', createdAt: daysAgo(12) },
  { id: 1018, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[2], quantity: 1 }], total: 55.00, customerName: 'Patrícia Rocha', createdAt: daysAgo(14) },
  { id: 1019, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[1], quantity: 1 }, { item: desserts[1], quantity: 2 }], total: 100.00, customerName: 'Mesa 2', tableId: 2, createdAt: daysAgo(15) },
  { id: 1020, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[7], quantity: 2 }, { item: drinks[1], quantity: 1 }], total: 92.00, customerName: 'Sérgio Ramos', address: 'Avenida Brasil, 2024', createdAt: daysAgo(18) },
  { id: 1021, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[6], quantity: 2 }], total: 98.00, customerName: 'Tatiane Melo', createdAt: daysAgo(20) },
  { id: 1022, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[0], quantity: 1 }], total: 45.00, customerName: 'Mesa 4', tableId: 4, createdAt: daysAgo(22) },
  { id: 1023, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[3], quantity: 1 }, { item: drinks[0], quantity: 1 }], total: 60.00, customerName: 'Felipe Neves', address: 'Rua 25 de Março, 150', createdAt: daysAgo(25) },
  { id: 1024, type: OrderType.Takeout, status: OrderStatus.Completed, items: [{ item: pizzas[5], quantity: 3 }], total: 147.00, customerName: 'Renata Dias', createdAt: daysAgo(28) },
  { id: 1025, type: OrderType.DineIn, status: OrderStatus.Completed, items: [{ item: pizzas[2], quantity: 1 }, { item: drinks[2], quantity: 2 }], total: 73.00, customerName: 'Mesa 1', tableId: 1, createdAt: daysAgo(29) },
  { id: 1026, type: OrderType.Delivery, status: OrderStatus.Completed, items: [{ item: pizzas[1], quantity: 1 }, { item: drinks[1], quantity: 1 }], total: 62.00, customerName: 'Vinícius Moraes', address: 'Praça da Sé, 1', createdAt: daysAgo(30) },
];

export const customers: Customer[] = [
  { id: 1, name: 'João Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', address: 'Rua das Acácias, 123', notes: 'Cliente fiel, prefere borda recheada.' },
  { id: 2, name: 'Maria Oliveira', email: 'maria.oli@example.com', phone: '(21) 99887-7665', address: 'Av. Atlântica, 400', notes: 'Alérgica a camarão.' },
  { id: 3, name: 'Carlos Pereira', email: 'carlos.p@example.com', phone: '(31) 91234-5678', address: '', notes: '' },
];

export const coupons: Coupon[] = [
  { code: 'BEMVINDO', type: 'percentage', value: 10, description: '10% de desconto na primeira compra' },
  { code: 'PIZZA20', type: 'fixed', value: 20, minValue: 100, description: 'R$ 20,00 off acima de R$ 100,00' },
  { code: 'FRETE', type: 'fixed', value: 5, description: 'Desconto de R$ 5,00 na entrega' },
];

const generateWeeklySalesData = () => {
    const data = [];
    const today = new Date();
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const dailySales = orders.filter(o => {
            if (o.status !== OrderStatus.Completed) return false;
            const orderDate = new Date(o.createdAt);
            return orderDate >= date && orderDate < nextDate;
        }).reduce((sum, o) => sum + o.total, 0);

        data.push({
            name: weekdays[date.getDay()],
            Vendas: dailySales,
        });
    }
    return data;
};

export const salesData = generateWeeklySalesData();
