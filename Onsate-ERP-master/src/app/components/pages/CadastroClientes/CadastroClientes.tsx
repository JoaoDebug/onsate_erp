import styles from "./CadastroClientes.module.css";

interface CadastroClientesProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

export default function CadastroClientes({
  data,
  setData,
}: CadastroClientesProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Cadastro de Clientes</h1>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Digite os dados do cliente"
        />
      </div>
    </main>
  );
}
