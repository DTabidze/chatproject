import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "./UserContext";
import Login from "./login/page";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
