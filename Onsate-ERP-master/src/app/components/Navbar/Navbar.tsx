"use client";

//Imports
import { useState, useEffect } from "react";
import Dropdown from "../Dropdown/Dropdown";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { useAtom } from "jotai";
import { Bounce, toast } from "react-toastify";
import {
  descriptionAtom,
  unityTypeAtom,
  barCodeAtom,
  ncmAtom,
  exNcmAtom,
  cestIdAtom,
  priceAtom,
  groupIdAtom,
  subGroupIdAtom,
  reservedStockAtom,
  stockAtom,
  grossWeightAtom,
  liquidWeightAtom,
} from "../Sheets/CadastroProdutos/CadastroProdutosSheet";

//Interface para tipar as props que vem para este componente
interface OnTabChangeProps {
  onTabChange: (tab: string | null) => void;
  setProdutosData: React.Dispatch<React.SetStateAction<string>>;
  setClientesData: React.Dispatch<React.SetStateAction<string>>;
}

//Component Navbar
export default function Navbar({
  onTabChange,
  setClientesData,
}: OnTabChangeProps) {

  //States navbar
  const [dropMenu, setDropMenu] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [dropdownData, setDropdownData] = useState<{
    title: string;
    icon: string;
    title2: string;
    icon2: string;
    leftOptions: string[];
    rightOptions: string[];
  } | null>(null);
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  //States para Resetar os dados da folha cadastro de produtos
  const [, setDescription] = useAtom(descriptionAtom);
  const [, setUnityType] = useAtom(unityTypeAtom);
  const [, setBarCode] = useAtom(barCodeAtom);
  const [, setNcm] = useAtom(ncmAtom);
  const [, setExNcm] = useAtom(exNcmAtom);
  const [, setCestId] = useAtom(cestIdAtom);
  const [, setPrice] = useAtom(priceAtom);
  const [, setGroupId] = useAtom(groupIdAtom);
  const [, setSubGroupId] = useAtom(subGroupIdAtom);
  const [, setReservedStock] = useAtom(reservedStockAtom);
  const [, setStock] = useAtom(stockAtom);
  const [, setGrossWeight] = useAtom(grossWeightAtom);
  const [, setLiquidWeight] = useAtom(liquidWeightAtom);

  //Função de reset dos dados da folha de cadastro de produtos
  const resetForm = () => {
    setDescription("");
    setUnityType("");
    setBarCode("");
    setNcm("");
    setExNcm("");
    setCestId("");
    setPrice("");
    setGroupId(null);
    setSubGroupId(null);
    setReservedStock("");
    setStock("");
    setGrossWeight("");
    setLiquidWeight("");
  };

  //Função que lida com abertura e fechamento do dropdown
  const handleToggleDropdown = (link: string) => {
    //Caso tenha  um link que ja está ativo (Que ja foi clicado)
    //Fecha o dropdown e limpa o link ativo e as props
    if (activeLink === link) {
      setDropMenu(false);
      setActiveLink(null);
      setDropdownData(null);
    } else {
      //Caso o Link clicado corresponda a algum destes cases abaixo
      //Estas props serão armazenadas na let newDropDownData
      let newDropdownData;

      switch (link) {
        case "Vendas":
          newDropdownData = {
            title: "Cadastros",
            icon: "/icons/cadastro-icon.svg",
            title2: "Processos",
            icon2: "/icons/processos-icon.svg",
            leftOptions: [
              "Cadastro de Clientes",
              "Cadastro de Produtos",
              "Cadastro de Vendedores",
              "Cadastro de Transportadoras",
            ],
            rightOptions: ["Pedido de Venda", "Transmissão de Nota"],
          };
          break;
        case "Compras":
          newDropdownData = {
            title: "Cadastros",
            icon: "/icons/cadastro-icon.svg",
            title2: "Processos",
            icon2: "/icons/processos-icon.svg",
            leftOptions: [
              "Cadastro de Fornecedores",
              "Cadastro de Grupo / Sub-Grupo",
              "Cadastro de Unidade",
            ],
            rightOptions: [
              "Entrada de Nota",
              "Inventário",
              "Ajuste de Suprimentos",
            ],
          };
          break;
        case "Financeiro":
          newDropdownData = {
            title: "Cadastros",
            icon: "/icons/cadastro-icon.svg",
            title2: "Finanças",
            icon2: "/icons/financas-Icon.svg",
            leftOptions: [
              "Meio de Pagamento",
              "Forma de Pagamento",
              "Centro de Custo",
              "Plano de Contas",
            ],
            rightOptions: ["Contas a Pagar", "Contas a Receber", "Caixa"],
          };
          break;
        case "Relatórios":
          newDropdownData = {
            title: "Relatórios Operacionais",
            icon: "/icons/report-Icon.svg",
            title2: "Relatórios Financeiros e Vendas",
            icon2: "/icons/report-Icon.svg",
            leftOptions: [
              "Relatórios de Clientes",
              "Relatórios de Estoque",
              "Relatório de Fornecedores",
            ],
            rightOptions: [
              "Relatório de Transportadores",
              "Relatório de Vendas",
              "Relatórios do Financeiro",
            ],
          };
          break;
        default:
          break;
      }

      //Caso alguma condição do Switch seja satisfeita
      //Ou seja a variável criada acima obterá um valor
      //E entrará no if para preencher os states que serão enviados ao dropdown
      if (newDropdownData) {
        setDropdownData(newDropdownData);
        setDropMenu(true);
        setActiveLink(link);
      }
    }
  };

  //Função que define a quantidade de abas que serão abertas e o seu limite.
  const handleOptionClick = (option: string) => {
    if (!tabs.includes(option) && tabs.length < 4) {
      setTabs((prev) => [...prev, option]);
      setActiveTab(option); // Define a aba ativa ao clicar
      onTabChange(option); // Notifica a page principal sobre a mudança de aba
    } else if (tabs.includes(option)) {
      toast.info("Aba já aberta.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.info("Limite de abas atingido.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  //Função que define qual aba está ativa através do click, e muda o CSS da aba ativa.
  //Ou seja, clicou em uma aba ela se torna a ativa.
  const handleTabClick = (tab: string) => {
    setActiveTab(tab); // Altera a aba ativa
    onTabChange(tab); // Notifica a page principal sobre a mudança de aba
  };

  //Função que lida com o fechamento de abas e reset de dados das paginas
  const handleCloseTab = (tabToClose: string) => {
    //Pega os dados atuals de tabs com uso do prev
    //E faz um filtro removendo a pagina que é igual ao parametro recebido aqui
    setTabs((prev) => prev.filter((tab) => tab !== tabToClose));
    if (activeTab === tabToClose) {
      setActiveTab(null);
      onTabChange(null);
    }

    localStorage.setItem(
      "tabs",
      JSON.stringify(tabs.filter((tab) => tab !== tabToClose))
    );

    // Resetar os dados da aba específica
    switch (tabToClose) {
      case "Cadastro de Produtos":
        // Resetar os dados do Cadastro de Produtos
        resetForm();
        
        break;
      case "Cadastro de Clientes":
        // Resetar os dados do Cadastro de Clientes
        setClientesData("");
        break;
      default:
        break;
    }
  };

  //Função que lida com o fechamento do dropdown caso clicado fora de sua área
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement; // Obtém o elemento que foi clicado
    if (!target.closest(`.${styles.lowerNavLinks}`)) {
      // Verifica se o elemento clicado está dentro do dropdown
      setDropMenu(false); // Fecha o dropdown
      setActiveLink(null); // Reseta o link ativo (se houver)
      setDropdownData(null); // Limpa os dados do dropdown (se houver)
    }
  };

  //useEffect para ser chamado quando o Evento de click for realizado
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event); // Chama a função para lidar com o clique fora
    };

    document.addEventListener("click", handleDocumentClick); // Adiciona o listener de clique ao documento
    return () => {
      document.removeEventListener("click", handleDocumentClick); // Remove o listener quando o componente é desmontado
    };
  }, []);

  useEffect(() => {
    const savedTabs = localStorage.getItem("tabs");
    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
      setActiveTab(JSON.parse(savedTabs)[0] || null);
    }
  }, []);

  return (
    <>
      <nav>
        <div className={styles.upperDiv}>
          <Image
            src={"/images/logo-onsate.png"}
            width={135}
            height={41}
            alt="logo-onsate"
          />
          <div className={`${styles.divTabs}`}>
            {tabs.map((tab) => (
              <div
                className={`${styles.linkTabs} ${
                  activeTab === tab ? styles.activeLinkTab : ""
                }`}
                key={tab}
                onClick={() => handleTabClick(tab)}
              >
                <p className={styles.pTexts}>{tab}</p>
                <Image
                  src={"/icons/close-icon.svg"}
                  width={18}
                  height={18}
                  alt="close-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que o click do close feche a aba
                    handleCloseTab(tab);
                  }} // Fecha a aba
                />
              </div>
            ))}
          </div>
          <div className={styles.divIcons}>
            <div className={styles.hoverIcons}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6291 25.6667C12.1041 25.6667 11.6521 25.4917 11.2729 25.1417C10.8937 24.7917 10.6653 24.3639 10.5875 23.8583L10.325 21.9333C10.0722 21.8361 9.834 21.7194 9.61039 21.5833C9.38678 21.4472 9.16803 21.3014 8.95414 21.1458L7.14581 21.9042C6.6597 22.118 6.17359 22.1375 5.68748 21.9625C5.20137 21.7875 4.8222 21.4764 4.54998 21.0292L3.17914 18.6375C2.90692 18.1903 2.82914 17.7139 2.94581 17.2083C3.06248 16.7028 3.32498 16.2847 3.73331 15.9542L5.27914 14.7875C5.2597 14.6514 5.24998 14.5201 5.24998 14.3937V13.6062C5.24998 13.4799 5.2597 13.3486 5.27914 13.2125L3.73331 12.0458C3.32498 11.7153 3.06248 11.2972 2.94581 10.7917C2.82914 10.2861 2.90692 9.80972 3.17914 9.36249L4.54998 6.97083C4.8222 6.52361 5.20137 6.21249 5.68748 6.03749C6.17359 5.86249 6.6597 5.88194 7.14581 6.09583L8.95414 6.85416C9.16803 6.69861 9.39164 6.55277 9.62498 6.41666C9.85831 6.28055 10.0916 6.16388 10.325 6.06666L10.5875 4.14166C10.6653 3.63611 10.8937 3.20833 11.2729 2.85833C11.6521 2.50833 12.1041 2.33333 12.6291 2.33333H15.3708C15.8958 2.33333 16.3479 2.50833 16.7271 2.85833C17.1062 3.20833 17.3347 3.63611 17.4125 4.14166L17.675 6.06666C17.9278 6.16388 18.1659 6.28055 18.3896 6.41666C18.6132 6.55277 18.8319 6.69861 19.0458 6.85416L20.8541 6.09583C21.3403 5.88194 21.8264 5.86249 22.3125 6.03749C22.7986 6.21249 23.1778 6.52361 23.45 6.97083L24.8208 9.36249C25.093 9.80972 25.1708 10.2861 25.0541 10.7917C24.9375 11.2972 24.675 11.7153 24.2666 12.0458L22.7208 13.2125C22.7403 13.3486 22.75 13.4799 22.75 13.6062V14.3937C22.75 14.5201 22.7305 14.6514 22.6916 14.7875L24.2375 15.9542C24.6458 16.2847 24.9083 16.7028 25.025 17.2083C25.1416 17.7139 25.0639 18.1903 24.7916 18.6375L23.3916 21.0292C23.1194 21.4764 22.7403 21.7875 22.2541 21.9625C21.768 22.1375 21.2819 22.118 20.7958 21.9042L19.0458 21.1458C18.8319 21.3014 18.6083 21.4472 18.375 21.5833C18.1416 21.7194 17.9083 21.8361 17.675 21.9333L17.4125 23.8583C17.3347 24.3639 17.1062 24.7917 16.7271 25.1417C16.3479 25.4917 15.8958 25.6667 15.3708 25.6667H12.6291ZM12.8333 23.3333H15.1375L15.5458 20.2417C16.1486 20.0861 16.7076 19.8576 17.2229 19.5562C17.7382 19.2549 18.2097 18.8903 18.6375 18.4625L21.525 19.6583L22.6625 17.675L20.1541 15.7792C20.2514 15.5069 20.3194 15.2201 20.3583 14.9187C20.3972 14.6174 20.4166 14.3111 20.4166 14C20.4166 13.6889 20.3972 13.3826 20.3583 13.0812C20.3194 12.7799 20.2514 12.4931 20.1541 12.2208L22.6625 10.325L21.525 8.34166L18.6375 9.56666C18.2097 9.11944 17.7382 8.74513 17.2229 8.44375C16.7076 8.14236 16.1486 7.91388 15.5458 7.75833L15.1666 4.66666H12.8625L12.4541 7.75833C11.8514 7.91388 11.2923 8.14236 10.7771 8.44375C10.2618 8.74513 9.79026 9.10972 9.36248 9.5375L6.47498 8.34166L5.33748 10.325L7.84581 12.1917C7.74859 12.4833 7.68053 12.775 7.64164 13.0667C7.60276 13.3583 7.58331 13.6694 7.58331 14C7.58331 14.3111 7.60276 14.6125 7.64164 14.9042C7.68053 15.1958 7.74859 15.4875 7.84581 15.7792L5.33748 17.675L6.47498 19.6583L9.36248 18.4333C9.79026 18.8806 10.2618 19.2549 10.7771 19.5562C11.2923 19.8576 11.8514 20.0861 12.4541 20.2417L12.8333 23.3333ZM14.0583 18.0833C15.1861 18.0833 16.1486 17.6847 16.9458 16.8875C17.743 16.0903 18.1416 15.1278 18.1416 14C18.1416 12.8722 17.743 11.9097 16.9458 11.1125C16.1486 10.3153 15.1861 9.91666 14.0583 9.91666C12.9111 9.91666 11.9437 10.3153 11.1562 11.1125C10.3687 11.9097 9.97498 12.8722 9.97498 14C9.97498 15.1278 10.3687 16.0903 11.1562 16.8875C11.9437 17.6847 12.9111 18.0833 14.0583 18.0833Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.hoverIcons}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 24.5C13.6695 24.5 13.3924 24.3882 13.1688 24.1646C12.9452 23.941 12.8334 23.6639 12.8334 23.3333C12.8334 23.0028 12.9452 22.7257 13.1688 22.5021C13.3924 22.2785 13.6695 22.1667 14 22.1667H22.1667V13.8833C22.1667 11.6083 21.3743 9.67847 19.7896 8.09375C18.2049 6.50903 16.275 5.71667 14 5.71667C11.725 5.71667 9.79518 6.50903 8.21046 8.09375C6.62574 9.67847 5.83337 11.6083 5.83337 13.8833V19.8333C5.83337 20.1639 5.72157 20.441 5.49796 20.6646C5.27435 20.8882 4.99726 21 4.66671 21C4.02504 21 3.47574 20.7715 3.01879 20.3146C2.56185 19.8576 2.33337 19.3083 2.33337 18.6667V16.3333C2.33337 15.925 2.43546 15.541 2.63962 15.1812C2.84379 14.8215 3.1306 14.5347 3.50004 14.3208L3.58754 12.775C3.7431 11.4528 4.12712 10.2278 4.73962 9.1C5.35212 7.97222 6.12018 6.99028 7.04379 6.15417C7.9674 5.31806 9.02712 4.66667 10.223 4.2C11.4188 3.73333 12.6778 3.5 14 3.5C15.3223 3.5 16.5764 3.73333 17.7625 4.2C18.9487 4.66667 20.0084 5.31319 20.9417 6.13958C21.875 6.96597 22.6431 7.94306 23.2459 9.07083C23.8487 10.1986 24.2375 11.4236 24.4125 12.7458L24.5 14.2625C24.8695 14.4375 25.1563 14.7 25.3605 15.05C25.5646 15.4 25.6667 15.7694 25.6667 16.1583V18.8417C25.6667 19.2306 25.5646 19.6 25.3605 19.95C25.1563 20.3 24.8695 20.5625 24.5 20.7375V22.1667C24.5 22.8083 24.2716 23.3576 23.8146 23.8146C23.3577 24.2715 22.8084 24.5 22.1667 24.5H14ZM10.5 16.3333C10.1695 16.3333 9.8924 16.2215 9.66879 15.9979C9.44518 15.7743 9.33337 15.4972 9.33337 15.1667C9.33337 14.8361 9.44518 14.559 9.66879 14.3354C9.8924 14.1118 10.1695 14 10.5 14C10.8306 14 11.1077 14.1118 11.3313 14.3354C11.5549 14.559 11.6667 14.8361 11.6667 15.1667C11.6667 15.4972 11.5549 15.7743 11.3313 15.9979C11.1077 16.2215 10.8306 16.3333 10.5 16.3333ZM17.5 16.3333C17.1695 16.3333 16.8924 16.2215 16.6688 15.9979C16.4452 15.7743 16.3334 15.4972 16.3334 15.1667C16.3334 14.8361 16.4452 14.559 16.6688 14.3354C16.8924 14.1118 17.1695 14 17.5 14C17.8306 14 18.1077 14.1118 18.3313 14.3354C18.5549 14.559 18.6667 14.8361 18.6667 15.1667C18.6667 15.4972 18.5549 15.7743 18.3313 15.9979C18.1077 16.2215 17.8306 16.3333 17.5 16.3333ZM7.02921 14.525C6.8931 12.4639 7.51532 10.6944 8.89587 9.21667C10.2764 7.73889 11.9973 7 14.0584 7C15.7889 7 17.3105 7.54931 18.623 8.64792C19.9355 9.74653 20.7278 11.1514 21 12.8625C19.2306 12.8431 17.6021 12.3667 16.1146 11.4333C14.6271 10.5 13.4848 9.23611 12.6875 7.64167C12.3764 9.19722 11.7202 10.5826 10.7188 11.7979C9.7174 13.0132 8.48754 13.9222 7.02921 14.525Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={styles.lowerDiv}>
          <div className={styles.lowerDivLinks}>
            <div className={styles.lowerNavLinks}>
              {["Vendas", "Compras", "Financeiro", "Relatórios"].map((link) => (
                <div
                  key={link}
                  className={`${styles.lowerNavLink} ${
                    activeLink === link ? styles.activeLink : ""
                  }`}
                  onClick={() => handleToggleDropdown(link)}
                >
                  <p>{link}</p>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 15L7 10H17L12 15Z" fill="white" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Componente dropdow chamaNdo e suas props enviadas */}
      {dropMenu && dropdownData && (
        <Dropdown
          title={dropdownData.title}
          icon={dropdownData.icon}
          title2={dropdownData.title2}
          icon2={dropdownData.icon2}
          leftOptions={dropdownData.leftOptions}
          rightOptions={dropdownData.rightOptions}
          onOptionClick={handleOptionClick}
        />
      )}
    </>
  );
}
