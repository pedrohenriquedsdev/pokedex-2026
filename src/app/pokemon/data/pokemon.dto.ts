export interface ResultadoObjetoHttp {
  name: string;
  url: string;
}

export interface ObjetoRespostaHttp {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultadoObjetoHttp[];
}

export interface TipoPokemonRespostaHttp {
  type: {
    name: string;
  };
}

export interface PokemonRespostaHttp {
  id: number;
  name: string;
  types: TipoPokemonRespostaHttp[];
  sprites: {
    front_default: string | null;
  };
}

export interface HabilidadePokemonRespostaHttp {
  ability: {
    name: string;
  };
}

export interface EstatisticaPokemonRespostaHttp {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface SpritesPokemonDetalhesRespostaHttp {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface CriesPokemonRespostaHttp {
  latest: string | null;
  legacy: string | null;
}

export interface PokemonDetalhesRespostaHttp {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: TipoPokemonRespostaHttp[];
  sprites: SpritesPokemonDetalhesRespostaHttp;
  cries?: CriesPokemonRespostaHttp;
  abilities: HabilidadePokemonRespostaHttp[];
  stats: EstatisticaPokemonRespostaHttp[];
}
