"use client";

import { useState } from "react";
import styles from './page.module.css';
import Navbar from "./components/Navbar/Navbar";
import CadastroProdutos from "./components/pages/CadastroProdutos/CadastroProdutos";
import CadastroClientes from "./components/pages/CadastroClientes/CadastroClientes";
import Footer from "./components/Footer/Footer";

const Home = () => {
  const [produtosData, setProdutosData] = useState("");
  const [clientesData, setClientesData] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Estados do CadastroProdutos (Para manter do jeito que deixamos antes de mudar deaba)
  //Aqui estão recebendo os valores atuais do componente, para enviar novamente ao mudar de pagina.
  //Assim ele não reseta a pagina
  const [tableDataActive, setTableDataActive] = useState<boolean>(true);
  const [addProduct, setAddProduct] = useState<boolean>(false);
  const [addEdit, setAddEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [titlePage, setTitlePage] = useState<string>("Cadastro de Produtos");

  const handleTabChange = (tab: string | null) => {
    if (tab === null) {
      // Resetar estados para os valores padrão
      setTableDataActive(true);
      setAddProduct(false);
      setLoading(false);
      setAddEdit(false)
      setTitlePage("Cadastro de Produtos");
    }
    setActiveTab(tab);
  };


  return (
    <>
      <main className="mainPage">
        <Navbar
          onTabChange={handleTabChange}
          setProdutosData={setProdutosData}
          setClientesData={setClientesData}
        />
        <section className={`${styles.sectionIMG} ${activeTab ? styles.noBackground : ''}`}>
          {activeTab === "Cadastro de Produtos" && (
            <CadastroProdutos 
              data={produtosData} 
              setData={setProdutosData} 
              activeTab={activeTab}
              tableDataActive={tableDataActive}
              setTableDataActive={setTableDataActive}
              addProduct={addProduct}
              setAddProduct={setAddProduct}
              loading={loading}
              setLoading={setLoading}
              titlePage={titlePage}
              setTitlePage={setTitlePage}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
            />
          )}
          {activeTab === "Cadastro de Clientes" && (
            <CadastroClientes data={clientesData} setData={setClientesData} />
          )}
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;
