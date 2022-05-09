import React, {useState, useEffect} from "react";
import { DataProvider } from "src/context/data-context-provider";
import InitialPage from "components/initial-page";

export default function Home() {
  return <DataProvider>
    <InitialPage/>
  </DataProvider>
}
