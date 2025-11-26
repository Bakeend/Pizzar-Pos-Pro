<h1 align="center">🍕 Pizza POS Pro</h1>

<div align="center">

[![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)]()
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=black)]()
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)]()
[![SQL Server](https://img.shields.io/badge/Database-SQL_Server_2022-CC2927?logo=microsoft-sql-server&logoColor=white)]()

<br>

**Sistema completo de Ponto de Venda (POS) para Pizzarias.**
<br>
Gerencie pedidos, cardápios, entregas e cozinha em uma única solução moderna e dockerizada.

</div>

<hr>

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Dashboard</b></td>
      <td align="center"><b>KDS (Cozinha)</b></td>
    </tr>
    <tr>
      <td align="center">
        <img src="./docs/dashboard-placeholder.png" alt="Dashboard" width="400">
      </td>
      <td align="center">
        <img src="./docs/kds-placeholder.png" alt="KDS" width="400">
      </td>
    </tr>
  </table>
</div>

<hr>

## 📋 Sobre o Projeto

O **Pizza POS Pro** é uma solução full-stack desenvolvida para modernizar a gestão de pizzarias. Utilizando as tecnologias mais recentes do mercado, o sistema oferece uma interface ágil para os atendentes e um backend robusto para garantir a integridade dos dados.

### 🛠 Tech Stack

* **Frontend:** React 19, TypeScript, Vite.
* **Backend:** Node.js, Express, TypeScript.
* **Banco de Dados:** Microsoft SQL Server 2022.
* **Infraestrutura:** Docker & Docker Compose.

---

## ✨ Funcionalidades Principais

* 📦 **Gestão de Pedidos Multicanal:** Controle unificado para Delivery, Balcão e Salão (Mesas).
* 🍕 **Customização de Pizza:** Interface intuitiva para seleção de tamanhos, bordas e "meio-a-meio".
* 🍳 **KDS (Kitchen Display System):** Tela exclusiva para a cozinha visualizar pedidos em tempo real.
* 📝 **Cardápio Dinâmico:** Gerenciamento fácil de produtos, categorias e preços.
* 👥 **CRM Simples:** Cadastro e histórico de clientes.
* 🎟 **Cupons & Promoções:** Sistema de descontos para fidelização.
* 📊 **Analytics:** Relatórios de vendas e performance.

---

## 🚀 Instalação e Uso

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Git](https://git-scm.com/) instalado.

### 🐳 Início Rápido (Recomendado)

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/Bakeend/Pizzar-Pos-Pro.git](https://github.com/Bakeend/Pizzar-Pos-Pro.git)
    cd Pizzar-Pos-Pro
    ```

2.  **Configure as Variáveis de Ambiente**
    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

3.  **Suba os containers**
    ```bash
    docker-compose up --build
    ```

4.  **Acesse a aplicação**
    * 🖥 **Frontend:** [http://localhost:3000](http://localhost:3000)
    * ⚙️ **Backend API:** [http://localhost:3001](http://localhost:3001)

---

## 💻 Desenvolvimento Manual (Sem Docker)

Se preferir rodar localmente sem containers:

1.  **Banco de Dados:** Instale o SQL Server e execute o script `scripts/init.sql`.
2.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 📂 Estrutura do Projeto

```text
Pizzar-Pos-Pro/
├── backend/            # API Node.js Express
│   ├── src/
│   ├── prisma/         # (Se estiver usando Prisma ORM)
│   └── Dockerfile
├── frontend/           # React App
│   ├── src/
│   └── Dockerfile
├── scripts/            # Scripts de inicialização do Banco
└── docker-compose.yml  # Orquestração dos containers
