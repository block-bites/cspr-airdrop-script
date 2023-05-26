import minimist from 'minimist';
import * as fs from 'fs';
import { Keys, CLPublicKey, DeployUtil, CasperClient } from 'casper-js-sdk';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const params = minimist(process.argv.slice(2));

const {
  _: args
} = params;

const [list, privateKeyPath, networkName, nodeUrl, timeout] = args;

if (!list) {
  throw new Error('Missing list argument');
}

if (!privateKeyPath) {
  throw new Error('Missing private keys argument');
}

if (!networkName) {
  throw new Error('Missing networkName argument');
}

if (!nodeUrl) {
  throw new Error('Missing nodeUrl argument');
}

if (!timeout) {
  throw new Error('Missing timeout argument');
}

const readJSON = (path: string) => {
  try {
    const result = fs.readFileSync(path).toString();
    return JSON.parse(result);
  } catch {
    console.log("Something break when reading JSON...");
  }
};

const run = async () => {
  let json;
  try {
    const data = fs.readFileSync(list, 'utf8');
    json = readJSON(list);
  } catch (err) {
    console.error(err);
    console.error('Error reading the JSON file');
  }

  const privateKeyBytes = Keys.Ed25519.parsePrivateKeyFile(privateKeyPath)
  const publicKeyBytes = Keys.Ed25519.privateToPublicKey(privateKeyBytes)
  const keyPair = Keys.Ed25519.parseKeyPair(publicKeyBytes, privateKeyBytes);
  const paymentAmount = 100000000;

  for await (const [i, entry] of json.entries()) {
    const { publickey, amount } = entry;
    const recipientKey = CLPublicKey.fromHex(publickey);
    const transferId = i;

    const deployParams = new DeployUtil.DeployParams(
      keyPair.publicKey,
      networkName
    );

    const session = DeployUtil.ExecutableDeployItem.newTransfer(
      amount,
      recipientKey,
      undefined,
      transferId
    );

    const payment = DeployUtil.standardPayment(paymentAmount);
    let deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    deploy = DeployUtil.signDeploy(deploy, keyPair);

    const hash = await deploy.send(nodeUrl);

    console.log(`Sent deploy ${hash} for account ${publickey} - ${amount} cspr motes`);

    await sleep(Number(timeout) * 1000);
  }
}

run();
