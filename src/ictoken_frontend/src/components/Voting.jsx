import React from 'react';
import { useState, useEffect } from 'react';
import { test as motoko_project_backend } from 'declarations/motoko_project_backend';

const Voting = () => {
	const [votes, setVotes] = useState([]);
	const [entry, setEntry] = useState([]);
	const [question, setQuestion] = useState('');

	// Function to get the question
	async function getQuestion() {
		const question = await motoko_project_backend.getQuestion();
		setQuestion(question);
	}

	// Function to get the list of entries and votes
	async function getVotes() {
		const entries = await motoko_project_backend.getVotes();
		setVotes(entries);
	}
	useEffect(() => {
		getQuestion();
		getVotes();
	}, []);
	// Function to vote for an entry
	async function vote(entry) {
		await motoko_project_backend.vote(entry);
		getVotes();
	}

	// Function to reset the votes
	async function resetVotes() {
		await motoko_project_backend.resetVotes();
		getVotes();
	}

	// Handle form submission to vote for an entry
	const handelVote = async (event) => {
		if (entry !== '') {
			await vote(entry);
			setEntry('');
		}
	};

	return (
		<section>
			<div>
				<h1>Vote App</h1>

				<div id="question">{question}</div>

				<div id="entries">
					{votes.map((item, index) => (
						<div key={index}>
							<span> {item[0]} </span>
							<span> {Number(item[1])} </span>
						</div>
					))}
				</div>

				<div id="vote-form">
					<input
						type="text"
						id="entry-input"
						value={entry}
						onChange={(e) => setEntry(e.target.value)}
						placeholder="Enter entry"
					/>
					<button type="submit" onClick={() => handelVote(entry)}>
						Vote
					</button>
				</div>

				<button id="reset-button" onClick={() => resetVotes()}>
					Reset Votes
				</button>
			</div>
		</section>
	);
};

export default Voting;
