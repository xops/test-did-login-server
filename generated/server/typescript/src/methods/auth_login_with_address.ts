import { AuthLoginWithAddress } from "../generated-typings";
import { v4 as uuidv4 } from "uuid";
const lifespan = 100000;

const auth_login_with_address: AuthLoginWithAddress = (address) => {
  const claim = {
    iat: Math.floor(Date.now() / 1000),
    ext: Math.floor(Date.now() / 1000) + lifespan,
    iss: `did:ethr:${address}`,
    sub: "login",
    aud: `did:sig.tools:${uuidv4()}`,
    nbf: Math.floor(Date.now() / 1000),
    tid: uuidv4(),
  };
  return Promise.resolve(claim);
};

export default auth_login_with_address;
