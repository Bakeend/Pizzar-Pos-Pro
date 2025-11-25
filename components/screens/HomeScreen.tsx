
import React from 'react';
import { View } from '../../types';
import { TruckIcon, CheckCircleIcon, PizzaIcon, ClockIcon } from '../icons';

interface HomeScreenProps {
  setView: (view: View) => void;
  onOpenCombo: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setView, onOpenCombo }) => {
  return (
    <div className="bg-brand-light min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=2069&auto=format&fit=crop" 
                alt="Pizza Background" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-brand-dark"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-block border border-brand-yellow/50 bg-brand-yellow/10 backdrop-blur-md px-6 py-2 rounded-full mb-4">
                <span className="text-brand-yellow font-bold tracking-[0.2em] uppercase text-sm">A Autêntica Experiência</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.1]" style={{ fontFamily: "'Roboto Slab', serif" }}>
                Pizza de Verdade,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-orange-500">Feita com Paixão.</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
                Ingredientes frescos, massa de longa fermentação e o sabor inconfundível do forno a lenha. Experimente o melhor da Itália no conforto da sua casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <button 
                    onClick={() => setView(View.Order)} 
                    className="w-full sm:w-auto bg-brand-red hover:bg-red-600 text-white text-lg font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(229,57,53,0.5)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(229,57,53,0.7)] flex items-center justify-center gap-3 group"
                >
                    <PizzaIcon className="w-6 h-6 transition-transform group-hover:rotate-12" />
                    Peça Agora
                </button>
                <button 
                    onClick={() => {
                         const element = document.getElementById('about');
                         element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:border-brand-yellow/50"
                >
                    Saiba Mais
                </button>
            </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 bg-white relative z-10 -mt-12 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-dark mb-4" style={{ fontFamily: "'Roboto Slab', serif" }}>Por que escolher a Pizza POS Pro?</h2>
                <div className="w-24 h-1 bg-brand-red mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="p-8 rounded-3xl hover:bg-gray-50 transition-colors duration-300 group">
                    <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <ClockIcon className="w-10 h-10 text-brand-red group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Entrega Rápida</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Nossa logística otimizada garante que sua pizza chegue quentinha e crocante em tempo recorde. Acompanhe cada etapa.
                    </p>
                </div>
                <div className="p-8 rounded-3xl hover:bg-gray-50 transition-colors duration-300 group">
                    <div className="w-24 h-24 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <CheckCircleIcon className="w-10 h-10 text-brand-yellow group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Qualidade Premium</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Utilizamos apenas ingredientes frescos, selecionados diariamente de produtores locais. Queijos nobres e molho de tomate 100% natural.
                    </p>
                </div>
                <div className="p-8 rounded-3xl hover:bg-gray-50 transition-colors duration-300 group">
                    <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-green group-hover:scale-110 transition-all duration-300 shadow-sm">
                         <PizzaIcon className="w-10 h-10 text-brand-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Sabor Autêntico</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Nossas receitas seguem a tradição italiana, com massa de fermentação lenta (48h) que resulta em leveza e sabor incomparáveis.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Popular Banner */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
         {/* Decorative circles */}
         <div className="absolute top-0 left-0 w-64 h-64 bg-brand-red opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

         <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="lg:w-1/2 space-y-8">
                <span className="text-brand-yellow font-bold tracking-widest uppercase">Oferta Especial</span>
                <h2 className="text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>
                    Combo Família <br/>
                    <span className="text-brand-red">Suprema</span>
                </h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                    A combinação perfeita para o seu fim de semana. Leve 2 Pizzas Grandes (Sabor Tradicional) + 1 Bebida por um preço imperdível.
                </p>
                
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm w-fit">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 line-through mb-1">De R$ 112,00</p>
                        <p className="text-4xl font-bold text-brand-green">R$ 89,90</p>
                    </div>
                    <div className="h-12 w-px bg-white/20"></div>
                    <button 
                        onClick={onOpenCombo}
                        className="bg-white hover:bg-gray-100 text-brand-dark font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                    >
                        Pedir Agora
                    </button>
                </div>
            </div>
            <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-brand-red rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
                <img 
                    src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop" 
                    alt="Pizza Promo" 
                    className="relative z-10 w-full rounded-2xl shadow-2xl transform md:rotate-3 group-hover:rotate-0 transition-transform duration-700"
                />
            </div>
         </div>
      </section>

      {/* Gallery / Instagram placeholder */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center mb-12">
             <h2 className="text-3xl font-bold text-brand-dark mb-4" style={{ fontFamily: "'Roboto Slab', serif" }}>Siga @PizzaPOSPro</h2>
             <p className="text-gray-500">Compartilhe seus momentos com a gente!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-4 max-w-7xl mx-auto">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" alt="Gallery 1" className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"/>
            <img src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=500&q=80" alt="Gallery 2" className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"/>
            <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80" alt="Gallery 3" className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"/>
            <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80" alt="Gallery 4" className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"/>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
                <h4 className="text-white text-xl font-bold mb-6" style={{ fontFamily: "'Roboto Slab', serif" }}>Pizza POS Pro</h4>
                <p className="mb-6 leading-relaxed">A melhor experiência em pizza, do pedido à entrega. Qualidade, sabor e tecnologia unidas para servir você.</p>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition-all cursor-pointer">
                        <span className="sr-only">Facebook</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition-all cursor-pointer">
                         <span className="sr-only">Instagram</span>
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.073-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="text-white text-lg font-bold mb-6">Links Rápidos</h4>
                <ul className="space-y-3">
                    <li><button onClick={() => setView(View.Home)} className="hover:text-brand-red transition-colors">Início</button></li>
                    <li><button onClick={() => setView(View.Order)} className="hover:text-brand-red transition-colors">Cardápio Completo</button></li>
                    <li><button onClick={() => { const el = document.getElementById('about'); el?.scrollIntoView({behavior:'smooth'})}} className="hover:text-brand-red transition-colors">Sobre Nós</button></li>
                    <li><a href="#" className="hover:text-brand-red transition-colors">Política de Privacidade</a></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white text-lg font-bold mb-6">Horários</h4>
                <ul className="space-y-3">
                    <li className="flex justify-between border-b border-gray-800 pb-2"><span>Seg - Qui</span> <span className="text-white">18:00 - 23:00</span></li>
                    <li className="flex justify-between border-b border-gray-800 pb-2"><span>Sex - Sáb</span> <span className="text-white">18:00 - 00:00</span></li>
                    <li className="flex justify-between border-b border-gray-800 pb-2"><span>Domingo</span> <span className="text-white">17:00 - 23:00</span></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white text-lg font-bold mb-6">Onde Estamos</h4>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                         <svg className="w-5 h-5 text-brand-red shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                         <span>Av. das Pizzas, 123<br/>Bairro do Sabor, SP</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span className="text-white text-lg font-bold">(11) 99999-8888</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span>contato@pizzapospro.com</span>
                    </li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 text-center mt-8 pt-8 border-t border-gray-800 text-sm text-gray-600">
            &copy; 2024 Pizza POS Pro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
