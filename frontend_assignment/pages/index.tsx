import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import MaterialForm from "./component/MaterialForm";
import TextBox from "./component/TextBox";

const filter = {
  address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  topics: [utils.id("NewGreeting(bytes32)")],
};

export default function Home() {
  const [logs, setLogs] = React.useState("Connect your wallet and greet!");
  const [ethersProvider, setEthersProvider] = React.useState<Web3Provider>();
  const [eventValue, setEventValue] = React.useState<string>("");

  async function greet() {
    setLogs("Creating your Semaphore identity...");
    const signer = ethersProvider!.getSigner();
    const message = await signer.signMessage(
      "Sign this message to create your identity!"
    );

    const identity = new ZkIdentity(Strategy.MESSAGE, message);
    const identityCommitment = identity.genIdentityCommitment();
    const identityCommitments = await (
      await fetch("./identityCommitments.json")
    ).json();

    const merkleProof = generateMerkleProof(
      20,
      BigInt(0),
      identityCommitments,
      identityCommitment
    );

    setLogs("Creating your Semaphore proof...");

    const greeting = "Hello world22";

    const witness = Semaphore.genWitness(
      identity.getTrapdoor(),
      identity.getNullifier(),
      merkleProof,
      merkleProof.root,
      greeting
    );

    const { proof, publicSignals } = await Semaphore.genProof(
      witness,
      "./semaphore.wasm",
      "./semaphore_final.zkey"
    );
    const solidityProof = Semaphore.packToSolidityProof(proof);

    const response = await fetch("/api/greet", {
      method: "POST",
      body: JSON.stringify({
        greeting,
        nullifierHash: publicSignals.nullifierHash,
        solidityProof: solidityProof,
      }),
    });

    if (response.status === 500) {
      const errorMessage = await response.text();

      setLogs(errorMessage);
    } else {
      setLogs("Your anonymous greeting is onchain :)");
    }
  }

  useEffect(() => {
    const setup = async () => {
      const provider = (await detectEthereumProvider()) as any;
      await provider.request({ method: "eth_requestAccounts" });
      const ethersProvider = new providers.Web3Provider(
        provider as ExternalProvider
      );
      setEthersProvider(ethersProvider);
    };

    setup();
  }, []);

  useEffect(() => {
    if (ethersProvider !== undefined) {
      ethersProvider.on(filter, (log, event) => {
        console.log(`log: ${utils.toUtf8String(log.data)}`);
        setEventValue(utils.toUtf8String(log.data));
      });
    }
  }, [ethersProvider]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Greetings</title>
        <meta
          name="description"
          content="A simple Next.js/Hardhat privacy application with Semaphore."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Greetings</h1>

        <p className={styles.description}>
          A simple Next.js/Hardhat privacy application with Semaphore.
        </p>

        <div className={styles.logs}>{logs}</div>

        <div onClick={() => greet()} className={styles.button}>
          Greet
        </div>
        <div style={{ marginTop: "5em" }}>
          <TextBox value={eventValue} />
        </div>

        <div className={styles.form}>
          <MaterialForm />
        </div>
      </main>
    </div>
  );
}
