// Public API of the contracts feature slice.
// Other slices and routes import only from here — never from internals directly.

export {
  createContract,
  closeContract,
  changeProvider,
  updateContractNotes,
  softDeleteContract,
} from "./actions";

export { insertContractInternal } from "./lib";
export type { TDbTransaction } from "./lib";

export {
  createContractSchema,
  changeProviderSchema,
  updateContractNotesSchema,
  CONTRACT_LIMITS,
} from "./schema";
export type {
  TCreateContractInput,
  TChangeProviderInput,
  TUpdateContractNotesInput,
} from "./schema";

export { CreateContractModal } from "./components/create-contract-modal";
export { CreateContractFormContent } from "./components/create-contract-form-content";
export { ChangeProviderModal } from "./components/change-provider-modal";
export { ChangeProviderFormContent } from "./components/change-provider-form-content";
export { UpdateContractModal } from "./components/update-contract-modal";
export { UpdateContractFormContent } from "./components/update-contract-modal/update-contract-form-content";
