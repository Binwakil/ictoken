import React from 'react';
import { useState, useEffect } from 'react';
import { motoko_project_backend } from 'declarations/motoko_project_backend';
import logo from '../public/logo2.svg';

const FileUpload = () => {

	const [image, setImage] = useState(logo);
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const uploadChunk = async ({ batch_name, chunk }) =>
		await motoko_project_backend.fileupload.create_chunk({
			batch_name: batch_name,
			content: [...new Uint8Array(await chunk.arrayBuffer())],
		});

	const loadImage = (batch_name) => {
		if (!batch_name) {
			return;
		}
		const newImage = `/assests/${batch_name}`;
		setImage(newImage);
	};
	const handleUpload = async () => {
		if (!file) {
			alert('No file selected');
			return;
		}
		setLoading(true);

		const batch_name = file.name;
		const chunks = [];
		const chunkSize = 1500000;

		for (let start = 0; start < file.size; start += chunkSize) {
			const chunk = file.slice(start, start + chunkSize);
			chunks.push(
				uploadChunk({
					batch_name,
					chunk,
				})
			);
		}

		const chunkIds = await promise.all(chunks);
		console.log(chunkIds);

		await motoko_project_backend.fileupload.commit_batch({
			batch_name,
			chunk_ids: chunkIds.map(({ chunk_id }) => chunk_id),
			content_type: file.type,
		});
		// motoko_project_backend.withdrawl(Number(amount));
		console.log('file uploaded');
		loadImage(batch_name);
		setLoading(false);
	};
	return (
		<div>
			<image src={image} alt="image" />
			<label htmlFor="image">Image</label>
			<br />
			<input
				id="image"
				name="image"
				type="file"
				value={file}
				onChange={(e) => setFile(e.target.value)}
			/>
			<button disabled={loading} onClick={handleUpload}>
				{loading ? 'uploading' : 'upload'}
			</button>
		</div>
	);
};

export default FileUpload;
