'use client';

interface Props {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: Props) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const links = [
        {
            name: 'facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: 'telegram',
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: 'twitter',
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: 'linkedin',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
    ];

    const handleShare = (shareUrl: string) => {
        window.open(
            shareUrl,
            '_blank',
            'width=700,height=700'
        );
    };

    return (
        <div className="flex gap-3">
            {links.map(item => (
                <button
                    key={item.name}
                    onClick={() => handleShare(item.url)}
                >
                    <img src={item.name} width={24} height={24}/>
                </button>
            ))}
        </div>
    );
}