/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types/projeto';
import { PerfilService } from '@/service/PerfilService';
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import { UsuarioService } from '@/service/UsuarioService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const PerfilUsuario = () => {
    let perfilUsuarioVazio: Projeto.PerfilUsuario = {
        id: '',
        perfil: {descricao: ''},
        usuario: {nome: '', login: '', senha: '', email: ''}
    };

    const [perfisUsuarios, setPerfisUsuarios] = useState<Projeto.PerfilUsuario[]>([]);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfisUsuariosDialog, setDeletePerfisUsuariosDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Projeto.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfisUsuarios, setSelectedPerfisUsuarios] = useState<Projeto.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] >([]);
    const [perfis, setPerfis] = useState<Projeto.Perfil[] >([]);

    useEffect(() => {
        if (perfisUsuarios?.length == 0) {
            perfilUsuarioService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPerfisUsuarios(response.data);
                }).catch((error) => {
                console.log(error);
            });
        }
    }, [perfilUsuarioService, perfisUsuarios?.length]);

    useEffect(() => {
        if (perfilUsuarioDialog) {
            usuarioService.listarTodos()
                .then((response) => {
                    setUsuarios(response.data);

                }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Erro ao carregar a lista de usuário.'
                });
            });
            perfilService.listarTodos()
                .then((response) => {
                    setPerfis(response.data);
                }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Erro ao carregar a lista de perfil.'
                });
            });
        }
    }, [perfilUsuarioDialog, perfilService, usuarioService]);

    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuarioDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfisUsuariosDialog = () => {
        setDeletePerfisUsuariosDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if (!perfilUsuario.id) {
            perfilUsuarioService.inserir(perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuarios([]);
                    console.log(response);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil do usuário cadastrado com sucesso!'
                    });
                }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Erro ao cadastrar perfil do usuário.'
                });
            });
        } else {
            perfilUsuarioService.alterar(perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuarios([]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil do usuário alterado com sucesso!'
                    });
                }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Erro ao alterar.'
                });
            });
        }
    };

    const editPerfilUsuario = (perfil: Projeto.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        perfilUsuarioService.excluir(perfilUsuario.id)
            .then((response) => {
                setPerfilUsuario(perfilUsuarioVazio);
                setDeletePerfilUsuarioDialog(false);
                setPerfisUsuarios([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfil do usuário excluído.',
                    life: 3000
                });
            }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao excluir.',
                life: 3000
            });
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePerfisUsuariosDialog(true);
    };

    const deleteSelectedPerfisUsuarios = () => {
        Promise.all(selectedPerfisUsuarios.map(async (_perfilUsuario) => {
            if (_perfilUsuario.id) {
                await perfilUsuarioService.excluir(_perfilUsuario.id);
            }
        })).then((response) => {
            setPerfisUsuarios([]);
            setSelectedPerfisUsuarios([]);
            setDeletePerfisUsuariosDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Perfis de usuários excluídos com sucesso.',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao excluir.',
                life: 3000
            });
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario[`${name}`] = val;
        setPerfilUsuario(_perfilUsuario);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected}
                            disabled={!selectedPerfisUsuarios || !(selectedPerfisUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar"
                            className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.usuario}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Perfis dos Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder="Search..." />
            </span>
        </div>
    );

    const perfilUsuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfisUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfisUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfisUsuarios} />
        </>
    );

    const onSelectPerfilChange = (perfil:Projeto.Perfil) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    }

    const onSelectUsuarioChange = (usuario:Projeto.Usuario) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuarios}
                        selection={selectedPerfisUsuarios}
                        onSelectionChange={(e) => setSelectedPerfisUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum perfil de usuário foi encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }}
                            header="Detalhes do Perfil do usuário" modal
                            className="p-fluid" footer={perfilUsuarioDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={perfilUsuario.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil...'/>
                            {submitted && !perfilUsuario.perfil &&
                                <small className="p-invalid">O perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="usuario">Usuário</label>
                            <Dropdown optionLabel="nome" value={perfilUsuario.usuario} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder='Selecione um usuário...'/>
                            {submitted && !perfilUsuario.usuario &&
                                <small className="p-invalid">O usuário é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal
                            footer={deletePerfilUsuarioDialogFooter} onHide={hideDeletePerfilUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Tem certeza que deseja excluir: <b>{perfilUsuario.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfisUsuariosDialog} style={{ width: '450px' }} header="Confirm" modal
                            footer={deletePerfisUsuariosDialogFooter} onHide={hideDeletePerfisUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Tem certeza que deseja excluir o perfil do usuário selecionado?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
