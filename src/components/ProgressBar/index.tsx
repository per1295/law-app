import styles from "./index.module.scss";

import { useRef, useEffect } from "react";
import { setCSSStyles } from "../../functions";
import { createPortal } from "react-dom";

interface IProps {
    total: number;
    now_index: number;
}

export default function ProgressBar({ total, now_index }: IProps) {
    const progress_bar_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const proggress_bar = progress_bar_ref.current;
        const percentage = Math.ceil(now_index * 100 / total);

        if ( proggress_bar ) {
            setCSSStyles(proggress_bar, {
                width: percentage + "%"
            });
        }
    }, [total, now_index]);

    return createPortal(
        <div className={styles.progress}>
            <div ref={progress_bar_ref} className={styles.progress_bar}></div>
        </div>,
        document.getElementById("root") ?? document.body
    )
}