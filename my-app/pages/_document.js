import { Html, Head, Main, NextScript } from "next/document";
import Header from '../components/header'; // Importuj Header
import Glowne from '../components/Glowne'
import Stopka from '../components/Stopka'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Header />
        <Main>
          {/* <Glowne /> */}
        </Main>
        <Stopka />
        <NextScript />
      </body>
    </Html>
  );
}
