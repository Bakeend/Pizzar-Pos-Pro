
import React, { useState, ReactNode, useEffect } from 'react';
import { AdminView, Order, Table, CartItem, OrderStatus, OrderType, TableStatus, MenuItem, Customer, Coupon } from '../../types';
import Dashboard from '../admin/Dashboard';
import TableView from '../admin/TableView';
import KdsView from '../admin/KdsView';
import PosView from '../admin/PosView';
import OrdersView from '../admin/OrdersView';
import ProductsView from '../admin/ProductsView';
import ProductModal from '../admin/ProductModal';
import ReportsView from '../admin/ReportsView';
import CustomersView from '../admin/CustomersView';
import CustomerModal from '../admin/CustomerModal';
import CouponsView from '../admin/CouponsView';
import CouponModal from '../admin/CouponModal';
import TableDetailsModal from '../admin/TableDetailsModal';
import { DashboardIcon, PosIcon, TableIcon, OrdersIcon, KdsIcon, ProductsIcon, ReportsIcon, UsersIcon, MenuIcon, TicketIcon } from '../icons';
import BrandLogo from '../BrandLogo';

interface AdminScreenProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
}

const viewLabels: Record<AdminView, string> = {
  [AdminView.Dashboard]: 'Dashboard',
  [AdminView.POS]: 'PDV',
  [AdminView.Tables]: 'Mesas',
  [AdminView.Orders]: 'Pedidos',
  [AdminView.KDS]: 'KDS',
  [AdminView.Products]: 'Produtos',
  [AdminView.Customers]: 'Clientes',
  [AdminView.Coupons]: 'Cupons',
  [AdminView.Reports]: 'Relatórios',
};

const AdminScreen: React.FC<AdminScreenProps> = ({ menuItems, setMenuItems, orders, setOrders, tables, setTables, customers, setCustomers, coupons, setCoupons }) => {
  const [activeView, setActiveView] = useState<AdminView>(AdminView.Dashboard);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [viewingTableDetailsId, setViewingTableDetailsId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);

  // Customer Management State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Coupon Management State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setTables(currentTables => {
        let tablesHaveChanged = false;
        const updatedTables = [...currentTables];

        orders.forEach(order => {
          if (order.status === OrderStatus.Preparing && order.startedPreparingAt && order.tableId) {
            const totalPrepTime = order.items.reduce((sum, item) => sum + (item.item.preparationTime || 0) * item.quantity, 0);
            const startTime = new Date(order.startedPreparingAt);
            const elapsedTime = (new Date().getTime() - startTime.getTime()) / (1000 * 60); // in minutes

            if (elapsedTime > totalPrepTime) {
              const tableIndex = updatedTables.findIndex(t => t.id === order.tableId);
              if (tableIndex !== -1 && updatedTables[tableIndex].status !== TableStatus.NeedsAttention) {
                updatedTables[tableIndex].status = TableStatus.NeedsAttention;
                tablesHaveChanged = true;
              }
            }
          }
        });

        return tablesHaveChanged ? updatedTables : currentTables;
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [orders, setTables]);


  const handleFinalizeOrder = (
      cart: CartItem[], 
      total: number, 
      tableId: number | null, 
      customer?: Customer | null, 
      walkInName?: string
  ) => {
      const selectedTable = tables.find(t => t.id === tableId);
      
      let finalCustomerName = 'Venda Balcão';
      
      if (customer) {
          finalCustomerName = customer.name;
      } else if (walkInName && walkInName.trim() !== '') {
          finalCustomerName = walkInName;
      } else if (selectedTable) {
          finalCustomerName = selectedTable.name;
      }

      const newOrder: Order = {
          id: Date.now(),
          type: tableId ? OrderType.DineIn : OrderType.Takeout,
          status: OrderStatus.Pending,
          items: cart,
          total: total,
          customerName: finalCustomerName,
          customerId: customer?.id, // Link the ID if customer exists
          tableId: tableId ?? undefined,
          createdAt: new Date().toISOString(),
      };

      setOrders(prevOrders => [newOrder, ...prevOrders]);

      if (tableId) {
          setTables(prevTables => 
              prevTables.map(table => 
                  table.id === tableId 
                  ? { ...table, status: TableStatus.Occupied, orderId: newOrder.id }
                  : table
              )
          );
      }
  };

  const handleStartPreparation = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: OrderStatus.Preparing, startedPreparingAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleMarkAsReady = (orderId: number) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;
  
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: OrderStatus.Ready } : order
      )
    );
  
    if (orderToUpdate.tableId) {
      setTables(prevTables =>
        prevTables.map(table =>
          table.id === orderToUpdate.tableId && table.status === TableStatus.NeedsAttention
            ? { ...table, status: TableStatus.Occupied }
            : table
        )
      );
    }
  };
  
  const handleOrderDelivered = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: OrderStatus.Completed } : order
      )
    );
  };


  const handleReleaseTable = (tableId: number) => {
    const tableToRelease = tables.find(t => t.id === tableId);
    if (!tableToRelease || !tableToRelease.orderId) return;
  
    const orderIdToComplete = tableToRelease.orderId;
  
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderIdToComplete ? { ...order, status: OrderStatus.Completed } : order
      )
    );
  
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId
          ? { ...table, status: TableStatus.Available, orderId: undefined }
          : table
      )
    );
  
    setViewingTableDetailsId(null);
  };

  // Product Handlers
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product: MenuItem) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const handleSaveProduct = (product: MenuItem) => {
    if (editingProduct) {
        // Update existing product
        setMenuItems(prevItems => prevItems.map(item => item.id === product.id ? product : item));
    } else {
        // Add new product
        setMenuItems(prevItems => [...prevItems, { ...product, id: Date.now() }]);
    }
    closeProductModal();
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Customer Handlers
  const handleAddCustomerClick = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleEditCustomerClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleSaveCustomer = (customer: Customer) => {
    if (editingCustomer) {
        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    } else {
        setCustomers(prev => [...prev, { ...customer, id: Date.now() }]);
    }
    closeCustomerModal();
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  // Coupon Handlers
  const handleAddCouponClick = () => {
    setEditingCoupon(null);
    setIsCouponModalOpen(true);
  };

  const handleEditCouponClick = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  const handleSaveCoupon = (coupon: Coupon) => {
    if (editingCoupon) {
        setCoupons(prev => prev.map(c => c.code === coupon.code ? coupon : c));
    } else {
        if (coupons.some(c => c.code === coupon.code)) {
            alert('Já existe um cupom com este código!');
            return;
        }
        setCoupons(prev => [...prev, coupon]);
    }
    closeCouponModal();
  };

  const closeCouponModal = () => {
      setIsCouponModalOpen(false);
      setEditingCoupon(null);
  };


  const tableForModal = tables.find(t => t.id === viewingTableDetailsId);

  const renderView = () => {
    switch (activeView) {
      case AdminView.Dashboard:
        return <Dashboard orders={orders} />;
      case AdminView.Tables:
        return <TableView 
                    tables={tables}
                    setActiveView={setActiveView}
                    selectedTableId={selectedTableId}
                    setSelectedTableId={setSelectedTableId}
                    setViewingTableDetailsId={setViewingTableDetailsId}
                />;
      case AdminView.KDS:
        return <KdsView 
                  orders={orders} 
                  onStartPreparation={handleStartPreparation} 
                  onMarkAsReady={handleMarkAsReady}
                  onOrderDelivered={handleOrderDelivered}
                />;
      case AdminView.POS:
        return <PosView 
                    selectedTableId={selectedTableId} 
                    onFinalizeOrder={handleFinalizeOrder}
                    setActiveView={setActiveView}
                    menuItems={menuItems}
                    customers={customers}
                    onAddCustomer={handleAddCustomerClick}
                />;
      case AdminView.Orders:
        return <OrdersView orders={orders} tables={tables} />;
      case AdminView.Products:
        return <ProductsView 
                    menuItems={menuItems} 
                    onAddProduct={handleAddProductClick}
                    onEditProduct={handleEditProductClick}
                    onDeleteProduct={handleDeleteProduct}
                />;
      case AdminView.Customers:
        return <CustomersView
                    customers={customers}
                    orders={orders || []}
                    onAddCustomer={handleAddCustomerClick}
                    onEditCustomer={handleEditCustomerClick}
                    onDeleteCustomer={handleDeleteCustomer}
                />;
      case AdminView.Coupons:
        return <CouponsView
                    coupons={coupons}
                    onAddCoupon={handleAddCouponClick}
                    onEditCoupon={handleEditCouponClick}
                    onDeleteCoupon={handleDeleteCoupon}
                />;
      case AdminView.Reports:
        return <ReportsView orders={orders} />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  interface NavItemProps {
    view: AdminView;
    icon: ReactNode;
    label: string;
  }
  
  const NavItem: React.FC<NavItemProps> = ({ view, icon, label }) => (
    <li
      onClick={() => {
        if (view === AdminView.POS) {
          setSelectedTableId(null);
        }
        setActiveView(view);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        activeView === view
          ? 'bg-brand-red text-white shadow-inner'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-brand-dark text-white flex flex-col p-4 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
            className="flex items-center mb-8 p-3 cursor-pointer hover:bg-gray-800 rounded-lg transition-colors group" 
            onClick={() => {
              setActiveView(AdminView.Dashboard);
              setIsSidebarOpen(false);
            }}
        >
          <BrandLogo className="h-10 w-10 mr-3 transform transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"/>
          <div>
            <h2 className="text-xl font-bold tracking-wider leading-none text-brand-yellow" style={{ fontFamily: "'Roboto Slab', serif" }}>PIZZA</h2>
            <p className="text-[0.65rem] font-bold text-white tracking-[0.2em] leading-none mt-1">POS PRO</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <NavItem view={AdminView.Dashboard} icon={<DashboardIcon className="h-6 w-6"/>} label="Dashboard" />
            <NavItem view={AdminView.POS} icon={<PosIcon className="h-6 w-6"/>} label="PDV" />
            <NavItem view={AdminView.Tables} icon={<TableIcon className="h-6 w-6"/>} label="Mesas" />
            <NavItem view={AdminView.Orders} icon={<OrdersIcon className="h-6 w-6"/>} label="Pedidos" />
            <NavItem view={AdminView.KDS} icon={<KdsIcon className="h-6 w-6"/>} label="KDS" />
            <NavItem view={AdminView.Products} icon={<ProductsIcon className="h-6 w-6"/>} label="Produtos" />
            <NavItem view={AdminView.Customers} icon={<UsersIcon className="h-6 w-6"/>} label="Clientes" />
            <NavItem view={AdminView.Coupons} icon={<TicketIcon className="h-6 w-6"/>} label="Cupons" />
            <NavItem view={AdminView.Reports} icon={<ReportsIcon className="h-6 w-6"/>} label="Relatórios" />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col w-full">
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 shadow-sm flex items-center">
             <button 
                className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
             >
                <MenuIcon className="h-6 w-6" />
             </button>

             <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <button 
                    onClick={() => setActiveView(AdminView.Dashboard)}
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-red transition-colors"
                  >
                    Admin
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-bold text-gray-800 md:ml-2">{viewLabels[activeView]}</span>
                  </div>
                </li>
              </ol>
            </nav>
        </div>
        
        <div className="flex-1 overflow-x-hidden">
            {renderView()}
        </div>

        {tableForModal && (
            <TableDetailsModal
                table={tableForModal}
                allOrders={orders}
                onClose={() => setViewingTableDetailsId(null)}
                onReleaseTable={handleReleaseTable}
            />
        )}
        {isProductModalOpen && (
            <ProductModal 
                product={editingProduct}
                onSave={handleSaveProduct}
                onClose={closeProductModal}
            />
        )}
        {isCustomerModalOpen && (
            <CustomerModal
                customer={editingCustomer}
                onSave={handleSaveCustomer}
                onClose={closeCustomerModal}
            />
        )}
        {isCouponModalOpen && (
            <CouponModal
                coupon={editingCoupon}
                onSave={handleSaveCoupon}
                onClose={closeCouponModal}
            />
        )}
      </main>
    </div>
  );
};

export default AdminScreen;