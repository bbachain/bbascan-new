import React from "react";
import {
  ComputeBudgetInstruction,
  SignatureResult,
  TransactionInstruction,
} from "@bbachain/web3.js";


import { InstructionCard } from "./InstructionCard";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";

// Hooks
import { useCluster } from "hooks/useCluster";

// Utils
import { microDaltonsToDaltonsString } from "utils";
import { reportError } from "utils/sentry";

export function ComputeBudgetDetailCard({
  ix,
  index,
  result,
  signature,
  innerCards,
  childIndex,
}: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  signature: string;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { url } = useCluster();
  try {
    const type = ComputeBudgetInstruction.decodeInstructionType(ix);
    switch (type) {
      case "RequestUnits": {
        const { units, additionalFee } =
          ComputeBudgetInstruction.decodeRequestUnits(ix);
        return (
          <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title="Compute Budget Program: Request Units (Deprecated)"
            innerCards={innerCards}
            childIndex={childIndex}
          >
            <tr>
              <td>Program</td>
              <td className="text-lg-end">
                <Address pubkey={ix.programId} link />
              </td>
            </tr>

            <tr>
              <td>Requested Compute Units</td>
              <td className="text-lg-end font-monospace">{`${new Intl.NumberFormat(
                "en-US"
              ).format(units)} compute units`}</td>
            </tr>

            <tr>
              <td>Additional Fee (BBA)</td>
              <td className="text-lg-end">
                <Balance daltons={additionalFee} />
              </td>
            </tr>
          </InstructionCard>
        );
      }
      case "RequestHeapFrame": {
        const { bytes } = ComputeBudgetInstruction.decodeRequestHeapFrame(ix);
        return (
          <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title="Compute Budget Program: Request Heap Frame"
            innerCards={innerCards}
            childIndex={childIndex}
          >
            <tr>
              <td>Program</td>
              <td className="text-lg-end">
                <Address pubkey={ix.programId} link />
              </td>
            </tr>

            <tr>
              <td>Requested Heap Frame (Bytes)</td>
              <td className="text-lg-end font-monospace">
                {new Intl.NumberFormat("en-US").format(bytes)}
              </td>
            </tr>
          </InstructionCard>
        );
      }
      case "SetComputeUnitLimit": {
        const { units } =
          ComputeBudgetInstruction.decodeSetComputeUnitLimit(ix);
        return (
          <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title="Compute Budget Program: Set Compute Unit Limit"
            innerCards={innerCards}
            childIndex={childIndex}
          >
            <tr>
              <td>Program</td>
              <td className="text-lg-end">
                <Address pubkey={ix.programId} link />
              </td>
            </tr>

            <tr>
              <td>Compute Unit Limit</td>
              <td className="text-lg-end font-monospace">{`${new Intl.NumberFormat(
                "en-US"
              ).format(units)} compute units`}</td>
            </tr>
          </InstructionCard>
        );
      }
      case "SetComputeUnitPrice": {
        const { microDaltons } =
          ComputeBudgetInstruction.decodeSetComputeUnitPrice(ix);
        return (
          <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title="Compute Budget Program: Set Compute Unit Price"
            innerCards={innerCards}
            childIndex={childIndex}
          >
            <tr>
              <td>Program</td>
              <td className="text-lg-end">
                <Address pubkey={ix.programId} link />
              </td>
            </tr>

            <tr>
              <td>Compute Unit Price</td>
              <td className="text-lg-end font-monospace">{`${microDaltonsToDaltonsString(
                microDaltons
              )} daltons per compute unit`}</td>
            </tr>
          </InstructionCard>
        );
      }
    }
  } catch (error) {
    reportError(error, {
      url: url,
      signature: signature,
    });
  }

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Compute Budget Program: Unknown Instruction"
      innerCards={innerCards}
      childIndex={childIndex}
      defaultRaw
    />
  );
}
