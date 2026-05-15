'use client';
import Image from 'next/image';
import styles from './shareButtons.module.css';
import {Button} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {useState} from 'react';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

interface Props {
	url: string;
	title: string;
}

export default function ShareButtons({url, title}: Props) {
	const [checked, setChecked] = useState(false);
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	const links = [{
		name: '/icons/fb.webp', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
	}, {
		name: '/icons/tg.webp', url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
	}, {
		name: '/icons/twitter.webp', url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
	}, {
		name: '/icons/ln.webp', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
	}];
	const copyLink = async () => {
		await navigator.clipboard.writeText(url);
		setChecked(true);
		setTimeout(() => setChecked(false), 2000);
	};
	const handleShare = (shareUrl: string) => {
		window.open(shareUrl, '_blank', 'width=700,height=700');
	};
	const nativeShare = async () => {
		if (navigator.share) {
			await navigator.share({
				title, url,
			});
		}
	};

	// react-share buttons

	return (<div className={styles.buttonsContainer}>
		{links.map(item => (<button
			className={styles.button}
			key={item.name}
			onClick={() => handleShare(item.url)}

		>
			<Image src={item.name} width={40} height={40} alt={item.name}/>
		</button>))}
		<Button
			size="large"
			onClick={copyLink}
		>{checked ? <CheckRoundedIcon/> : <ContentCopyIcon/>}

		</Button>
		{!!navigator.share && <Button type="submit"
									  variant="contained"
									  onClick={nativeShare}><MoreHorizRoundedIcon/></Button>}
	</div>);

}