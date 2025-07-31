"use client";

import React from "react";
import styles from "./CadastroProdutosSheet.module.css";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import SearchSelectNcm from "../../SearchSelect/SearchSelectNCM";
import SearchSelectCest from "../../SearchSelect/SearchSelectCest";
import ModalUnitiesSelect from "../../ModalsSearchIcon/ModalUnitiesSelect/ModalUnitiesSelect";
import ModalGroupSelect from "../../ModalsSearchIcon/ModalGroupsSelect/ModalGroupSelect";
import ModalNCM from "../../ModalsSearchIcon/ModalNCM/ModalNCM";
import ModalCEST from "../../ModalsSearchIcon/ModalCEST/ModalCEST";
import Loading from "../../Loading/Loading";

//Interfaces

interface CadastroProdutosSheetProps {
  clearFormFlag: boolean;
  addProductFlag: boolean;
  resetFlags: () => void; // Função para resetar os flags
  handleAddProduct: () => void; // Função para adicionar o produto
  handleClearForm: () => void; // Função para limpar o formulário
}

interface selectType {
  id: number;
  name: string;
}

// Definindo átomos para cada campo de input
//Irão inicializar os valores nos inputs
export const descriptionAtom = atom<string | null>(null);
export const unityTypeAtom = atom<string | null>(null);
export const barCodeAtom = atom<string | null>(null);
export const ncmAtom = atom<string>("");
export const exNcmAtom = atom<string | null>(null);
export const cestIdAtom = atom<string>("");
export const priceAtom = atom<string | null>(null);
export const groupIdAtom = atom<string | null>(null);
export const subGroupIdAtom = atom<string | null>(null);
export const reservedStockAtom = atom<string | null>(null);
export const stockAtom = atom<string | null>(null);
export const grossWeightAtom = atom<string | null>(null);
export const liquidWeightAtom = atom<string | null>(null);

const CadastroProdutosSheet: React.FC<CadastroProdutosSheetProps> = ({
  clearFormFlag,
  addProductFlag,
  resetFlags,
  handleAddProduct,
  handleClearForm,
}) => {
  // Usando os átomos com useAtom para obter e definir o estado
  const [description, setDescription] = useAtom(descriptionAtom);
  const [unityType, setUnityType] = useAtom(unityTypeAtom);
  const [barCode, setBarCode] = useAtom(barCodeAtom);
  const [ncm, setNcm] = useAtom(ncmAtom);
  const [exNcm, setExNcm] = useAtom(exNcmAtom);
  const [cestId, setCestId] = useAtom(cestIdAtom);
  const [price, setPrice] = useAtom(priceAtom);
  const [groupId, setGroupId] = useAtom(groupIdAtom);
  const [subGroupId, setSubGroupId] = useAtom(subGroupIdAtom);
  const [reservedStock, setReservedStock] = useAtom(reservedStockAtom);
  const [stock, setStock] = useAtom(stockAtom);
  const [grossWeight, setGrossWeight] = useAtom(grossWeightAtom);
  const [liquidWeight, setLiquidWeight] = useAtom(liquidWeightAtom);
  // Estado de mensagens de erro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //Data para selects
  const [unitySelect, setUnitySelect] = useState<selectType[]>([]);
  const [groupSelect, setGroupSelect] = useState<selectType[]>([]);
  const [subGroupSelect, setSubGroupSelect] = useState<selectType[]>([]);

  //Select que filtra dados no backend
  const [, setInputValueNcm] = useState<string>("");
  const [, setSelectedOptionNcm] = useState<string | null>(null);
  const [, setSelectedOptionCest] = useState<string | null>(null);

  //Estados do modal para adicionar as unidades nos selects
  const [isModalOpenUnity, setIsModalOpenUnity] = useState(false);
  const [isModalOpenGroup, setIsModalOpenGroup] = useState(false);
  const [isModalOpenNcm, setIsModalOpenNcm] = useState(false);
  const [isModalOpenCest, setIsModalOpenCest] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  //Controle do botão para limpar os selects
  const [clearSelectGroup, setClearSelectGroup] = useState(false);
  const [clearSelectUnity, setClearSelectUnity] = useState(false);
  const [clearSelectSubGroup, setClearSelectSubGroup] = useState(false);

  //Variavel de loading pós post
  const [loading, setLoading] = useState(false);

  //DAdos para preencher o select que vem do banco
  useEffect(() => {
    // Função para buscar os dados
    const fetchData = async () => {
      try {
        // Realiza as três requisições em paralelo usando Promise.all
        const [responseUnity, responseGroups] = await Promise.all([
          fetch("http://26.56.52.76:8000/unitytype"),
          fetch("http://26.56.52.76:8000/group"),
        ]);

        // Verifica se as respostas foram bem-sucedidas
        if (!responseUnity.ok || !responseGroups.ok) {
          throw new Error("Erro ao buscar dados");
        }

        // Converte as respostas para JSON
        const dataUnity = await responseUnity.json();
        const dataGroup = await responseGroups.json();

        // Atualiza os estados com os dados recebidos
        setUnitySelect(dataUnity.unityTypes);
        setGroupSelect(dataGroup.groups);

        console.log(dataUnity, "dataUnity");
        console.log(dataGroup, "dataGroup");
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchData(); // Chama a função de busca de dados
  }, []);

  //Function para puxar o relacional do Grupo com seus grupos
  const handleSubGroups = async (id: number) => {
    if (!id) {
      //Não selecionou grupo, ou resetou para nada dnv
      setSubGroupSelect([]);
      return;
    } else {
      try {
        const response = await fetch(
          `http://26.56.52.76:8000/subgroup?groupsId=${id}`
        );

        const data = await response.json();

        setSubGroupSelect(data.subgroups);
        console.log(data);

        if (!response.ok) {
          console.log("Erro na chamada");
          toast.error("O Grupo procurado não tem Sub-Grupos");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro na requisição");
      }
    }
  };

  //Function para resetar os valores quando o form é enviado
  const resetForm = () => {
    setDescription("");
    setUnityType("");
    setBarCode(null);
    setNcm("");
    setExNcm(null);
    setCestId("");
    setPrice(null);
    setGroupId(null);
    setSubGroupId(null);
    setReservedStock(null);
    setStock(null);
    setGrossWeight(null);
    setLiquidWeight(null);
    setInputValueNcm("");
    setClearSelectGroup(false)
    setClearSelectSubGroup(false)
    setClearSelectUnity(false)
  };

  //Function para enviar os dados para o backend
  const handleSubmit = async () => {
    let error: string | null = null;

    // Verificando se os campos estão vazios
    if (!description || description.trim() === "") {
      error = "O campo descrição não pode estar vazio.";
    } else if (!unityType || unityType.trim() === "") {
      error = "O campo unidade não pode estar vazio.";
    } else if (!ncm || ncm.trim() === "") {
      error = "O campo NCM não pode estar vazio.";
    } else if (!price || price.trim() === "") {
      error = "O campo preço de venda não pode estar vazio.";
    }

    // Se algum erro foi encontrado, define o erro e não envia os dados
    if (error) {
      setErrorMessage(error);
      return; // Impede o envio dos dados se houver erro
    }

    // Se não houver erro, limpa a mensagem de erro
    setErrorMessage(null);

    //Começa o Loading
    setLoading(true)

    // Dados do formulário
    const dataForm = {
      description: description,
      unity_type: parseInt(unityType || ""),
      ...(barCode && { bar_code: parseInt(barCode) }),
      ncm: ncm,
      ...(exNcm && { ex_ncm: parseInt(exNcm) }),
      cest_code: cestId,
      //...(cestId && { cestId: parseInt(cestId) }),
      ...(price && { price: parseFloat(price) }),
      ...(groupId && { group: parseInt(groupId) }),
      ...(subGroupId && { sub_group: parseInt(subGroupId) }),
      ...(reservedStock && { reserved_stock: parseInt(reservedStock) }),
      ...(stock && { stock: parseInt(stock) }),
      ...(grossWeight && { gross_weight: parseFloat(grossWeight) }),
      ...(liquidWeight && { liquid_weight: parseFloat(liquidWeight) }),
    };

    // Fazer REQ da API
    console.log("Formulário enviado com sucesso!", dataForm);
    
    try {
      const response = await fetch("http://26.56.52.76:8000/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm), // Converte o objeto para JSON
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        toast.error("Ocorreu um erro de requisição, tente novamente!");
        return;
      }

      if (response.status === 201) {
        //Api não retorna json, então não fazer nada com response

        console.log("Produto postado com sucesso:");
        toast.success("Produto adicionado com sucesso!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao postar o produto");
    }finally{
      setLoading(false)
    }

    // Resetar o formulário após o envio
    resetForm();
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Input)
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao digitar
    };
  };

  //Function para somente permitir números em um input detexto
  const handleInputNumber = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, ""); // Remove qualquer coisa que não seja número
  };

  const handleInputNumberFloat = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = e.target as HTMLInputElement;

    // Permite apenas números, vírgulas e pontos como caracteres válidos
    target.value = target.value.replace(/[^0-9,\.]/g, "");

    // Permite apenas um ponto ou uma vírgula
    // Caso a vírgula seja encontrada, converte para ponto para evitar duplicidade
    if (target.value.indexOf(",") !== -1) {
      target.value = target.value.replace(",", ".");
    }

    // Limita para que apenas um ponto seja inserido
    const pointCount = target.value.split(".").length - 1;
    if (pointCount > 1) {
      target.value = target.value.substring(0, target.value.lastIndexOf("."));
    }
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Select)
  const handleSelectChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
      setClearSelectUnity(true);
    };
  };

  const handleSelectChangeGroup = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
      handleSubGroups(parseInt(e.target.value));
      setClearSelectGroup(true);
    };
  };

  const handleSelectChangeSubGroup = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
      setClearSelectSubGroup(true);
    };
  };

  // Funções para tratar as flags de controle
  useEffect(() => {
    if (clearFormFlag) {
      resetForm();
      handleClearForm();
      resetFlags(); // Reseta os flags no pai
    }
  }, [clearFormFlag, resetFlags]);

  useEffect(() => {
    if (addProductFlag) {
      handleAddProduct();
      handleSubmit(); // Passando um objeto vazio como evento
      resetFlags(); // Reseta os flags no pai
    }
  }, [addProductFlag, resetFlags, handleAddProduct]);

  // Função para lidar com a mudança no input de busca ncm
  const handleInputChangeNcm = (value: string) => {
    setNcm(value); // Atualiza o valor de busca no componente pai
  };

  // Função para lidar com a seleção do NCM
  // Função chamada quando uma opção é selecionada
  const handleSelectChangeNcm = (
    selected: { label: string; value: string } | null
  ) => {
    if (selected) {
      setSelectedOptionNcm(selected.value);
    }

    if (!selected) {
      setNcm("");
      setSelectedOptionNcm(""); // Limpa o valor do input quando a seleção for desfeita
    }
  };

  // Função para lidar com a mudança no input de busca cest
  const handleInputChangeCEST = (value: string) => {
    setCestId(value); // Atualiza o valor de busca no componente pai
  };

  // Função para lidar com a seleção do CEST
  // Função chamada quando uma opção é selecionada
  const handleSelectChangeCEST = (
    selected: { label: string; value: string } | null
  ) => {
    if (selected) {
      setSelectedOptionCest(selected.value);
    }

    if (!selected) {
      setCestId("");
      setSelectedOptionCest(""); // Limpa o valor do input quando a seleção for desfeita
    }
  };

  //Logica dos modais para adicionar unidades nos selects e lupas
  // Função para abrir o modal com o conteúdo apropriado
  const openModal = (content: string) => {
    setModalContent(content);

    if (content == "Group") {
      setIsModalOpenGroup(true);
      return;
    }

    if (content == "Unity") {
      setIsModalOpenUnity(true);
      return;
    }

    if (content == "Ncm") {
      setIsModalOpenNcm(true);
      return;
    }

    if (content == "Cest") {
      setIsModalOpenCest(true);
      return;
    }
  };

  const closeModal = () => {
    setIsModalOpenGroup(false);
    setIsModalOpenUnity(false);
    setIsModalOpenNcm(false);
    setIsModalOpenCest(false);
    setModalContent(null); // Reseta o conteúdo
    fetchUnityUpdate(); //Chama as unidades pro campo quando o modal fecha
    fetchGroupUpdate(); //Chama as Grupos pro campo quando o modal fecha
  };

  //Toda vez que fechar o modal ele atualiza o select de unity
  const fetchUnityUpdate = async () => {
    try {
      const response = await fetch(`http://26.56.52.76:8000/unitytype`);

      if (response.ok) {
        const data = await response.json();
        setUnitySelect(data.unityTypes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGroupUpdate = async () => {
    try {
      const response = await fetch(`http://26.56.52.76:8000/group`);

      if (response.ok) {
        const data = await response.json();
        setGroupSelect(data.groups);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectUnityTable = (unityId: number) => {
    const idString = unityId.toString();
    setUnityType(idString);
  };

  const handleSelectGroupTable = (groupId: number) => {
    const idString = groupId.toString();
    setGroupId(idString);
    handleSubGroups(groupId);
    setClearSelectGroup(true);
    setClearSelectSubGroup(true);
  };

  const handleValueNcmInput = (ncm: string) => {
    setNcm(ncm);
  };

  const handleValueCestInput = (cest: string) => {
    setCestId(cest);
  };

  //Trava rolagem quando o modal estiver aberto
  useEffect(() => {
    if (isModalOpenUnity || isModalOpenGroup || isModalOpenNcm) {
      document.body.style.overflow = "hidden"; // Bloqueia rolagem
    } else {
      document.body.style.overflow = "auto"; // Restaura a rolagem
    }
    return () => {
      document.body.style.overflow = "auto"; // Garante que a rolagem seja restaurada quando o componente for desmontado
    };
  }, [isModalOpenUnity, isModalOpenGroup, isModalOpenNcm]);

  const handleClearSelection = (select: string) => {
    if (select == "selectGroup") {
      setGroupId(null);
      setClearSelectGroup(false);
    }

    if (select == "selectSubGroup") {
      setSubGroupId(null);
      setClearSelectSubGroup(false);
    }

    if (select == "selectUnity") {
      setUnityType("");
      setClearSelectUnity(false);
    }
  };

  return (
    <main className={styles.main}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className={styles.errorMessage}>
                  <p>{errorMessage}</p>
                </div>
              )}
              <div className={styles.firstLineInput}>
                <label>
                  Descrição<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={description || ""}
                  onChange={handleInputChange(setDescription)}
                  maxLength={100}
                  placeholder="ex: papel grafite"
                />
              </div>

              <div className={styles.secondLineInputs}>
                <div className={styles.inputWrapContainer}>
                  <label>
                    Unidade<span style={{ color: "red" }}>*</span>
                  </label>
                  <div className={styles.divInputIcon}>
                    <select
                      value={unityType || ""}
                      onChange={handleSelectChange(setUnityType)}
                      className={styles.unityInput}
                    >
                      <option value="">Selecione</option>
                      {unitySelect.map((unity) => (
                        <option key={unity.id} value={unity.id}>
                          {unity.name}
                        </option>
                      ))}
                    </select>
                    <Image
                      src={"icons/search-input-icon.svg"}
                      width={20}
                      height={20}
                      alt="searchIcon"
                      onClick={() => openModal("Unity")}
                    />
                    {clearSelectUnity && (
                      <button
                        type="button"
                        onClick={() => handleClearSelection("selectUnity")}
                        className={styles.clearButton}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>Código de barras</label>
                  <input
                    type="text"
                    value={barCode || ""}
                    onChange={(e) => setBarCode(e.target.value)}
                    maxLength={13}
                    placeholder="ex: 1698189354175"
                    onInput={handleInputNumber}
                    className={styles.barCodeInput}
                  />
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>
                    NCM<span style={{ color: "red" }}>*</span>
                  </label>
                  <div className={styles.divInputIcon}>
                    <div>
                      <SearchSelectNcm
                        inputValue={ncm} // Usar ncm diretamente em vez de inputValue
                        onInputChange={handleInputChangeNcm}
                        onSelectChange={handleSelectChangeNcm}
                        disabled={false}
                        able={false}
                      />
                    </div>
                    <Image
                      src={"icons/search-input-icon.svg"}
                      width={20}
                      height={20}
                      alt="searchIcon"
                      onClick={() => openModal("Ncm")}
                    />
                  </div>
                </div>
                <div className={styles.inputWrapContainer}>
                  <label>EX NCM</label>
                  <input
                    type="text"
                    value={exNcm || ""}
                    onChange={(e) => setExNcm(e.target.value)}
                    placeholder="ex: 1698"
                    maxLength={4}
                    onInput={handleInputNumber}
                    className={styles.ex_ncmInput}
                  />
                </div>
                <div className={styles.inputWrapContainer}>
                  <label>Código CEST</label>
                  <div className={styles.divInputIcon}>
                    <div className={styles.divSpecialSelect}>
                      <SearchSelectCest
                        inputValue={cestId} // Usar ncm diretamente em vez de inputValue
                        onInputChange={handleInputChangeCEST}
                        onSelectChange={handleSelectChangeCEST}
                        disabled={false}
                        able={false}
                      />
                    </div>
                    <Image
                      src={"icons/search-input-icon.svg"}
                      width={20}
                      height={20}
                      alt="searchIcon"
                      onClick={() => openModal("Cest")}
                    />
                  </div>
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>
                    Preço de venda R$<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={price || ""}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ex: 250"
                    onInput={handleInputNumberFloat}
                    className={styles.priceInput}
                  />
                </div>
              </div>

              <div className={styles.thirdLineInputs}>
                <div className={styles.inputWrapContainer}>
                  <label>Grupo</label>
                  <div className={styles.divInputIcon}>
                    {" "}
                    <select
                      value={groupId || ""}
                      onChange={handleSelectChangeGroup(setGroupId)}
                      className={styles.groupInput}
                    >
                      <option value="">Selecione</option>
                      {groupSelect.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <Image
                      src={"icons/search-input-icon.svg"}
                      width={20}
                      height={20}
                      alt="searchIcon"
                      onClick={() => openModal("Group")}
                    />
                    {clearSelectGroup && (
                      <button
                        type="button"
                        onClick={() => handleClearSelection("selectGroup")}
                        className={styles.clearButton}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>Sub grupo</label>
                  <div className={styles.divInputIcon}>
                    <select
                      value={subGroupId || ""}
                      onChange={handleSelectChangeSubGroup(setSubGroupId)}
                      className={styles.subGroupInput}
                    >
                      <option value="">Selecione</option>
                      {subGroupSelect.map((subroup) => (
                        <option key={subroup.id} value={subroup.id}>
                          {subroup.name}
                        </option>
                      ))}
                    </select>
                    {clearSelectSubGroup && (
                      <button
                        type="button"
                        onClick={() => handleClearSelection("selectSubGroup")}
                        className={styles.clearButton}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>Estoque reservado</label>
                  <input
                    type="text"
                    value={reservedStock || ""}
                    onChange={(e) => setReservedStock(e.target.value)}
                    placeholder="ex: 5"
                    onInput={handleInputNumber}
                  />
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>Peso Bruto</label>
                  <input
                    type="text"
                    value={grossWeight || ""}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    placeholder="ex: 100"
                    onInput={handleInputNumberFloat}
                  />
                </div>

                <div className={styles.inputWrapContainer}>
                  <label>Peso Líquido</label>
                  <input
                    type="text"
                    value={liquidWeight || ""}
                    onChange={(e) => setLiquidWeight(e.target.value)}
                    placeholder="ex: 80"
                    onInput={handleInputNumberFloat}
                  />
                </div>
                <div className={styles.adjustSpace}></div>
              </div>
            </form>
          </div>
          <ModalUnitiesSelect
            isOpen={isModalOpenUnity}
            closeModal={closeModal}
            title={modalContent || ""}
            onSelectUnity={handleSelectUnityTable}
            selectNumber={-1}
          />
          <ModalGroupSelect
            isOpen={isModalOpenGroup}
            closeModal={closeModal}
            title={modalContent || ""}
            onSelectUnity={handleSelectGroupTable}
            selectNumber={-1}
          />
          <ModalNCM
            isOpen={isModalOpenNcm}
            closeModal={closeModal}
            title={modalContent || ""}
            onSelectUnity={handleValueNcmInput}
            selectNumber={-1}
          />
          <ModalCEST
            isOpen={isModalOpenCest}
            closeModal={closeModal}
            title={modalContent || ""}
            onSelectUnity={handleValueCestInput}
            selectNumber={-1}
          />
        </>
      )}
    </main>
  );
};

export default CadastroProdutosSheet;
