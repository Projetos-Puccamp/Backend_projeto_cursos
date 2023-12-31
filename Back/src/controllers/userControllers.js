const UserServices = require('../services/userServices');
module.exports = {
    buscarTodos: async (req, res)=>{
        let json = {erro:'', result:[]};

        let users = await UserServices.buscarTodos();
        for(let i in users){
            json.result.push({
                codigo: users[i].codigo,
                descricao: users[i].email
            });
        }
        res.json(json);
    },
    buscarUm: async(req,res) =>{

        let email = req.body.email;
        let senha = req.body.senha;
        let user = await UserServices.buscarUm(email, senha);
        let vr = user.NivelPermissao;
        let l = 'administrador/Padministrador.html';
        if (user) {
            // Credenciais corretas, retorna uma resposta de sucesso
            res.json({ autenticado: true, NvP : vr, Local : l});
          } else {
            // Credenciais inválidas, retorna uma resposta de erro
            res.json({ autenticado: false });
          }
    },
    buscarHistorico:async(req, res) => {
      console.log('entou em busca do historico');
      let json = {erro:'', result:[]};
      let id = req.body.id;
      let idAluno = await UserServices.buscaIdAluno(id);
      console.log('Id do aluno no historico: '+ idAluno);
      let historicos = await UserServices.buscarHistorico(idAluno);
      for(let i in historicos){
          json.result.push({
              codigoT: historicos[i].Treinamento_idTreinamento,
              codigo: historicos[i].idAlunoTreinamento,
              status: historicos[i].status
          });
      }
      res.json(json);  
},
    
    login: async(req,res) =>{
        let email = req.body.email;
        let senha = req.body.senha;
        let user = await UserServices.buscarUm(email, senha);
        
        let vr =  user.NivelPermissao;
        console.log(vr);
        switch (vr) {
            case '1':
             l = 'alunos/Paluno.html';
              break;
            case '2': 
             l ='administrador/Padministrador.html';
              break;
            case '3':
              l= 'empresas/Pempresas.html';
              break;
            case '4':
             l = 'mentor/Pmentor.html';
              break;
            default:
              console.log("Opção inválida");
          }
        if (user) {
            //salvando na sessao o valor do idUsuario
            
          
            // Credenciais corretas, retorna uma resposta de sucesso
            res.json({ autenticado: true, NvP : vr, Local : l, id :  user.idUsuario});
          } else {
            // Credenciais inválidas, retorna uma resposta de erro
            res.json({ autenticado: false });
          }
    },

    FillCursos: async(req, res) => {
            let json = {erro:'', result:[]};
            let cursos = await UserServices.buscarTodosCursos();
            for(let i in cursos){
                json.result.push({
                    codigo: cursos[i].idTreinamento,
                    descricao: cursos[i].Descricao,
                    testehref: 'Plogin.html'
                });
            }
            res.json(json);  
    },

    FillVagas: async(req, res) => {
        let json = {erro:'', result:[]};
        let vagas = await UserServices.buscarTodosVagas();
        for(let i in vagas){
            json.result.push({
                codigo: vagas[i].Vaga,
                descricao: vagas[i].DescricaoAtv
            });
        }
        res.json(json);  
},


    inserir: async(req,res) =>{
        console.log('entrou');
        let json = {erro:'', result:{}};
        let nome = req.body.nome;
        let email = req.body.email;
        let senha = req.body.senha;

        if(email && senha){
            let userCodigo = await UserServices.inserir(nome,email, senha);
            json.result = {
                codigo: userCodigo,
                email,
                senha
            };
        }else{
            json.erro = 'Campos não enviados';
        }
        res.json(json);
    },
    inserirVaga: async (req, res) => {
        let json = { erro: '', result: {} };
        let id = req.body.id;
        let titulo = req.body.titulo;
        let descricao = req.body.descricao;
        let requisitos = req.body.requisitos;
        let fxsal = req.body.fxsal;
        if (id && titulo && descricao && requisitos && fxsal) {
          let idEmp = await UserServices.buscaIdEmp(id);
          console.log('Essa é o Id da empresa'+idEmp);

          let vagaCodigo = await UserServices.inserirVaga(idEmp, titulo, descricao, requisitos, fxsal);
          json.result = {
            codigo: vagaCodigo,
            idEmp,
            titulo,
            descricao,
            requisitos,
            fxsal
          };
        } else {
          json.erro = 'Campos não enviados';
        }
        res.json(json);
      },
      inserirPergunta: async (req, res) => {
        let json = { erro: '', result: {} };
        console.log('Entrou em Inserir Perguntas');
        let idQuiz = req.body.idQuiz;
        let tipoPergunta = req.body.tipoPergunta;
        let pergunta = req.body.pergunta;
        let respostaA = req.body.respostaA;
        let respostaB = req.body.respostaB;
        let respostaC = req.body.respostaC;
        let respostaD = req.body.respostaD;
        let respostaE = req.body.respostaE;
        let respostaCorreta = req.body.respostaCorreta;

        if (idQuiz && tipoPergunta && pergunta && respostaA && respostaB && respostaC && respostaD && respostaE && respostaCorreta  ) {
          try {
            // Aqui você pode implementar a lógica de inserção da pergunta no banco de dados
            // Exemplo:
            let perguntaId = await UserServices.inserirPergunta(idQuiz, tipoPergunta, pergunta, respostaA, respostaB, respostaC, respostaD, respostaE, respostaCorreta);
            json.result = {
              perguntaId,
              idQuiz,
              tipoPergunta,
              pergunta,
              respostaA,
              respostaB,
              respostaC,
              respostaD,
              respostaE,
              respostaCorreta
            };
          } catch (error) {
            json.erro = 'Erro ao inserir a pergunta';
            console.error(error);
          }
        } else {
          json.erro = 'Campos não enviados';
        }
        res.json(json);
      },
      inserirTreinamento: async (req, res) => {
        let json = { erro: '', result: {} };
        console.log('Entrou em Inserir Treinamento');
        let nome = req.body.nome;
        let codigoQuiz = req.body.codigoQuiz;
        let codigoConteudo = req.body.codigoConteudo;
        let descricao = req.body.descricao;
        let cargaHoraria = req.body.cargaHoraria;
        let dataInicio = req.body.dataInicio;
        let dataFim = req.body.dataFim;
      console.log('Entrou em inserir treinamento');
        if (nome && codigoQuiz && codigoConteudo && descricao && cargaHoraria && dataInicio && dataFim) {
          try {
            // Aqui você pode implementar a lógica de inserção do treinamento no banco de dados
            // Exemplo:
            let treinamentoId = await UserServices.inserirTreinamento(nome, codigoQuiz, codigoConteudo, descricao, cargaHoraria, dataInicio, dataFim);
            let Idtreinamento = await UserServices.BuscaIdTreinamento(nome);
            console.log('IdTreinamento criado é'+ Idtreinamento);
           let Quiztreinamento = await UserServices.inserirQuizTreinamento(Idtreinamento,codigoQuiz);
            let Conteudotreinamento = await UserServices.inserirConteudoTreinamento(Idtreinamento, codigoConteudo);
            json.result = {
              treinamentoId,
              nome,
              codigoQuiz,
              codigoConteudo,
              descricao,
              cargaHoraria,
              dataInicio,
              dataFim
            };
          } catch (error) {
            json.erro = 'Erro ao inserir o treinamento';
            console.error(error);
          }
        } else {
          json.erro = 'Campos não enviados';
        }
        res.json(json);
      },

      inserirVaga_Treinamento: async (req, res) => {
        let json = { erro: '', result: {} };
        let Idtreinamento = req.body.idTreinamento;
        let VagaEmp= req.body.idVemp;

        console.log('Entrou em Inserir TreinamentoVaga'+Idtreinamento+VagaEmp);
        if (Idtreinamento && VagaEmp ) {
          try {
            console.log('Entrou em Inserir TreinamentoVaga'+Idtreinamento+VagaEmp);
            // Aqui você pode implementar a lógica de inserção do treinamento no banco de dados
            // Exemplo:
            let Treinamento_Vaga = await UserServices.InserirTreinamentoVaga(Idtreinamento, VagaEmp);
            json.result = {
              Idtreinamento,
               VagaEmp
            };
          } catch (error) {
            json.erro = 'Erro ao inserir o treinamento_vaga';
            console.error(error);
          }
        } else {
          json.erro = 'Campos não enviados';
        }
        res.json(json);
      }, 
      inserirAluno_Treinamento: async (req, res) => {// Falta verificar se o aluno ja é cadastrado no curso
        let json = { erro: '', result: {} };
        let Idtreinamento = req.body.idTreinamento;
        let IdAluno= req.body.idUsuario;
         IdAluno = await UserServices.buscaIdAluno( IdAluno);
        console.log('Entrou em Inserir TreinamentoVaga: '+Idtreinamento+IdAluno);
        if (Idtreinamento && IdAluno ) {
          try {
            console.log('Entrou em Inserir TreinamentoAluno'+Idtreinamento+IdAluno);
            // Aqui você pode implementar a lógica de inserção do treinamento no banco de dados
            // Exemplo:
            let Treinamento_Vaga = await UserServices.InserirTreinamentoAluno(Idtreinamento, IdAluno);
            json.result = {
              Idtreinamento,
              IdAluno
            };
          } catch (error) {
            json.erro = 'Erro ao inserir o treinamento_vaga';
            console.error(error);
          }
        } else {
          json.erro = 'Campos não enviados';
        }
        res.json(json);
      },

    alterar: async(req,res) =>{
        let json = {erro:'', result:{}};

        let codigo = req.params.codigo;
        let email = req.body.email;
        let senha = req.body.senha;

        if(codigo && email && senha){
            await UserServices.alterar(codigo, email, senha);
            json.result = {
                codigo,
                email,
                senha
            };
        }else{
            json.erro = 'Campos não enviados';
        }
        res.json(json);
    }
}