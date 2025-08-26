// src/pages/contract/buildContractPdfReact.js
import React from "react";
import { pdf } from "@react-pdf/renderer";
import ContractDocument from "./ContractDocument.jsx"; // asegúrate que este sí sea .jsx

export async function buildContractPdfReact({ contract, landlord, tenant, property }) {
  const element = React.createElement(ContractDocument, { contract, landlord, tenant, property });
  const instance = pdf(element);
  const blob = await instance.toBlob();
  return blob;
}
