// *** Variáveis ***
let pagina = 1;
let local = '';
let tipo = '';
let remoto = false;
let senioridade = '';

// *** Funções que rodarão no início da página ***
(function (){
  'use strict';

  let lugares = localStorage.getItem('lugares');
  let tipos = localStorage.getItem('tipos');

  $('#cb-estado').attr("disabled", true);
  $('#tipo-contrato').attr("disabled", true);

  // *** SET LOCALIZAÇÕES ***
  if (!lugares){
    $.get({
      url: 'https://devjobs-dh.herokuapp.com/vagas/filtros/locais',
      success: function(result){
    
        lugares = result.map(local => (
          `<option value="${local}">${local}</option>`
        ));
          
        localStorage.setItem('lugares',lugares);
        $('#cb-estado').append(lugares);
        
        $('#cb-estado').attr("disabled", false);
    }});
  } else
  {
    $('#cb-estado').append(lugares);
    
    $('#cb-estado').attr("disabled", false);
  }

  // *** SET TIPOS DE CONTRATAÇÃO ***
  if (!tipos){
    $.get({
      url: 'https://devjobs-dh.herokuapp.com/vagas/filtros/tipos',
      success: function(result){
    
        tipos = result.map(tipo => (
          `<option value="${tipo}">${tipo}</option>`
        ));
          
        localStorage.setItem('tipos',tipos);
        $('#tipo-contrato').append(tipos);
        
        $('#tipo-contrato').attr("disabled", false);
    }});
  } else
  {
    $('#tipo-contrato').append(tipos);
    
    $('#tipo-contrato').attr("disabled", false);
  }
  
}());

// *** Método responsável por realizar a pesquisa e incluir os cards ***
const realizarPesquisa = () => {
  $('body').addClass('wait');
  const url = "https://devjobs-dh.herokuapp.com/vagas/filter?page=" + pagina;
  let parameters = '';

  if (local){
    parameters += '&local=' + local;
  }

  if (tipo){
    parameters += '&tipo=' + tipo;
  }

  if (senioridade){
    parameters += '&senioridade=' + senioridade;
  }

  if (remoto){
    parameters += '&remoto=true';
  }

  console.log(url + parameters);

  $.get({
    url: url + parameters,
    success: function(result){

    $("#container-list-vagas").empty();

    if (result.vagas.length === 0 && pagina === 1) {
      $("#container-list-vagas").append('<h3>Não há resultados</h3>');
    }

    const vagas = result.vagas.map(vaga => (
      `<div class="col mb-4">
        <div class="card h-100 card-vaga">
        <div class="logo">
          <img src="${vaga.url_logo}" class="card-img-top" alt="logo da empresa ${vaga.empresa}">
        </div>
          <div class="card-top d-flex justify-content-between">
            <h4 class="mt-4">${vaga.titulo}</h4>
          </div>
          <ul class="d-flex flex-wrap px-0">
            <li>${vaga.empresa}</li>
            <li>${vaga.localizacao.join(', ')}</li>
            <li>${vaga.data.substring(0,10)}</li>
          </ul>
          <div class="card-botton d-flex">
            <div class="dados-vaga">
              <p>Tipo Contrato: ${vaga.tipo_contratacao}</p>
            </div>

            <a id="saiba-mais" href="${vaga.url_vaga}" target="_blank">+</a>
          </div>
        </div>
      </div>
      `
    ));

    $("#container-list-vagas").append(vagas);

    $('#btn-pesquisa').attr("disabled", false);
    $('body').removeClass('wait');
    enableNextPrev(result.count);

  }});
}


// *** Habilitar e Desabilitar o Next Prev
const enableNextPrev = (count) => {
  if (pagina * 10 < count){
    $('#next').attr("hidden", false);
  } else {
    $('#next').attr("hidden", true);
  }

  if (pagina > 1 && count > 10) {
    $('#prev').attr("hidden", false);
  } else {
    $('#prev').attr("hidden", true);
  }
}


// *** Avançar página ***
$('#next').click(() => {
  pagina++;
  realizarPesquisa();
});


// *** Voltar página ***
$('#prev').click(() => {
  pagina--;
  realizarPesquisa();
});

// *** Submit, irá preencher os valores das variáveis e rodar a pesquisa
$("#form-pesquisa").submit(function( event ) {
 
  $('#btn-pesquisa').attr("disabled", true);

  event.preventDefault();

  let uf = document.getElementById("cb-estado");
  let style = document.getElementById("tipo-contrato");
  let level = document.getElementById("senioridade");
  let remote = document.getElementById("remoto").checked;
  
  // Zerar as variáveis
  pagina = 1;
  local = '';
  tipo = '';
  remoto = false;
  senioridade = '';

  if (uf.selectedIndex > 1){
    local = uf.value;
  }

  if (style.selectedIndex > 1){
    tipo = style.value;
  }

  if (level.selectedIndex > 1){
    senioridade = level.value;
  }

  if (remote){
    remoto = true;
  }

  realizarPesquisa();
});