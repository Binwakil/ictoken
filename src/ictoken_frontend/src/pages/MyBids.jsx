import { useEffect, useState } from 'react';
import { ictoken_backend } from 'declarations/ictoken_backend';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import { useAuth } from '../use-auth-client';
const MyBids = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { identity, logout, principal } = useAuth();
	const [bids, setBids] = useState([]);
	// Get the current time in nanoseconds
	const currentTime = BigInt(Date.now()) * 1000000n;

	const handlegetAuction = async () => {
		setIsLoading(true);
		const bids = await ictoken_backend.getAllPastBids();
		console.log('bids', bids);
		setIsLoading(false);
		setBids(bids.ok);
	};
	useEffect(() => {
		handlegetAuction();
	}, []);
	return (
		<main>
			<div className="flex justify-center mt-10">
				<Link to={'/'} className="text-white bg-green-500 px-4 py-2 rounded-md">
					Home
				</Link>
			</div>
			<div>
				<h2 className="text-center font-bold my-4">MyBids</h2>
				<div className="divide-y">
					{bids.length > 0 &&
						bids?.map((item, index) => {
							return (
								<Link
									to={`/auctions/${index}`}
									key={index}
									className="flex justify-between shadow p-2"
								>
									<span
										className={`font-semibold ${
											principal?.toString() === item[1][0][0]?.toString()
												? 'text-green-500'
												: ''
										}`}
									>
										Bidder: {item[1][0][0].toString()}
									</span>
									<p>${Number(item[1][0][1])}</p>
								</Link>
							);
						})}
				</div>
			</div>
			{isLoading && <Loader />}
		</main>
	);
};

export default MyBids;
