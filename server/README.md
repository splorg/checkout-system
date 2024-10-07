# Backend

## Tecnologias utilizadas
- TypeScript
- Express
- Prisma ORM
- Zod
- Docker

## Como executar

É necessário ter o Docker instalado ou uma instância do MySQL disponível.

<details>
<summary><b>Utilizando o Docker</b></summary>

```bash
docker compose up -d
```

Isso irá iniciar o MySQL em um container, por padrão expondo a porta 3306, usuário `root`, senha `root`, e banco de dados `gandaya`.

</details>

Com o docker-compose rodando (ver acima) ou seu banco de dados ativo, basta rodar:⠀

```bash
cp .env.example .env

# Preencha a variável DATABASE_URL com a URL do banco de dados
# Se estiver usando o docker-compose, a URL de exemplo já está correta
# Preencha a variável FRONTEND_URL com a URL do frontend
# Opcionalmente, preencha a variável PORT com a porta que você deseja usar
# (por padrão será usada a porta 3000)

npm install
npx prisma generate dev
npx prisma migrate dev
npm run dev
```

Sua API estará disponível em `http://localhost:3000`

## Dados de teste

Por padrão, o banco de dados será seedado com um evento de ID `01836bcf-6de8-4c1a-9200-6f16c6377b3c`, já com alguns produtos, e um usuário de ID `030dc9fc-9077-472b-b904-567234c33be2` com uma carteira inicial de R$ 100,00.

## Arquitetura

O backend foi desenvolvido buscando aplicar alguns princípios da Clean Architecture e o padrão arquitetural de **event-sourcing.** Esta abordagem persiste entidades como um histórico de eventos, aplicada ao carrinho (criação, adição/remoção de produtos, e checkout) e à carteira (criação, depósitos e débitos). Isso facilita análises posteriores, como carrinhos abandonados, itens removidos, e fluxo de saldo dos usuários.

## Endpoints

Uma collection do Postman está salva em `collection/postman.json`.

#### GET /events
Retorna todos os eventos - o banco de dados será seedado com um evento de teste

#### GET /events/:eventId/products
Retorna a lista de produtos a venda do evento especificado

#### GET /wallet/:userId
Retorna o saldo atual na carteira do usuário especificado

#### POST /wallet/:userId
Adiciona um valor (em centavos) à carteira do usuário especificado

#### GET /history/:userId
Retorna o histórico de compras do usuário especificado

#### POST /cart/create
Recebe um ID de usuário, um ID de evento, um ID do primeiro produto a ser adicionado e sua quantidade, e cria um carrinho para o usuário

#### POST /cart/add
Recebe um ID de carrinho, um ID de produto e sua quantidade, e adiciona o produto ao carrinho existente

#### DELETE /cart/:cartId/:productId
Remove um produto do carrinho especificado

#### GET /cart/:userId/:eventId
Retorna o carrinho atual do usuário especificado no evento especificado

#### POST /cart/checkout
Recebe um ID de carrinho e finaliza o checkout do mesmo, validando estoque dos produtos e saldo do usuário