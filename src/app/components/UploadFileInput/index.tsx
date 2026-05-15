'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles.module.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import {IconButton} from '@mui/material';

type Props = {
	accept?: string;
	multiple?: boolean;
	maxFiles?: number;
	maxSizeMB?: number;
	imagePreview?: string[];
	disabled?: boolean;
	onFilesChange?: (files: File[], oldFiles: string[]) => void;
	label?: string;
};

export default function UploadFileInput({
											accept,
											multiple = false,
											maxFiles,
											maxSizeMB = 10,
											disabled = false,
											imagePreview = [],
											onFilesChange,
											label = 'Drag & drop files here, or click to browse',
										}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Old files initialised from props once
	const [oldFiles, setOldFiles] = useState<string[]>([...imagePreview]);

	// Keep refs to latest state for callbacks
	const filesRef = useRef<File[]>(files);
	const oldFilesRef = useRef<string[]>(oldFiles);
	filesRef.current = files;
	oldFilesRef.current = oldFiles;

	const effectiveMaxFiles = useMemo(() => {
		if (!multiple) return 1;
		return maxFiles ?? 10;
	}, [multiple, maxFiles]);

	const notify = useCallback((nextFiles: File[], nextOldFiles: string[]) => {
		onFilesChange?.(nextFiles, nextOldFiles);
	}, [onFilesChange]);

	const validateAndBuildNext = useCallback((incoming: FileList | File[]) => {
		const list = Array.isArray(incoming) ? incoming : Array.from(incoming);
		setError(null);

		const maxBytes = maxSizeMB * 1024 * 1024;

		const validBySize: File[] = [];
		for (const f of list) {
			if (f.size > maxBytes) {
				setError(`"${f.name}" is too large (max ${maxSizeMB}MB).`);
				continue;
			}
			validBySize.push(f);
		}

		const next = multiple ? [...filesRef.current, ...validBySize] : validBySize.slice(0, 1);
		const trimmed = next.slice(0, effectiveMaxFiles);

		return trimmed;
	}, [effectiveMaxFiles, maxSizeMB, multiple]);

	const openPicker = useCallback(() => {
		if (disabled) return;
		inputRef.current?.click();
	}, [disabled]);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (disabled) return;

		if (e.dataTransfer?.files?.length) {
			const nextFiles = validateAndBuildNext(e.dataTransfer.files);
			setFiles(nextFiles);
			notify(nextFiles, oldFilesRef.current); // ✅ callback outside updater
		}
	}, [disabled, notify, validateAndBuildNext]);

	const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;

		const nextFiles = validateAndBuildNext(e.target.files);
		setFiles(nextFiles);
		notify(nextFiles, oldFilesRef.current); // ✅

		e.target.value = '';
	}, [notify, validateAndBuildNext]);

	const removeAt = useCallback((idx: number) => {
		const nextFiles = filesRef.current.filter((_, i) => i !== idx);
		setFiles(nextFiles);
		notify(nextFiles, oldFilesRef.current); // ✅
	}, [notify]);

	const removeOldAt = useCallback((fileKey: string) => {
		const nextOld = oldFilesRef.current.filter((i) => i !== fileKey);
		setOldFiles(nextOld);
		notify(filesRef.current, nextOld); // ✅
	}, [notify]);
	useEffect(() => {
		return () => {
			setFiles([]);
			setOldFiles([]);
		};
	}, []);
	return (<div className={styles.container}>
			{oldFiles.length > 0 && oldFiles.map((f) => (<div key={f} className={styles.imageContainer}>
					<div className={styles.closeIcon}>
						<IconButton type="button" onClick={() => removeOldAt(f)}>
							<CloseIcon/>
						</IconButton>
					</div>

					<img
						src={'/wp-content/' + f}
						alt={f}
						style={{maxWidth: 240, borderRadius: 10}}
					/>
				</div>))}

			{files.length > 0 && files.map((f, idx) => (<div
					key={`${f.name}-${f.lastModified}-${idx}`}
					className={styles.imageContainer}
				>
					<div className={styles.closeIcon}>
						<IconButton type="button" onClick={() => removeAt(idx)}>
							<CloseIcon/>
						</IconButton>
					</div>

					{f.type.startsWith('image/') && (<img
							src={URL.createObjectURL(f)}
							alt={f.name}
							style={{maxWidth: 240, borderRadius: 10}}
							onLoad={(e) => {
								const url = e.currentTarget.src;
								requestAnimationFrame(() => URL.revokeObjectURL(url));
							}}
						/>)}
				</div>))}

			<input
				ref={inputRef}
				type="file"
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				onChange={onInputChange}
				style={{display: 'none'}}
			/>

			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				onClick={openPicker}
				onKeyDown={(e) => {
					if (disabled) return;
					if (e.key === 'Enter' || e.key === ' ') openPicker();
				}}
				onDragEnter={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (disabled) return;
					setIsDragging(true);
				}}
				onDragOver={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (disabled) return;
					setIsDragging(true);
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setIsDragging(false);
				}}
				onDrop={onDrop}
				aria-disabled={disabled}
				className={`${styles.label} ${isDragging ? styles.dragging : ''}`}
			>
				<AttachFileIcon sx={{fontSize: '3rem'}}/>
				<div className={styles.title}>{label}</div>
				<div className={styles.desription}>
					{accept ? `Accepted: ${accept}` : 'Any file type'}
					{' · '}Max size: {maxSizeMB}MB
					{' · '}
					{multiple ? `Up to ${effectiveMaxFiles} files` : 'Single file'}
				</div>
			</div>

			{error && <div style={{color: 'crimson', fontSize: 13}}>{error}</div>}
		</div>);
}
