import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Auction from './pages/Auction';
import MyBids from './pages/MyBids';
function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/auctions/:id" element={<Auction />} />
			<Route path="/create" element={<Create />} />
			<Route path="/my-bids" element={<MyBids />} />
		</Routes>
	);
}

export default App;
