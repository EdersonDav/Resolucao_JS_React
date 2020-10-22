function gerarRelatorioHorasTrabalhadas(registros) {

  //Array que vai conter todos os nomes que veio da base de dados
  const nomes = []

  //Array que vai conter todas as datas que veio da base de dados
  let datasDesordenadas = []

  //Atribuição de nomes
  for (reg of registros) {
    if (!nomes.includes(reg.funcionario)) {
      nomes.push(reg.funcionario)
    }
  }

  //Atribuição de datas
  for (reg of registros) {
    if (!datasDesordenadas.includes(reg.data)) {
      datasDesordenadas.push(reg.data)
    }
  }

  //Ordenando as datas
  const datas = datasDesordenadas.sort()

  //Array que vai separar os dados que veio da base por nomes
  const arrayPorNomes = []

  //Loop para atribuir todos os dados de um funcionario
  for (let i = 0; i <= nomes.length; i++) {
    let aux = []
    registros.map(reg => {
      if (reg.funcionario == nomes[i]) {
        aux.push(reg)
      }
    })
    if (aux.length > 0) {
      arrayPorNomes.push(aux);
    }
  }

  //Array que vai separar os dados que veio da base por nomes e datas
  const arrayPorNomesEData = []

  //Loop para atribuir todos os dados de um funcionario com a sua respectiva data
  for (let i = 0; i <= datas.length; i++) {
    for (let o = 0; o <= arrayPorNomes.length; o++) {
      let aux = []
      if (arrayPorNomes[o]) {
        arrayPorNomes[o].map(reg => {
          if (reg.data == datas[i]) {
            aux.push(reg)
          }
        })
      }
      if (aux.length > 0) {
        arrayPorNomesEData.push(aux);
      }
    }
  }

  //Função para retornar a resposta final para cada funcionario calculando as horas trabalhadas
  //Recebe os dados de um funcionario no periodo de um dia apenas
  const calculoDeHoras = (registroDoDia) => {
    //Pegando todas as horas do dia
    const horas = registroDoDia.map(reg => {
      return reg.hora
    })
    horas.sort();

    const primeiroRegistro = horas[0];
    const segundoRegistro = horas[1];

    //Chamando função que calcula as horas trabalhadas
    const primeiroTempoTrbalhado = calcDiferencaDeHoras(primeiroRegistro, segundoRegistro)

    //Verificando se o funcionario trabalhou mais que apenas um periodo do dia
    if (horas[2] && horas[3]) {
      const terceiroRegistro = horas[2];
      const quartoRegistro = horas[3];

      const segundoTempoTrabalhado = calcDiferencaDeHoras(terceiroRegistro, quartoRegistro).split(":")

      //Somando os valores de dois periodos trabalhados
      const total = moment(primeiroTempoTrbalhado, 'hh:mm').add(Number(segundoTempoTrabalhado[0]), 'hours').add(
        Number(
          segundoTempoTrabalhado[
            1]), 'minutes').format('hh:mm')
      return {
        funcionario: registroDoDia[0].funcionario,
        data: registroDoDia[0].data,
        total
      }
    } else {
      return {
        funcionario: registroDoDia[0].funcionario,
        data: registroDoDia[0].data,
        total: primeiroTempoTrbalhado
      }
    }
  }

  // Função que calcula periodos trabalhados
  const calcDiferencaDeHoras = (entrada, saida) => {
    const diffHoras = moment(saida, "HH:mm").diff(moment(entrada, "HH:mm"));
    const duracaoHoras = moment.duration(diffHoras);
    const horas = Math.floor(duracaoHoras.asHours()) + ":" + moment.utc(diffHoras).format("mm");
    return horas;
  }

  const saida = []

  //Chamando função de calculo de horas
  for (let i = 0; i <= arrayPorNomesEData.length; i++) {
    if (arrayPorNomesEData[i]) {
      saida.push(calculoDeHoras(arrayPorNomesEData[i]));
    }
  }

  //Ordenando saida final
  saida.sort((s1, s2) => {
    return (s1.funcionario > s2.funcionario) ? 1 : ((s2.funcionario > s1.funcionario) ? -1 : 0);
  })

  return (saida);
}
const totalHorasTrabalhadas = gerarRelatorioHorasTrabalhadas(registros);
console.log(totalHorasTrabalhadas);