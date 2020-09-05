import { Login } from "../generated-typings";
import EthCrypto from "eth-crypto";
import * as util from "ethereumjs-util";
import { recoverPublicKeyFromSig, recoverPublicKeyFromSigWithoutPersonal } from "@etclabscore/signatory-core/build/src/lib/sign";
const publicKeyToAddress = require('ethereum-public-key-to-address') //tslint:disable-line

const login: Login = (DIDTokenString) => {
  const buff = Buffer.from(DIDTokenString, "base64");
  const decoded = buff.toString();
  const [proof, claim] = JSON.parse(decoded);
  const parsedClaim = JSON.parse(claim);
  const add = parsedClaim.iss.split("did:ethr:")[1];

  try {
    const c = Buffer.from(claim);
    let signerPubkey;
    try {
      signerPubkey = recoverPublicKeyFromSig(Buffer.from(claim), proof, 61);
    } catch (e) {
      console.log(e);
    }
    if (!signerPubkey) {
      throw new Error("no pubkey found");
    }
    console.log("claim", c.toString());
    console.log("expected address", add, parsedClaim);
    console.log("proof", proof);
    console.log("pubkey", signerPubkey.toString("hex"));
    let pubkeyaddress;
    try {
      pubkeyaddress = publicKeyToAddress(signerPubkey);
      console.log("pubkeyaddress", pubkeyaddress);
    } catch (e) {
      console.log("pubkeyaddress error:", e);
    }

    if (add === pubkeyaddress) {
      return Promise.resolve("foo");
    } else {
      throw new Error("An error occured, Not logged in");
    }
  } catch (e) {
    throw new Error("An error occured, Not logged in");
  }
};

export default login;
