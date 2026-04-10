import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}





export interface Service {
  category: string;
  endpoint: string;
  id: u32;
  name: string;
  price: u128;
  provider: string;
  reputation: u32;
  service_type: u32;
  successful_calls: u32;
  total_calls: u32;
}

export interface Client {
  /**
   * Construct and simulate a get_service transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_service: ({id}: {id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Option<Service>>>

  /**
   * Construct and simulate a list_service transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  list_service: ({provider, category, name, price, service_type, endpoint}: {provider: string, category: string, name: string, price: u128, service_type: u32, endpoint: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a update_reputation transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_reputation: ({id, success}: {id: u32, success: boolean}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_services_by_category transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_services_by_category: ({category}: {category: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Service>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAB1NlcnZpY2UAAAAACgAAAAAAAAAIY2F0ZWdvcnkAAAARAAAAAAAAAAhlbmRwb2ludAAAABAAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAARuYW1lAAAAEQAAAAAAAAAFcHJpY2UAAAAAAAAKAAAAAAAAAAhwcm92aWRlcgAAABMAAAAAAAAACnJlcHV0YXRpb24AAAAAAAQAAAAAAAAADHNlcnZpY2VfdHlwZQAAAAQAAAAAAAAAEHN1Y2Nlc3NmdWxfY2FsbHMAAAAEAAAAAAAAAAt0b3RhbF9jYWxscwAAAAAE",
        "AAAAAAAAAAAAAAALZ2V0X3NlcnZpY2UAAAAAAQAAAAAAAAACaWQAAAAAAAQAAAABAAAD6AAAB9AAAAAHU2VydmljZQA=",
        "AAAAAAAAAAAAAAAMbGlzdF9zZXJ2aWNlAAAABgAAAAAAAAAIcHJvdmlkZXIAAAATAAAAAAAAAAhjYXRlZ29yeQAAABEAAAAAAAAABG5hbWUAAAARAAAAAAAAAAVwcmljZQAAAAAAAAoAAAAAAAAADHNlcnZpY2VfdHlwZQAAAAQAAAAAAAAACGVuZHBvaW50AAAAEAAAAAEAAAAE",
        "AAAAAAAAAAAAAAARdXBkYXRlX3JlcHV0YXRpb24AAAAAAAACAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAHc3VjY2VzcwAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAAYZ2V0X3NlcnZpY2VzX2J5X2NhdGVnb3J5AAAAAQAAAAAAAAAIY2F0ZWdvcnkAAAARAAAAAQAAA+oAAAfQAAAAB1NlcnZpY2UA" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_service: this.txFromJSON<Option<Service>>,
        list_service: this.txFromJSON<u32>,
        update_reputation: this.txFromJSON<null>,
        get_services_by_category: this.txFromJSON<Array<Service>>
  }
}