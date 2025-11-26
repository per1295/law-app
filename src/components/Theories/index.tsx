import styles from './index.module.scss';

import { ThemeContext, NowTheory } from '../../contexts';
import { useContext, useRef, useEffect } from 'react';
import type { TransitionEventHandler } from 'react';

import Theory from "../Theory";
import Image from "../Image";

const CHESS_PIECES = [
    "Pawn", "Queen", "Bishop", "Rook", "Knight", "King"
];
const THEORY_NAMES = [
    "Теологическая",
    "Патриархальная",
    "Насилия",
    "Психологическая",
    "Договорная",
    "Материалистическая",
];

export default function Theories() {
    const theme = useContext(ThemeContext);
    const { index: theoryIndex, theory } = useContext(NowTheory);

    const pieces = CHESS_PIECES.map(piece => {
        return `${piece}_${theme.value === "light" ? "Black" : "White"}`
    });
    const theories_ref = useRef<HTMLDivElement>(null);

    const onTransitionEnd: TransitionEventHandler = event => {
        event.preventDefault();
        const image = event.currentTarget as HTMLImageElement;
        image.classList.remove(styles.piece_transition);
    }

    useEffect(() => {
        const theories = theories_ref.current as HTMLDivElement;

        if ( theme.value && theme.prevValue !== null ) {
            const images = theories.querySelectorAll("section > img");

            for ( const image of images ) {
                image.classList.add(styles.piece_transition);
            }
        }
    }, [theme.value, theme.prevValue]);

    return(
        <div ref={theories_ref} className={styles.theories}>
            <Theory theory_name={THEORY_NAMES[theoryIndex]} theory_value={theory}>
                <Image
                    src={`/${pieces[theoryIndex]}.png`}
                    alt={pieces[theoryIndex]}
                    className={styles.piece}
                    onTransitionEnd={onTransitionEnd}
                />
            </Theory>
        </div>
    )
}