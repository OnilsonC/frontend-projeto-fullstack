import { InventoryStatus, ProductOrder } from '@/types/demo';

declare namespace Projeto {
    type Usuario = {
        id?: number | string;
        nome: string;
        login: string;
        senha: string;
        email: string;
    };

    type Recurso = {
        id?: number | string;
        nome: string;
        chave: string;
    };

    type Perfil = {
        id?: number | string;
        descricao: string;
    };

    type PerfilUsuario = {
        id?: number | string;
        usuario: Usuario;
        perfil: Perfil
    }
}

