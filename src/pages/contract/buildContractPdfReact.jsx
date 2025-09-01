// src/pages/contract/buildContractPdfReact.js
import React from "react";
import { pdf } from "@react-pdf/renderer";
import ContractDocument from "./ContractDocument.jsx";

export async function buildContractPdfReact({ contract, landlord, tenant, property }) {
  const element = React.createElement(ContractDocument, { contract, landlord, tenant, property });
  return await pdf(element).toBlob();
}
