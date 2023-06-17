import { Principal } from "@dfinity/principal";

// Create an actor reference for the backend canister
const backendActor = actor.createActor(canisterId, {
  agentOptions: {
    canisterId: backendCanisterId,
  },
});

// Function to get the question
async function getQuestion() {
  const question = await backendActor.getQuestion();
  return question;
}

// Function to get the list of entries and votes
async function getVotes() {
  const entries = await backendActor.getVotes();
  return entries;
}

// Function to vote for an entry
async function vote(entry) {
  await backendActor.vote(entry);
}

// Function to reset the votes
async function resetVotes() {
  await backendActor.resetVotes();
}

// Example usage:

// Get the question
getQuestion().then((question) => {
  console.log("Question:", question);
});

// Get the list of entries and votes
getVotes().then((entries) => {
  console.log("Entries:", entries);
});

// Vote for an entry
const entry = "Motoko";
vote(entry).then(() => {
  console.log("Voted for", entry);
});

// Reset the votes
resetVotes().then(() => {
  console.log("Votes reset");
});
