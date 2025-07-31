import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google"; // Importa a fonte Poppins
import { NextFont } from "next/dist/compiled/@next/font";
import { ToastContainer } from "react-toastify"; // Componente de notificação
import 'react-toastify/dist/ReactToastify.css'; 

// Configura a fonte Poppins
const poppins: NextFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Use "weights" no plural
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onsate ERP",
  description: "Sistema de ERP WEB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {children}
      </body>
    </html>
  );
}
