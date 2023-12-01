import { IEntidade } from "./Entidade";

/**
 * Tipo para representar um evento na simulação.
 * @typedef
 */
export type Evento = {
  /**
   * Entidade que agendou o evento.
   * @type {string}
   */
    emissor: IEntidade;

  /**
   * Nome do evento.
   * @type {string}
   */
  nome: string;

  /**
   * Nome da entidade que o evento está associado.
   * @type {string}
   */
  entidade: string;

  /**
   * Quandiade de tempo para o evento ser disparado.
   * @type {number}
   */
  espera: number;

  /**
   * Argumentos adicionais para o evento.
   * @type {Record<string, any>[]}
   */
  argumentos: Record<string, any>[];
}

/**
 * Classe para representar a linha do tempo na simulação.
 * @class
 */
/**
 * Classe que representa uma linha do tempo para agendar e avançar eventos.
 */
export class LinhaDoTempo {
  private eventos: Map<number, Evento[]> = new Map();
  public momentoAtual: number;
  public escala: number = 1;
  public dataInicial: Date;
  public timestampAtual: Date;

  constructor(dataInicial: Date=new Date(), momentoInicial: number = 0, escala: number = 1) {
    this.escala = escala;
    this.dataInicial = dataInicial;
    this.momentoAtual = momentoInicial;
    this.timestampAtual = this.obterTimestampAtual(momentoInicial);
  }

  public obterTimestampAtual(momento: number): Date {
    return new Date(this.dataInicial.getTime() + (momento * this.escala * 1000));
  }

  /**
   * Método para agendar um evento na linha do tempo.
   * @method
   * @param {Evento} evento Evento a ser agendado.
   */
  agendar(evento: Evento) {
    const momento = this.momentoAtual + evento.espera;
    const eventosNoMomento = this.eventos.get(momento) || [];
    eventosNoMomento.push(evento);
    this.eventos.set(momento, eventosNoMomento);
  }

  /**
   * Método para retirar os próximos eventos da linha do tempo.
   * @method
   * @returns {Generator<Evento>} Retorna um gerador de eventos. Se não houver mais eventos, retorna um gerador vazio.
   */
  *avancarTempo(): Generator<Evento> {
    this.timestampAtual = this.obterTimestampAtual(this.momentoAtual);
    let eventos = this.eventos.get(this.momentoAtual) || [];
    while (eventos.length > 0 || this.eventos.has(this.momentoAtual)) {
      if (eventos.length === 0) {
          eventos = this.eventos.get(this.momentoAtual) || [];
          this.eventos.delete(this.momentoAtual);
      }
      while (eventos.length > 0) {
          yield eventos.shift() as Evento;
      }
    }
    this.momentoAtual++;
  }
}