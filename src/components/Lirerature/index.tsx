import styles from "./index.module.scss";

import { ThemeContext } from "../../contexts";
import { useContext, useRef } from "react";
import { useDragAndDrop } from "../../hooks";

import type { Theory } from "../../types";
import type { RefObject } from "react";

export interface IProps {
    name: string;
    writtenDate: string;
    theory: Theory;
    authorID: string;
    zIndex: RefObject<number>;
}

export default function Literature({ name, writtenDate, theory, authorID, zIndex }: IProps) {
    const theme = useContext(ThemeContext);
    const className = `${styles.literature} ${theme.value === "dark" || styles.literature_light }`;

    const literature_ref = useRef<HTMLDivElement>(null);
    useDragAndDrop(literature_ref, zIndex);

    return(
        <div
            ref={literature_ref}
            data-theory={theory}
            data-author={authorID}
            data-literature={true}
            className={className}
        >
            "{name}"<br />
            {writtenDate}
        </div>
    )
}