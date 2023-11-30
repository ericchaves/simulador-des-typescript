import Simulador from '../../src/Simulador';
import { IEntidade, Entidade, AgendarEventoFunction } from '../../src/IEntidade';

const mockEntidade: Entidade = {
  nome: 'MockEntidade',
  inicializar: jest.fn().mockImplementation((agendarEvento: AgendarEventoFunction) => Promise.resolve(true)),
  processarEvento: jest.fn().mockImplementation((evento: string, argumentos: Record<string, any>[], momentoAtual: number, agendarEvento: AgendarEventoFunction) => Promise.resolve(true))
};

describe('Simulador', () => {
  let entidades: IEntidade[] = [mockEntidade];

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('ao chamar preparar as entidades devem ser inicializadas com sucesso.', async () => {
    const simulador = new Simulador(entidades, 0, 10);
    const result = await simulador.preparar();
    expect(result).toBe(true);
    expect(mockEntidade.inicializar).toHaveBeenCalled();
  });

  test('ao executar uma simulação deve emitir o valor do simulado a cada iteração.', async () => {
    const simulador = new Simulador(entidades, 0, 10);
    const result: Number[] = [];
    for await (const momento of simulador.simular()) {
      result.push(momento);
    }
    expect(result).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });

  test('o método paraSimulacao deve abortar a simulacao sem avançar para o próximo momento.', async() => {
    const simulador = new Simulador(entidades, 0, 10);
    const result: Number[] = [];
    for await (const momento of simulador.simular()) {
      result.push(momento);
      if(result.length === 5){
        simulador.pararSimulacao();
      }
    }
    expect(result).toEqual([1,2,3,4,5]);
  });

  //teste se o evento agendado para uma entidade é disparado durante a simulação
  test('ao agendar um evento para uma entidade, o evento deve ser disparado durante a simulação.', async () => {
    const simulador = new Simulador(entidades, 0, 10);
    simulador.agendarEvento('teste', 'MockEntidade', [], 1);
    const result: Number[] = [];
    for await (const momento of simulador.simular()) {
      result.push(momento);
    }
    expect(mockEntidade.processarEvento).toHaveBeenCalled();
  });
});