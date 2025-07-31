"use client";

import React from "react";
import styles from "./TableData.module.css";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import { atom, useAtom } from "jotai";
import ModalAction from "../ModalAction/ModalAction";

//Global Variables
export const idEditAtom = atom<number | null>(null);

//Interfaces

interface GroupOrSubgroup {
  name: string;
}

interface UnityType{
  name: string
  description: string
}

interface Products {
  id: number;
  description: string;
  price: number;
  bar_code: string;
  ex_ncm: number;
  reserved_stock: number;
  gross_weight: number;
  liquid_weight: number;
  stock: number;
  ncmId: string;
  UnityType: UnityType;
  groupId: number;
  cestId: string;
  subGroupId: number;
  createdAt: string;
  updatedAt: string;
  Group: GroupOrSubgroup;
  SubGroup: GroupOrSubgroup;
}

//Interface para Lidar com o Array de items filtrados
//Ou seja são as opões do dropdown do input de pesquisa
interface ItemFilter {
  item: string;
  svg: string;
  field: string;
}

//Interface de Prop do Component
interface TableDataProps {
  handleAddProduct: () => void;
  handleEditProduct: () => void;
}

//Array de items utilizados para filtrar no input de pesquisa
const tableFilter: ItemFilter[] = [
  {
    item: "Código",
    svg: "/icons/code-icon.svg",
    field: "id",
  },
  {
    item: "Cd. Barra",
    svg: "/icons/codebar-icon.svg",
    field: "bar_code",
  },
  {
    item: "Descrição",
    svg: "/icons/description-icon.svg",
    field: "description",
  },
  {
    item: "Unidade",
    svg: "/icons/unity-icon.svg",
    field: "unityTypeId",
  },
  {
    item: "Preço Venda",
    svg: "/icons/price-sell-icon.svg",
    field: "price",
  },
  {
    item: "Grupo",
    svg: "/icons/group-icon.svg",
    field: "groupId",
  },
  {
    item: "Sub-Grupo",
    svg: "/icons/sub-group-icon.svg",
    field: "subGroupId",
  },
];

//Quantidade de items na lista por página
const ITEMS_PER_PAGE = 20;

const TableData: React.FC<TableDataProps> = ({
  handleAddProduct,
  handleEditProduct,
}) => {
  //States
  const [selecteds, setSelecteds] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [dropDownSearch, setDropDownSearch] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Products[]>([]);
  const [initialProducts, setInitialProducts] = useState<Products[]>([]);
  const [initialTotalPages, setInitialTotalPages] = useState<number>(0);
  const [, setIdForEdit] = useAtom(idEditAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textForModal, setTextForModal] = useState<string>(
    "Deseja deletar os produtos selecionados?"
  );

  //Req de busca de dados da tabela ao criar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        //Esconder url da api futuramente
        `http://26.56.52.76:8000/product?limit=${ITEMS_PER_PAGE}&page=${
          currentPage + 1
        }`
      );
      const data = await res.json();
      console.log(data);
      setProducts(data.products);
      setInitialProducts(data.products);
      setTotalPages(data.totalPages);
      setInitialTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [currentPage]);

  // Atualiza o estado quando a lista de produtos muda
  useEffect(() => {
    setSelecteds(Array(products.length).fill(false));
  }, [products]);

  //Função enviada via prop para adicionar um produto
  //Os icones estão na page CadastroProdutos, mas o clique vem daqui e envia para la
  const toggleAddProduct = () => {
    handleAddProduct();
  };

  //Functio para enviar ao elemento pai o clique de renderizar a página de edit de produtos
  const toggleAddEditProduct = () => {
    const selectID = products
      .filter((_, index) => selecteds[index]) // Filtra os produtos onde a seleção é true
      .map((product) => product.id); // Mapeia para pegar os IDs dos produtos selecionados

    //Validações para ir para a page de edição do produto
    if (selectID.length == 0) {
      toast.info("Selecione um produto para editar.");
      return;
    }

    if (selectID.length > 1) {
      toast.info("Somente um produto pode ser editado por vez.");
      return;
    }

    console.log(selectID, "ID");
    //Set ID FOR EDIT GLOBAL
    setIdForEdit(selectID[0]);
    handleEditProduct();
  };

  //Function para deletar
  const deleteProducts = async () => {
    // Cria um array de IDs dos produtos selecionados
    const selectedProductIds = products
      .filter((_, index) => selecteds[index]) // Filtra os produtos onde a seleção é true
      .map((product) => product.id); // Mapeia para pegar os IDs dos produtos selecionados

    console.log(selectedProductIds);

    // Se a lista de IDs estiver vazia, não faz nada
    if (selectedProductIds.length === 0) {
      toast.info("Nenhum produto selecionado para deletar.");
      return;
    }

    //MODAL DE DELEÇÃO

    //Req Delete
    try {
      const res = await fetch("http://26.56.52.76:8000/product", {
        method: "DELETE", // Usando POST para enviar os dados
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedProductIds }), // Passando os IDs no corpo da requisição
      });

      if (!res.ok) {
        toast.error("Os produtos não foram deletados, tente novamente.");
        return;
      }

      if (res.status == 204) {
        toast.success("Produtos deletados com sucesso.");
        //Chama uma nova req get no DB
        fetchProductsDeleted();
        setSelecteds(Array(products.length).fill(false)); // Reseta a seleção
      } else {
        toast.error("Erro ao deletar os produtos.");
      }
    } catch (error) {
      console.error("Erro na requisição de delete:", error);
      toast.error("Ocorreu um erro ao tentar deletar os produtos.");
    }
  };

  //Faz uma nova req após deletar os produtos
  const fetchProductsDeleted = async () => {
    const res = await fetch(
      //Esconder url da api futuramente
      `http://26.56.52.76:8000/product?limit=${ITEMS_PER_PAGE}&page=${
        currentPage + 1
      }`
    );
    const data = await res.json();
    console.log(data);
    setProducts(data.products);
    setInitialProducts(data.products);
    setTotalPages(data.totalPages);
    setInitialTotalPages(data.totalPages);
  };

  //Const useRef para verificar qual elemento o usuário está clicando
  //PAra lidar com o dropdown do filtro da barra de pesquisa
  const dropdownRef = useRef<HTMLDivElement>(null);

  //Function que lita com as caixas que selecionam os produtos
  const handleCheckboxChange = (index: number) => {
    const novosselecteds = [...selecteds];
    novosselecteds[index] = !novosselecteds[index];
    setSelecteds(novosselecteds);
  };

  //Functions de Paginação
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Função que será chamada para realizar a requisição com base no filtro
  const filterData = async (searchTerm: string, field: string) => {
    try {
      const res = await fetch(
        //Esconder url da api futuramente
        `http://26.56.52.76:8000/product?limit=${ITEMS_PER_PAGE}&page=${
          currentPage + 1
        }&field=${field}&filter=${searchTerm}`
      );
      const data = await res.json();
      console.log(data);
      setProducts(data.products);
      setCurrentPage(0);
      setTotalPages(data.totalPages);
    } catch {
      console.log("Ocorreu algum erro");
    }
  };

  // Debounce da função fetchData]
  //Só chama a req de filtro depois de 500ms ou seja
  //Vai esperar 500ms para ver se outra tecla não vai ser pressionada
  //Evitando várias reqs ao db
  const debouncedFetchData = useCallback(
    debounce((value: string, field: string) => filterData(value, field), 500), // 500ms de atraso
    []
  );

  // Function onchange do input de pesquisar, caso um filtro não esteja selecionado
  //Solicita a escolha de um e reseta os estados abaixo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedOption == null) {
      toast.info("Selecione um Filtro antes de pesquisar");
      setSearchTerm("");
      setCurrentPage(0);
      return;
    }

    const fieldValue = tableFilter[selectedOption].field;
    console.log(fieldValue);
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchData(value, fieldValue);
  };

  //Variavel para realizar o zebramento da lista
  //Com base no tamanho do array
  const startIndex = currentPage * ITEMS_PER_PAGE;
  //Varaivel que recebe todo o array de produytos
  const currentItems = products;

  //Dropdown da barra de pesquisa
  const handleDropdownToggle = () => {
    setDropDownSearch((prev) => !prev);
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setDropDownSearch(false); // Close dropdown on selection
    setSearchTerm(""); // Limpa o campo de busca ao mudar de filtro
  };

  //clear selected option dropwdon
  const handleClearOptionClick = () => {
    setSelectedOption(null);
    setSearchTerm("");
    setProducts(initialProducts);
    setTotalPages(initialTotalPages);
  };

  //Verifica se o clique foi fora do dropdown para fechar
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropDownSearch(false);
    }
  };

  useEffect(() => {
    // Reseta a página atual ao aplicar um novo filtro
    setCurrentPage(0);
  }, [searchTerm, selectedOption]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Lógica do Modal para deleção

  const handleForDeleteProducts = () => {
    //Verifica se a lista de items selecionados da tabela está vazia
    //Para seguir cm a lógica

    const selectedProductIds = products
    .filter((_, index) => selecteds[index]) // Filtra os produtos onde a seleção é true
    .map((product) => product.id); // Mapeia para pegar os IDs dos produtos selecionados


    if (selectedProductIds.length === 0) {
      toast.info("Nenhum produto selecionado para deletar.");
      return;
    }

    //Seta o texto para o modal de acordo com a quantidade selecionada

    if (selectedProductIds.length === 1) {
      setTextForModal("Deseja deletar o produto selecionado?");
      handleOpenModal();
      return;
    }

    if(selectedProductIds.length > 1){
      setTextForModal("Deseja deletar os produtos selecionados?");
      handleOpenModal();
      return;
    }

  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    deleteProducts(); //Chama a function para deletar os produtos.
    setIsModalOpen(false); // Fecha o modal após a confirmação
  };
  const handleCancel = () => {
    setSelecteds([]); //Limpa a lsita de selecionados caso não queira deletar.
    setIsModalOpen(false); // Fecha o modal após o cancelamento
  };

    //Trava rolagem quando o modal estiver aberto
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden'; // Bloqueia rolagem
      } else {
        document.body.style.overflow = 'auto'; // Restaura a rolagem
      }
      return () => {
        document.body.style.overflow = 'auto'; // Garante que a rolagem seja restaurada quando o componente for desmontado
      };
    }, [isModalOpen]);

  return (
    <main className={styles.main}>
      <ModalAction
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        text={textForModal}
      />
      <div className={styles.controlList}>
        <div className={styles.inputSearch}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleDropdownToggle}
          >
            <path d="M12 15L7 10H17L12 15Z" fill="black" />
          </svg>
          {selectedOption !== null && (
            <div className={styles.filterDivInput}>
              <Image
                src={"/icons/arrow-close-black-icon.svg"}
                width={18}
                height={18}
                alt="close=icon"
                onClick={handleClearOptionClick}
              />
              <p>{tableFilter[selectedOption].item}</p>
            </div> // Exibe o item selecionado
          )}
          <input
            id="Pesquisa"
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className={styles.iconsAction}>
          <div className={styles.icon} onClick={toggleAddProduct}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z"
                fill="black"
                fillOpacity="0.7"
              />
            </svg>
          </div>
          <div className={styles.icon} onClick={toggleAddEditProduct}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
                fill="black"
                fillOpacity="0.7"
              />
            </svg>
          </div>
          <div className={styles.icon} onClick={handleForDeleteProducts}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                fill="black"
                fillOpacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>
      {dropDownSearch && (
        <div className={styles.dropDownSearch} ref={dropdownRef}>
          {tableFilter.map((item, index) => (
            <div
              key={index}
              className={`${styles.optionsFilter} ${
                selectedOption === index ? styles.selected : ""
              }`}
              onClick={() => handleOptionClick(index)}
              style={{
                backgroundColor:
                  selectedOption === index ? "#cacaca" : "transparent",
              }} // Apply background color
            >
              <Image
                src={item.svg}
                width={20}
                height={20}
                alt={`icon ${item.item}`}
              />
              <p>{item.item}</p>
            </div>
          ))}
        </div>
      )}
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th className={styles.colunaSelecionar}>Selecionar</th>
            <th>Código</th>
            <th>Cd. Barra</th>
            <th>Descrição</th>
            <th>Unidade</th>
            <th>Preço Venda</th>
            <th>Grupo</th>
            <th>Sub-Grupo</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={startIndex + index}
              className={`${
                (startIndex + index) % 2 === 0
                  ? styles.linhaPar
                  : styles.linhaImpar
              } ${selecteds[startIndex + index] ? styles.selecionado : ""}`}
            >
              <td className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={!!selecteds[startIndex + index]} // Garante que seja um booleano
                  onChange={() => handleCheckboxChange(startIndex + index)}
                  id={`checkBox-${startIndex + index}`}
                />
              </td>
              <td className={styles.colunaCodigo}>{item.id}</td>
              <td>{item.bar_code}</td>
              <td className={styles.colunaDescricao}>{item.description}</td>
              <td className={styles.colunaUnidade}>{item.UnityType.name}</td>
              <td className={styles.colunaPrecoVenda}>
                R$ {item.price.toFixed(2)}
              </td>
              <td>{item.Group ? item.Group.name : "N/A"}</td>
              <td>{item.SubGroup ? item.SubGroup.name : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.paginacao}>
        <div>
          Página {currentPage + 1} de {totalPages == 0 ? 1 : totalPages}
        </div>
        <button
          className={styles.btnArrowLeft}
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.979 10L4.1665 6.16667L5.33317 5L10.3332 10L5.33317 15L4.1665 13.8333L7.979 10ZM13.479 10L9.6665 6.16667L10.8332 5L15.8332 10L10.8332 15L9.6665 13.8333L13.479 10Z"
              fill="black"
              fillOpacity="0.8"
            />
          </svg>
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={styles.btnArrowRight}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.979 10L4.1665 6.16667L5.33317 5L10.3332 10L5.33317 15L4.1665 13.8333L7.979 10ZM13.479 10L9.6665 6.16667L10.8332 5L15.8332 10L10.8332 15L9.6665 13.8333L13.479 10Z"
              fill="black"
              fillOpacity="0.8"
            />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default TableData;
