let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];

// Salvar localmente
function salvarDados() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
}

// Mostrar os produtos após inserir/atualiza/remover
function mostrarProdutos() {
    const tbody = document.querySelector('#produtosTabela tbody');
    tbody.innerHTML = '';
    produtos.forEach(prod => {
        // Mostrar a disponibilidade com base na validade e quantidade
        let status = '';
        const hoje = new Date().toISOString().split('T')[0];
        if (prod.validade <= hoje) status += '<span style=color:red>Produto Vencido!</span>';
        else if (prod.quantidade == 0) status += '<span style=color:orange>Fora de Estoque!</span>';
        else status += '<span style=color:green>Disponível!</span>';

        let fornecedorInfo = `${prod.fornecedor.nome}<br>${prod.fornecedor.contato}`;
        // Botões de ação para editar e remover
        let acoes = `
          <button onclick='editarProduto("${prod.codigo}")' title='Editar' 
              class='btn btn-sm btn-warning'>✏️</button> 
          <button onclick='removerProduto("${prod.codigo}")' title='Remover'
              class='btn btn-sm btn-danger'>🗑️</button>`;

        let avs = avaliacoes.filter(a => a.codigo === prod.codigo)
                            .map(a => `<li>${a.comentario}</li>`).join('');

        tbody.innerHTML += `
          <tr><td>${prod.codigo}</td><td>${prod.nome}</td><td>${prod.quantidade}</td><td>${prod.validade}</td><td>${Number(prod.preco).toFixed(2)}</td><td>${fornecedorInfo}</td><td>${status}</td><td>${acoes}</td><td><ul>${avs}</ul></td></tr>`;
    });
}

mostrarProdutos();

// Adicionar/Atualizar produto
document.getElementById('produtoForm').onsubmit = function(e){
    e.preventDefault();

    const codigo = document.getElementById('codigo').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const quantidade = Number(document.getElementById('quantidade').value);
    const validade = document.getElementById('validade').value;
    const preco = Number(document.getElementById('preco').value);

    const fornecedor_nome = document.getElementById('fornecedor_nome').value.trim();
    const fornecedor_contato = document.getElementById('fornecedor_contato').value.trim();

    if (!codigo) return alert("Informe o código único!");

    let idp = produtos.findIndex(p => p.codigo === codigo);

    if(idp >= 0){
    
      produtos[idp] = {codigo, nome, quantidade, validade, preco,
                       fornecedor:{nome:fornecedor_nome, contato:fornecedor_contato}};
      alert("Produto atualizado!");

      if(quantidade > 20) alert("Estoque alto! Procure baixar os preços para aumentar as vendas e evitar perdas!");

      let diasRestantes = Math.ceil((new Date(validade)-new Date())/(1000*60*60*24));
      if(diasRestantes <= 7 && diasRestantes >= 0)
         alert("Produto próximo do vencimento! Tente alguma promoção para evitar perdas.");

   }else{
      produtos.push({codigo, nome, quantidade, validade, preco,
                     fornecedor:{nome:fornecedor_nome, contato:fornecedor_contato}});
   }

   salvarDados();
   mostrarProdutos();
   this.reset();
};

function removerProduto(codigo){
   if(confirm("Remover este produto?")){
     produtos = produtos.filter(p=>p.codigo!==codigo);
     salvarDados(); mostrarProdutos();
   }
}

function editarProduto(codigo){
   let p = produtos.find(p=>p.codigo===codigo);
   if(!p) return;
   document.getElementById('codigo').value=p.codigo;
   document.getElementById('nome').value=p.nome;
   document.getElementById('quantidade').value=p.quantidade;
   document.getElementById('validade').value=p.validade;
   document.getElementById('preco').value=p.preco;
   document.getElementById('fornecedor_nome').value=p.fornecedor.nome;
   document.getElementById('fornecedor_contato').value=p.fornecedor.contato;
}

document.getElementById('avaliacaoForm').onsubmit=function(e){
   e.preventDefault();
   const codigo=document.getElementById('codigoAvaliacao').value.trim();
   const comentario=document.getElementById('comentarioAvaliacao').value.trim();

   if(!produtos.some(p=>p.codigo===codigo)){
       alert("Código não encontrado!");
       return;
   }

   avaliacoes.push({codigo, comentario});
   salvarDados();
   mostrarAvaliacoes();
   mostrarProdutos();
   this.reset();
};

function mostrarAvaliacoes(){
  let ul=document.getElementById('listaAvaliacoes');
  ul.innerHTML='';
  avaliacoes.slice(-10).reverse().forEach(a=>{
     ul.innerHTML+=`<li class='list-group-item'><b>[${a.codigo}]</b>: ${a.comentario}</li>`;
  });
}
mostrarAvaliacoes();