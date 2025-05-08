-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "hashSenha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Email" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "ddd" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Telefone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Localidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EPessoal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "localidadeId" INTEGER NOT NULL,
    CONSTRAINT "EPessoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EPessoal_localidadeId_fkey" FOREIGN KEY ("localidadeId") REFERENCES "Localidade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EComercial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "localidadeId" INTEGER NOT NULL,
    CONSTRAINT "EComercial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EComercial_localidadeId_fkey" FOREIGN KEY ("localidadeId") REFERENCES "Localidade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "saldo" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Conta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "contaId" INTEGER NOT NULL,
    CONSTRAINT "Entrada_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entrada_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Saida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "contaId" INTEGER NOT NULL,
    CONSTRAINT "Saida_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Saida_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Receita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "dataTentativa" DATETIME NOT NULL,
    "nota" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Receita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "validade" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL,
    "fotoUrl" TEXT,
    "dataCompra" DATETIME,
    "categoriaId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Produto_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Produto_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    CONSTRAINT "Estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Estoque_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Estoque_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valorTotal" INTEGER NOT NULL,
    "finalizada" BOOLEAN NOT NULL,
    "dataCriada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "dataCompra" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Compra_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "Lista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_userId_key" ON "Email"("email", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Telefone_numero_userId_key" ON "Telefone"("numero", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EPessoal_rua_numero_localidadeId_userId_key" ON "EPessoal"("rua", "numero", "localidadeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EComercial_rua_numero_localidadeId_userId_key" ON "EComercial"("rua", "numero", "localidadeId", "userId");

-- CreateIndex
CREATE INDEX "Conta_userId_idx" ON "Conta"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_nome_userId_key" ON "Entrada"("nome", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Saida_nome_userId_key" ON "Saida"("nome", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Receita_nome_key" ON "Receita"("nome");

-- CreateIndex
CREATE INDEX "Estoque_userId_idx" ON "Estoque"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_listaId_produtoId_userId_key" ON "Compra"("listaId", "produtoId", "userId");
