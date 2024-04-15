import React, { useEffect, useState } from 'react';
import { LedgerCanister, AccountIdentifier } from '@dfinity/ledger-icp';
import { createAgent } from '@dfinity/utils';
import { useAuth } from '../use-auth-client';
import { createActor } from './createActor';
const Ledger = () => {
	const { identity, logout, principal } = useAuth();
	const [ICPLedger, setICPLedger] = useState(null);
	const [hexID, setHexID] = useState(null);
	const [bal, setBal] = useState(null);
	const MY_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
	const HOST = `http://localhost:4943?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}#authorize`;
	const [indexCanister, setIndexCanister] = useState(null);
	const ICPIndexID = 'qhbym-qaaaa-aaaaa-aaafq-cai';
	useEffect(() => {
		setUpLedger();
	}, []);
	async function setUpLedger() {
		const agent = await createAgent({
			identity,
			host: HOST,
		});
		//{ transactionFee, transfer, icrc1Transfer,accountBalance }
		let ledger = LedgerCanister.create({
			agent,
			canisterId: MY_LEDGER_CANISTER_ID,
		});
		setICPLedger(ledger);
		console.log('Icp ledger setup successfully');
		const actor = createActor(ICPIndexID, {
			agentOptions: {
				identity,
			},
		});

		setIndexCanister(actor);
		console.log('index canister set up successfully');
	}

	async function getTransactions() {
		const results = await indexCanister.get_account_identifier_transactions({
			start: [],
			max_results: 10,
			account_identifier:
				'ebc5f90afc543a620a4b05a1621284a4863ff02649206a4be3718b3cd0511571',
		});

		if (results.Ok) {
			console.log('transactions results :', results.Ok.transactions);
		}
	}

	async function getBalance() {
		const accIdentifier = AccountIdentifier.fromHex(
			'ebc5f90afc543a620a4b05a1621284a4863ff02649206a4be3718b3cd0511571'
		);
		const res = await ICPLedger.accountBalance({
			accountIdentifier: accIdentifier,
			certified: false,
		});
		setBal(Number(res));
		console.log('Icp balance :', res);
	}

	async function princToAcc() {
		const acc = AccountIdentifier.fromPrincipal({
			principal: principal,
			subAccount: undefined,
		}).toHex();
		setHexID(acc);
		console.log(acc);
	}

	return (
		<div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				<h2>ICP Ledger Tutorial</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						padding: '10px',
						alignItems: 'center',
					}}
				>
					<button
						style={{ backgroundColor: 'brown', color: 'white', width: '400px' }}
						onClick={() => logout()}
					>
						Logout
					</button>
					<br />

					<button
						style={{ backgroundColor: 'brown', color: 'white', width: '400px' }}
						onClick={() => getBalance()}
					>
						Get Balance
					</button>
					<span>Balance : {bal}</span>
					<button
						style={{ backgroundColor: 'brown', color: 'white', width: '400px' }}
						onClick={() => princToAcc()}
					>
						princToAcc
					</button>
					<span>Hex Account : {hexID}</span>

					<button
						style={{ backgroundColor: 'brown', color: 'white', width: '400px' }}
						onClick={() => getTransactions()}
					>
						Get Transactions
					</button>
				</div>
			</div>
		</div>
	);
};

export default Ledger;
