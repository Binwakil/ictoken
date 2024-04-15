import { useEffect, useState } from 'react';
import { ictoken_backend } from 'declarations/ictoken_backend';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
const Auction = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [auction, setAuction] = useState('');
	const [bids, setBids] = useState([]);
	// Get the current time in nanoseconds
	const currentTime = BigInt(Date.now()) * 1000000n;
	const { id } = useParams();

	const handlegetAuction = async () => {
		setIsLoading(true);
		const data = await ictoken_backend.getAuctionInfo(Number(id));
		const bids = await ictoken_backend.getAuctionPastBids(Number(id));
		setIsLoading(false);
		if (data.length < 0 || data.err) {
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: 'Auction id is invalid',
			});
			return;
		}
		console.log(data);
		setAuction(...data);
		setBids(bids.ok);
	};
	useEffect(() => {
		handlegetAuction();
	}, []);
	const handleNewBid = async (id, prize) => {
		const { value: amount } = await Swal.fire({
			title: 'Enter your bidding',
			input: 'number',
			inputLabel: `Bidding start from $${prize}`,
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
			const bid = await ictoken_backend.newBid(
				Number(id),
				Number(amount)
			);
			setIsLoading(false);
			if (bid.err) {
				const errName = Object.keys(bid.err)[0];
				// console.log('bid err', errName);
				Swal.fire({
					title: 'Error',
					icon: 'error',
					text: errName || 'Something went wrong',
				});
			} else {
				Swal.fire({
					title: 'Success',
					icon: 'success',
					text: 'You have place your bid successfully',
				});
			}
			return handlegetAuction();
		}
	};
	return (
		<main>
			<div>
				<div className="flex justify-center mt-10">
					<Link to="/" className="text-white bg-green-500 px-4 py-2 rounded-md">
						Home
					</Link>
				</div>
				<div className="p-3">
					<h2 className="text-center font-bold my-4">Auction Details</h2>
					<div className="grid grid-cols-1 md:grid-cols-2">
						<h2>
							Auction Name:{' '}
							<span className="capitalize">{auction.tokenID} </span>
						</h2>
						<p>Start Price: ${Number(auction.startPrice)}</p>
						<p>
							Bid starts:{' '}
							{new Date(Number(auction.startTime) / 1000000).toLocaleString()}
						</p>
						<p>
							Bid Ends:{' '}
							{new Date(Number(auction.endTime) / 1000100).toLocaleString()}
						</p>
						<p>Creator: {auction?.creator?.toString()}</p>

						{currentTime > Number(auction.endTime) ? (
							<p className="text-xs text-red-400 my-2">
								The auction has ended.
							</p>
						) : (
							<div>
								<button
									type="button"
									className="text-white bg-green-500 px-4 py-2 rounded-md mt-4"
									onClick={() => handleNewBid(id, auction.startPrice)}
								>
									Place bid
								</button>
							</div>
						)}
					</div>
				</div>
				<div>
					<h2 className="text-center font-bold my-4">Bidders Details</h2>
					<div className="divide-y">
						{bids.length > 0 &&
							bids?.map((item, index) => {
								return (
									<div key={index} className="flex justify-between shadow p-2">
										<span
											className={`font-semibold ${
												auction?.topBidder?.toString() === item[0]?.toString()
													? 'text-green-500'
													: ''
											}`}
										>
											Bidder: {item[0].toString()}
										</span>
										<p>${Number(item[1])}</p>
									</div>
								);
							})}
					</div>
				</div>
			</div>
			{isLoading && <Loader />}
		</main>
	);
};

export default Auction;
