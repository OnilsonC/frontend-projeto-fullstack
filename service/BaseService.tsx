import axios from 'axios';
import { Projeto } from '@/types/projeto';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

export class BaseService{

    url: string;

    constructor(url: string) {
        this.url = url;
    }

    listarTodos() {
        return axiosInstance.get(this.url);
    }

    buscaPorId(id: number | string) {
        return axiosInstance.get(this.url + "/" + id);
    }

    inserir(objeto: any) {
        return axiosInstance.post(this.url, objeto);
    }

    alterar(objeto: any) {
        return axiosInstance.put(this.url, objeto);
    }

    excluir(id?: number | string) {
        return axiosInstance.delete(this.url + "/" + id);
    }
}
