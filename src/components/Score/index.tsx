import styles from "./index.module.scss";

import { useEffect } from "react";
import { setCSSStyles } from "../../functions";

import Image from "../Image";

interface IProps {
    shownScore: boolean;
}

const SUCCESS = [
    "Success_piece", "Success_libra", "Success_check"
];

export default function Score({ shownScore }: IProps) {
    const score_className = `${styles.score} ${shownScore && styles.score_appear } ${styles.score_success}`;
    const score_statics_className = `${styles.score_statistics} ${styles.score_statistics_success}`;
    const score_label_className = `${styles.score_label} ${styles.score_success_color}`;
    const score_tip_className = `${styles.score_tip} ${styles.score_tip_success}`;
    const score_tip_button_className = `${styles.score_tip_button} ${styles.score_tip_button_success}`;

    // Запрещаем прокрукту страницы
    useEffect(() => {
        if ( shownScore ) {
            setCSSStyles(document.documentElement, {
                overflow: "hidden"
            });
        }
    }, [ shownScore ]);

    function restartGame() {
        location.reload()
    }

    return(
        <div className={score_className}>
            <div className={score_statics_className}>
                <Image src={`/${SUCCESS[0]}.png`} alt={SUCCESS[0]} className={styles.score_statistics_img} />
                <Image src={`/${SUCCESS[1]}.png`} alt={SUCCESS[1]} className={styles.score_statistics_img} />
                <span className={score_label_className}>
                    Успех
                </span>
                <Image src={`/${SUCCESS[2]}.png`} alt={SUCCESS[2]} className={styles.score_statistics_img} />
            </div>
            <span className={score_tip_className}>
                Молодец!
                <button className={score_tip_button_className} onClick={restartGame}>
                    Попробовать еще раз
                </button>
            </span>
        </div>
    )
}