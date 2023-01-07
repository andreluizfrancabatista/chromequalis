//popup.js
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Add your Analytics tracking ID here.
 */
//var _AnalyticsCode = 'UA-129511160-3';
/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', _AnalyticsCode]);
// _gaq.push(['_trackPageview']);
// (function () {
//   var ga = document.createElement('script');
//   ga.type = 'text/javascript';
//   ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0];
//   s.parentNode.insertBefore(ga, s);
// })();
/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
// function trackButtonClick(e) {
//   _gaq.push(['_trackEvent', e.target.id, 'clicked']);
// }

/**
 * Now set up your event handlers for the popup's `button` elements once the
 * popup's DOM has loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
  }
  //to track links clicked
  var links = document.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', trackButtonClick);
  }
});
/*End of analytics*/
/**
 * fetchJSON function
 */
async function fetchJSON(url) {
  var json = [];

  // fetch url
  const response = await fetch(url);

  // check response status
  if (response.status === 200) {
    // get response contents
    json = await response.json();
  } else {
    // log response status code and text
    console.log(response.status);
    console.log(response.statusText);
  }

  return json;
}
/**
* Get path to local json files
*/
const path_2022 = 'data/01_qualis_2022.json';
const capesData_2022 = fetchJSON(path_2022);
const path_2013 = 'data/01_qualis_2013.json';
const capesData_2013 = fetchJSON(path_2013);


function loading() {
  document.getElementById('loader').style.display = 'inline-block';
  document.getElementById('logoQualis').style.display = 'none';
  document.getElementById('outputTable').innerHTML = '';
  document.getElementById('outputTableV2').innerHTML = '';
  document.getElementById('title').innerHTML = '';
  document.getElementById('titleV2').innerHTML = '';
  document.getElementById('messages').innerHTML = '';
}
//Consulta Qualis 2017-2020
function consultaQualis(issn) {
  loading();
  if (issn == null) {
    issn = document.getElementById('search-box').value;
  }
  issn = issn.toUpperCase().trim();
  capesData_2022.then((result) => {
    let data = result.filter(el => el.ISSN == issn);
    document.getElementById('search-box').value = issn;
    document.getElementById('links-dropdown').style.display = 'block';
    //document.getElementById('avisoMsgOnOff').style.display = 'block';
    if (data[0]) {
      document.getElementById('title').innerHTML = data[0]['Título'].toUpperCase();
    } else {
      document.getElementById('title').innerHTML = '<em>Título não encontrado</em>';
    }
    document.getElementById('footer').style.display = 'none';
    document.getElementById('messages').innerHTML = '';
    drawTable(data, '2017');
    createSearchLinks(issn);
    document.getElementById('loader').style.display = 'none';
  })
    .catch((erro) => {
      let msgErro = '<p>Erro: ' + erro + '</p>';
      document.getElementById('title').innerHTML = msgErro;
      document.getElementById('loader').style.display = 'none';
    });
}

//Consulta Qualis 2013-2016
function consultaQualisV2(issn) {
  if (issn == null) {
    issn = document.getElementById('search-box').value;
  }
  issn = issn.toUpperCase().trim();
  capesData_2013.then((result) => {
    let data = result.filter(el => el.ISSN == issn);
    if (data[0]) {
      document.getElementById('titleV2').innerHTML = data[0]['Título'].toUpperCase();
    } else {
      document.getElementById('titleV2').innerHTML = '<em>Título não encontrado</em>';
    }
    drawTable(data, '2013');
    document.getElementById('loader').style.display = 'none';
  })
    .catch((erro) => {
      let msgErro = '<p>Erro: ' + erro + '</p>';
      if (!isISSNHard(issn)) {
        document.getElementById('titleV2').innerHTML = 'ISSN inválido: ' + issn;
      } else {
        document.getElementById('titleV2').innerHTML = msgErro;
      }
      document.getElementById('loader').style.display = 'none';
    });

}

//função para pegar o data e escrever em uma tabela qualis 2017-2020
function drawTableV2(data) {
  let table = document.getElementById('outputTableV2');
  //table.innerHTML = '<tr><th colspan=\'2\'>Qualis Preliminar 2019*</th></tr>';
  table.innerHTML = '<tr><th colspan=\'2\'>Quadriênio 2013-2016</th></tr>';
  table.innerHTML += '<tr><th>Área</th><th class=\'colunaEstrato\'>Estrato*</th></tr>';
  let nodetr = document.createElement('tr');
  let nodetdarea = document.createElement('td');
  let textnode = '';
  if (data[0]) {
    textnode = document.createTextNode('Área única');
    nodetdarea.appendChild(textnode);
    let nodetdestrato = document.createElement('td');
    textnode = document.createTextNode(data[0]['Estrato']); //busca o estrato oficial
    // textnode = document.createTextNode('-');//aguardando o estrato oficial
    nodetdestrato.appendChild(textnode);
    nodetr.appendChild(nodetdarea);
    nodetr.appendChild(nodetdestrato);
    table.appendChild(nodetr);
  } else {
    nodetdarea.colSpan = 2;
    textnode = document.createTextNode('');
    nodetdarea.appendChild(textnode);
    nodetdarea.innerHTML = "<i class=\'fas fa-exclamation-circle\'></i> Não existem dados cadastrados para a pesquisa realizada.";
    nodetr.appendChild(nodetdarea);
    nodetdarea.style.paddingTop = '10px';
    nodetdarea.style.paddingBottom = '10px';
    table.appendChild(nodetr);
  }
  //Info sobre Qualis 2019
  nodetr = document.createElement('tr');
  nodetdarea = document.createElement('td');
  nodetdarea.colSpan = 2;
  textnode = document.createTextNode('');
  nodetdarea.appendChild(textnode);
  nodetdarea.innerHTML = '* <em>Estamos aguardando a publicação oficial do Qualis referente ao Quadriênio 2017-2020 pela CAPES.</em>'
  nodetr.appendChild(nodetdarea);
  table.appendChild(nodetr);
}


//função para pegar o data e escrever em uma tabela qualis 2017-2020
function drawTable(data, ano) {
  if (ano == '2013') {
    var table = document.getElementById('outputTableV2');
    table.innerHTML = '<tr><th colspan=\'2\'>Quadriênio 2013-2016</th></tr>';
  }
  if (ano == '2017') {
    var table = document.getElementById('outputTable');
    table.innerHTML = '<tr><th colspan=\'2\'>Quadriênio 2017-2020</th></tr>';
  }
  table.innerHTML += '<tr><th>Área</th><th class=\'colunaEstrato\'>Estrato</th></tr>';
  if (data[0]) {
    Object.keys(data).forEach((itemDoArray, index) => {
      let nodetr = document.createElement('tr');
      let nodetdarea = document.createElement('td');
      let nodetdestrato = document.createElement('td');
      let textnode = document.createTextNode(data[index]['Área de Avaliação']);
      nodetdarea.appendChild(textnode);
      textnode = document.createTextNode(data[index]['Estrato']);
      nodetdestrato.appendChild(textnode);
      nodetr.appendChild(nodetdarea);
      nodetr.appendChild(nodetdestrato);
      table.appendChild(nodetr);
    });
  } else {
    let nodetr = document.createElement('tr');
    let nodetdarea = document.createElement('td');
    nodetdarea.colSpan = 2;
    nodetdarea.style.paddingTop = '10px';
    nodetdarea.style.paddingBottom = '10px';
    let textnode = document.createTextNode('');
    nodetdarea.appendChild(textnode);
    nodetdarea.innerHTML = "<i class=\'fas fa-exclamation-circle\'></i> Não existem dados cadastrados para a pesquisa realizada.";
    nodetr.appendChild(nodetdarea);
    table.appendChild(nodetr);
  }
}

//Get the selected text and send it to the function
function getSelecao() {
  return getSelection().toString();
}

chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getSelecao,
    },
    (selection) => {
      let issn = undefined;
      if (selection) {
        issn = selection[0].result;
      }

      if (extractISSN(issn)) {
        issn = extractISSN(issn)[0];
        document.getElementById("search-box").value = issn;
        consultaQualis(issn);
        consultaQualisV2(issn);
      } else {
        document.getElementById('outputTable').innerHTML = '';
        document.getElementById('outputTableV2').innerHTML = '';
        document.getElementById('title').innerHTML = '';
        document.getElementById('titleV2').innerHTML = '';
        document.getElementById('logoQualis').style.display = 'inline';
        document.getElementById('footer').style.display = 'flex';
        document.getElementById('messages').innerHTML = "<i class='fas fa-exclamation-circle'></i> Insira, ou selecione, um número de ISSN válido para realizar a consulta.";
        document.getElementById('links-dropdown').style.display = 'none';
        //document.getElementById('avisoMsgOnOff').style.display = 'none';
      }
    });
});

/**Regex ISSN Hard*/
function isISSNHard(issn) {
  //([0-9]{4}-[0-9]{3}[0-9|x]{1})$
  let str = issn;
  let patt = new RegExp('^([0-9]{4}-[0-9]{3}[0-9|x]{1})$', 'gmi');
  return patt.test(str);
}

/**
 * Regex ISSN 
 */
function isISSN(issn) {
  //[0-9]{4}-[0-9]{3}[0-9|x]{1}
  let str = issn;
  let patt = new RegExp('^([0-9]{4}-[0-9]{3}[0-9|x]{1})', 'gmi');
  return patt.test(str);
}

/**
 * Extract ISSN
 */
function extractISSN(selection) {
  //[0-9]{4}-[0-9]{3}[0-9|x]{1}
  if (selection) {
    let str = String(selection);
    let patt = new RegExp('[0-9]{4}-[0-9]{3}[0-9|x]{1}', 'i');
    return str.match(patt);
  } else {
    return null;
  }
}

/**Criador de links de busca */
let searchEngines = [
  {
    nome: "Google",
    url: "http://www.google.com/search?q=ISSN+",
    icon: "<i class='fab fa-google'></i>"
  },
  {
    nome: "Bing",
    url: "https://www.bing.com/search?q=ISSN+",
    icon: "<i class='fab fa-b'></i>"
  },
  {
    nome: "Yahoo",
    url: "https://search.yahoo.com/search?p=ISSN+",
    icon: "<i class='fab fa-yahoo'></i>"
  }
  // ,
  // {
  //   nome: "QualisAPIv1",
  //   url: url + "v1/issn/"
  // }
  // ,
  // {
  //   nome: "QualisAPIv2",
  //   url: url + "v2/issn/"
  // }
]

function createSearchLinks(issn) {
  let links = document.getElementsByClassName('search-links');
  Object.keys(searchEngines).forEach((item, index) => {
    links[index].innerHTML = searchEngines[index].nome + ": ISSN " + issn;
    if (index < 3) {
      links[index].setAttribute('href', searchEngines[index].url + "\"" + issn + "\"");
      links[index].setAttribute('title', searchEngines[index].url + "\"" + issn + "\"");
    } else {
      links[index].setAttribute('href', searchEngines[index].url + issn);
      links[index].setAttribute('title', searchEngines[index].url + issn);
    }
  });
};

/*Onload document */
document.addEventListener('DOMContentLoaded', function () {
  /**
   * Salvar opção do usuário por visualizar a mensagem
   */
  chrome.storage.sync.get(['optViewMsg'], function (result) {
    if (result.optViewMsg == undefined) {
      //Primeiro acesso
      chrome.storage.sync.set({ optViewMsg: true }, function () {
        //console.log('Primeiro acesso: Value is set to ' + true);
        let avisoQualis = document.getElementById('avisoQualis2019');
        if (avisoQualis) {
          avisoQualis.style.display = 'flex';
          document.getElementById('exibirOnOff').checked = false;
        }
      });
    }
    if (result.optViewMsg == true) {
      //Exibe aviso
      let avisoQualis = document.getElementById('avisoQualis2019');
      if (avisoQualis) {
        avisoQualis.style.display = 'flex';
        document.getElementById('exibirOnOff').checked = false;
        chrome.storage.sync.set({ optViewMsg: true }, function () {
          //console.log('Value is set to ' + true);
        });
      }
    } else {
      //Não exibe aviso
      let avisoQualis = document.getElementById('avisoQualis2019');
      if (avisoQualis) {
        avisoQualis.style.display = 'none';
      }
    }
  });

  /**
   * Botão Aviso para exibir o aviso
   */
  let btn3 = document.getElementById('avisoMsgOnOff');
  if (btn3) {
    btn3.addEventListener('click', function () {
      let avisoQualis = document.getElementById('avisoQualis2019');
      avisoQualis.style.display = 'flex';
      document.getElementById('exibirOnOff').checked = false;
      chrome.storage.sync.set({ optViewMsg: true }, function () {
        //console.log('Value is set to ' + true);
      });
    });
  }

  /**
   * Botão fechar do aviso
   */
  let btn2 = document.getElementById('buttonClose');
  if (btn2) {
    btn2.addEventListener('click', function () {
      let avisoQualis = document.getElementById('avisoQualis2019');
      avisoQualis.style.display = 'none';
      /**
       * Checa se o usuário marcou a checkbox para não ver a mensagem novamente
       */
      let exibirOnOff = document.getElementById('exibirOnOff').checked;
      if (exibirOnOff) {
        //Não exibir mais
        chrome.storage.sync.set({ optViewMsg: false }, function () {
          //console.log('Value is set to ' + false);
        });
      } else {
        //Pode exibir novamente
        chrome.storage.sync.set({ optViewMsg: true }, function () {
          //console.log('Value is set to ' + true);
        });
      }
    });
  }

  /**
   * Botão de buscar por ISSN
   */
  let btn1 = document.getElementById('search-button');
  btn1.addEventListener('click', function () {
    let issn = document.getElementById('search-box').value;
    if (issn == null || issn == undefined || issn == '') {
      document.getElementById('outputTable').innerHTML = '';
      document.getElementById('outputTableV2').innerHTML = '';
      document.getElementById('title').innerHTML = '';
      document.getElementById('titleV2').innerHTML = '';
      document.getElementById('logoQualis').style.display = 'inline';
      document.getElementById('footer').style.display = 'flex';
      document.getElementById('messages').innerHTML = 'Para encontrar um periódico, insira um número de ISSN.';
      document.getElementById('links-dropdown').style.display = 'none';
      //document.getElementById('avisoMsgOnOff').style.display = 'none';
    } else if (!isISSNHard(issn)) {
      document.getElementById('outputTable').innerHTML = '';
      document.getElementById('outputTableV2').innerHTML = '';
      document.getElementById('title').innerHTML = 'Número de ISSN inválido.';
      document.getElementById('titleV2').innerHTML = '';
      document.getElementById('logoQualis').style.display = 'none';
      document.getElementById('footer').style.display = 'flex';
      document.getElementById('messages').innerHTML = "<i class='fas fa-exclamation-circle'></i> Insira, ou selecione, um número de ISSN válido para realizar a consulta.";
      document.getElementById('links-dropdown').style.display = 'none';
      //document.getElementById('avisoMsgOnOff').style.display = 'none';
      document.getElementById('search-box').value = issn;
    } else {
      consultaQualis(issn);
      consultaQualisV2(issn);
    }

    /**
     * Checa se o usuário deseja visualizar a mensagem novamente
     */
    chrome.storage.sync.get(['optViewMsg'], function (result) {
      if (result.optViewMsg) {
        //console.log('Value currently is ' + result.optViewMsg);
        document.getElementById('avisoQualis2019').style.display = 'flex';
      } else {
        //console.log('Value currently is ' + result.optViewMsg);
      }
    });
  });

  /**
   * Busca por ISSN usando a tecla ENTER
   */
  let search = document.getElementById('search-box');
  search.focus();
  search.addEventListener('keyup', function () {
    if (event.keyCode === 13) {
      event.preventDefault();
      btn1.click();
    }
  });
});