import { ictoken_backend } from 'declarations/ictoken_backend';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
const Create = () => {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState(0);
	const [duration, setDuration] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!name) {
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: 'Auction name is required',
			});
			return;
		}
		if (!amount) {
			return;
		}
		if (!duration) {
			return;
		}
		setIsLoading(true);
		const data = await ictoken_backend.newAuction(
			// convert to seconds
			Number(duration * 60),
			Number(amount),
			name
		);
		console.log('auction data', data);
		if (!data.err) {
			handleCancelAuction();
			setIsLoading(false);
			Swal.fire({
				title: 'Success',
				icon: 'success',
				text: 'Auction created successfully',
			});
			navigate('/');
		} else {
			console.log('auction data err', data);
		}
	};
	const handleCancelAuction = () => {
		setAmount('');
		setName('');
		setDuration('');
	};

	return (
		<main>
			<div>
				<div className="flex justify-center mt-10">
					<Link to="/" className="text-white bg-green-500 px-4 py-2 rounded-md">
						Home
					</Link>
				</div>
				<div className="shadow my-2 p-2">
					<h2 className="text-center font-bold my-4">Create Book Auction</h2>
					<div className="p-2">
						<label htmlFor="name">Enter auction name: &nbsp;</label>
						<input
							id="name"
							alt="Name"
							type="text"
							className="w-full rounded border border-stroke bg-gray py-2 p-2 pr-1 text-black focus:border-primary focus-visible:outline-none"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="p-2">
						<label htmlFor="amount">Bid start amount:</label>
						<input
							id="amount"
							alt="amount"
							type="number"
							value={amount}
							className="w-full rounded border border-stroke bg-gray py-2 p-2 pr-1 text-black focus:border-primary focus-visible:outline-none"
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<div className="p-2">
						<label htmlFor="duration">Duration: (min)</label>
						<input
							id="duration"
							alt="duration"
							type="number"
							className="w-full rounded border border-stroke bg-gray py-2 pl-2 pr-1 text-black focus:border-primary focus-visible:outline-none"
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
						/>
					</div>
					<div className="flex gap-3 mt-4">
						<button
							type="button"
							className="text-white bg-green-500 px-4 py-1 rounded-md"
							onClick={handleSubmit}
						>
							Create Auction
						</button>
						<button
							type="button"
							className="text-white bg-red-500 px-4 py-1 rounded-md"
							onClick={handleCancelAuction}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
			.{isLoading && <Loader />}
		</main>
	);
};

export default Create;
