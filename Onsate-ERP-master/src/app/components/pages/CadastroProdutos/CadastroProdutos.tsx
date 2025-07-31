"use client";

import TableData from "../../TableData/TableData";
import styles from "./CadastroProdutos.module.css";
import Loading from "../../Loading/Loading";
import CadastroProdutosSheet from "../../Sheets/CadastroProdutos/CadastroProdutosSheet";
import Image from "next/image";
import { useState } from "react";
import EditarCadastroProdutosSheet from "../../Sheets/EditarCadastroProdutos/EditarCadastroProdutosSheet";

interface CadastroProdutosProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  tableDataActive: boolean;
  setTableDataActive: React.Dispatch<React.SetStateAction<boolean>>;
  addEdit: boolean;
  setAddEdit: React.Dispatch<React.SetStateAction<boolean>>;
  addProduct: boolean;
  setAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  titlePage: string;
  setTitlePage: React.Dispatch<React.SetStateAction<string>>;
}

export default function CadastroProdutos({
  tableDataActive,
  setTableDataActive,
  addEdit,
  setAddEdit,
  addProduct,
  setAddProduct,
  loading,
  setLoading,
  titlePage,
  setTitlePage,
}: CadastroProdutosProps) {
  // Estados para controlar o filho (controle do formulário)
  const [clearFormFlag, setClearFormFlag] = useState(false);
  const [addProductFlag, setAddProductFlag] = useState(false);
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  //Function que limpa a página e renderiza o componente de adicionar
  const handleAddComponente = (): void => {
    setTableDataActive(false);

    setLoading(true);
    setTitlePage("");

    setTimeout(() => {
      setLoading(false);
      setTitlePage("Dados Cadastrais");
      setAddProduct(true);
    }, 500);
  };

  //Function que limpa a página e renderiza o componente de editar
  const handleEditComponent = (): void => {
    setTableDataActive(false);

    setLoading(true);
    setTitlePage("");

    setTimeout(() => {
      setLoading(false);
      setTitlePage("Editar Produto");
      setAddEdit(true);
    }, 500);
  };

  //Function para retornar ao componente de tabela
  //**** TODA VEZ Q VOLTAR SERÁ UMA NOVA REQ, VER COMO PROCEDER SE DEIXA OU MUDA, como é product novo acredito que deixar como está msm
  const handleBackComponent = (): void => {
    setTitlePage("Cadastro de Produtos");
    setAddProduct(false);
    setAddEdit(false);
    setTableDataActive(true);
    setClearFormFlag(!clearFormFlag);
  };

  // Função para limpar o formulário
  const handleClearForm = () => {
    setClearFormFlag(!clearFormFlag); // Atualiza o estado para sinalizar ao filho que ele deve limpar o formulário
  };

  // Função para adicionar o produto
  const handleAddProduct = () => {
    setAddProductFlag(true); // Atualiza o estado para sinalizar ao filho que ele deve adicionar o produto
  };

  const handleStatusChange = (newStatus: boolean) => {
    setStatus(newStatus);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {titlePage == "Cadastro de Produtos" && <h1>Cadastro de Produtos</h1>}
        {titlePage !== "Cadastro de Produtos" && (
          <div className={styles.titleButtons}>
            <div className={styles.activeTitle}>
              <h1>{titlePage} </h1>
              {titlePage == "Editar Produto" && (
                <>
                  {status ? (
                    <input type="checkbox"  checked/>
                  ) : (
                    <input type="checkbox"  />
                  )}
                  <label>{status ? "Ativo" : "Inativo"}</label>
                </>
              )}
            </div>
            {!loading && (
              <div className={styles.controlSheetButtons}>
                <Image
                  src={"/icons/eraser-icon.svg"}
                  width={36}
                  height={36}
                  alt="eraser-icon"
                  onClick={handleClearForm}
                />
                <Image
                  src={"/icons/disket-save-icon.svg"}
                  width={36}
                  height={36}
                  alt="disket-icon"
                  onClick={handleAddProduct}
                />
                <Image
                  src={"/icons/arrow-back-icon.svg"}
                  width={36}
                  height={36}
                  alt="arrow-back-icon"
                  onClick={handleBackComponent}
                />
              </div>
            )}
          </div>
        )}

        {tableDataActive && (
          <TableData
            handleAddProduct={handleAddComponente}
            handleEditProduct={handleEditComponent}
          />
        )}
        {loading && <Loading />}
        {addProduct && (
          <CadastroProdutosSheet
            clearFormFlag={clearFormFlag}
            addProductFlag={addProductFlag}
            resetFlags={() => {
              setClearFormFlag(false);
              setAddProductFlag(false);
            }} // Função para resetar os flags no filho
            handleAddProduct={handleAddProduct} // Função de adicionar no pai
            handleClearForm={handleClearForm} // Função de limpar no pai
          />
        )}
        {addEdit && (
          <EditarCadastroProdutosSheet
            clearFormFlag={clearFormFlag}
            addProductFlag={addProductFlag}
            resetFlags={() => {
              setClearFormFlag(false);
              setAddProductFlag(false);
            }} // Função para resetar os flags no filho
            handleAddProduct={handleAddProduct} // Função de adicionar no pai
            handleClearForm={handleClearForm} // Função de limpar no pai
            statusProduct={handleStatusChange}
          />
        )}
      </div>
    </main>
  );
}
