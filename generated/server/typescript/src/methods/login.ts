import { Login } from "../generated-typings";
import EthCrypto from "eth-crypto";
import * as ethUtil from "ethereumjs-util";
import jwt from "jsonwebtoken";
import { recoverPublicKeyFromSig } from "@etclabscore/signatory-core/build/src/lib/sign";
import { stringToHex } from "@etclabscore/eserialize";
import { getSecret } from "../secret";

const login: Login = async (DIDTokenString) => {
  const buff = Buffer.from(DIDTokenString, "base64");
  const decoded = buff.toString();
  const [proof, claim] = JSON.parse(decoded);
  const parsedClaim = JSON.parse(claim);
  const add = parsedClaim.iss.split("did:ethr:")[1];

  try {
    const c = Buffer.from(claim);
    let signerPubkey;
    try {
      signerPubkey = recoverPublicKeyFromSig(Buffer.from(stringToHex(claim)), proof, 61);
    } catch (e) {
      console.log(e);
    }
    if (!signerPubkey) {
      throw new Error("no pubkey found");
    }
    const address = "0x" + ethUtil.keccak256(signerPubkey).slice(-20).toString("hex");

    if (add === ethUtil.toChecksumAddress(address)) {
      const accessToken = jwt.sign({
        address,
        did: {
          proof,
          claim: parsedClaim
        }
      }, getSecret());
      return Promise.resolve(accessToken);
    } else {
      throw new Error("An error occured, Not logged in");
    }
  } catch (e) {
    throw new Error("An error occured, Not logged in");
  }
};

export default login;
