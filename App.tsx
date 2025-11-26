
// Importações do React e hooks
import React, { useState } from 'react';

// Importação de todos os tipos TypeScript necessários para o sistema
import { View, MenuItem, CartItem, Order, Table, OrderType, OrderStatus, TableStatus, Customer, Coupon } from './types';

// Importação dos componentes principais da aplicação
import Header from './components/Header'; // Cabeçalho da aplicação
import HomeScreen from './components/screens/HomeScreen'; // Tela inicial
import MenuScreen from './components/screens/MenuScreen'; // Tela do cardápio
import CheckoutScreen from './components/screens/CheckoutScreen'; // Tela de finalização do pedido
import AdminScreen from './components/screens/AdminScreen'; // Painel administrativo
import LoginScreen from './components/screens/LoginScreen'; // Tela de login do admin
import PizzaModal from './components/PizzaModal'; // Modal de personalização de pizza
import ComboModal from './components/ComboModal'; // Modal de seleção de combo
import CartSidebar from './components/CartSidebar'; // Barra lateral do carrinho

// Importação dos dados mockados (dados de exemplo para desenvolvimento)
import { menuItems as mockMenuItems, pizzas, orders as mockOrders, tables as mockTables, customers as mockCustomers, coupons as mockCoupons } from './data/mockData';

/**
 * Função auxiliar para calcular o preço de uma pizza personalizada
 * @param cartItem - Item do carrinho contendo pizza e suas customizações
 * @returns Preço final calculado da pizza
 */
const calculatePizzaPrice = (cartItem: CartItem): number => {
  // Se o item faz parte de uma promoção (ex: combo com preço fixo), retorna o preço base sem cálculos extras
  if (cartItem.isPromo) return cartItem.item.price;

  // Extrai o item e suas customizações do carrinho
  const { item, customization } = cartItem;

  // Se não houver customização, retorna o preço padrão do item
  if (!customization) return item.price;

  // Calcula o preço base da pizza
  let basePrice;

  // Se a pizza tem mais de um sabor (pizza meio a meio)
  if (customization.flavors.length > 1) {
    // O preço base é o maior preço entre os dois sabores
    basePrice = Math.max(customization.flavors[0].price, customization.flavors[1].price);
  } else {
    // Se for apenas um sabor, usa o preço do item
    basePrice = item.price;
  }

  // Inicia o preço final com o preço base
  let finalPrice = basePrice;

  // Adiciona R$ 10,00 se o tamanho for grande
  if (customization.size === 'large') finalPrice += 10.00;

  // Adiciona R$ 8,00 se a borda for recheada com queijo
  if (customization.crust === 'cheese-filled') finalPrice += 8.00;

  // Retorna o preço final calculado
  return finalPrice;
};


/**
 * Componente principal da aplicação Pizza POS Pro
 * Gerencia todo o estado global e a navegação entre telas
 */
const App: React.FC = () => {
  // Estado para controlar qual tela está sendo exibida no momento
  const [view, setView] = useState<View>(View.Home);

  // ===== Estados Principais do Sistema (Lifted State) =====
  // Esses estados são compartilhados entre vários componentes

  // Lista de todos os itens disponíveis no cardápio
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  // Lista de todos os pedidos realizados no sistema
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Lista de todas as mesas do restaurante
  const [tables, setTables] = useState<Table[]>(mockTables);

  // Lista de todos os clientes cadastrados
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  // Lista de todos os cupons de desconto disponíveis
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  // ===== Estados da Interface do Usuário (UI State) =====

  // Carrinho de compras - array de itens selecionados pelo cliente
  const [cart, setCart] = useState<CartItem[]>([]);

  // Pizza que está sendo personalizada no momento (null quando modal está fechado)
  const [pizzaToCustomize, setPizzaToCustomize] = useState<MenuItem | null>(null);

  // Controla se o modal de combo está aberto ou fechado
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  // Controla se a barra lateral do carrinho está aberta ou fechada
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ===== Estado de Autenticação =====

  // Controla se o usuário está autenticado (logado) no sistema admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // ===== Manipuladores do Modal de Personalização de Pizza =====

  /**
   * Abre o modal de personalização para uma pizza específica
   * @param pizza - Item de pizza selecionado para personalizar
   */
  const handleOrderPizza = (pizza: MenuItem) => setPizzaToCustomize(pizza);

  /**
   * Fecha o modal de personalização de pizza
   */
  const handleClosePizzaModal = () => setPizzaToCustomize(null);

  // ===== Manipuladores do Carrinho de Compras =====

  /**
   * Adiciona um item personalizado ao carrinho (ex: pizza customizada)
   * @param item - Item do carrinho já configurado com customizações
   */
  const handleAddToCart = (item: CartItem) => {
    // Adiciona o novo item ao carrinho mantendo os itens existentes
    setCart(currentCart => [...currentCart, item]);
    // Fecha o modal de personalização após adicionar
    handleClosePizzaModal();
  };

  /**
   * Adiciona um item simples ao carrinho (sem customização)
   * Se o item já existir, incrementa a quantidade ao invés de duplicar
   * @param item - Item do menu a ser adicionado
   */
  const handleAddItem = (item: MenuItem) => {
    setCart(currentCart => {
      // Procura se o item já existe no carrinho (sem customização e sem ser promo)
      const existingItemIndex = currentCart.findIndex(cartItem =>
        cartItem.item.id === item.id && !cartItem.customization && !cartItem.isPromo
      );

      // Se o item já existe no carrinho
      if (existingItemIndex > -1) {
        // Cria uma cópia do carrinho
        const newCart = [...currentCart];
        // Incrementa a quantidade do item existente
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      // Se o item não existe, adiciona como novo item com quantidade 1
      return [...currentCart, { item, quantity: 1 }];
    });
  };

  // ===== Manipulador de Combos Promocionais =====

  /**
   * Adiciona um combo promocional ao carrinho
   * Combo: 2 Pizzas Grandes + 1 Bebida = R$ 89,90
   * @param pizza1 - Primeira pizza do combo
   * @param pizza2 - Segunda pizza do combo
   * @param drink - Bebida do combo
   */
  const handleAddCombo = (pizza1: MenuItem, pizza2: MenuItem, drink: MenuItem) => {
    // Lógica de preço do combo:
    // - Total do combo: R$ 89,90
    // - Bebida: R$ 12,00
    // - Restante para 2 pizzas: R$ 77,90
    // - Preço por pizza: R$ 38,95
    // 
    // Usamos 'isPromo: true' para que a função de cálculo de preço
    // NÃO adicione os R$ 10,00 extras do tamanho 'grande'

    const comboDrinkPrice = 12.00; // Preço da bebida no combo
    const pizzaPrice = 38.95; // Preço de cada pizza no combo

    // Configura a primeira pizza do combo
    const p1: CartItem = {
      item: { ...pizza1, price: pizzaPrice },
      quantity: 1,
      isPromo: true, // Marca como promoção para evitar acréscimos no preço
      customization: { size: 'large', crust: 'classic', flavors: [pizza1] }
    };

    // Configura a segunda pizza do combo
    const p2: CartItem = {
      item: { ...pizza2, price: pizzaPrice },
      quantity: 1,
      isPromo: true, // Marca como promoção para evitar acréscimos no preço
      customization: { size: 'large', crust: 'classic', flavors: [pizza2] }
    };

    // Configura a bebida do combo
    const d1: CartItem = {
      item: { ...drink, price: comboDrinkPrice },
      quantity: 1,
      isPromo: true // Marca como promoção
    };

    // Adiciona os 3 itens do combo ao carrinho de uma vez
    setCart(current => [...current, p1, p2, d1]);

    // Fecha o modal de combo
    setIsComboModalOpen(false);

    // Abre o carrinho para o cliente visualizar os itens adicionados
    setIsCartOpen(true);
  };

  // ===== Finalização de Pedido (Checkout) =====

  /**
   * Processa a ação de ir para o checkout
   * Fecha o carrinho e navega para a tela de finalização
   */
  const handleProceedToCheckout = () => {
    // Impede prosseguir se o carrinho estiver vazio
    if (cart.length === 0) return;

    // Fecha a barra lateral do carrinho
    setIsCartOpen(false);

    // Navega para a tela de checkout
    setView(View.Checkout);
  };

  /**
   * Processa e finaliza um pedido
   * Calcula o total, aplica descontos, registra o cliente se necessário e cria o pedido
   * @param details - Detalhes do pedido (tipo, cliente, endereço, mesa, desconto, etc)
   */
  const handlePlaceOrder = (details: {
    orderType: OrderType;      // Tipo do pedido (delivery, retirada, local)
    customerName: string;       // Nome do cliente
    phone?: string;            // Telefone do cliente (opcional)
    customerId?: number;       // ID do cliente se já cadastrado (opcional)
    address?: string;          // Endereço de entrega (opcional)
    tableId?: number,          // ID da mesa (opcional, para pedidos locais)
    discount?: number          // Valor do desconto em reais (opcional)
  }) => {
    // Calcula o total do carrinho somando todos os itens
    const cartTotal = cart.reduce((sum, cartItem) => {
      // Para pizzas, usa a função de cálculo especial que considera customizações
      // Para outros itens, usa o preço direto
      const itemPrice = cartItem.item.category === 'pizza'
        ? calculatePizzaPrice(cartItem)
        : cartItem.item.price;

      // Multiplica o preço pela quantidade e soma ao total
      return sum + itemPrice * cartItem.quantity;
    }, 0);

    // Calcula taxa de entrega
    // - Entrega grátis para pedidos acima de R$ 80,00
    // - Taxa de R$ 5,00 para pedidos de delivery abaixo de R$ 80,00
    // - R$ 0,00 para retirada e pedidos locais
    const deliveryFee = details.orderType === OrderType.Delivery
      ? (cartTotal >= 80 ? 0 : 5.00)
      : 0;

    // Obtém o valor do desconto (0 se não houver)
    const discount = details.discount || 0;

    // Calcula o total final = subtotal + taxa de entrega - desconto
    // Math.max garante que o total nunca seja negativo
    const finalTotal = Math.max(0, cartTotal + deliveryFee - discount);

    // ===== Gerenciamento de Cliente =====
    // Tenta vincular a um cliente existente ou criar um novo
    let finalCustomerId = details.customerId;

    // Se não foi fornecido um ID mas há telefone
    if (!finalCustomerId && details.phone) {
      // Procura se já existe um cliente com esse telefone
      const existingCustomer = customers.find(c => c.phone === details.phone);

      if (existingCustomer) {
        // Se encontrou, usa o ID do cliente existente
        finalCustomerId = existingCustomer.id;
      } else {
        // Se não encontrou, cria um novo cliente automaticamente
        // Isso permite que o sistema VIP funcione nos próximos pedidos
        const newCustomer: Customer = {
          id: Date.now(),                    // Gera ID único baseado no timestamp
          name: details.customerName,         // Nome fornecido no pedido
          phone: details.phone,              // Telefone fornecido
          email: '',                         // Email vazio por enquanto
          address: details.address           // Endereço se fornecido
        };

        // Adiciona o novo cliente à lista de clientes
        setCustomers(prev => [...prev, newCustomer]);

        // Usa o ID do novo cliente
        finalCustomerId = newCustomer.id;
      }
    }

    // ===== Criação do Pedido =====
    const newOrder: Order = {
      id: Date.now(),                        // ID único baseado no timestamp
      type: details.orderType,               // Tipo do pedido
      status: OrderStatus.Pending,           // Status inicial: Pendente
      items: cart,                           // Itens do carrinho
      total: finalTotal,                     // Total calculado
      discount: discount,                    // Desconto aplicado
      customerName: details.customerName,    // Nome do cliente
      customerId: finalCustomerId,           // ID do cliente (se vinculado)
      address: details.address,              // Endereço de entrega (se houver)
      tableId: details.tableId,              // ID da mesa (se for pedido local)
      createdAt: new Date().toISOString(),   // Data/hora de criação em formato ISO
    };

    // Adiciona o novo pedido no início da lista de pedidos
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    // Se o pedido está vinculado a uma mesa
    if (details.tableId) {
      // Atualiza o status da mesa para "Ocupada" e vincula o pedido
      setTables(prevTables =>
        prevTables.map(table =>
          table.id === details.tableId
            ? { ...table, status: TableStatus.Occupied, orderId: newOrder.id }
            : table
        )
      );
    }

    // Exibe mensagem de sucesso para o usuário
    alert('Pedido realizado com sucesso! Acompanhe o status no painel do administrador.');

    // Limpa o carrinho após o pedido ser criado
    setCart([]);

    // Retorna para a tela inicial
    setView(View.Home);
  };

  // ===== Autenticação =====

  /**
   * Processa o login do administrador
   * @param username - Nome de usuário
   * @param password - Senha do usuário
   */
  const handleLogin = (username: string, password: string) => {
    // Em um sistema real, aqui seria feita a validação com backend
    // Por ora, a validação já é feita no LoginScreen
    setIsAuthenticated(true);
    setView(View.Admin);
  };

  /**
   * Processa o logout do administrador
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setView(View.Home);
  };


  /**
   * Renderiza o conteúdo principal baseado na tela atual
   * @returns Componente da tela atual
   */
  const renderContent = () => {
    switch (view) {
      // Tela Inicial
      case View.Home:
        return <HomeScreen setView={setView} onOpenCombo={() => setIsComboModalOpen(true)} />;

      // Tela do Cardápio
      case View.Order:
        return <MenuScreen menuItems={menuItems} onOrderPizza={handleOrderPizza} onAddItem={handleAddItem} />;

      // Tela de Finalização do Pedido
      case View.Checkout:
        return <CheckoutScreen
          cart={cart}
          tables={tables}
          coupons={coupons}
          orders={orders}
          customers={customers}
          onPlaceOrder={handlePlaceOrder}
          setView={setView}
        />;

      // Painel Administrativo (requer autenticação)
      case View.Admin:
        // Se não estiver autenticado, mostra tela de login
        if (!isAuthenticated) {
          return <LoginScreen onLogin={handleLogin} setView={setView} />;
        }
        // Se estiver autenticado, mostra o painel admin
        return <AdminScreen
          menuItems={menuItems} setMenuItems={setMenuItems}
          orders={orders} setOrders={setOrders}
          tables={tables} setTables={setTables}
          customers={customers} setCustomers={setCustomers}
          coupons={coupons} setCoupons={setCoupons}
          setView={setView}
          onLogout={handleLogout}
        />;

      // Caso padrão: retorna para a tela inicial
      default:
        return <HomeScreen setView={setView} onOpenCombo={() => setIsComboModalOpen(true)} />;
    }
  };

  // ===== Renderização do Componente =====
  return (
    <div className="font-sans antialiased text-gray-800">
      {/* Exibe o Header em todas as telas exceto no painel Admin */}
      {view !== View.Admin && (
        <Header
          setView={setView}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
        />
      )}

      {/* Renderiza o conteúdo da tela atual */}
      {renderContent()}

      {/* Modal de Personalização de Pizza - Só aparece quando uma pizza está sendo customizada */}
      {pizzaToCustomize && (
        <PizzaModal
          pizza={pizzaToCustomize}
          allPizzas={pizzas}
          onClose={handleClosePizzaModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Modal de Combo - Só aparece quando o usuário clica no botão de combo */}
      {isComboModalOpen && (
        <ComboModal
          // Filtra apenas pizzas do menu
          pizzas={menuItems.filter(i => i.category === 'pizza')}
          // Filtra apenas bebidas do menu
          drinks={menuItems.filter(i => i.category === 'drink')}
          onClose={() => setIsComboModalOpen(false)}
          onAddCombo={handleAddCombo}
        />
      )}

      {/* Barra Lateral do Carrinho - Desliza da direita quando aberta */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
};

export default App;
