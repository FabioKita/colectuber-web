import React, { useState, useEffect } from "react";
import { DataProvider } from "src/context/data-context-provider";
import Index from "components";
import { GoogleScriptProvider } from "src/context/google-context-provider";
import { SelectionProvider } from "src/context/selection-context-provider";
import { UserLocationProvider } from "src/context/user-location-context-provider";

export default function Home() {
  return (
    <GoogleScriptProvider>
      <DataProvider>
        <UserLocationProvider>
          <SelectionProvider>
            <Index />
          </SelectionProvider>
        </UserLocationProvider>
      </DataProvider>
    </GoogleScriptProvider>
  );
}
