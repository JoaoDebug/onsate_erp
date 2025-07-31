import { useState, useCallback } from "react";
import Downshift from "downshift";
import debounce from "lodash/debounce";
import styles from "./SearchSelect.module.css";

// Tipando as opções do select
interface Option {
  label: string;
  value: string;
}

interface SearchSelectProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSelectChange: (selected: { label: string; value: string } | null) => void; // Função para passar a opção selecionada
  disabled: boolean;
  able: boolean
}

const SearchSelectNcm = ({
  inputValue,
  onInputChange,
  onSelectChange,
  disabled,
  able
}: SearchSelectProps) => {
  const [options, setOptions] = useState<Option[]>([]); // Opções de busca
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento

  // Função para carregar as opções com debounce
  const loadOptions = async (query: string) => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // Requisição de dados ao backend
      const response = await fetch(
        `http://26.56.52.76:8000/ncms?ncmfilter=${query}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar as opções");
      }

      const data = await response.json();
      const formattedOptions = data.ncms.map((item: { ncm: string }) => ({
        label: item.ncm,
        value: item.ncm,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error("Erro ao buscar as opções:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      loadOptions(query);
    }, 500), // 500ms de debounce
    []
  );

  // Função que é chamada toda vez que o usuário digita
  const handleInputChange = (newValue: string) => {
    onInputChange(newValue); // Atualizando o estado no componente pai
    debouncedSearch(newValue); // Chama a versão debounced
  };

  // Função para limpar a seleção
  const handleClearSelection = () => {
    onSelectChange(null); // Limpa a seleção
    onInputChange(""); // Limpa o valor do input
  };


  // Função que é chamada quando o usuário seleciona uma opção
  const handleSelectChange = (selectedOption: Option | null) => {
    onSelectChange(selectedOption); // Passa a opção selecionada para o componente pai
  };

  //Deixa apenas numeros no input text
  const handleInputNumber = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, ""); // Remove qualquer coisa que não seja número
  };

  return (
    <div className={styles.divSelect}>
      <Downshift
        inputValue={inputValue} // Passando o inputValue do pai para o Downshift
        onInputValueChange={handleInputChange}
        onSelect={handleSelectChange}
        itemToString={(item) => (item ? item.label : "")}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          selectedItem,
          inputValue,
        }) => (
          <div>
            <div className={styles.inputWrapper}>
              <input
                {...getInputProps()}
                value={inputValue ? inputValue : ""} // Controle do valor do input diretamente pelo estado
                placeholder="NCM"
                className={styles.input}
                onInput={handleInputNumber}
                disabled={disabled}
              />
              {/* Botão para limpar a seleção */}
              {inputValue !== "" && selectedItem && !able && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className={styles.clearButton}
                >
                  Limpar
                </button>
              )}
            </div>
            {isOpen && (
              <ul className={styles.suggestionsList}>
                {loading && <li>Carregando...</li>}
                {options.length === 0 && !loading && inputValue && (
                  <li>Nenhuma opção encontrada</li>
                )}
                {options.map((item, index) => (
                  <li
                    key={item.value}
                    {...getItemProps({
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? "#bde4ff" : "#fff",
                        fontWeight: selectedItem === item ? "bold" : "normal",
                      },
                    })}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Downshift>
    </div>
  );
};

export default SearchSelectNcm;
