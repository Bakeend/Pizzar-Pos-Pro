<h1>🍕 Pizza POS Pro</h1>
<p><strong>Sistema completo de ponto de venda (POS) para pizzarias</strong><br>
Frontend em React, backend em Node.js/Express com TypeScript, banco de dados SQL Server 2022, tudo 100% dockerizado.</p>

<hr>

<h2>📋 Características</h2>
<ul>
  <li><strong>Frontend:</strong> React 19, TypeScript, Vite</li>
  <li><strong>Backend:</strong> Node.js, Express, TypeScript</li>
  <li><strong>Banco de Dados:</strong> SQL Server 2022</li>
  <li><strong>Containerização:</strong> Docker + Docker Compose</li>
  <li><strong>Funcionalidades:</strong>
    <ul>
      <li>Sistema de pedidos (delivery, balcão, mesa)</li>
      <li>Gerenciamento de cardápio</li>
      <li>Gestão de mesas</li>
      <li>Cadastro de clientes</li>
      <li>Cupons de desconto</li>
      <li>Relatórios e analytics</li>
      <li>Kitchen Display System (KDS)</li>
      <li>Customização de pizzas</li>
    </ul>
  </li>
</ul>

<hr>

<h2>🚀 Início Rápido (com Docker)</h2>

<h3>⚙️ Pré-requisitos</h3>
<ul>
  <li>Docker e Docker Compose instalados</li>
  <li>Git instalado</li>
</ul>

<h3>⏳ Instalação rápida</h3>
<ol>
  <li>Clone o repositório:
    <pre><code>git clone https://github.com/Bakeend/Pizzar-Pos-Pro.git
cd Pizzar-Pos-Pro
</code></pre>
  </li>
  <li>Copie os arquivos de exemplo de ambiente:
    <pre><code>cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
</code></pre>
  </li>
  <li>(Opcional) Edite as variáveis de ambiente se necessário.</li>
  <li>Suba tudo com Docker Compose:
    <pre><code>docker-compose up --build
</code></pre>
  </li>
  <li>Acesse:
    <ul>
      <li>Frontend: <a href="http://localhost:3000">http://localhost:3000</a></li>
      <li>Backend: <a href="http://localhost:3001">http://localhost:3001</a></li>
    </ul>
  </li>
</ol>

<hr>

<h2>🧑‍💻 Desenvolvimento sem Docker</h2>
<ol>
  <li>Inicie o banco de dados SQL Server localmente (veja <code>scripts/init.sql</code>).</li>
  <li>Instale dependências do backend e rode:
    <pre><code>cd backend
npm install
npm run dev
</code></pre>
  </li>
  <li>Instale dependências do frontend e rode:
    <pre><code>cd frontend
npm install
npm run dev
</code></pre>
  </li>
</ol>

<hr>

<h2>📚 Guia do Usuário</h2>
<ul>
  <li><strong>Cadastro de produtos:</strong> painel → Cardápio → Adicionar produto.</li>
  <li><strong>Novo pedido:</strong> painel → Pedidos → Novo pedido → selecione cliente, mesa ou delivery → selecione pizza e opções customizadas.</li>
  <li><strong>Visualização de pedidos em preparo:</strong> KDS no painel principal.</li>
  <li><strong>Relatórios:</strong> menu lateral → Relatórios → escolha período.</li>
</ul>

<hr>

<h2>🛠️ Dicas & Soluções de Problemas</h2>
<ul>
  <li>Para parar os containers:
    <pre><code>docker-compose down
</code></pre>
  </li>
  <li>Logs em tempo real:
    <pre><code>docker-compose logs -f
</code></pre>
  </li>
  <li>Erro de conexão com SQL: verifique as variáveis de ambiente no backend.</li>
</ul>

<hr>

<h2>🙋 Contribua!</h2>
<ol>
  <li>Faça um fork e, ao clonar, crie uma branch.</li>
  <li>Adicione seus recursos ou corrija bugs.</li>
  <li>Envie um pull request detalhado.</li>
</ol>

<hr>
