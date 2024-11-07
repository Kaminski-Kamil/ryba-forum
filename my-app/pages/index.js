// import { Head } from "next/document";
import Verify from "@/components/VerifySession";

export default function Home() {
  return (
    <main>
      <div className="lewyblok">
        <ul>
          <li>Karta wędkarska</li>
          <li>PZW</li>
          <li>Zarybianie</li>
          <li>Wędki</li>
          <li>Pochwal się zdobyczą</li>
          <li>Zanęty</li>
          <li>Haczyki</li>
          <li>Spławiki</li>
          <li>Galeria</li>
        </ul>
      </div>
      <div className="prawyblok">
      
      <Verify />

      </div>

    </main>
  );
}