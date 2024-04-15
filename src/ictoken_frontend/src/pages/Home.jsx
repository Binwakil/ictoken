import { useEffect, useState } from 'react';
import { ictoken_backend } from 'declarations/ictoken_backend';
import logo from '/logo2.svg';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../use-auth-client';
import Loader from '../components/Loader';
const Home = () => {
	const { principal } = useAuth();
	const [auctions, setAuctions] = useState([]);
	const [balance, setBalance] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	// Get the current time in nanoseconds
	const navigate = useNavigate();
	const currentTime = BigInt(Date.now()) * 1000000n;

	const handlegetAuctions = async () => {
		setIsLoading(true);
		ictoken_backend.getAuctions().then((auctions) => {
			// console.log(auctions);
			setAuctions(auctions);
			setIsLoading(false);
		});
	};
	useEffect(() => {
		handlegetAuctions();
	}, []);
	const handleCheckBalance = async () => {
		setIsLoading(true);
		const balance = await ictoken_backend.getMyBalance();
		setBalance(Number(balance));
		setIsLoading(false);
	};
	const handleFundWallet = async () => {
		const { value: amount } = await Swal.fire({
			title: 'Enter amount',
			input: 'number',
			inputLabel: `Amount must be greather then $100`,
			// inputValue,
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'You need to write something!';
				}
			},
		});
		if (amount) {
			setIsLoading(true);
			await ictoken_backend.newUser(Number(amount));
			// console.log('account data', data);
			setIsLoading(false);
			if (data.err) {
				const errName = Object.keys(bid.err)[0];
				Swal.fire({
					title: 'Error',
					icon: 'error',
					text: errName || 'Something went wrong',
				});
			} else {
				Swal.fire({
					title: 'Success',
					icon: 'success',
					text: 'Account funded successfully',
				});
			}
			return handleCheckBalance();
		}
	};
	const handleDetails = async (id) => {
		navigate(`/auctions/${id}`);
	};
	return (
		<main>
			<section className="flex flex-col justify-center w-full">
				<div className="flex">
					<img src={logo} alt="DFINITY logo" className="mx-auto md:w-1/2" />
				</div>
				<br />
				<br />
				<div className="grid grid-cols-1 gap-9 sm:grid-cols-2 my-10 p-2">
					<div className="my-4">
						<h2 className="text-bold">
							User principal: {principal?.toString()}
						</h2>
						<div className="mt-1">Balance: {balance}</div>
						<div className="md:flex gap-2 mt-3 justify-center">
							<button
								type="button"
								className="text-white bg-green-500 px-4 py-1 rounded-md"
								onClick={handleFundWallet}
							>
								Fund account
							</button>
							<button
								type="button"
								className="text-white bg-green-500 px-4 py-1 rounded-md"
								onClick={handleCheckBalance}
							>
								Check balance
							</button>
						</div>
					</div>
				</div>
				<div>
					<h2 className="text-center font-bold my-4">Book Auctions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3">
						{auctions.map((item, index) => {
							return (
								<div key={index} className="shadow p-3">
									<Link to={`/auctions/${item[0]}`}>
										Auction Name: {item[1].tokenID}{' '}
									</Link>
									<p>Start Price: {Number(item[1].startPrice)}</p>
									<p>
										Bid starts:{' '}
										{new Date(
											Number(item[1].startTime) / 1000000
										).toLocaleString()}
									</p>
									<p>
										Bid Ends:{' '}
										{new Date(
											Number(item[1].endTime) / 1000100
										).toLocaleString()}
									</p>

									{currentTime > Number(item[1].endTime) ? (
										<p className="text-xs text-red-400 my-2">
											The auction has ended.
										</p>
									) : (
										<div>
											<button
												type="button"
												className="text-white bg-green-500 px-4 rounded-md"
												onClick={() => handleDetails(item[0])}
											>
												Details
											</button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<div className="w-full md:flex justify-center mt-10 gap-2">
					<Link
						to={'/create'}
						className="text-white bg-green-500 px-4 py-2 rounded-md"
					>
						Create Auction
					</Link>
					<Link
						to={'/my-bids'}
						className="text-white bg-blue-500 px-4 py-2 rounded-md"
					>
						My bids
					</Link>
				</div>
			</section>
			{isLoading && <Loader />}
		</main>
	);
};

export default Home;
