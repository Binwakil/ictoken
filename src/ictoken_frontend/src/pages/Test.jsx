import { useState } from 'react';
import { test as ictoken_backend } from 'declarations/ictoken_backend';
import Voting from '../components/Voting';
import logo from '/logo2.svg';
import { Link } from 'react-router-dom';
import Auction from './Auction';

const Test = () => {
	const [greeting, setGreeting] = useState('');
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [balance, setBalance] = useState('');
	const handleSubmit = async () => {
		if (!name) {
			return;
		}
		await ictoken_backend.changeName(name);
		handleGetName();
	};
	const handleGetName = async () => {
		ictoken_backend.greet().then((greeting) => {
			setGreeting(greeting);
		});
		return false;
	};

	const handleCheckBalance = async () => {
		const balance = await ictoken_backend.checkBalance();
		setBalance(Number(balance));
	};
	const handleAddAmount = async () => {
		if (!amount) {
			return;
		}
		await ictoken_backend.topUp(Number(amount));
		handleCheckBalance();
	};
	const handleWithdrawl = async () => {
		if (!amount) {
			return;
		}
		ictoken_backend.withdrawl(Number(amount));
		handleCheckBalance();
	};
	return (
		<main>
			<img src={logo} alt="DFINITY logo" />
			<br />
			<br />
			<Auction />
			<Voting />
			<div>
				<label htmlFor="name">Enter your name: &nbsp;</label>
				<input
					id="name"
					alt="Name"
					type="text"
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="button" onClick={handleSubmit}>
					Add name
				</button>
				<button type="button" onClick={handleGetName}>
					Get Name
				</button>
				<br />
				<div id="greeting">{greeting}</div>
			</div>
			<div>
				<label htmlFor="amount">Enter your amount: &nbsp;</label>
				<input
					id="amount"
					alt="amount"
					type="number"
					onChange={(e) => setAmount(e.target.value)}
				/>
				<button type="button" onClick={handleAddAmount}>
					Top up
				</button>
				<button type="button" onClick={handleWithdrawl}>
					withdrawl
				</button>
				<button type="button" onClick={handleCheckBalance}>
					Get Balance
				</button>
				<br />
				<div>{balance}</div>
			</div>
			<Link to={'/create'}>Create</Link>
			<br />
			<Link to={'/'}>Login</Link>
		</main>
	);
};

export default Test;
