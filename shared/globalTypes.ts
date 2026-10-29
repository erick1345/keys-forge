export interface IUser {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  nivel_acesso?: 'admin' | 'cliente';
}

export interface IGame {
  id?: number;
  titulo: string;
  descricao: string;
  preco: number;
  plataforma: string;
  imagem_url: string;
  estoque: number;
}