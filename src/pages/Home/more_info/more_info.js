import React, { useState } from 'react';
import styles from './more_info.module.scss';

const CardComponent = ({ title, content, imageUrl, text_more }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [hideTitleOutside, setHideTitleOutside] = useState(false);

    const toggleDetail = () => {
        setShowDetail(!showDetail);
    };

    return (
        <div className={styles.cardContainer}>
            <div
                className={styles.card}
                onMouseEnter={() => setHideTitleOutside(true)}
                onMouseLeave={() => setHideTitleOutside(false)}
                style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'center' }}
            >
                <div className={styles.cardContent}>
                    <p className={styles.cardTitle}>{title}</p>
                    <p className={styles.cardDescription}>{content}</p>
                    <div className={styles.cardButton}>
                        <div className={styles.button} onClick={toggleDetail}>
                            More Info
                        </div>
                    </div>
                    {showDetail && <div className={styles.detailContent}>{text_more}</div>}
                </div>
            </div>
            <img src={imageUrl} alt="Thumbnail" className={styles.cardImage} />
            {!hideTitleOutside && (
                <div className={styles.cardImageDiv}>
                    <p className={styles.cardTitleOutSide}>{title}</p>
                </div>
            )}
        </div>
    );
};

export default CardComponent;
